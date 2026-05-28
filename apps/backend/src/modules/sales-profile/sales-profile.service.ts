// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { AuthenticatedUserData } from "../../common/utils/authenticated-user.js";
import type {
  ChangeSalesPasswordRequestData,
  NotificationPreferencesData,
  NotificationPreferencesRequestData,
  PerformanceData,
  SalesProfileData,
  SalesProfileServiceErrorData,
  SourceBreakdownData,
  UpdateSalesProfileRequestData,
  WeeklyActivityData,
} from "./sales-profile.types.js";
// CONFIG //
import { environmentConfig } from "../../config/environment.js";
import { signInWithPassword, updateAuthUserPassword } from "../../config/supabase.js";
// CONSTANTS //
import {
  INVALID_CREDENTIALS_MESSAGE,
  AUTH_WEAK_PASSWORD_MESSAGE,
} from "../../common/constants/auth.constants.js";
import {
  SALES_PROFILE_ACCESS_FORBIDDEN_MESSAGE,
  SALES_PROFILE_DEFAULT_LANGUAGE,
  SALES_PROFILE_DEFAULT_PERIOD,
  SALES_PROFILE_DUPLICATE_PHONE_MESSAGE,
  SALES_PROFILE_LOST_STATUSES,
  SALES_PROFILE_NOT_FOUND_MESSAGE,
  SALES_PROFILE_PASSWORD_CHANGE_FORBIDDEN_MESSAGE,
  SALES_PROFILE_PIPELINE_STATUSES,
  SALES_PROFILE_WON_STATUS,
  SALES_PROFILE_WEEKDAY_ORDER,
} from "../../common/constants/sales-profile.constants.js";

interface SalesProfileUserRecordData {
  id: string;
  auth_id?: string | null;
  branch_id?: string | null;
  role_id?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  profile_photo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  user_code?: string | null;
  language_preference?: string | null;
  notification_preferences_json?: Record<string, unknown> | string | null;
}

interface SalesProfileBranchRecordData {
  id: string;
  city?: string | null;
}

interface SalesProfileRoleRecordData {
  id: string;
  name?: string | null;
}

interface SalesProfileLeadAssignmentRecordData {
  lead_id: string;
  user_id: string;
  is_primary: boolean | null;
  lead?: {
    id: string;
    full_name?: string | null;
    created_at?: string | null;
    status_id?: string | null;
    lead_source_id?: string | null;
  } | null;
}

interface SalesProfileStatusLogRecordData {
  lead_id: string;
  updated_at?: string | null;
  user_id?: string | null;
}

interface NamedEntityRecordData {
  id: string;
  name: string;
}

interface PeriodRangeData {
  currentFromInclusive: Date;
  currentToExclusive: Date;
}

