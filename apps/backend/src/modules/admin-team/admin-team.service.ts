// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { AuthenticatedUserData } from "../../common/utils/authenticated-user.js";
import type {
  SupabaseLookupRecordData,
  SupabaseUserRecordData,
} from "../../config/supabase.js";
import type {
  AdminTeamOptionsData,
  AdminTeamServiceErrorData,
  CreateSalespersonRequestData,
  CreateSalespersonResponseData,
  RemoveSalespersonRequestData,
  RemoveSalespersonResponseData,
  ResetSalespersonPasswordResponseData,
  SalespersonData,
  SalespersonDetailData,
  SalespersonStatsData,
  TeamOptionItemData,
  UpdateSalespersonRequestData,
} from "./admin-team.types.js";
// CONFIG //
import { environmentConfig } from "../../config/environment.js";
import {
  createAuthUser,
  deleteAuthUser,
  getBranchByIdentifier,
  getBranches,
  getRoleByIdentifier,
  getRoles,
  getUserByRecordIdentifier,
  updateAuthUserPassword,
} from "../../config/supabase.js";
// CONSTANTS //
import {
  ADMIN_TEAM_ACTIVE_LEAD_STATUSES,
  ADMIN_TEAM_ACTIVE_STATUS_LABEL,
  ADMIN_TEAM_AUTH_ID_MISSING_MESSAGE,
  ADMIN_TEAM_BRANCH_NOT_FOUND_MESSAGE,
  ADMIN_TEAM_DEFAULT_PERIOD,
  ADMIN_TEAM_DUPLICATE_EMAIL_MESSAGE,
  ADMIN_TEAM_DUPLICATE_PHONE_MESSAGE,
  ADMIN_TEAM_DUPLICATE_USER_ID_MESSAGE,
  ADMIN_TEAM_INACTIVE_STATUS_LABEL,
  ADMIN_TEAM_REASSIGN_TARGET_INVALID_MESSAGE,
  ADMIN_TEAM_REASSIGN_TARGET_NOT_FOUND_MESSAGE,
  ADMIN_TEAM_ROLE_NOT_FOUND_MESSAGE,
  ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
  ADMIN_TEAM_TEMP_PASSWORD_LENGTH,
  ADMIN_TEAM_WON_STATUS,
} from "../../common/constants/admin-team.constants.js";
// LIBRARIES //
import { randomBytes } from "node:crypto";

interface AdminTeamUserRecordData {
  id: string;
  user_code?: string | null;
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  role_id?: string | null;
  branch_id?: string | null;
  is_active?: boolean | null;
  joined_at?: string | null;
  auth_id?: string | null;
}

interface AdminTeamLeadAssignmentRecordData {
  lead_id: string;
  user_id: string;
  is_primary: boolean | null;
  lead?: {
    id: string;
    created_at?: string | null;
    status_id?: string | null;
  } | null;
}

interface PeriodRangeData {
  currentFromInclusive: Date;
  currentToExclusive: Date;
}

interface AdminTeamServiceDependenciesData {
  getSalesUserRecords: () => Promise<AdminTeamUserRecordData[]>;
  getUserRecordByIdentifier: (
    salespersonId: string,
  ) => Promise<AdminTeamUserRecordData | null>;
  getUserRecordByEmail: (email: string) => Promise<AdminTeamUserRecordData | null>;
  getUserRecordByPhone: (phone: string) => Promise<AdminTeamUserRecordData | null>;
  getUserRecordByUserCode: (
    userCode: string,
  ) => Promise<AdminTeamUserRecordData | null>;
  createUserRecord: (payload: {
    userCode: string;
    fullName: string;
    phone: string;
    email: string;
    roleId: string;
    branchId: string;
    authId: string;
    isActive: boolean;
    joinedAt: string;
  }) => Promise<AdminTeamUserRecordData>;
  updateUserRecord: (
    userRecordId: string,
    payload: Record<string, unknown>,
  ) => Promise<AdminTeamUserRecordData>;
  getRoles: () => Promise<SupabaseLookupRecordData[]>;
  getRoleByIdentifier: (
    roleIdentifier: string,
  ) => Promise<SupabaseLookupRecordData | null>;
  getBranches: () => Promise<SupabaseLookupRecordData[]>;
  getBranchByIdentifier: (
    branchIdentifier: string,
  ) => Promise<SupabaseLookupRecordData | null>;
  createAuthUser: (payload: {
    email: string;
    password: string;
  }) => Promise<{ id: string; email?: string }>;
  deleteAuthUser: (authUserId: string) => Promise<void>;
  updateAuthUserPassword: (payload: {
    authUserId: string;
    password: string;
  }) => Promise<void>;
  getUserByRecordIdentifier: (
    userIdentifier: string,
  ) => Promise<SupabaseUserRecordData | null>;
  getStatusNameById: (statusId: string) => Promise<string | null>;
  getLeadAssignmentsByUserIds: (
    userRecordIds: string[],
  ) => Promise<AdminTeamLeadAssignmentRecordData[]>;
  reassignLeadAssignments: (payload: {
    fromUserId: string;
    toUserId: string;
    leadIds: string[];
  }) => Promise<void>;
  unassignLeadAssignments: (payload: {
    fromUserId: string;
    leadIds: string[];
  }) => Promise<void>;
}

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

const buildServiceRoleHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
    apikey: environmentConfig.supabaseServiceRoleKey,
    Authorization: `Bearer ${environmentConfig.supabaseServiceRoleKey}`,
    Prefer: "return=representation",
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
    throw new Error(await getSupabaseErrorMessage(response));
  }

  return (await response.json()) as T;
};

const executeMutationRequest = async <T>({
  method,
  requestUrl,
  body,
}: {
  method: "POST" | "PATCH";
  requestUrl: URL;
  body: object;
}): Promise<T> => {
  const response = await fetch(requestUrl, {
    method,
    headers: buildServiceRoleHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await getSupabaseErrorMessage(response));
  }

  const responseBody = (await response.json()) as T[];
  const firstRecord = responseBody[0];

  if (!firstRecord) {
    throw new Error("Supabase mutation did not return a record.");
  }

  return firstRecord;
};

const executeDeleteRequest = async (requestUrl: URL): Promise<void> => {
  const response = await fetch(requestUrl, {
    method: "DELETE",
    headers: buildServiceRoleHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getSupabaseErrorMessage(response));
  }
};

const createSupabaseTableUrl = (tableName: string): URL => {
  return new URL(`${environmentConfig.supabaseUrl}/rest/v1/${tableName}`);
};

const createAdminTeamServiceError = (
  code: AdminTeamServiceErrorData["code"],
  message: string,
): AdminTeamServiceErrorData => {
  const adminTeamError = new Error(message) as AdminTeamServiceErrorData;
  adminTeamError.code = code;
  return adminTeamError;
};

const startOfMonth = (dateValue: Date): Date => {
  return new Date(dateValue.getFullYear(), dateValue.getMonth(), 1);
};

const addMonths = (dateValue: Date, monthDelta: number): Date => {
  return new Date(dateValue.getFullYear(), dateValue.getMonth() + monthDelta, 1);
};

const parsePeriodRange = (period: string): PeriodRangeData => {
  const trimmedPeriod = period.trim().toLowerCase();
  const currentDate = new Date();

  if (trimmedPeriod === ADMIN_TEAM_DEFAULT_PERIOD) {
    const currentFromInclusive = startOfMonth(currentDate);

    return {
      currentFromInclusive,
      currentToExclusive: addMonths(currentFromInclusive, 1),
    };
  }

  const yearMonthMatch = trimmedPeriod.match(/^(\d{4})-(\d{2})$/);

  if (yearMonthMatch) {
    const yearNumber = Number(yearMonthMatch[1]);
    const monthNumber = Number(yearMonthMatch[2]);

    if (monthNumber < 1 || monthNumber > 12) {
      throw createAdminTeamServiceError(
        "BAD_REQUEST",
        "Period month must be between 01 and 12.",
      );
    }

    return {
      currentFromInclusive: new Date(yearNumber, monthNumber - 1, 1),
      currentToExclusive: new Date(yearNumber, monthNumber, 1),
    };
  }

  const namedMonthMatch = trimmedPeriod.match(/^([a-z]+)(?:[\s-]+)(\d{4})$/);

  if (!namedMonthMatch) {
    throw createAdminTeamServiceError(
      "BAD_REQUEST",
      "Period must be 'this-month', use YYYY-MM, or use a month name like 'May 2026'.",
    );
  }

  const monthIndex = MONTH_NAME_TO_INDEX_MAP[namedMonthMatch[1] ?? ""];

  if (monthIndex === undefined) {
    throw createAdminTeamServiceError(
      "BAD_REQUEST",
      "Period month name is invalid. Use a value like 'May 2026'.",
    );
  }

  const yearNumber = Number(namedMonthMatch[2]);

  return {
    currentFromInclusive: new Date(yearNumber, monthIndex, 1),
    currentToExclusive: new Date(yearNumber, monthIndex + 1, 1),
  };
};

const isDateWithinRange = ({
  isoDate,
  fromInclusive,
  toExclusive,
}: {
  isoDate: string | null | undefined;
  fromInclusive: Date;
  toExclusive: Date;
}): boolean => {
  if (!isoDate) {
    return false;
  }

  const parsedDate = new Date(isoDate);

  return parsedDate >= fromInclusive && parsedDate < toExclusive;
};

const toRoundedPercent = (value: number): number => {
  return Number(value.toFixed(2));
};

