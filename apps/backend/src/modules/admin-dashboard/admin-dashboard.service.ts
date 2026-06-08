// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { AuthenticatedUserData } from "../../common/utils/authenticated-user.js";
import type { SupabaseUserRecordData } from "../../config/supabase.js";
import type {
  AdminDashboardServiceErrorData,
  AdminSummaryData,
  LeadsBySourceData,
  TeamPerformerData,
  TopReferrerData,
} from "./admin-dashboard.types.js";
// CONFIG //
import { environmentConfig } from "../../config/environment.js";
import { getUserByRecordIdentifier } from "../../config/supabase.js";
// CONSTANTS //
import {
  ADMIN_DASHBOARD_ACTIVE_STATUSES,
  ADMIN_DASHBOARD_OTHER_SOURCE_LABEL,
  ADMIN_DASHBOARD_SOURCE_COLOR_MAP,
  ADMIN_DASHBOARD_UNKNOWN_REFERRER_LABEL,
  ADMIN_DASHBOARD_WON_STATUS,
} from "../../common/constants/admin-dashboard.constants.js";

interface AdminDashboardLeadRecordData {
  id: string;
  created_at: string | null;
  lead_source_id?: string | null;
  status_id?: string | null;
  referred_by_referrer_id?: string | null;
  referrer?: {
    id: string;
    full_name?: string | null;
    phone?: string | null;
  } | null;
}

interface AdminDashboardLeadUserRecordData {
  lead_id: string;
  user_id: string;
  is_primary: boolean | null;
}

interface NamedEntityRecordData {
  id: string;
  name: string;
}

interface PeriodRangeData {
  currentFromInclusive: Date;
  currentToExclusive: Date;
  previousFromInclusive: Date;
  previousToExclusive: Date;
}

interface ReferrerAggregateData {
  id: string;
  name: string;
  referrals: number;
  converted: number;
}

interface AdminDashboardServiceDependenciesData {
  getLeadRecordsWithinRange: (payload: {
    fromInclusive: string;
    toExclusive: string;
  }) => Promise<AdminDashboardLeadRecordData[]>;
  getLeadUserRecordsByLeadIds: (
    leadIds: string[],
  ) => Promise<AdminDashboardLeadUserRecordData[]>;
  getLeadSourceNameById: (sourceId: string) => Promise<string | null>;
  getStatusNameById: (statusId: string) => Promise<string | null>;
  getUserByRecordIdentifier: (
    userIdentifier: string,
  ) => Promise<SupabaseUserRecordData | null>;
}

/**
 * Rounds dashboard percentages to two decimal places for consistent UI display.
 */
const toRoundedPercent = (value: number): number => {
  return Number(value.toFixed(2));
};

/**
 * Compares current-period values against the previous period using percentage change.
 */
const calculatePercentageChange = (
  currentValue: number,
  previousValue: number,
): number => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return toRoundedPercent(((currentValue - previousValue) / previousValue) * 100);
};

const createAdminDashboardServiceError = (
  code: AdminDashboardServiceErrorData["code"],
  message: string,
): AdminDashboardServiceErrorData => {
  const adminDashboardError = new Error(
    message,
  ) as AdminDashboardServiceErrorData;
  adminDashboardError.code = code;
  return adminDashboardError;
};

/**
 * Returns the first day of the month so date windows align with dashboard filters.
 */
const startOfMonth = (dateValue: Date): Date => {
  return new Date(dateValue.getFullYear(), dateValue.getMonth(), 1);
};

/**
 * Moves a month-based period forward or backward while keeping it anchored to month start.
 */
const addMonths = (dateValue: Date, monthDelta: number): Date => {
  return new Date(dateValue.getFullYear(), dateValue.getMonth() + monthDelta, 1);
};

const MONTH_NAME_TO_INDEX_MAP: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

/**
 * Converts supported dashboard period strings into current and previous month ranges.
 */