interface SalesProfileServiceDependenciesData {
  getUserRecordByUserCode: (
    userCode: string,
  ) => Promise<SalesProfileUserRecordData | null>;
  getUserRecordByEmail: (
    email: string,
  ) => Promise<SalesProfileUserRecordData | null>;
  getUserRecordByPhone: (
    phone: string,
  ) => Promise<SalesProfileUserRecordData | null>;
  updateUserRecord: (
    userRecordId: string,
    payload: Record<string, unknown>,
  ) => Promise<SalesProfileUserRecordData>;
  getBranchById: (
    branchId: string,
  ) => Promise<SalesProfileBranchRecordData | null>;
  getRoleById: (
    roleId: string,
  ) => Promise<SalesProfileRoleRecordData | null>;
  signInWithPassword: (payload: {
    email: string;
    password: string;
  }) => Promise<{
    access_token: string;
  }>;
  updateAuthUserPassword: (payload: {
    authUserId: string;
    password: string;
  }) => Promise<void>;
  getStatusNameById: (statusId: string) => Promise<string | null>;
  getLeadSourceNameById: (sourceId: string) => Promise<string | null>;
  getLeadAssignmentsByUserIds: (
    userRecordIds: string[],
  ) => Promise<SalesProfileLeadAssignmentRecordData[]>;
  getStatusLogsByUserIds: (
    userRecordIds: string[],
  ) => Promise<SalesProfileStatusLogRecordData[]>;
  getActiveSalesUserRecords: () => Promise<SalesProfileUserRecordData[]>;
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

const buildServiceRoleHeaders = ({
  prefer,
}: {
  prefer?: string;
} = {}): HeadersInit => {
  return {
    "Content-Type": "application/json",
    apikey: environmentConfig.supabaseServiceRoleKey,
    Authorization: `Bearer ${environmentConfig.supabaseServiceRoleKey}`,
    ...(prefer ? { Prefer: prefer } : {}),
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
  prefer,
}: {
  method: "POST" | "PATCH";
  requestUrl: URL;
  body: object;
  prefer?: string;
}): Promise<T> => {
  const response = await fetch(requestUrl, {
    method,
    headers: buildServiceRoleHeaders({ prefer }),
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

const createSupabaseTableUrl = (tableName: string): URL => {
  return new URL(`${environmentConfig.supabaseUrl}/rest/v1/${tableName}`);
};

const createSalesProfileServiceError = (
  code: SalesProfileServiceErrorData["code"],
  message: string,
): SalesProfileServiceErrorData => {
  const serviceError = new Error(message) as SalesProfileServiceErrorData;
  serviceError.code = code;
  return serviceError;
};

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
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

const isLostStatus = (statusName: string | null): boolean => {
  return (
    statusName !== null &&
    SALES_PROFILE_LOST_STATUSES.includes(
      statusName as (typeof SALES_PROFILE_LOST_STATUSES)[number],
    )
  );
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

  if (trimmedPeriod === SALES_PROFILE_DEFAULT_PERIOD) {
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
      throw createSalesProfileServiceError(
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
    throw createSalesProfileServiceError(
      "BAD_REQUEST",
      "Period must be 'this-month', use YYYY-MM, or use a month name like 'May 2026'.",
    );
  }

  const monthIndex = MONTH_NAME_TO_INDEX_MAP[namedMonthMatch[1] ?? ""];

  if (monthIndex === undefined) {
    throw createSalesProfileServiceError(
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

const getWeekdayLabel = (isoDate: string | null | undefined): string | null => {
  if (!isoDate) {
    return null;
  }

  const parsedDate = new Date(isoDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(parsedDate);
};

const createDefaultNotificationPreferences = (): NotificationPreferencesData => {
  return {
    overdueFollowUps: false,
    testDriveReminders: false,
    newLeadAssigned: false,
    statusChangeAlerts: false,
    wonLostSummary: false,
    pushNotification: false,
    sms: false,
    whatsApp: false,
    quietHoursEnabled: false,
    quietHoursFrom: null,
    quietHoursTo: null,
  };
};

const getBusinessUserCode = (
  userRecord: SalesProfileUserRecordData,
): string => {
  if (typeof userRecord.user_code === "string" && userRecord.user_code.trim()) {
    return userRecord.user_code;
  }

  const loginUserIdValue = ((userRecord as unknown) as Record<string, unknown>)[
    environmentConfig.supabaseLoginUserIdColumn
  ];

  if (typeof loginUserIdValue === "string" && loginUserIdValue.trim()) {
    return loginUserIdValue;
  }

  return userRecord.id;
};

const parseNotificationPreferences = (
  rawValue: Record<string, unknown> | string | null | undefined,
): NotificationPreferencesData => {
  if (!rawValue) {
    return createDefaultNotificationPreferences();
  }

  if (typeof rawValue === "string") {
    try {
      return {
        ...createDefaultNotificationPreferences(),
        ...(JSON.parse(rawValue) as NotificationPreferencesData),
      };
    } catch {
      return createDefaultNotificationPreferences();
    }
  }

  return {
    ...createDefaultNotificationPreferences(),
    ...rawValue,
  };
};

const createDefaultSalesProfileDependencies =
  (): SalesProfileServiceDependenciesData => {
    const getUsersSelectQuery = (): string => {
      return "*";
    };

    return {
      getUserRecordByUserCode: async (userCode) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set(
          environmentConfig.supabaseLoginUserIdColumn,
          `eq.${userCode}`,
        );
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<SalesProfileUserRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      getUserRecordByEmail: async (email) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set("email", `eq.${email}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<SalesProfileUserRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      getUserRecordByPhone: async (phone) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set("phone", `eq.${phone}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<SalesProfileUserRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      updateUserRecord: async (userRecordId, payload) => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("id", `eq.${userRecordId}`);
        requestUrl.searchParams.set("select", getUsersSelectQuery());

        return executeMutationRequest<SalesProfileUserRecordData>({
          method: "PATCH",
          requestUrl,
          body: payload,
          prefer: "return=representation",
        });
      },
      getBranchById: async (branchId) => {
        const requestUrl = createSupabaseTableUrl("branches");
        requestUrl.searchParams.set("select", "id,city");
        requestUrl.searchParams.set("id", `eq.${branchId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<SalesProfileBranchRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      getRoleById: async (roleId) => {
        const requestUrl = createSupabaseTableUrl("roles");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${roleId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody =
          await executeReadRequest<SalesProfileRoleRecordData[]>(requestUrl);

        return responseBody[0] ?? null;
      },
      signInWithPassword,
      updateAuthUserPassword,
      getStatusNameById: async (statusId) => {
        const requestUrl = createSupabaseTableUrl("statuses");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${statusId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.name?.trim().toUpperCase() ?? null;
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
      getLeadAssignmentsByUserIds: async (userRecordIds) => {
        if (userRecordIds.length === 0) {
          return [];
        }

        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set(
          "select",
          "lead_id,user_id,is_primary,lead:leads!inner(id,full_name,created_at,status_id,lead_source_id)",
        );
        requestUrl.searchParams.set("user_id", `in.(${userRecordIds.join(",")})`);
        requestUrl.searchParams.set("is_primary", "eq.true");

        return executeReadRequest<SalesProfileLeadAssignmentRecordData[]>(
          requestUrl,
        );
      },
      getStatusLogsByUserIds: async (userRecordIds) => {
        if (userRecordIds.length === 0) {
          return [];
        }

        const requestUrl = createSupabaseTableUrl("lead_status_log");
        requestUrl.searchParams.set("select", "lead_id,updated_at,user_id");
        requestUrl.searchParams.set("user_id", `in.(${userRecordIds.join(",")})`);
        requestUrl.searchParams.set("order", "updated_at.asc");

        return executeReadRequest<SalesProfileStatusLogRecordData[]>(requestUrl);
      },
      getActiveSalesUserRecords: async () => {
        const requestUrl = createSupabaseTableUrl(environmentConfig.supabaseUsersTable);
        requestUrl.searchParams.set("select", getUsersSelectQuery());
        requestUrl.searchParams.set("is_active", "eq.true");
        requestUrl.searchParams.set("order", "full_name.asc");

        return executeReadRequest<SalesProfileUserRecordData[]>(requestUrl);
      },
    };
  };

export interface SalesProfileServiceData {
  getSalesProfileService: (
    authenticatedUser: AuthenticatedUserData,
    userCode: string,
  ) => Promise<QueryResponseData<SalesProfileData>>;
  updateSalesProfileService: (
    authenticatedUser: AuthenticatedUserData,
    userCode: string,
    payload: UpdateSalesProfileRequestData,
  ) => Promise<QueryResponseData<SalesProfileData>>;
  changeSalesPasswordService: (
    authenticatedUser: AuthenticatedUserData,
    userCode: string,
    payload: ChangeSalesPasswordRequestData,
  ) => Promise<QueryResponseData<{ success: boolean }>>;
  updateSalesNotificationsService: (
    authenticatedUser: AuthenticatedUserData,
    userCode: string,
    payload: NotificationPreferencesRequestData,
  ) => Promise<QueryResponseData<{ success: boolean }>>;
  getSalesPerformanceService: (
    authenticatedUser: AuthenticatedUserData,
    userCode: string,
    period: string,
  ) => Promise<QueryResponseData<PerformanceData>>;
}

export const createSalesProfileService = (
  dependencies: SalesProfileServiceDependenciesData = createDefaultSalesProfileDependencies(),
): SalesProfileServiceData => {
  const isAdminSelfProfileRequest = ({
    authenticatedUser,
    targetUserCode,
  }: {
    authenticatedUser: AuthenticatedUserData;
    targetUserCode: string;
  }): boolean => {
    return (
      authenticatedUser.role === "admin" &&
      authenticatedUser.userId === targetUserCode
    );
  };

  const ensureTargetProfileAccess = ({
    authenticatedUser,
    targetUserCode,
    allowAdmin,
  }: {
    authenticatedUser: AuthenticatedUserData;
    targetUserCode: string;
    allowAdmin: boolean;
  }): SalesProfileServiceErrorData | null => {
    if (authenticatedUser.role === "admin") {
      if (allowAdmin || isAdminSelfProfileRequest({
        authenticatedUser,
        targetUserCode,
      })) {
        return null;
      }

      return createSalesProfileServiceError(
        "FORBIDDEN",
        SALES_PROFILE_PASSWORD_CHANGE_FORBIDDEN_MESSAGE,
      );
    }

    if (authenticatedUser.role === "sales" && authenticatedUser.userId === targetUserCode) {
      return null;
    }

    return createSalesProfileServiceError(
      "FORBIDDEN",
      allowAdmin
        ? SALES_PROFILE_ACCESS_FORBIDDEN_MESSAGE
        : SALES_PROFILE_PASSWORD_CHANGE_FORBIDDEN_MESSAGE,
    );
  };

  const isSalesRoleName = (roleName: string | null | undefined): boolean => {
    return typeof roleName === "string" && roleName.trim().toLowerCase().includes("sales");
  };

  const resolveSalesUserContext = async (
    authenticatedUser: AuthenticatedUserData,
    userCode: string,
  ): Promise<{
    userRecord: SalesProfileUserRecordData;
    roleRecord: SalesProfileRoleRecordData;
    branchRecord: SalesProfileBranchRecordData | null;
  }> => {
    const userRecord = await dependencies.getUserRecordByUserCode(userCode);

    if (!userRecord) {
      throw createSalesProfileServiceError(
        "NOT_FOUND",
        SALES_PROFILE_NOT_FOUND_MESSAGE,
      );
    }

    const roleRecord = await dependencies.getRoleById(userRecord.role_id ?? "");

    if (
      !roleRecord ||
      (!isSalesRoleName(roleRecord.name) &&
        !isAdminSelfProfileRequest({
          authenticatedUser,
          targetUserCode: userCode,
        }))
    ) {
      throw createSalesProfileServiceError(
        "NOT_FOUND",
        SALES_PROFILE_NOT_FOUND_MESSAGE,
      );
    }

    const [branchRecord] = await Promise.all([
      userRecord.branch_id
        ? dependencies.getBranchById(userRecord.branch_id)
        : Promise.resolve(null),
    ]);

    return {
      userRecord,
      roleRecord,
      branchRecord,
    };
  };

  const mapSalesProfile = ({
    userRecord,
    roleRecord,
    branchRecord,
  }: {
    userRecord: SalesProfileUserRecordData;
    roleRecord: SalesProfileRoleRecordData;
    branchRecord: SalesProfileBranchRecordData | null;
  }): SalesProfileData => {
    return {
      userId: getBusinessUserCode(userRecord),
      fullName: userRecord.full_name ?? userRecord.email ?? "",
      phone: userRecord.phone ?? "",
      email: userRecord.email ?? "",
      role: roleRecord.name ?? "",
      branch: branchRecord?.city ?? "",
      joinedAt: userRecord.created_at ?? "",
      profilePhotoUrl: userRecord.profile_photo_url ?? null,
      languagePreference:
        userRecord.language_preference?.trim() || SALES_PROFILE_DEFAULT_LANGUAGE,
      notificationPreferences: parseNotificationPreferences(
        userRecord.notification_preferences_json,
      ),
    };
  };

  const buildPerformanceForUser = async ({
    userRecordId,
    period,
  }: {
    userRecordId: string;
    period: string;
  }): Promise<{
    totalLeads: number;
    won: number;
    lost: number;
    pipeline: Record<string, number>;
    sourceBreakdown: SourceBreakdownData[];
    callsMade: number;
    weeklyActivity: WeeklyActivityData[];
  }> => {
    const { currentFromInclusive, currentToExclusive } = parsePeriodRange(period);
    const assignments = await dependencies.getLeadAssignmentsByUserIds([userRecordId]);
    const filteredAssignments = assignments.filter((assignmentItem) =>
      isDateWithinRange({
        isoDate: assignmentItem.lead?.created_at,
        fromInclusive: currentFromInclusive,
        toExclusive: currentToExclusive,
      }),
    );
    const statusEntries = await Promise.all(
      filteredAssignments.map(async (assignmentItem) => [
        assignmentItem.lead_id,
        assignmentItem.lead?.status_id
          ? normalizeStatusName(
              await dependencies.getStatusNameById(assignmentItem.lead.status_id),
            )
          : null,
      ] as const),
    );
    const sourceEntries = await Promise.all(
      filteredAssignments.map(async (assignmentItem) => [
        assignmentItem.lead_id,
        assignmentItem.lead?.lead_source_id
          ? (await dependencies.getLeadSourceNameById(assignmentItem.lead.lead_source_id)) ??
            "Other"
          : "Other",
      ] as const),
    );
    const statusMap = new Map<string, string | null>(statusEntries);
    const sourceMap = new Map<string, string>(sourceEntries);
    const pipeline = SALES_PROFILE_PIPELINE_STATUSES.reduce<Record<string, number>>(
      (accumulator, statusItem) => ({
        ...accumulator,
        [statusItem]: 0,
      }),
      {},
    );
    const sourceBreakdownMap = new Map<string, number>();

    let won = 0;
    let lost = 0;

    for (const assignmentItem of filteredAssignments) {
      const statusName = statusMap.get(assignmentItem.lead_id) ?? null;
      const sourceName = sourceMap.get(assignmentItem.lead_id) ?? "Other";

      if (
        statusName &&
        SALES_PROFILE_PIPELINE_STATUSES.includes(
          statusName as (typeof SALES_PROFILE_PIPELINE_STATUSES)[number],
        )
      ) {
        pipeline[statusName] = (pipeline[statusName] ?? 0) + 1;
      }

      if (statusName === SALES_PROFILE_WON_STATUS) {
        won += 1;
      }

      if (isLostStatus(statusName)) {
        lost += 1;
      }

      sourceBreakdownMap.set(
        sourceName,
        (sourceBreakdownMap.get(sourceName) ?? 0) + 1,
      );
    }

    const statusLogs = await dependencies.getStatusLogsByUserIds([userRecordId]);
    const filteredStatusLogs = statusLogs.filter((statusLogItem) =>
      isDateWithinRange({
        isoDate: statusLogItem.updated_at,
        fromInclusive: currentFromInclusive,
        toExclusive: currentToExclusive,
      }),
    );
    const weeklyActivityMap = new Map<
      string,
      {
        calls: number;
        leads: number;
      }
    >(
      SALES_PROFILE_WEEKDAY_ORDER.map((weekdayItem) => [
        weekdayItem,
        {
          calls: 0,
          leads: 0,
        },
      ]),
    );

    for (const assignmentItem of filteredAssignments) {
      const weekdayLabel = getWeekdayLabel(assignmentItem.lead?.created_at);

      if (!weekdayLabel || !weeklyActivityMap.has(weekdayLabel)) {
        continue;
      }

      const weeklyActivityItem = weeklyActivityMap.get(weekdayLabel) as {
        calls: number;
        leads: number;
      };

      weeklyActivityMap.set(weekdayLabel, {
        calls: weeklyActivityItem.calls,
        leads: weeklyActivityItem.leads + 1,
      });
    }

    for (const statusLogItem of filteredStatusLogs) {
      const weekdayLabel = getWeekdayLabel(statusLogItem.updated_at);

      if (!weekdayLabel || !weeklyActivityMap.has(weekdayLabel)) {
        continue;
      }

      const weeklyActivityItem = weeklyActivityMap.get(weekdayLabel) as {
        calls: number;
        leads: number;
      };

      weeklyActivityMap.set(weekdayLabel, {
        calls: weeklyActivityItem.calls + 1,
        leads: weeklyActivityItem.leads,
      });
    }

    return {
      totalLeads: filteredAssignments.length,
      won,
      lost,
      pipeline,
      sourceBreakdown: Array.from(sourceBreakdownMap.entries())
        .map(([source, count]) => ({
          source,
          count,
        }))
        .sort((leftItem, rightItem) => rightItem.count - leftItem.count),
      callsMade: filteredStatusLogs.length,
      weeklyActivity: SALES_PROFILE_WEEKDAY_ORDER.map((weekdayItem) => ({
        day: weekdayItem,
        calls: weeklyActivityMap.get(weekdayItem)?.calls ?? 0,
        leads: weeklyActivityMap.get(weekdayItem)?.leads ?? 0,
      })),
    };
  };

  const mapServiceError = (error: unknown): SalesProfileServiceErrorData => {
    if (
      error instanceof Error &&
      "code" in error &&
      typeof (error as SalesProfileServiceErrorData).code === "string"
    ) {
      return error as SalesProfileServiceErrorData;
    }

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("invalid login credentials")) {
        return createSalesProfileServiceError(
          "FORBIDDEN",
          INVALID_CREDENTIALS_MESSAGE,
        );
      }
    }

    return createSalesProfileServiceError(
      "INTERNAL",
      error instanceof Error ? error.message : "Sales profile request failed.",
    );
  };

  const buildUserSettingsUpdatePayload = ({
    userRecord,
    languagePreference,
    notificationPreferences,
  }: {
    userRecord: SalesProfileUserRecordData;
    languagePreference?: string;
    notificationPreferences?: Record<string, unknown>;
  }): Record<string, unknown> => {
    const updatePayload: Record<string, unknown> = {};

    if (
      languagePreference !== undefined &&
      "language_preference" in userRecord
    ) {
      updatePayload.language_preference = languagePreference;
    }

    if (
      notificationPreferences !== undefined &&
      "notification_preferences_json" in userRecord
    ) {
      updatePayload.notification_preferences_json = notificationPreferences;
    }

    return updatePayload;
  };

  return {
    getSalesProfileService: async (authenticatedUser, userCode) => {
      try {
        const accessError = ensureTargetProfileAccess({
          authenticatedUser,
          targetUserCode: userCode,
          allowAdmin: true,
        });

        if (accessError) {
          return {
            data: null,
            error: accessError,
          };
        }

        const userContext = await resolveSalesUserContext(
          authenticatedUser,
          userCode,
        );

        return {
          data: mapSalesProfile(userContext),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    updateSalesProfileService: async (authenticatedUser, userCode, payload) => {
      try {
        const accessError = ensureTargetProfileAccess({
          authenticatedUser,
          targetUserCode: userCode,
          allowAdmin: true,
        });

        if (accessError) {
          return {
            data: null,
            error: accessError,
          };
        }

        const userContext = await resolveSalesUserContext(
          authenticatedUser,
          userCode,
        );

        if (payload.phone) {
          const duplicatePhoneUser = await dependencies.getUserRecordByPhone(
            payload.phone,
          );

          if (
            duplicatePhoneUser &&
            duplicatePhoneUser.id !== userContext.userRecord.id
          ) {
            return {
              data: null,
              error: createSalesProfileServiceError(
                "CONFLICT",
                SALES_PROFILE_DUPLICATE_PHONE_MESSAGE,
              ),
            };
          }
        }

        const updatedUserRecordPayload = {
          ...(payload.fullName ? { full_name: payload.fullName } : {}),
          ...(payload.phone ? { phone: payload.phone } : {}),
          ...buildUserSettingsUpdatePayload({
            userRecord: userContext.userRecord,
            languagePreference: payload.languagePreference,
          }),
        };

        const updatedUserRecord = await dependencies.updateUserRecord(
          userContext.userRecord.id,
          updatedUserRecordPayload,
        );
        const branchRecord = updatedUserRecord.branch_id
          ? await dependencies.getBranchById(updatedUserRecord.branch_id)
          : userContext.branchRecord;
        const roleRecord =
          (await dependencies.getRoleById(updatedUserRecord.role_id ?? "")) ??
          userContext.roleRecord;

        return {
          data: mapSalesProfile({
            userRecord: updatedUserRecord,
            roleRecord,
            branchRecord,
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
    changeSalesPasswordService: async (
      authenticatedUser,
      userCode,
      payload,
    ) => {
      try {
        const accessError = ensureTargetProfileAccess({
          authenticatedUser,
          targetUserCode: userCode,
          allowAdmin: false,
        });

        if (accessError) {
          return {
            data: null,
            error: accessError,
          };
        }

        const userContext = await resolveSalesUserContext(
          authenticatedUser,
          userCode,
        );

        if (
          typeof userContext.userRecord.auth_id !== "string" ||
          userContext.userRecord.auth_id.trim().length === 0
        ) {
          return {
            data: null,
            error: createSalesProfileServiceError(
              "NOT_FOUND",
              SALES_PROFILE_NOT_FOUND_MESSAGE,
            ),
          };
        }

        if (!userContext.userRecord.email) {
          return {
            data: null,
            error: createSalesProfileServiceError(
              "NOT_FOUND",
              SALES_PROFILE_NOT_FOUND_MESSAGE,
            ),
          };
        }

        if (
          payload.newPassword.length < 8 ||
          !/[A-Z]/.test(payload.newPassword) ||
          !/[0-9]/.test(payload.newPassword)
        ) {
          return {
            data: null,
            error: createSalesProfileServiceError(
              "BAD_REQUEST",
              AUTH_WEAK_PASSWORD_MESSAGE,
            ),
          };
        }

        try {
          await dependencies.signInWithPassword({
            email: userContext.userRecord.email,
            password: payload.currentPassword,
          });
        } catch {
          return {
            data: null,
            error: createSalesProfileServiceError(
              "FORBIDDEN",
              INVALID_CREDENTIALS_MESSAGE,
            ),
          };
        }

        await dependencies.updateAuthUserPassword({
          authUserId: userContext.userRecord.auth_id,
          password: payload.newPassword,
        });

        return {
          data: {
            success: true,
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
    updateSalesNotificationsService: async (
      authenticatedUser,
      userCode,
      payload,
    ) => {
      try {
        const accessError = ensureTargetProfileAccess({
          authenticatedUser,
          targetUserCode: userCode,
          allowAdmin: true,
        });

        if (accessError) {
          return {
            data: null,
            error: accessError,
          };
        }

        const userContext = await resolveSalesUserContext(
          authenticatedUser,
          userCode,
        );

        const notificationUpdatePayload = buildUserSettingsUpdatePayload({
          userRecord: userContext.userRecord,
          notificationPreferences: payload,
          languagePreference:
            userContext.userRecord.language_preference ??
            SALES_PROFILE_DEFAULT_LANGUAGE,
        });

        if (Object.keys(notificationUpdatePayload).length > 0) {
          await dependencies.updateUserRecord(
            userContext.userRecord.id,
            notificationUpdatePayload,
          );
        }

        return {
          data: {
            success: true,
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
    getSalesPerformanceService: async (
      authenticatedUser,
      userCode,
      period,
    ) => {
      try {
        const accessError = ensureTargetProfileAccess({
          authenticatedUser,
          targetUserCode: userCode,
          allowAdmin: true,
        });

        if (accessError) {
          return {
            data: null,
            error: accessError,
          };
        }

        const targetUserContext = await resolveSalesUserContext(
          authenticatedUser,
          userCode,
        );
        const activeSalesUserRecords = (
          await Promise.all(
            (await dependencies.getActiveSalesUserRecords()).map(async (userRecordItem) => {
              const roleRecord = await dependencies.getRoleById(userRecordItem.role_id ?? "");
              return roleRecord && isSalesRoleName(roleRecord.name) ? userRecordItem : null;
            }),
          )
        ).filter(
          (userRecordItem): userRecordItem is SalesProfileUserRecordData =>
            userRecordItem !== null,
        );
        const performanceEntries = await Promise.all(
          activeSalesUserRecords.map(async (userRecordItem) => ({
            userRecordId: userRecordItem.id,
            userCode: getBusinessUserCode(userRecordItem),
            summary: await buildPerformanceForUser({
              userRecordId: userRecordItem.id,
              period,
            }),
          })),
        );
        const sortedRankEntries = [...performanceEntries].sort((leftItem, rightItem) => {
          if (rightItem.summary.won !== leftItem.summary.won) {
            return rightItem.summary.won - leftItem.summary.won;
          }

          return rightItem.summary.totalLeads - leftItem.summary.totalLeads;
        });
        const targetSummaryEntry =
          performanceEntries.find(
            (performanceItem) =>
              performanceItem.userRecordId === targetUserContext.userRecord.id,
          ) ?? {
            userRecordId: targetUserContext.userRecord.id,
            userCode: getBusinessUserCode(targetUserContext.userRecord),
            summary: await buildPerformanceForUser({
              userRecordId: targetUserContext.userRecord.id,
              period,
            }),
          };
        const rankIndex = sortedRankEntries.findIndex(
          (performanceItem) =>
            performanceItem.userRecordId === targetUserContext.userRecord.id,
        );
        const rank = rankIndex >= 0 ? rankIndex + 1 : null;
        const { totalLeads, callsMade, won, lost, pipeline, weeklyActivity, sourceBreakdown } =
          targetSummaryEntry.summary;

        return {
          data: {
            totalLeads,
            callsMade,
            won,
            wonRate: totalLeads === 0 ? 0 : toRoundedPercent((won / totalLeads) * 100),
            lost,
            lostRate: totalLeads === 0 ? 0 : toRoundedPercent((lost / totalLeads) * 100),
            rank,
            pipeline,
            weeklyActivity,
            sourceBreakdown,
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

let salesProfileService: SalesProfileServiceData = createSalesProfileService();

export const getSalesProfileService = (): SalesProfileServiceData => {
  return salesProfileService;
};

export const setSalesProfileService = (
  service: SalesProfileServiceData,
): void => {
  salesProfileService = service;
};