const generateTempPassword = (): string => {
  const randomSuffix = randomBytes(6).toString("base64url").slice(0, 8);
  return `Gw${randomSuffix}9A!`;
};

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const normalizeSearchValue = (searchValue: string | undefined): string | null => {
  if (!searchValue) {
    return null;
  }

  const trimmedSearchValue = searchValue.trim().toLowerCase();
  return trimmedSearchValue.length > 0 ? trimmedSearchValue : null;
};

const isAdminRoleName = (roleName: string): boolean => {
  const normalizedRoleName = roleName.trim().toLowerCase();
  return normalizedRoleName.includes("admin");
};

const mapStatusLabel = (isActive: boolean): "Active" | "Inactive" => {
  return isActive
    ? ADMIN_TEAM_ACTIVE_STATUS_LABEL
    : ADMIN_TEAM_INACTIVE_STATUS_LABEL;
};

const createDefaultAdminTeamDependencies =
  (): AdminTeamServiceDependenciesData => {
    const getUsersSelectQuery = (): string => {
      return [
        "id",
        environmentConfig.supabaseLoginUserIdColumn,
        environmentConfig.supabaseUserNameColumn,
        environmentConfig.supabaseUserPhoneColumn,
        environmentConfig.supabaseUserEmailColumn,
        environmentConfig.supabaseUserRoleColumn,
        environmentConfig.supabaseUserBranchColumn,
        environmentConfig.supabaseUserActiveColumn,
        environmentConfig.supabaseUserJoinedAtColumn,
        "auth_id",
      ].join(",");
    };

    return {
      getSalesUserRecords: async () => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set("order", `${environmentConfig.supabaseUserNameColumn}.asc`);

        return executeReadRequest<AdminTeamUserRecordData[]>(requestUrl);
      },
      getUserRecordByIdentifier: async (salespersonId) => {
        const requestByUserCodeUrl = createSupabaseTableUrl(
          environmentConfig.supabaseUsersTable,
        );
        requestByUserCodeUrl.searchParams.set("select", getUsersSelectQuery());
        requestByUserCodeUrl.searchParams.set(
          environmentConfig.supabaseLoginUserIdColumn,
          `eq.${salespersonId}`,
        );
        requestByUserCodeUrl.searchParams.set("limit", "1");

        const userCodeResponse =
          await executeReadRequest<AdminTeamUserRecordData[]>(requestByUserCodeUrl);

        if (userCodeResponse[0]) {
          return userCodeResponse[0];
        }

        const requestByIdUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestByIdUrl.searchParams.set("select", getUsersSelectQuery());
        requestByIdUrl.searchParams.set("id", `eq.${salespersonId}`);
        requestByIdUrl.searchParams.set("limit", "1");

        const userIdResponse =
          await executeReadRequest<AdminTeamUserRecordData[]>(requestByIdUrl);

        return userIdResponse[0] ?? null;
      },
      getUserRecordByEmail: async (email) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set(
          environmentConfig.supabaseUserEmailColumn,
          `eq.${email}`,
        );
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<AdminTeamUserRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      getUserRecordByPhone: async (phone) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set(
          environmentConfig.supabaseUserPhoneColumn,
          `eq.${phone}`,
        );
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<AdminTeamUserRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      getUserRecordByUserCode: async (userCode) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set(
          environmentConfig.supabaseLoginUserIdColumn,
          `eq.${userCode}`,
        );
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<AdminTeamUserRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      createUserRecord: async (payload) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());

        return executeMutationRequest<AdminTeamUserRecordData>({
          method: "POST",
          requestUrl,
          body: {
            [environmentConfig.supabaseLoginUserIdColumn]: payload.userCode,
            [environmentConfig.supabaseUserNameColumn]: payload.fullName,
            [environmentConfig.supabaseUserPhoneColumn]: payload.phone,
            [environmentConfig.supabaseUserEmailColumn]: payload.email,
            [environmentConfig.supabaseUserRoleColumn]: payload.roleId,
            [environmentConfig.supabaseUserBranchColumn]: payload.branchId,
            [environmentConfig.supabaseUserActiveColumn]: payload.isActive,
            [environmentConfig.supabaseUserJoinedAtColumn]: payload.joinedAt,
            auth_id: payload.authId,
          },
        });
      },
      updateUserRecord: async (userRecordId, payload) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("id", `eq.${userRecordId}`);
        requestUrl.searchParams.set("select", getUsersSelectQuery());

        return executeMutationRequest<AdminTeamUserRecordData>({
          method: "PATCH",
          requestUrl,
          body: payload,
        });
      },
      getRoles,
      getRoleByIdentifier,
      getBranches,
      getBranchByIdentifier,
      createAuthUser,
      deleteAuthUser,
      updateAuthUserPassword,
      getUserByRecordIdentifier,
      getStatusNameById: async (statusId) => {
        const statusRequestUrl = createSupabaseTableUrl("statuses");
        statusRequestUrl.searchParams.set("select", "id,name");
        statusRequestUrl.searchParams.set("id", `eq.${statusId}`);
        statusRequestUrl.searchParams.set("limit", "1");

        const statusResponse =
          await executeReadRequest<Array<{ id: string; name: string }>>(
            statusRequestUrl,
          );

        return statusResponse[0]?.name?.trim().toUpperCase() ?? null;
      },
      getLeadAssignmentsByUserIds: async (userRecordIds) => {
        if (userRecordIds.length === 0) {
          return [];
        }

        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set(
          "select",
          "lead_id,user_id,is_primary,lead:leads!inner(id,created_at,status_id)",
        );
        requestUrl.searchParams.set("user_id", `in.(${userRecordIds.join(",")})`);
        requestUrl.searchParams.set("is_primary", "eq.true");

        return executeReadRequest<AdminTeamLeadAssignmentRecordData[]>(requestUrl);
      },
      reassignLeadAssignments: async ({ fromUserId, toUserId, leadIds }) => {
        if (leadIds.length === 0) {
          return;
        }

        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set("user_id", `eq.${fromUserId}`);
        requestUrl.searchParams.set("lead_id", `in.(${leadIds.join(",")})`);
        requestUrl.searchParams.set("select", "lead_id,user_id,is_primary");

        await executeMutationRequest<AdminTeamLeadAssignmentRecordData>({
          method: "PATCH",
          requestUrl,
          body: {
            user_id: toUserId,
          },
        });
      },
      unassignLeadAssignments: async ({ fromUserId, leadIds }) => {
        if (leadIds.length === 0) {
          return;
        }

        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set("user_id", `eq.${fromUserId}`);
        requestUrl.searchParams.set("lead_id", `in.(${leadIds.join(",")})`);

        await executeDeleteRequest(requestUrl);
      },
    };
  };