const parsePeriodRange = (period: string): PeriodRangeData => {
  const trimmedPeriod = period.trim().toLowerCase();
  const currentDate = new Date();

  if (trimmedPeriod === "this-month") {
    const currentFromInclusive = startOfMonth(currentDate);
    const currentToExclusive = addMonths(currentFromInclusive, 1);
    const previousFromInclusive = addMonths(currentFromInclusive, -1);

    return {
      currentFromInclusive,
      currentToExclusive,
      previousFromInclusive,
      previousToExclusive: currentFromInclusive,
    };
  }

  const monthMatch = trimmedPeriod.match(/^(\d{4})-(\d{2})$/);

  if (!monthMatch) {
    const namedMonthMatch = trimmedPeriod.match(
      /^([a-z]+)(?:[\s-]+)(\d{4})$/,
    );

    if (!namedMonthMatch) {
      throw createAdminDashboardServiceError(
        "BAD_REQUEST",
        "Period must be 'this-month', use YYYY-MM, or use a month name like 'May 2026'.",
      );
    }

    const monthName = namedMonthMatch[1];
    const yearValue = namedMonthMatch[2];

    if (!monthName || !yearValue) {
      throw createAdminDashboardServiceError(
        "BAD_REQUEST",
        "Period must be 'this-month', use YYYY-MM, or use a month name like 'May 2026'.",
      );
    }

    const monthIndex = MONTH_NAME_TO_INDEX_MAP[monthName];
    const yearNumber = Number(yearValue);

    if (monthIndex === undefined) {
      throw createAdminDashboardServiceError(
        "BAD_REQUEST",
        "Period month name is invalid. Use a value like 'May 2026'.",
      );
    }

    const currentFromInclusive = new Date(yearNumber, monthIndex, 1);
    const currentToExclusive = new Date(yearNumber, monthIndex + 1, 1);
    const previousFromInclusive = new Date(yearNumber, monthIndex - 1, 1);

    return {
      currentFromInclusive,
      currentToExclusive,
      previousFromInclusive,
      previousToExclusive: currentFromInclusive,
    };
  }

  const yearNumber = Number(monthMatch[1]);
  const monthNumber = Number(monthMatch[2]);

  if (monthNumber < 1 || monthNumber > 12) {
    throw createAdminDashboardServiceError(
      "BAD_REQUEST",
      "Period month must be between 01 and 12.",
    );
  }

  const currentFromInclusive = new Date(yearNumber, monthNumber - 1, 1);
  const currentToExclusive = new Date(yearNumber, monthNumber, 1);
  const previousFromInclusive = new Date(yearNumber, monthNumber - 2, 1);

  return {
    currentFromInclusive,
    currentToExclusive,
    previousFromInclusive,
    previousToExclusive: currentFromInclusive,
  };
};

const toIsoString = (dateValue: Date): string => {
  return dateValue.toISOString();
};

const normalizeStatusName = (statusName: string | null): string | null => {
  if (!statusName) {
    return null;
  }

  return statusName.trim().toUpperCase();
};

/**
 * Normalizes source labels so missing values still appear as a chart bucket.
 */
const normalizeSourceName = (sourceName: string | null): string => {
  if (!sourceName || sourceName.trim().length === 0) {
    return ADMIN_DASHBOARD_OTHER_SOURCE_LABEL;
  }

  return sourceName.trim();
};

const resolveSourceColor = (sourceName: string): string => {
  return (
    ADMIN_DASHBOARD_SOURCE_COLOR_MAP[sourceName.trim().toLowerCase()] ??
    "#64748B"
  );
};

const createSupabaseTableUrl = (tableName: string): URL => {
  return new URL(`${environmentConfig.supabaseUrl}/rest/v1/${tableName}`);
};

const buildServiceRoleHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
    apikey: environmentConfig.supabaseServiceRoleKey,
    Authorization: `Bearer ${environmentConfig.supabaseServiceRoleKey}`,
  };
};

/**
 * Extracts a readable error message from Supabase REST responses.
 */
const getSupabaseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const responseBody = (await response.json()) as {
      msg?: string;
      message?: string;
      error?: string;
      error_description?: string;
    };

    return (
      responseBody.msg ??
      responseBody.message ??
      responseBody.error_description ??
      responseBody.error ??
      "Supabase request failed."
    );
  } catch {
    return "Supabase request failed.";
  }
};

/**
 * Performs a typed Supabase REST read request and surfaces failures as service errors.
 */
const executeReadRequest = async <T>(requestUrl: URL): Promise<T> => {
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: buildServiceRoleHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await getSupabaseErrorMessage(response);

    console.log("[admin-dashboard] Supabase read failed", {
      requestUrl: requestUrl.toString(),
      status: response.status,
      errorMessage,
    });

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};

