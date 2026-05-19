// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { AuthenticatedUserData } from "../../common/utils/authenticated-user.js";
import type {
  AdminReportsDateRangeQueryData,
  AdminReportsServiceErrorData,
  BestSourceInsightData,
  FunnelReportData,
  LostReasonBreakdownData,
  ReportOverviewData,
  SourcePerformanceReportData,
} from "./admin-reports.types.js";
// CONFIG //
import { environmentConfig } from "../../config/environment.js";
// CONSTANTS //
import {
  ADMIN_REPORTS_FUNNEL_STAGE_ORDER,
  ADMIN_REPORTS_LOST_STATUSES,
  ADMIN_REPORTS_TEST_DRIVE_STATUS,
  ADMIN_REPORTS_UNKNOWN_LOST_REASON_LABEL,
  ADMIN_REPORTS_UNKNOWN_SOURCE_LABEL,
  ADMIN_REPORTS_WON_STATUS,
} from "../../common/constants/admin-reports.constants.js";

interface AdminReportsLeadRecordData {
  id: string;
  created_at: string | null;
  lead_source_id?: string | null;
  status_id?: string | null;
  lost_reason?: string | null;
  lost_reason_id?: string | null;
}

interface NamedEntityRecordData {
  id: string;
  name: string;
}

interface DateRangeWindowData {
  currentFromInclusive: Date;
  currentToExclusive: Date;
  previousFromInclusive: Date;
  previousToExclusive: Date;
}

interface AdminReportsServiceDependenciesData {
  getLeadRecordsWithinRange: (payload: {
    fromInclusive: string;
    toExclusive: string;
  }) => Promise<AdminReportsLeadRecordData[]>;
  getLeadSourceNameById: (sourceId: string) => Promise<string | null>;
  getStatusNameById: (statusId: string) => Promise<string | null>;
  getLostReasonNameById: (lostReasonId: string) => Promise<string | null>;
}

const createAdminReportsServiceError = (
  code: AdminReportsServiceErrorData["code"],
  message: string,
): AdminReportsServiceErrorData => {
  const adminReportsError = new Error(message) as AdminReportsServiceErrorData;
  adminReportsError.code = code;
  return adminReportsError;
};

const toRoundedPercent = (value: number): number => {
  return Number(value.toFixed(2));
};

const calculatePercentageChange = (
  currentValue: number,
  previousValue: number,
): number => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return toRoundedPercent(((currentValue - previousValue) / previousValue) * 100);
};

const createUtcDate = (dateValue: string): Date => {
  const [yearValue, monthValue, dayValue] = dateValue.split("-");

  if (!yearValue || !monthValue || !dayValue) {
    throw createAdminReportsServiceError(
      "BAD_REQUEST",
      "Date must use YYYY-MM-DD format.",
    );
  }

  return new Date(
    Date.UTC(Number(yearValue), Number(monthValue) - 1, Number(dayValue)),
  );
};

const addDays = (dateValue: Date, dayDelta: number): Date => {
  return new Date(dateValue.getTime() + dayDelta * 24 * 60 * 60 * 1000);
};

const toIsoString = (dateValue: Date): string => {
  return dateValue.toISOString();
};

const toDateKey = (dateValue: Date): string => {
  return dateValue.toISOString().slice(0, 10);
};

const normalizeStatusName = (statusName: string | null): string | null => {
  if (!statusName) {
    return null;
  }

  return statusName.trim().toUpperCase();
};

const normalizeSourceName = (sourceName: string | null): string => {
  if (!sourceName || sourceName.trim().length === 0) {
    return ADMIN_REPORTS_UNKNOWN_SOURCE_LABEL;
  }

  return sourceName.trim();
};

const normalizeLostReasonName = (lostReasonName: string | null): string => {
  if (!lostReasonName || lostReasonName.trim().length === 0) {
    return ADMIN_REPORTS_UNKNOWN_LOST_REASON_LABEL;
  }

  return lostReasonName.trim();
};

const isLostStatus = (statusName: string | null): boolean => {
  return (
    statusName !== null &&
    ADMIN_REPORTS_LOST_STATUSES.includes(
      statusName as (typeof ADMIN_REPORTS_LOST_STATUSES)[number],
    )
  );
};