export interface AdminTeamServiceData {
  getTeamService: (
    authenticatedUser: AuthenticatedUserData,
    query: {
      search?: string;
      status: "active" | "inactive";
      branchId?: string;
      period: string;
    },
  ) => Promise<QueryResponseData<SalespersonData[]>>;
  getSalespersonByIdService: (
    authenticatedUser: AuthenticatedUserData,
    salespersonId: string,
    period: string,
  ) => Promise<QueryResponseData<SalespersonDetailData>>;
  getTeamOptionsService: (
    authenticatedUser: AuthenticatedUserData,
  ) => Promise<QueryResponseData<AdminTeamOptionsData>>;
  createSalespersonService: (
    authenticatedUser: AuthenticatedUserData,
    payload: CreateSalespersonRequestData,
  ) => Promise<QueryResponseData<CreateSalespersonResponseData>>;
  updateSalespersonService: (
    authenticatedUser: AuthenticatedUserData,
    salespersonId: string,
    payload: UpdateSalespersonRequestData,
  ) => Promise<QueryResponseData<SalespersonData>>;
  resetSalespersonPasswordService: (
    authenticatedUser: AuthenticatedUserData,
    salespersonId: string,
  ) => Promise<QueryResponseData<ResetSalespersonPasswordResponseData>>;
  removeSalespersonService: (
    authenticatedUser: AuthenticatedUserData,
    salespersonId: string,
    payload: RemoveSalespersonRequestData,
  ) => Promise<QueryResponseData<RemoveSalespersonResponseData>>;
}

/**
 * Creates the admin team service with injectable dependencies.
 */
