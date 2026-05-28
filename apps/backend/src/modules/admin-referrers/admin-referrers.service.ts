// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { AuthenticatedUserData } from "../../common/utils/authenticated-user.js";
import type {
  AdminReferredLeadsQueryData,
  AdminReferrersListQueryData,
  AdminReferrersServiceErrorData,
  PaginatedReferredLeadsData,
  PaginatedReferrersData,
  ReferredLeadData,
  ReferrerData,
  ReferrerDetailData,
} from "./admin-referrers.types.js";
// CONFIG //
import { environmentConfig } from "../../config/environment.js";
// CONSTANTS //
import {
  ADMIN_REFERRERS_UNKNOWN_NAME,
  ADMIN_REFERRER_NOT_FOUND_MESSAGE,
  ADMIN_REFERRERS_WON_STATUS,
} from "../../common/constants/admin-referrers.constants.js";
import { LEAD_STATUS_VALUES } from "../../common/constants/lead.constants.js";

interface ReferrerRecordData {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  created_at?: string | null;
}

interface ReferrerLeadRecordData {
  id: string;
  full_name?: string | null;
  created_at?: string | null;
  status_id?: string | null;
  referred_by_referrer_id?: string | null;
}

interface NamedEntityRecordData {
  id: string;
  name: string;
}

interface ReferrerAggregateData {
  referrer: ReferrerRecordData;
  totalReferrals: number;
  won: number;
  conversionRate: number;
}

interface AdminReferrersServiceDependenciesData {
  getReferrerRecords: () => Promise<ReferrerRecordData[]>;
  getReferrerRecordById: (referrerId: string) => Promise<ReferrerRecordData | null>;
  getLeadRecordsByReferrerIds: (
    referrerIds: string[],
  ) => Promise<ReferrerLeadRecordData[]>;
  getLeadRecordsByReferrerId: (
    referrerId: string,
  ) => Promise<ReferrerLeadRecordData[]>;
  getStatusNameById: (statusId: string) => Promise<string | null>;
}

const createAdminReferrersServiceError = (
  code: AdminReferrersServiceErrorData["code"],
  message: string,
): AdminReferrersServiceErrorData => {
  const serviceError = new Error(message) as AdminReferrersServiceErrorData;
  serviceError.code = code;
  return serviceError;
};

const toRoundedPercent = (value: number): number => {
  return Number(value.toFixed(2));
};

const normalizeStatusName = (statusName: string | null): string | null => {
  if (!statusName) {
    return null;
  }

  return statusName.trim().toUpperCase();
};

const normalizeReferrerName = (referrerRecord: ReferrerRecordData): string => {
  if (
    typeof referrerRecord.full_name === "string" &&
    referrerRecord.full_name.trim().length > 0
  ) {
    return referrerRecord.full_name.trim();
  }

  return ADMIN_REFERRERS_UNKNOWN_NAME;
};

const toMonthLabel = (dateValue: string | null | undefined): string => {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
};

const normalizeLeadStatus = (statusName: string | null): (typeof LEAD_STATUS_VALUES)[number] => {
  if (
    statusName &&
    LEAD_STATUS_VALUES.includes(statusName as (typeof LEAD_STATUS_VALUES)[number])
  ) {
    return statusName as (typeof LEAD_STATUS_VALUES)[number];
  }

  return "NEW";
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

    console.log("[admin-referrers] Supabase read failed", {
      requestUrl: requestUrl.toString(),
      status: response.status,
      errorMessage,
    });

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};