/**
 * Wires the default data access functions used by the admin dashboard service.
 */
  const createDefaultAdminDashboardDependencies =
  (): AdminDashboardServiceDependenciesData => {
    return {
      getLeadRecordsWithinRange: async ({ fromInclusive, toExclusive }) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set(
          "select",
          "id,created_at,lead_source_id,status_id,referred_by_referrer_id,referrer:referrers!left(id,full_name,phone)",
        );
        requestUrl.searchParams.append("created_at", `gte.${fromInclusive}`);
        requestUrl.searchParams.append("created_at", `lt.${toExclusive}`);
        requestUrl.searchParams.set("order", "created_at.asc");

        return executeReadRequest<AdminDashboardLeadRecordData[]>(requestUrl);
      },
      getLeadUserRecordsByLeadIds: async (leadIds) => {
        if (leadIds.length === 0) {
          return [];
        }

        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set("select", "lead_id,user_id,is_primary");
        requestUrl.searchParams.set("lead_id", `in.(${leadIds.join(",")})`);
        requestUrl.searchParams.set("is_primary", "eq.true");

        return executeReadRequest<AdminDashboardLeadUserRecordData[]>(
          requestUrl,
        );
      },
      getLeadSourceNameById: async (sourceId) => {
        const requestUrl = createSupabaseTableUrl("lead_sources");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${sourceId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.name ?? null;
      },
      getStatusNameById: async (statusId) => {
        const requestUrl = createSupabaseTableUrl("statuses");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${statusId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.name ?? null;
      },
      getUserByRecordIdentifier,
    };
  };

/**
 * Public contract for all admin dashboard read operations used by controllers.
 */
export interface AdminDashboardServiceData {
  getAdminSummaryService: (
    authenticatedUser: AuthenticatedUserData,
    period: string,
  ) => Promise<QueryResponseData<AdminSummaryData>>;
  getLeadsBySourceService: (
    authenticatedUser: AuthenticatedUserData,
    period: string,
  ) => Promise<QueryResponseData<LeadsBySourceData[]>>;
  getTopPerformersService: (
    authenticatedUser: AuthenticatedUserData,
    period: string,
    limit: number,
  ) => Promise<QueryResponseData<TeamPerformerData[]>>;
  getTopReferrersService: (
    authenticatedUser: AuthenticatedUserData,
    period: string,
    limit: number,
  ) => Promise<QueryResponseData<TopReferrerData[]>>;
}

/**
 * Creates the admin dashboard service with injectable data dependencies.
 */
export const createAdminDashboardService = (
  dependencies: AdminDashboardServiceDependenciesData = createDefaultAdminDashboardDependencies(),
): AdminDashboardServiceData => {
  /**
   * Resolves a lead status from either the denormalized record value or the status lookup table.
   */
  const getStatusNameService = async (
    leadRecord: AdminDashboardLeadRecordData,
  ): Promise<string | null> => {
    if (
      typeof leadRecord.status_id === "string" &&
      leadRecord.status_id.trim().length > 0
    ) {
      return normalizeStatusName(
        await dependencies.getStatusNameById(leadRecord.status_id),
      );
    }

    return null;
  };

  /**
   * Resolves a lead source from either the stored label or the related source record.
   */
  const getSourceNameService = async (
    leadRecord: AdminDashboardLeadRecordData,
  ): Promise<string> => {
    if (
      typeof leadRecord.lead_source_id === "string" &&
      leadRecord.lead_source_id.trim().length > 0
    ) {
      return normalizeSourceName(
        await dependencies.getLeadSourceNameById(leadRecord.lead_source_id),
      );
    }

    return ADMIN_DASHBOARD_OTHER_SOURCE_LABEL;
  };

  /**
   * Loads one combined period window, then splits it into current and previous month buckets.
   */
  const getLeadRecordsForPeriod = async (
    period: string,
  ): Promise<{
    currentLeadRecords: AdminDashboardLeadRecordData[];
    previousLeadRecords: AdminDashboardLeadRecordData[];
  }> => {
    const periodRange = parsePeriodRange(period);
    const leadRecords = await dependencies.getLeadRecordsWithinRange({
      fromInclusive: toIsoString(periodRange.previousFromInclusive),
      toExclusive: toIsoString(periodRange.currentToExclusive),
    });

    return {
      currentLeadRecords: leadRecords.filter((leadRecordItem) => {
        if (!leadRecordItem.created_at) {
          return false;
        }

        const createdAtDate = new Date(leadRecordItem.created_at);
        return (
          createdAtDate >= periodRange.currentFromInclusive &&
          createdAtDate < periodRange.currentToExclusive
        );
      }),
      previousLeadRecords: leadRecords.filter((leadRecordItem) => {
        if (!leadRecordItem.created_at) {
          return false;
        }

        const createdAtDate = new Date(leadRecordItem.created_at);
        return (
          createdAtDate >= periodRange.previousFromInclusive &&
          createdAtDate < periodRange.previousToExclusive
        );
      }),
    };
  };

  /**
   * Normalizes unexpected failures into the shared admin dashboard service error format.
   */
  const mapServiceError = (error: unknown): AdminDashboardServiceErrorData => {
    console.log("[admin-dashboard] service error", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "UnknownError",
    });

    if (
      error instanceof Error &&
      "code" in error &&
      typeof (error as AdminDashboardServiceErrorData).code === "string"
    ) {
      return error as AdminDashboardServiceErrorData;
    }

    return createAdminDashboardServiceError(
      "INTERNAL",
      error instanceof Error ? error.message : "Admin dashboard request failed.",
    );
  };

  return {
    getAdminSummaryService: async (_authenticatedUser, period) => {
      try {
        const { currentLeadRecords, previousLeadRecords } =
          await getLeadRecordsForPeriod(period);

        // Resolve statuses first so all summary cards are derived from the same normalized values.
        const currentStatuses = await Promise.all(
          currentLeadRecords.map((leadRecordItem) =>
            getStatusNameService(leadRecordItem),
          ),
        );
        const previousStatuses = await Promise.all(
          previousLeadRecords.map((leadRecordItem) =>
            getStatusNameService(leadRecordItem),
          ),
        );

        // Each dashboard card is calculated from the same filtered period slice.
        const currentActive = currentStatuses.filter(
          (statusNameItem) =>
            statusNameItem !== null &&
            ADMIN_DASHBOARD_ACTIVE_STATUSES.includes(
              statusNameItem as (typeof ADMIN_DASHBOARD_ACTIVE_STATUSES)[number],
            ),
        ).length;
        const currentWon = currentStatuses.filter(
          (statusNameItem) => statusNameItem === ADMIN_DASHBOARD_WON_STATUS,
        ).length;
        const previousWon = previousStatuses.filter(
          (statusNameItem) => statusNameItem === ADMIN_DASHBOARD_WON_STATUS,
        ).length;

        return {
          data: {
            totalLeads: currentLeadRecords.length,
            totalLeadsChange: calculatePercentageChange(
              currentLeadRecords.length,
              previousLeadRecords.length,
            ),
            converted: currentWon,
            conversionRate:
              currentLeadRecords.length === 0
                ? 0
                : toRoundedPercent(
                    (currentWon / currentLeadRecords.length) * 100,
                  ),
            activeLeads: currentActive,
            won: currentWon,
            wonChange: calculatePercentageChange(currentWon, previousWon),
          },
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getLeadsBySourceService: async (_authenticatedUser, period) => {
      try {
        const { currentLeadRecords } = await getLeadRecordsForPeriod(period);
        const sourceCountsMap = new Map<string, number>();

        for (const leadRecordItem of currentLeadRecords) {
          const sourceName = await getSourceNameService(leadRecordItem);
          sourceCountsMap.set(
            sourceName,
            (sourceCountsMap.get(sourceName) ?? 0) + 1,
          );
        }

        return {
          data: Array.from(sourceCountsMap.entries())
            .map(([sourceName, count]) => ({
              source: sourceName,
              count,
              color: resolveSourceColor(sourceName),
            }))
            .sort((leftItem, rightItem) => rightItem.count - leftItem.count),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getTopPerformersService: async (_authenticatedUser, period, limit) => {
      try {
        const { currentLeadRecords } = await getLeadRecordsForPeriod(period);
        const leadIds = currentLeadRecords.map((leadRecordItem) => leadRecordItem.id);
        const leadUserRecords =
          await dependencies.getLeadUserRecordsByLeadIds(leadIds);
        const leadStatusEntries = await Promise.all(
          currentLeadRecords.map(async (leadRecordItem) => [
            leadRecordItem.id,
            await getStatusNameService(leadRecordItem),
          ] as const),
        );
        const leadStatusMap = new Map<string, string | null>(leadStatusEntries);
        const performerCountsMap = new Map<
          string,
          { leads: number; won: number }
        >();

        for (const leadUserRecordItem of leadUserRecords) {
          const statusName = leadStatusMap.get(leadUserRecordItem.lead_id) ?? null;
          const performerSummary = performerCountsMap.get(leadUserRecordItem.user_id) ?? {
            leads: 0,
            won: 0,
          };

          performerCountsMap.set(leadUserRecordItem.user_id, {
            leads: performerSummary.leads + 1,
            won:
              performerSummary.won +
              (statusName === ADMIN_DASHBOARD_WON_STATUS ? 1 : 0),
          });
        }

        const topPerformerEntries = Array.from(performerCountsMap.entries())
          .sort((leftItem, rightItem) => {
            const rightWinRate =
              rightItem[1].leads > 0
                ? rightItem[1].won / rightItem[1].leads
                : 0;
            const leftWinRate =
              leftItem[1].leads > 0
                ? leftItem[1].won / leftItem[1].leads
                : 0;

            if (rightWinRate !== leftWinRate) {
              return rightWinRate - leftWinRate;
            }

            // Tiebreaker: more total leads handled ranks higher
            return rightItem[1].leads - leftItem[1].leads;
          })
          .slice(0, limit);

        return {
          data: await Promise.all(
            topPerformerEntries.map(async ([userRecordId, performerSummary], index) => {
              const userRecord =
                await dependencies.getUserByRecordIdentifier(userRecordId);

              return {
                rank: index + 1,
                userId:
                  typeof userRecord?.user_id === "string" &&
                  userRecord.user_id.trim().length > 0
                    ? userRecord.user_id
                    : userRecordId,
                name:
                  typeof userRecord?.full_name === "string" &&
                  userRecord.full_name.trim().length > 0
                    ? userRecord.full_name
                    : "Unknown Salesperson",
                leads: performerSummary.leads,
                won: performerSummary.won,
                winRate:
                  performerSummary.leads === 0
                    ? 0
                    : toRoundedPercent(
                        (performerSummary.won / performerSummary.leads) * 100,
                      ),
              };
            }),
          ),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getTopReferrersService: async (_authenticatedUser, period, limit) => {
      try {
        const { currentLeadRecords } = await getLeadRecordsForPeriod(period);
        const referrerMap = new Map<string, ReferrerAggregateData>();

        for (const leadRecordItem of currentLeadRecords) {
          const referrerName =
            typeof leadRecordItem.referrer?.full_name === "string" &&
            leadRecordItem.referrer.full_name.trim().length > 0
              ? leadRecordItem.referrer.full_name.trim()
              : null;
          const referrerPhone =
            typeof leadRecordItem.referrer?.phone === "string" &&
            leadRecordItem.referrer.phone.trim().length > 0
              ? leadRecordItem.referrer.phone.trim()
              : null;

          if (
            typeof leadRecordItem.referred_by_referrer_id !== "string" &&
            !referrerName
          ) {
            continue;
          }

          const referrerKey =
            typeof leadRecordItem.referred_by_referrer_id === "string" &&
            leadRecordItem.referred_by_referrer_id.trim().length > 0
              ? leadRecordItem.referred_by_referrer_id
              : `${referrerName ?? ADMIN_DASHBOARD_UNKNOWN_REFERRER_LABEL}:${referrerPhone ?? ""}`;
          const statusName = await getStatusNameService(leadRecordItem);
          const referrerSummary = referrerMap.get(referrerKey) ?? {
            id: referrerKey,
            name: referrerName || ADMIN_DASHBOARD_UNKNOWN_REFERRER_LABEL,
            referrals: 0,
            converted: 0,
          };

          referrerMap.set(referrerKey, {
            ...referrerSummary,
            referrals: referrerSummary.referrals + 1,
            converted:
              referrerSummary.converted +
              (statusName === ADMIN_DASHBOARD_WON_STATUS ? 1 : 0),
          });
        }

        return {
          data: Array.from(referrerMap.values())
            .sort((leftItem, rightItem) => {
              if (rightItem.converted !== leftItem.converted) {
                return rightItem.converted - leftItem.converted;
              }

              return rightItem.referrals - leftItem.referrals;
            })
            .slice(0, limit)
            .map((referrerItem) => ({
              id: referrerItem.id,
              name: referrerItem.name,
              referrals: referrerItem.referrals,
              converted: referrerItem.converted,
              conversionRate:
                referrerItem.referrals === 0
                  ? 0
                  : toRoundedPercent(
                      (referrerItem.converted / referrerItem.referrals) * 100,
                    ),
            })),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
  };
};

let adminDashboardService: AdminDashboardServiceData =
  createAdminDashboardService();

/**
 * Returns the shared admin dashboard service instance.
 */
export const getAdminDashboardService = (): AdminDashboardServiceData => {
  return adminDashboardService;
};

/**
 * Replaces the shared admin dashboard service instance, mainly for tests.
 */
export const setAdminDashboardService = (
  service: AdminDashboardServiceData,
): void => {
  adminDashboardService = service;
};