export const createAdminTeamService = (
  dependencies: AdminTeamServiceDependenciesData = createDefaultAdminTeamDependencies(),
): AdminTeamServiceData => {
  const ensureAdminUser = (
    authenticatedUser: AuthenticatedUserData,
  ): AdminTeamServiceErrorData | null => {
    if (authenticatedUser.role !== "admin") {
      return createAdminTeamServiceError(
        "FORBIDDEN",
        "You are not allowed to access admin team resources.",
      );
    }

    return null;
  };

  const resolveRoleLookup = async (
    roleId: string | null | undefined,
  ): Promise<TeamOptionItemData> => {
    if (!roleId) {
      throw createAdminTeamServiceError("NOT_FOUND", ADMIN_TEAM_ROLE_NOT_FOUND_MESSAGE);
    }

    const roleLookup = await dependencies.getRoleByIdentifier(roleId);

    if (!roleLookup) {
      throw createAdminTeamServiceError("NOT_FOUND", ADMIN_TEAM_ROLE_NOT_FOUND_MESSAGE);
    }

    return roleLookup;
  };

  const resolveBranchLookup = async (
    branchId: string | null | undefined,
  ): Promise<TeamOptionItemData> => {
    if (!branchId) {
      throw createAdminTeamServiceError(
        "NOT_FOUND",
        ADMIN_TEAM_BRANCH_NOT_FOUND_MESSAGE,
      );
    }

    const branchLookup = await dependencies.getBranchByIdentifier(branchId);

    if (!branchLookup) {
      throw createAdminTeamServiceError(
        "NOT_FOUND",
        ADMIN_TEAM_BRANCH_NOT_FOUND_MESSAGE,
      );
    }

    return branchLookup;
  };

  const getCurrentPeriodStatsMap = async (
    userRecordIds: string[],
    period: string,
  ): Promise<Map<string, SalespersonStatsData>> => {
    const { currentFromInclusive, currentToExclusive } = parsePeriodRange(period);
    const assignments = await dependencies.getLeadAssignmentsByUserIds(userRecordIds);
    const statsMap = new Map<string, SalespersonStatsData>();

    for (const assignmentItem of assignments) {
      if (
        !assignmentItem.lead ||
        !isDateWithinRange({
          isoDate: assignmentItem.lead.created_at,
          fromInclusive: currentFromInclusive,
          toExclusive: currentToExclusive,
        })
      ) {
        continue;
      }

      const currentStats = statsMap.get(assignmentItem.user_id) ?? {
        leads: 0,
        won: 0,
        winRate: 0,
      };
      const statusName =
        typeof assignmentItem.lead.status_id === "string"
          ? await dependencies.getStatusNameById(assignmentItem.lead.status_id)
          : null;
      const wonCount =
        currentStats.won + (statusName === ADMIN_TEAM_WON_STATUS ? 1 : 0);
      const leadsCount = currentStats.leads + 1;

      statsMap.set(assignmentItem.user_id, {
        leads: leadsCount,
        won: wonCount,
        winRate: leadsCount === 0 ? 0 : toRoundedPercent((wonCount / leadsCount) * 100),
      });
    }

    return statsMap;
  };

  const getActiveLeadCountByUserId = async (userRecordId: string): Promise<number> => {
    const assignments = await dependencies.getLeadAssignmentsByUserIds([userRecordId]);
    let activeLeadCount = 0;

    for (const assignmentItem of assignments) {
      if (!assignmentItem.lead?.status_id) {
        continue;
      }

      const statusName = await dependencies.getStatusNameById(
        assignmentItem.lead.status_id,
      );

      if (
        statusName &&
        ADMIN_TEAM_ACTIVE_LEAD_STATUSES.includes(
          statusName as (typeof ADMIN_TEAM_ACTIVE_LEAD_STATUSES)[number],
        )
      ) {
        activeLeadCount += 1;
      }
    }

    return activeLeadCount;
  };

  const mapSalesperson = async ({
    userRecord,
    periodStats,
  }: {
    userRecord: AdminTeamUserRecordData;
    periodStats: SalespersonStatsData;
  }): Promise<SalespersonData> => {
    const [roleLookup, branchLookup] = await Promise.all([
      resolveRoleLookup(userRecord.role_id),
      resolveBranchLookup(userRecord.branch_id),
    ]);

    return {
      id: userRecord.id,
      userId: userRecord.user_code ?? userRecord.id,
      fullName: userRecord.full_name ?? userRecord.email ?? "Unknown Salesperson",
      phone: userRecord.phone ?? "",
      email: userRecord.email ?? "",
      branch: branchLookup,
      role: roleLookup,
      status: mapStatusLabel(userRecord.is_active !== false),
      joinedAt: userRecord.joined_at ?? "",
      thisMonth: periodStats,
    };
  };

  const generateNextUserCode = async (): Promise<string> => {
    const userRecords = await dependencies.getSalesUserRecords();
    const existingNumericSuffixes = userRecords
      .map((userRecordItem) => userRecordItem.user_code ?? "")
      .flatMap((userCodeItem) => {
        const match = userCodeItem.match(/^SP(\d+)$/i);

        return match?.[1] ? [Number(match[1])] : [];
      });
    const nextUserNumber = Math.max(0, ...existingNumericSuffixes) + 1;

    return `SP${String(nextUserNumber).padStart(3, "0")}`;
  };

  const mapServiceError = (error: unknown): AdminTeamServiceErrorData => {
    if (
      error instanceof Error &&
      "code" in error &&
      typeof (error as AdminTeamServiceErrorData).code === "string"
    ) {
      return error as AdminTeamServiceErrorData;
    }

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("duplicate")) {
        return createAdminTeamServiceError("CONFLICT", error.message);
      }
    }

    return createAdminTeamServiceError(
      "INTERNAL",
      error instanceof Error ? error.message : "Admin team request failed.",
    );
  };

  return {
    getTeamService: async (authenticatedUser, query) => {
      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const userRecords = await dependencies.getSalesUserRecords();
        const salesUserRecords = (
          await Promise.all(
            userRecords.map(async (userRecordItem) => {
              const roleLookup = await dependencies.getRoleByIdentifier(
                userRecordItem.role_id ?? "",
              );

              return roleLookup && !isAdminRoleName(roleLookup.name)
                ? userRecordItem
                : null;
            }),
          )
        ).filter((userRecordItem): userRecordItem is AdminTeamUserRecordData => {
          return userRecordItem !== null;
        });
        const searchValue = normalizeSearchValue(query.search);
        const filteredUserRecords = salesUserRecords.filter((userRecordItem) => {
          const isActive = userRecordItem.is_active !== false;

          if (query.status === "active" && !isActive) {
            return false;
          }

          if (query.status === "inactive" && isActive) {
            return false;
          }

          if (query.branchId && userRecordItem.branch_id !== query.branchId) {
            return false;
          }

          if (!searchValue) {
            return true;
          }

          const searchableValue = [
            userRecordItem.full_name ?? "",
            userRecordItem.email ?? "",
            userRecordItem.phone ?? "",
            userRecordItem.user_code ?? "",
          ]
            .join(" ")
            .toLowerCase();

          return searchableValue.includes(searchValue);
        });
        const statsMap = await getCurrentPeriodStatsMap(
          filteredUserRecords.map((userRecordItem) => userRecordItem.id),
          query.period,
        );

        return {
          data: await Promise.all(
            filteredUserRecords.map((userRecordItem) =>
              mapSalesperson({
                userRecord: userRecordItem,
                periodStats: statsMap.get(userRecordItem.id) ?? {
                  leads: 0,
                  won: 0,
                  winRate: 0,
                },
              }),
            ),
          ),
          error: null,
        };
      } catch (error) {
        return { data: null, error: mapServiceError(error) };
      }
    },
    getSalespersonByIdService: async (
      authenticatedUser,
      salespersonId,
      period,
    ) => {
      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const userRecord =
          await dependencies.getUserRecordByIdentifier(salespersonId);

        if (!userRecord) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const roleLookup = await dependencies.getRoleByIdentifier(
          userRecord.role_id ?? "",
        );

        if (!roleLookup || isAdminRoleName(roleLookup.name)) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const statsMap = await getCurrentPeriodStatsMap([userRecord.id], period);
        const salesperson = await mapSalesperson({
          userRecord,
          periodStats: statsMap.get(userRecord.id) ?? {
            leads: 0,
            won: 0,
            winRate: 0,
          },
        });

        return {
          data: {
            ...salesperson,
            activeLeadCount: await getActiveLeadCountByUserId(userRecord.id),
          },
          error: null,
        };
      } catch (error) {
        return { data: null, error: mapServiceError(error) };
      }
    },
    getTeamOptionsService: async (authenticatedUser) => {
      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const [roles, branches] = await Promise.all([
          dependencies.getRoles(),
          dependencies.getBranches(),
        ]);

        return {
          data: {
            roles: roles.filter((roleItem) => !isAdminRoleName(roleItem.name)),
            branches,
          },
          error: null,
        };
      } catch (error) {
        return { data: null, error: mapServiceError(error) };
      }
    },
    createSalespersonService: async (authenticatedUser, payload) => {
      let createdAuthUserId: string | null = null;

      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const normalizedEmail = normalizeEmail(payload.email);
        const [existingEmailUser, existingPhoneUser, branchLookup, roleLookup] =
          await Promise.all([
            dependencies.getUserRecordByEmail(normalizedEmail),
            dependencies.getUserRecordByPhone(payload.phone),
            dependencies.getBranchByIdentifier(payload.branchId),
            dependencies.getRoleByIdentifier(payload.roleId),
          ]);

        if (existingEmailUser) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "CONFLICT",
              ADMIN_TEAM_DUPLICATE_EMAIL_MESSAGE,
            ),
          };
        }

        if (existingPhoneUser) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "CONFLICT",
              ADMIN_TEAM_DUPLICATE_PHONE_MESSAGE,
            ),
          };
        }

        if (!branchLookup) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_BRANCH_NOT_FOUND_MESSAGE,
            ),
          };
        }

        if (!roleLookup) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_ROLE_NOT_FOUND_MESSAGE,
            ),
          };
        }

        if (isAdminRoleName(roleLookup.name)) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "BAD_REQUEST",
              "Salesperson role cannot be an admin role.",
            ),
          };
        }

        const nextUserCode = await generateNextUserCode();
        const duplicateUserCodeRecord =
          await dependencies.getUserRecordByUserCode(nextUserCode);

        if (duplicateUserCodeRecord) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "CONFLICT",
              ADMIN_TEAM_DUPLICATE_USER_ID_MESSAGE,
            ),
          };
        }

        const tempPassword = generateTempPassword().slice(
          0,
          ADMIN_TEAM_TEMP_PASSWORD_LENGTH + 4,
        );
        const createdAuthUser = await dependencies.createAuthUser({
          email: normalizedEmail,
          password: tempPassword,
        });
        createdAuthUserId = createdAuthUser.id;

        const joinedAt = new Date().toISOString();
        const createdUserRecord = await dependencies.createUserRecord({
          userCode: nextUserCode,
          fullName: payload.fullName,
          phone: payload.phone,
          email: normalizedEmail,
          roleId: payload.roleId,
          branchId: payload.branchId,
          authId: createdAuthUser.id,
          isActive: true,
          joinedAt,
        });
        const salesperson = await mapSalesperson({
          userRecord: createdUserRecord,
          periodStats: {
            leads: 0,
            won: 0,
            winRate: 0,
          },
        });

        return {
          data: {
            salesperson,
            tempPassword,
          },
          error: null,
        };
      } catch (error) {
        if (createdAuthUserId) {
          try {
            await dependencies.deleteAuthUser(createdAuthUserId);
          } catch {
            // Keep the original failure as the primary error for the API response.
          }
        }

        return { data: null, error: mapServiceError(error) };
      }
    },
    updateSalespersonService: async (
      authenticatedUser,
      salespersonId,
      payload,
    ) => {
      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const existingUserRecord =
          await dependencies.getUserRecordByIdentifier(salespersonId);

        if (!existingUserRecord) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const currentRoleLookup = await dependencies.getRoleByIdentifier(
          existingUserRecord.role_id ?? "",
        );

        if (!currentRoleLookup || isAdminRoleName(currentRoleLookup.name)) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        if (payload.email) {
          const duplicateEmailUser = await dependencies.getUserRecordByEmail(
            normalizeEmail(payload.email),
          );

          if (duplicateEmailUser && duplicateEmailUser.id !== existingUserRecord.id) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "CONFLICT",
                ADMIN_TEAM_DUPLICATE_EMAIL_MESSAGE,
              ),
            };
          }
        }

        if (payload.phone) {
          const duplicatePhoneUser = await dependencies.getUserRecordByPhone(payload.phone);

          if (duplicatePhoneUser && duplicatePhoneUser.id !== existingUserRecord.id) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "CONFLICT",
                ADMIN_TEAM_DUPLICATE_PHONE_MESSAGE,
              ),
            };
          }
        }

        if (payload.branchId) {
          const branchLookup = await dependencies.getBranchByIdentifier(payload.branchId);

          if (!branchLookup) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "NOT_FOUND",
                ADMIN_TEAM_BRANCH_NOT_FOUND_MESSAGE,
              ),
            };
          }
        }

        if (payload.roleId) {
          const roleLookup = await dependencies.getRoleByIdentifier(payload.roleId);

          if (!roleLookup) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "NOT_FOUND",
                ADMIN_TEAM_ROLE_NOT_FOUND_MESSAGE,
              ),
            };
          }

          if (isAdminRoleName(roleLookup.name)) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "BAD_REQUEST",
                "Salesperson role cannot be an admin role.",
              ),
            };
          }
        }

        const updatedUserRecord = await dependencies.updateUserRecord(
          existingUserRecord.id,
          {
            ...(payload.fullName
              ? { [environmentConfig.supabaseUserNameColumn]: payload.fullName }
              : {}),
            ...(payload.phone
              ? { [environmentConfig.supabaseUserPhoneColumn]: payload.phone }
              : {}),
            ...(payload.email
              ? {
                  [environmentConfig.supabaseUserEmailColumn]: normalizeEmail(
                    payload.email,
                  ),
                }
              : {}),
            ...(payload.branchId
              ? { [environmentConfig.supabaseUserBranchColumn]: payload.branchId }
              : {}),
            ...(payload.roleId
              ? { [environmentConfig.supabaseUserRoleColumn]: payload.roleId }
              : {}),
            ...(typeof payload.isActive === "boolean"
              ? {
                  [environmentConfig.supabaseUserActiveColumn]: payload.isActive,
                }
              : {}),
          },
        );

        const statsMap = await getCurrentPeriodStatsMap(
          [updatedUserRecord.id],
          ADMIN_TEAM_DEFAULT_PERIOD,
        );

        return {
          data: await mapSalesperson({
            userRecord: updatedUserRecord,
            periodStats: statsMap.get(updatedUserRecord.id) ?? {
              leads: 0,
              won: 0,
              winRate: 0,
            },
          }),
          error: null,
        };
      } catch (error) {
        return { data: null, error: mapServiceError(error) };
      }
    },
    resetSalespersonPasswordService: async (
      authenticatedUser,
      salespersonId,
    ) => {
      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const existingUserRecord =
          await dependencies.getUserRecordByIdentifier(salespersonId);

        if (!existingUserRecord) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const currentRoleLookup = await dependencies.getRoleByIdentifier(
          existingUserRecord.role_id ?? "",
        );

        if (!currentRoleLookup || isAdminRoleName(currentRoleLookup.name)) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        if (
          typeof existingUserRecord.auth_id !== "string" ||
          existingUserRecord.auth_id.trim().length === 0
        ) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_AUTH_ID_MISSING_MESSAGE,
            ),
          };
        }

        const tempPassword = generateTempPassword().slice(
          0,
          ADMIN_TEAM_TEMP_PASSWORD_LENGTH + 4,
        );

        await dependencies.updateAuthUserPassword({
          authUserId: existingUserRecord.auth_id,
          password: tempPassword,
        });

        return {
          data: {
            tempPassword,
          },
          error: null,
        };
      } catch (error) {
        return { data: null, error: mapServiceError(error) };
      }
    },
    removeSalespersonService: async (
      authenticatedUser,
      salespersonId,
      payload,
    ) => {
      try {
        const forbiddenError = ensureAdminUser(authenticatedUser);

        if (forbiddenError) {
          return { data: null, error: forbiddenError };
        }

        const existingUserRecord =
          await dependencies.getUserRecordByIdentifier(salespersonId);

        if (!existingUserRecord) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        const currentRoleLookup = await dependencies.getRoleByIdentifier(
          existingUserRecord.role_id ?? "",
        );

        if (!currentRoleLookup || isAdminRoleName(currentRoleLookup.name)) {
          return {
            data: null,
            error: createAdminTeamServiceError(
              "NOT_FOUND",
              ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE,
            ),
          };
        }

        let reassignTargetUserRecord: AdminTeamUserRecordData | null = null;

        if (payload.strategy === "reassign") {
          reassignTargetUserRecord = await dependencies.getUserRecordByIdentifier(
            payload.reassignToId ?? "",
          );

          if (
            !reassignTargetUserRecord ||
            reassignTargetUserRecord.is_active === false
          ) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "NOT_FOUND",
                ADMIN_TEAM_REASSIGN_TARGET_NOT_FOUND_MESSAGE,
              ),
            };
          }

          const reassignTargetRoleLookup = await dependencies.getRoleByIdentifier(
            reassignTargetUserRecord.role_id ?? "",
          );

          if (
            !reassignTargetRoleLookup ||
            isAdminRoleName(reassignTargetRoleLookup.name)
          ) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "NOT_FOUND",
                ADMIN_TEAM_REASSIGN_TARGET_NOT_FOUND_MESSAGE,
              ),
            };
          }

          if (reassignTargetUserRecord.id === existingUserRecord.id) {
            return {
              data: null,
              error: createAdminTeamServiceError(
                "BAD_REQUEST",
                ADMIN_TEAM_REASSIGN_TARGET_INVALID_MESSAGE,
              ),
            };
          }
        }

        const leadAssignments = await dependencies.getLeadAssignmentsByUserIds([
          existingUserRecord.id,
        ]);
        const activeLeadIds: string[] = [];

        for (const leadAssignmentItem of leadAssignments) {
          if (!leadAssignmentItem.lead?.status_id) {
            continue;
          }

          const statusName = await dependencies.getStatusNameById(
            leadAssignmentItem.lead.status_id,
          );

          if (
            statusName &&
            ADMIN_TEAM_ACTIVE_LEAD_STATUSES.includes(
              statusName as (typeof ADMIN_TEAM_ACTIVE_LEAD_STATUSES)[number],
            )
          ) {
            activeLeadIds.push(leadAssignmentItem.lead_id);
          }
        }

        let reassignedLeadCount = 0;
        let unassignedLeadCount = 0;

        if (payload.strategy === "reassign" && reassignTargetUserRecord) {
          await dependencies.reassignLeadAssignments({
            fromUserId: existingUserRecord.id,
            toUserId: reassignTargetUserRecord.id,
            leadIds: activeLeadIds,
          });
          reassignedLeadCount = activeLeadIds.length;
        }

        if (payload.strategy === "unassigned") {
          await dependencies.unassignLeadAssignments({
            fromUserId: existingUserRecord.id,
            leadIds: activeLeadIds,
          });
          unassignedLeadCount = activeLeadIds.length;
        }

        await dependencies.updateUserRecord(existingUserRecord.id, {
          [environmentConfig.supabaseUserActiveColumn]: false,
        });

        return {
          data: {
            success: true,
            removalStrategy: payload.strategy,
            reassignedLeadCount,
            unassignedLeadCount,
          },
          error: null,
        };
      } catch (error) {
        return { data: null, error: mapServiceError(error) };
      }
    },
  };
};

let adminTeamService: AdminTeamServiceData = createAdminTeamService();

/**
 * Returns the shared admin team service instance.
 */
export const getAdminTeamService = (): AdminTeamServiceData => {
  return adminTeamService;
};

/**
 * Replaces the shared admin team service instance, mainly for tests.
 */
export const setAdminTeamService = (service: AdminTeamServiceData): void => {
  adminTeamService = service;
};