const createDefaultAdminReferrersDependencies =
  (): AdminReferrersServiceDependenciesData => {
    return {
      getReferrerRecords: async () => {
        const requestUrl = createSupabaseTableUrl("referrers");
        requestUrl.searchParams.set(
          "select",
          "id,full_name,phone,email,city,created_at",
        );
        requestUrl.searchParams.set("order", "full_name.asc");

        return executeReadRequest<ReferrerRecordData[]>(requestUrl);
      },
      getReferrerRecordById: async (referrerId) => {
        const requestUrl = createSupabaseTableUrl("referrers");
        requestUrl.searchParams.set(
          "select",
          "id,full_name,phone,email,city,created_at",
        );
        requestUrl.searchParams.set("id", `eq.${referrerId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<ReferrerRecordData[]>(
          requestUrl,
        );

        return responseBody[0] ?? null;
      },
      getLeadRecordsByReferrerIds: async (referrerIds) => {
        if (referrerIds.length === 0) {
          return [];
        }

        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set(
          "select",
          "id,full_name,created_at,status_id,referred_by_referrer_id",
        );
        requestUrl.searchParams.set(
          "referred_by_referrer_id",
          `in.(${referrerIds.join(",")})`,
        );
        requestUrl.searchParams.set("order", "created_at.desc");

        return executeReadRequest<ReferrerLeadRecordData[]>(requestUrl);
      },
      getLeadRecordsByReferrerId: async (referrerId) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set(
          "select",
          "id,full_name,created_at,status_id,referred_by_referrer_id",
        );
        requestUrl.searchParams.set("referred_by_referrer_id", `eq.${referrerId}`);
        requestUrl.searchParams.set("order", "created_at.desc");

        return executeReadRequest<ReferrerLeadRecordData[]>(requestUrl);
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
    };
  };

const paginateItems = <T>({
  items,
  page,
  limit,
}: {
  items: T[];
  page: number;
  limit: number;
}): { items: T[]; page: number; limit: number; totalItems: number; totalPages: number } => {
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;

  return {
    items: items.slice(startIndex, startIndex + limit),
    page,
    limit,
    totalItems,
    totalPages,
  };
};

export interface AdminReferrersServiceData {
  getReferrersService: (
    authenticatedUser: AuthenticatedUserData,
    query: AdminReferrersListQueryData,
  ) => Promise<QueryResponseData<PaginatedReferrersData>>;
  getReferrerByIdService: (
    authenticatedUser: AuthenticatedUserData,
    referrerId: string,
  ) => Promise<QueryResponseData<ReferrerDetailData>>;
  getReferredLeadsService: (
    authenticatedUser: AuthenticatedUserData,
    referrerId: string,
    query: AdminReferredLeadsQueryData,
  ) => Promise<QueryResponseData<PaginatedReferredLeadsData>>;
}

export const createAdminReferrersService = (
  dependencies: AdminReferrersServiceDependenciesData = createDefaultAdminReferrersDependencies(),
): AdminReferrersServiceData => {
  const buildReferrerAggregateMap = async (
    referrerRecords: ReferrerRecordData[],
  ): Promise<Map<string, ReferrerAggregateData>> => {
    const referrerIds = referrerRecords.map((referrerRecordItem) => referrerRecordItem.id);
    const leadRecords = await dependencies.getLeadRecordsByReferrerIds(referrerIds);
    const statusEntries = await Promise.all(
      leadRecords.map(async (leadRecordItem) => [
        leadRecordItem.id,
        typeof leadRecordItem.status_id === "string"
          ? normalizeStatusName(
              await dependencies.getStatusNameById(leadRecordItem.status_id),
            )
          : null,
      ] as const),
    );
    const statusMap = new Map<string, string | null>(statusEntries);
    const aggregateMap = new Map<string, ReferrerAggregateData>();

    for (const referrerRecordItem of referrerRecords) {
      aggregateMap.set(referrerRecordItem.id, {
        referrer: referrerRecordItem,
        totalReferrals: 0,
        won: 0,
        conversionRate: 0,
      });
    }

    for (const leadRecordItem of leadRecords) {
      if (
        typeof leadRecordItem.referred_by_referrer_id !== "string" ||
        !aggregateMap.has(leadRecordItem.referred_by_referrer_id)
      ) {
        continue;
      }

      const aggregateItem = aggregateMap.get(
        leadRecordItem.referred_by_referrer_id,
      ) as ReferrerAggregateData;
      const wonIncrement =
        statusMap.get(leadRecordItem.id) === ADMIN_REFERRERS_WON_STATUS ? 1 : 0;
      const totalReferrals = aggregateItem.totalReferrals + 1;
      const won = aggregateItem.won + wonIncrement;

      aggregateMap.set(leadRecordItem.referred_by_referrer_id, {
        ...aggregateItem,
        totalReferrals,
        won,
        conversionRate:
          totalReferrals === 0 ? 0 : toRoundedPercent((won / totalReferrals) * 100),
      });
    }

    return aggregateMap;
  };

  const toReferrerData = (aggregateItem: ReferrerAggregateData): ReferrerData => {
    return {
      id: aggregateItem.referrer.id,
      name: normalizeReferrerName(aggregateItem.referrer),
      phone:
        typeof aggregateItem.referrer.phone === "string"
          ? aggregateItem.referrer.phone
          : "",
      email:
        typeof aggregateItem.referrer.email === "string"
          ? aggregateItem.referrer.email
          : null,
      city:
        typeof aggregateItem.referrer.city === "string"
          ? aggregateItem.referrer.city
          : null,
      since: toMonthLabel(aggregateItem.referrer.created_at),
      totalReferrals: aggregateItem.totalReferrals,
      won: aggregateItem.won,
      conversionRate: aggregateItem.conversionRate,
    };
  };

  const sortMostReferrals = (
    leftItem: ReferrerData,
    rightItem: ReferrerData,
  ): number => {
    if (rightItem.totalReferrals !== leftItem.totalReferrals) {
      return rightItem.totalReferrals - leftItem.totalReferrals;
    }

    if (rightItem.won !== leftItem.won) {
      return rightItem.won - leftItem.won;
    }

    return leftItem.name.localeCompare(rightItem.name);
  };

  const sortBestConversion = (
    leftItem: ReferrerData,
    rightItem: ReferrerData,
  ): number => {
    if (rightItem.conversionRate !== leftItem.conversionRate) {
      return rightItem.conversionRate - leftItem.conversionRate;
    }

    if (rightItem.won !== leftItem.won) {
      return rightItem.won - leftItem.won;
    }

    if (rightItem.totalReferrals !== leftItem.totalReferrals) {
      return rightItem.totalReferrals - leftItem.totalReferrals;
    }

    return leftItem.name.localeCompare(rightItem.name);
  };

  const mapServiceError = (error: unknown): AdminReferrersServiceErrorData => {
    console.log("[admin-referrers] service error", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "UnknownError",
    });

    if (
      error instanceof Error &&
      "code" in error &&
      typeof (error as AdminReferrersServiceErrorData).code === "string"
    ) {
      return error as AdminReferrersServiceErrorData;
    }

    return createAdminReferrersServiceError(
      "INTERNAL",
      error instanceof Error ? error.message : "Admin referrers request failed.",
    );
  };

  return {
    getReferrersService: async (_authenticatedUser, query) => {
      try {
        const referrerRecords = await dependencies.getReferrerRecords();
        const aggregateMap = await buildReferrerAggregateMap(referrerRecords);
        const normalizedSearch = query.search?.trim().toLowerCase() ?? "";
        const sortFunction =
          query.sort === "best-conversion" ? sortBestConversion : sortMostReferrals;
        const referrerItems = Array.from(aggregateMap.values())
          .map(toReferrerData)
          .filter((referrerItem) => {
            if (normalizedSearch.length === 0) {
              return true;
            }

            return (
              referrerItem.name.toLowerCase().includes(normalizedSearch) ||
              referrerItem.phone.toLowerCase().includes(normalizedSearch)
            );
          })
          .sort(sortFunction);

        return {
          data: paginateItems({
            items: referrerItems,
            page: query.page,
            limit: query.limit,
          }),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getReferrerByIdService: async (_authenticatedUser, referrerId) => {
      try {
        const referrerRecords = await dependencies.getReferrerRecords();
        const targetReferrerRecord =
          referrerRecords.find((referrerRecordItem) => referrerRecordItem.id === referrerId) ??
          (await dependencies.getReferrerRecordById(referrerId));

        if (!targetReferrerRecord) {
          return {
            data: null,
            error: createAdminReferrersServiceError(
              "NOT_FOUND",
              ADMIN_REFERRER_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const referrerCollection = referrerRecords.some(
          (referrerRecordItem) => referrerRecordItem.id === targetReferrerRecord.id,
        )
          ? referrerRecords
          : [...referrerRecords, targetReferrerRecord];
        const aggregateMap = await buildReferrerAggregateMap(referrerCollection);
        const topReferrerItem = Array.from(aggregateMap.values())
          .map(toReferrerData)
          .sort(sortMostReferrals)[0];
        const aggregateItem = aggregateMap.get(targetReferrerRecord.id);

        if (!aggregateItem) {
          return {
            data: null,
            error: createAdminReferrersServiceError(
              "NOT_FOUND",
              ADMIN_REFERRER_NOT_FOUND_MESSAGE,
            ),
          };
        }

        return {
          data: {
            ...toReferrerData(aggregateItem),
            isTopReferrer: topReferrerItem?.id === targetReferrerRecord.id,
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
    getReferredLeadsService: async (_authenticatedUser, referrerId, query) => {
      try {
        const referrerRecord = await dependencies.getReferrerRecordById(referrerId);

        if (!referrerRecord) {
          return {
            data: null,
            error: createAdminReferrersServiceError(
              "NOT_FOUND",
              ADMIN_REFERRER_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const leadRecords = await dependencies.getLeadRecordsByReferrerId(referrerId);
        const leadItems: ReferredLeadData[] = await Promise.all(
          leadRecords.map(async (leadRecordItem) => {
            const statusName =
              typeof leadRecordItem.status_id === "string"
                ? normalizeStatusName(
                    await dependencies.getStatusNameById(leadRecordItem.status_id),
                  )
                : null;

            return {
              id: leadRecordItem.id,
              leadName:
                typeof leadRecordItem.full_name === "string"
                  ? leadRecordItem.full_name
                  : "",
              status: normalizeLeadStatus(statusName),
              month: toMonthLabel(leadRecordItem.created_at),
            };
          }),
        );

        return {
          data: paginateItems({
            items: leadItems,
            page: query.page,
            limit: query.limit,
          }),
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

let adminReferrersService: AdminReferrersServiceData =
  createAdminReferrersService();

export const getAdminReferrersService = (): AdminReferrersServiceData => {
  return adminReferrersService;
};

export const setAdminReferrersService = (
  service: AdminReferrersServiceData,
): void => {
  adminReferrersService = service;
};