const parseDateRangeWindow = (
  query: AdminReportsDateRangeQueryData,
): DateRangeWindowData => {
  const currentFromInclusive = createUtcDate(query.from);
  const currentToExclusive = addDays(createUtcDate(query.to), 1);
  const totalDays = Math.max(
    1,
    Math.round(
      (currentToExclusive.getTime() - currentFromInclusive.getTime()) /
        (24 * 60 * 60 * 1000),
    ),
  );

  return {
    currentFromInclusive,
    currentToExclusive,
    previousFromInclusive: addDays(currentFromInclusive, -totalDays),
    previousToExclusive: currentFromInclusive,
  };
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

const executeReadRequest = async <T>(requestUrl: URL): Promise<T> => {
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: buildServiceRoleHeaders(),
  });

  if (!response.ok) {
    const errorMessage = await getSupabaseErrorMessage(response);

    console.log("[admin-reports] Supabase read failed", {
      requestUrl: requestUrl.toString(),
      status: response.status,
      errorMessage,
    });

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};

const createDefaultAdminReportsDependencies =
  (): AdminReportsServiceDependenciesData => {
    return {
      getLeadRecordsWithinRange: async ({ fromInclusive, toExclusive }) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set(
          "select",
          "id,created_at,lead_source_id,status_id,lost_reason_id",
        );
        requestUrl.searchParams.append("created_at", `gte.${fromInclusive}`);
        requestUrl.searchParams.append("created_at", `lt.${toExclusive}`);
        requestUrl.searchParams.set("order", "created_at.asc");

        return executeReadRequest<AdminReportsLeadRecordData[]>(requestUrl);
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
      getLostReasonNameById: async (lostReasonId) => {
        const requestUrl = createSupabaseTableUrl("lost_reasons");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${lostReasonId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.name ?? null;
      },
    };
  };

export interface AdminReportsServiceData {
  getReportOverviewService: (
    authenticatedUser: AuthenticatedUserData,
    query: AdminReportsDateRangeQueryData,
  ) => Promise<QueryResponseData<ReportOverviewData>>;
  getSourcePerformanceService: (
    authenticatedUser: AuthenticatedUserData,
    query: AdminReportsDateRangeQueryData,
  ) => Promise<QueryResponseData<SourcePerformanceReportData>>;
  getFunnelReportService: (
    authenticatedUser: AuthenticatedUserData,
    query: AdminReportsDateRangeQueryData,
  ) => Promise<QueryResponseData<FunnelReportData>>;
}

export const createAdminReportsService = (
  dependencies: AdminReportsServiceDependenciesData = createDefaultAdminReportsDependencies(),
): AdminReportsServiceData => {
  const getStatusNameService = async (
    leadRecord: AdminReportsLeadRecordData,
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

  const getSourceNameService = async (
    leadRecord: AdminReportsLeadRecordData,
  ): Promise<string> => {
    if (
      typeof leadRecord.lead_source_id === "string" &&
      leadRecord.lead_source_id.trim().length > 0
    ) {
      return normalizeSourceName(
        await dependencies.getLeadSourceNameById(leadRecord.lead_source_id),
      );
    }

    return ADMIN_REPORTS_UNKNOWN_SOURCE_LABEL;
  };

  const getLostReasonNameService = async (
    leadRecord: AdminReportsLeadRecordData,
  ): Promise<string> => {
    if (
      typeof leadRecord.lost_reason_id === "string" &&
      leadRecord.lost_reason_id.trim().length > 0
    ) {
      return normalizeLostReasonName(
        await dependencies.getLostReasonNameById(leadRecord.lost_reason_id),
      );
    }

    if (
      typeof leadRecord.lost_reason === "string" &&
      leadRecord.lost_reason.trim().length > 0
    ) {
      return normalizeLostReasonName(leadRecord.lost_reason);
    }

    return ADMIN_REPORTS_UNKNOWN_LOST_REASON_LABEL;
  };

  const getLeadRecordsForRange = async (
    query: AdminReportsDateRangeQueryData,
  ): Promise<{
    currentLeadRecords: AdminReportsLeadRecordData[];
    previousLeadRecords: AdminReportsLeadRecordData[];
    rangeWindow: DateRangeWindowData;
  }> => {
    const rangeWindow = parseDateRangeWindow(query);
    const leadRecords = await dependencies.getLeadRecordsWithinRange({
      fromInclusive: toIsoString(rangeWindow.previousFromInclusive),
      toExclusive: toIsoString(rangeWindow.currentToExclusive),
    });

    return {
      currentLeadRecords: leadRecords.filter((leadRecordItem) => {
        if (!leadRecordItem.created_at) {
          return false;
        }

        const createdAtDate = new Date(leadRecordItem.created_at);
        return (
          createdAtDate >= rangeWindow.currentFromInclusive &&
          createdAtDate < rangeWindow.currentToExclusive
        );
      }),
      previousLeadRecords: leadRecords.filter((leadRecordItem) => {
        if (!leadRecordItem.created_at) {
          return false;
        }

        const createdAtDate = new Date(leadRecordItem.created_at);
        return (
          createdAtDate >= rangeWindow.previousFromInclusive &&
          createdAtDate < rangeWindow.previousToExclusive
        );
      }),
      rangeWindow,
    };
  };

  const mapServiceError = (error: unknown): AdminReportsServiceErrorData => {
    console.log("[admin-reports] service error", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "UnknownError",
    });

    if (
      error instanceof Error &&
      "code" in error &&
      typeof (error as AdminReportsServiceErrorData).code === "string"
    ) {
      return error as AdminReportsServiceErrorData;
    }

    return createAdminReportsServiceError(
      "INTERNAL",
      error instanceof Error ? error.message : "Admin reports request failed.",
    );
  };

  const createBestSourceGuidance = (
    bestSource: Omit<BestSourceInsightData, "guidance">,
  ): string => {
    return `${bestSource.source} is converting best for the selected range. Prioritize follow-ups and repeat the acquisition playbook behind these ${bestSource.won} wins.`;
  };

  return {
    getReportOverviewService: async (_authenticatedUser, query) => {
      try {
        const { currentLeadRecords, previousLeadRecords, rangeWindow } =
          await getLeadRecordsForRange(query);
        const currentStatuses = await Promise.all(
          currentLeadRecords.map((leadRecordItem) =>
            getStatusNameService(leadRecordItem),
          ),
        );

        const wonCount = currentStatuses.filter(
          (statusNameItem) => statusNameItem === ADMIN_REPORTS_WON_STATUS,
        ).length;
        const testDriveCount = currentStatuses.filter(
          (statusNameItem) => statusNameItem === ADMIN_REPORTS_TEST_DRIVE_STATUS,
        ).length;
        const lostLeadCount = currentStatuses.filter((statusNameItem) =>
          isLostStatus(statusNameItem),
        ).length;
        const dailyTrendMap = new Map<string, { leads: number; won: number }>();

        for (
          let dateCursor = new Date(rangeWindow.currentFromInclusive);
          dateCursor < rangeWindow.currentToExclusive;
          dateCursor = addDays(dateCursor, 1)
        ) {
          dailyTrendMap.set(toDateKey(dateCursor), {
            leads: 0,
            won: 0,
          });
        }

        for (let index = 0; index < currentLeadRecords.length; index += 1) {
          const leadRecordItem = currentLeadRecords[index];
          const statusName = currentStatuses[index] ?? null;

          if (!leadRecordItem?.created_at) {
            continue;
          }

          const dateKey = toDateKey(new Date(leadRecordItem.created_at));
          const dailyTrendItem = dailyTrendMap.get(dateKey);

          if (!dailyTrendItem) {
            continue;
          }

          dailyTrendMap.set(dateKey, {
            leads: dailyTrendItem.leads + 1,
            won:
              dailyTrendItem.won +
              (statusName === ADMIN_REPORTS_WON_STATUS ? 1 : 0),
          });
        }

        return {
          data: {
            totalLeads: currentLeadRecords.length,
            totalLeadsChange: calculatePercentageChange(
              currentLeadRecords.length,
              previousLeadRecords.length,
            ),
            converted: wonCount,
            conversionRate:
              currentLeadRecords.length === 0
                ? 0
                : toRoundedPercent((wonCount / currentLeadRecords.length) * 100),
            won: wonCount,
            testDrive: testDriveCount,
            lostLeads: lostLeadCount,
            lostRate:
              currentLeadRecords.length === 0
                ? 0
                : toRoundedPercent(
                    (lostLeadCount / currentLeadRecords.length) * 100,
                  ),
            dailyTrend: Array.from(dailyTrendMap.entries()).map(
              ([date, dailyTrendItem]) => ({
                date,
                leads: dailyTrendItem.leads,
                won: dailyTrendItem.won,
              }),
            ),
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
    getSourcePerformanceService: async (_authenticatedUser, query) => {
      try {
        const { currentLeadRecords, previousLeadRecords } =
          await getLeadRecordsForRange(query);
        const currentSourceMap = new Map<string, { leads: number; won: number }>();
        const previousSourceMap = new Map<string, number>();

        for (const leadRecordItem of previousLeadRecords) {
          const sourceName = await getSourceNameService(leadRecordItem);
          previousSourceMap.set(
            sourceName,
            (previousSourceMap.get(sourceName) ?? 0) + 1,
          );
        }

        for (const leadRecordItem of currentLeadRecords) {
          const sourceName = await getSourceNameService(leadRecordItem);
          const statusName = await getStatusNameService(leadRecordItem);
          const sourceSummary = currentSourceMap.get(sourceName) ?? {
            leads: 0,
            won: 0,
          };

          currentSourceMap.set(sourceName, {
            leads: sourceSummary.leads + 1,
            won:
              sourceSummary.won +
              (statusName === ADMIN_REPORTS_WON_STATUS ? 1 : 0),
          });
        }

        const sources = Array.from(currentSourceMap.entries())
          .map(([sourceName, sourceSummary]) => ({
            source: sourceName,
            leads: sourceSummary.leads,
            won: sourceSummary.won,
            rate:
              sourceSummary.leads === 0
                ? 0
                : toRoundedPercent((sourceSummary.won / sourceSummary.leads) * 100),
            trend: calculatePercentageChange(
              sourceSummary.leads,
              previousSourceMap.get(sourceName) ?? 0,
            ),
          }))
          .sort((leftItem, rightItem) => {
            if (rightItem.leads !== leftItem.leads) {
              return rightItem.leads - leftItem.leads;
            }

            if (rightItem.won !== leftItem.won) {
              return rightItem.won - leftItem.won;
            }

            return leftItem.source.localeCompare(rightItem.source);
          });

        const bestSourceCandidate = [...sources].sort((leftItem, rightItem) => {
          if (rightItem.rate !== leftItem.rate) {
            return rightItem.rate - leftItem.rate;
          }

          if (rightItem.won !== leftItem.won) {
            return rightItem.won - leftItem.won;
          }

          if (rightItem.leads !== leftItem.leads) {
            return rightItem.leads - leftItem.leads;
          }

          return leftItem.source.localeCompare(rightItem.source);
        })[0];

        return {
          data: {
            sources,
            bestSource:
              bestSourceCandidate === undefined
                ? null
                : {
                    source: bestSourceCandidate.source,
                    leads: bestSourceCandidate.leads,
                    won: bestSourceCandidate.won,
                    rate: bestSourceCandidate.rate,
                    guidance: createBestSourceGuidance(bestSourceCandidate),
                  },
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
    getFunnelReportService: async (_authenticatedUser, query) => {
      try {
        const { currentLeadRecords } = await getLeadRecordsForRange(query);
        const currentStatuses = await Promise.all(
          currentLeadRecords.map((leadRecordItem) =>
            getStatusNameService(leadRecordItem),
          ),
        );
        const lostReasonMap = new Map<string, number>();
        const lostLeadIndices: number[] = [];

        const stages = await Promise.all(
          ADMIN_REPORTS_FUNNEL_STAGE_ORDER.map(async (stageItem) => {
            const stageCount = currentStatuses.filter(
              (statusNameItem) => statusNameItem === stageItem,
            ).length;

            return {
              stage: stageItem,
              count: stageCount,
              percentage:
                currentLeadRecords.length === 0
                  ? 0
                  : toRoundedPercent((stageCount / currentLeadRecords.length) * 100),
            };
          }),
        );

        for (let index = 0; index < currentStatuses.length; index += 1) {
          const statusName = currentStatuses[index] ?? null;

          if (!isLostStatus(statusName)) {
            continue;
          }

          lostLeadIndices.push(index);
        }

        for (const lostLeadIndex of lostLeadIndices) {
          const lostReasonName = await getLostReasonNameService(
            currentLeadRecords[lostLeadIndex] as AdminReportsLeadRecordData,
          );

          lostReasonMap.set(
            lostReasonName,
            (lostReasonMap.get(lostReasonName) ?? 0) + 1,
          );
        }

        const totalLostLeads = lostLeadIndices.length;
        const lostReasons: LostReasonBreakdownData[] = Array.from(
          lostReasonMap.entries(),
        )
          .map(([reasonName, reasonCount]) => ({
            reason: reasonName,
            count: reasonCount,
            percentage:
              totalLostLeads === 0
                ? 0
                : toRoundedPercent((reasonCount / totalLostLeads) * 100),
          }))
          .sort((leftItem, rightItem) => {
            if (rightItem.count !== leftItem.count) {
              return rightItem.count - leftItem.count;
            }

            return leftItem.reason.localeCompare(rightItem.reason);
          });

        return {
          data: {
            stages,
            lostReasons,
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
  };
};

let adminReportsService: AdminReportsServiceData = createAdminReportsService();

export const getAdminReportsService = (): AdminReportsServiceData => {
  return adminReportsService;
};

export const setAdminReportsService = (
  service: AdminReportsServiceData,
): void => {
  adminReportsService = service;
};
