// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { AuthenticatedUserData } from "../../common/utils/authenticated-user.js";
import type { SupabaseUserRecordData } from "../../config/supabase.js";
import type {
  CarBrandData,
  CarModelData,
  CreateLeadNoteRequestData,
  CreateLeadRequestData,
  CreateLeadResponseData,
  LeadActivityData,
  LeadDetailsData,
  LeadListItemData,
  LeadNoteData,
  LeadStatusData,
  LeadUserSummaryData,
  SalesLeadServiceErrorData,
  UpdateLeadDetailsRequestData,
  UpdateLeadStatusRequestData,
} from "./sales-leads.types.js";
// CONFIG //
import { environmentConfig } from "../../config/environment.js";
import { getUserByRecordIdentifier } from "../../config/supabase.js";
// CONSTANTS //
import {
  ADMIN_ROLE_VALUE,
  CAR_MODEL_REQUIRES_BRAND_MESSAGE,
  LEAD_ACCESS_FORBIDDEN_MESSAGE,
  LEAD_DUPLICATE_PHONE_MESSAGE,
  LEAD_NOT_FOUND_MESSAGE,
  LEAD_STATUS_CHANGE_ACTIVITY_TEMPLATE,
} from "../../common/constants/lead.constants.js";

interface SalesLeadRecordData {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  source: string;
  lead_source_id?: string | null;
  status: LeadStatusData;
  status_id?: string | null;
  assigned_to?: string | null;
  created_by?: string | null;
  creator_user_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
  lost_reason?: string | null;
  referrer_name?: string | null;
  referrer_phone?: string | null;
  car_brand?: string | null;
  car_brand_id?: string | null;
  car_model?: string | null;
  car_model_id?: string | null;
  variant_name?: string | null;
  color_preference?: string | null;
  budget?: string | null;
  is_used?: boolean | null;
  [key: string]: unknown;
}

interface SalesLeadNoteRecordData {
  lead_id: string;
  user_id: string | null;
  note_text: string;
  created_at: string | null;
  updated_at?: string | null;
}

interface LeadUserRecordData {
  lead_id: string;
  user_id: string;
  is_primary: boolean | null;
}

interface NamedEntityRecordData {
  id: string;
  name: string;
}

interface CarModelRecordData extends NamedEntityRecordData {
  car_brand_id: string;
}

interface SalesLeadActivityRecordData {
  lead_id: string;
  from_status_id: string | null;
  to_status_id: string | null;
  user_id: string | null;
  updated_at: string | null;
}

interface CreateLeadRecordInputData {
  full_name: string;
  phone: string;
  email: string | null;
  lead_source_id: string;
  status?: LeadStatusData;
  status_id?: string;
  creator_user_id: string;
  referred_by_referrer_id?: string | null;
  referrer_name?: string | null;
  referrer_phone?: string | null;
  car_brand_id: string | null;
  car_model_id: string | null;
  variant_name: string | null;
  color_preference: string | null;
  budget: string | null;
  is_used: boolean | null;
  lost_reason?: string | null;
}

interface UpdateLeadRecordInputData {
  full_name?: string;
  phone?: string;
  email?: string | null;
  lead_source_id?: string;
  source?: string;
  status?: LeadStatusData;
  status_id?: string;
  lost_reason?: string | null;
  lost_reason_id?: string | null;
  referred_by_referrer_id?: string | null;
  referrer_name?: string | null;
  referrer_phone?: string | null;
  car_brand_id?: string | null;
  car_model_id?: string | null;
  variant_name?: string | null;
  color_preference?: string | null;
  budget?: string | null;
  is_used?: boolean | null;
}

interface CreateLeadNoteRecordInputData {
  lead_id: string;
  user_id: string;
  note_text: string;
}

interface CreateLeadUserRecordInputData {
  lead_id: string;
  user_id: string;
  is_primary: boolean;
}

interface CreateLeadActivityRecordInputData {
  lead_id: string;
  from_status_id: string | null;
  to_status_id: string;
  user_id: string;
}

interface SalesLeadsServiceDependenciesData {
  getLeadRecords?: () => Promise<SalesLeadRecordData[]>;
  getCarBrandRecords?: () => Promise<NamedEntityRecordData[]>;
  getCarModelRecordsByBrandId?: (
    carBrandId: string,
  ) => Promise<CarModelRecordData[]>;
  getLeadRecord: (leadId: string) => Promise<SalesLeadRecordData | null>;
  getLeadRecordsByIds?: (leadIds: string[]) => Promise<SalesLeadRecordData[]>;
  getLeadActivityRecords: (
    leadId: string,
  ) => Promise<SalesLeadActivityRecordData[]>;
  getLeadRecordsByUserIdentifier?: (
    userIdentifier: string,
  ) => Promise<SalesLeadRecordData[]>;
  getLeadUserRecords: (leadId: string) => Promise<LeadUserRecordData[]>;
  getLeadUserRecordsByUserIdentifier?: (
    userIdentifier: string,
  ) => Promise<LeadUserRecordData[]>;
  getLeadNoteRecords: (leadId: string) => Promise<SalesLeadNoteRecordData[]>;
  getUserByRecordIdentifier: (
    userIdentifier: string,
  ) => Promise<SupabaseUserRecordData | null>;
  getLeadByPhone: (phone: string) => Promise<SalesLeadRecordData | null>;
  getLeadSourceIdByName: (sourceName: string) => Promise<string | null>;
  getLeadSourceNameById: (sourceId: string) => Promise<string | null>;
  getStatusIdByName: (statusName: string) => Promise<string | null>;
  getStatusNameById: (statusId: string) => Promise<string | null>;
  getLostReasonIdByName: (lostReasonName: string) => Promise<string | null>;
  getLostReasonNameById: (lostReasonId: string) => Promise<string | null>;
  getCarBrandIdByName: (brandName: string) => Promise<string | null>;
  getCarBrandNameById: (brandId: string) => Promise<string | null>;
  getCarModelIdByName: (
    modelName: string,
    carBrandId: string | null,
  ) => Promise<string | null>;
  getCarModelNameById: (modelId: string) => Promise<string | null>;
  updateLeadRecord: (
    leadId: string,
    payload: UpdateLeadRecordInputData,
  ) => Promise<SalesLeadRecordData>;
  createLeadRecord: (
    payload: CreateLeadRecordInputData,
  ) => Promise<SalesLeadRecordData>;
  createLeadNoteRecord: (
    payload: CreateLeadNoteRecordInputData,
  ) => Promise<SalesLeadNoteRecordData>;
  createLeadUserRecord: (
    payload: CreateLeadUserRecordInputData,
  ) => Promise<LeadUserRecordData>;
  createLeadActivityRecord: (
    payload: CreateLeadActivityRecordInputData,
  ) => Promise<SalesLeadActivityRecordData>;
}

const LEADS_OPTIONAL_MUTATION_COLUMNS = new Set<string>([
  "lost_reason",
  "referrer_name",
  "referrer_phone",
  "car_brand",
  "car_model",
  "variant_name",
  "color_preference",
  "budget",
  "is_used",
]);

/**
 * Builds the shared Supabase service-role headers for REST calls.
 */
const buildServiceRoleHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
    apikey: environmentConfig.supabaseServiceRoleKey,
    Authorization: `Bearer ${environmentConfig.supabaseServiceRoleKey}`,
    Prefer: "return=representation",
  };
};

/**
 * Extracts the most useful error message from a failed Supabase response.
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
 * Extracts a missing column name from a Supabase/PostgREST error message.
 */
const getMissingColumnName = (errorMessage: string): string | null => {
  const missingColumnMatch = errorMessage.match(
    /column ['"]?([a-zA-Z0-9_]+)['"]?/i,
  );

  if (!missingColumnMatch?.[1]) {
    return null;
  }

  return missingColumnMatch[1];
};

/**
 * Removes optional lead fields that are not yet available in the database schema.
 */
const omitUnsupportedLeadColumn = <T extends object>(
  payload: T,
  columnName: string,
): T => {
  if (!LEADS_OPTIONAL_MUTATION_COLUMNS.has(columnName)) {
    return payload;
  }

  const nextPayload = { ...payload } as Record<string, unknown>;
  delete nextPayload[columnName];
  return nextPayload as T;
};

/**
 * Creates a REST endpoint URL for a specific Supabase table.
 */
const createSupabaseTableUrl = (tableName: string): URL => {
  return new URL(`${environmentConfig.supabaseUrl}/rest/v1/${tableName}`);
};

/**
 * Creates a typed service error that controllers can map consistently.
 */
const createSalesLeadServiceError = (
  code: SalesLeadServiceErrorData["code"],
  message: string,
): SalesLeadServiceErrorData => {
  const salesLeadError = new Error(message) as SalesLeadServiceErrorData;
  salesLeadError.code = code;
  return salesLeadError;
};

const SALES_LEAD_SERVICE_ERROR_CODES = new Set<SalesLeadServiceErrorData["code"]>([
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "INTERNAL",
]);

const isDuplicatePhoneConstraintError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  const duplicateCandidate = error as Error & {
    code?: unknown;
    details?: unknown;
    hint?: unknown;
    constraint?: unknown;
  };
  const normalizedMessage = error.message.toLowerCase();
  const normalizedDetails =
    typeof duplicateCandidate.details === "string"
      ? duplicateCandidate.details.toLowerCase()
      : "";
  const normalizedHint =
    typeof duplicateCandidate.hint === "string"
      ? duplicateCandidate.hint.toLowerCase()
      : "";
  const normalizedConstraint =
    typeof duplicateCandidate.constraint === "string"
      ? duplicateCandidate.constraint.toLowerCase()
      : "";
  const duplicateSignals = [
    normalizedMessage,
    normalizedDetails,
    normalizedHint,
    normalizedConstraint,
  ].join(" ");

  const hasUniqueViolationCode = duplicateCandidate.code === "23505";
  const hasDuplicateSignal =
    duplicateSignals.includes("duplicate") ||
    duplicateSignals.includes("unique");
  const hasPhoneSignal =
    duplicateSignals.includes("phone") ||
    duplicateSignals.includes("leads_phone");

  return hasPhoneSignal && (hasUniqueViolationCode || hasDuplicateSignal);
};

/**
 * Maps a Supabase user record into the lightweight lead user summary shape.
 */
const mapLeadUserSummary = (
  userRecord: SupabaseUserRecordData | null,
): LeadUserSummaryData | null => {
  const userId =
    typeof userRecord?.user_id === "string"
      ? userRecord.user_id
      : typeof userRecord?.id === "string"
        ? userRecord.id
        : null;
  const fullName =
    typeof userRecord?.full_name === "string" ? userRecord.full_name : null;

  if (!userId || !fullName) {
    return null;
  }

  return {
    id: userId,
    name: fullName,
  };
};

/**
 * Returns the first non-empty string value from the provided property names.
 */
const getOptionalString = (
  sourceRecord: Record<string, unknown>,
  propertyNames: string[],
): string | null => {
  for (const propertyName of propertyNames) {
    const propertyValue = sourceRecord[propertyName];

    if (typeof propertyValue === "string" && propertyValue.trim().length > 0) {
      return propertyValue;
    }
  }

  return null;
};

/**
 * Returns the first boolean value found across the provided property names.
 */
const getOptionalBoolean = (
  sourceRecord: Record<string, unknown>,
  propertyNames: string[],
): boolean | null => {
  for (const propertyName of propertyNames) {
    const propertyValue = sourceRecord[propertyName];

    if (typeof propertyValue === "boolean") {
      return propertyValue;
    }
  }

  return null;
};

/**
 * Builds the activity description for a lead status change entry.
 */
const createStatusChangeDescription = ({
  previousStatus,
  nextStatus,
}: {
  previousStatus: LeadStatusData;
  nextStatus: LeadStatusData;
}): string => {
  return LEAD_STATUS_CHANGE_ACTIVITY_TEMPLATE
    .replace("{previousStatus}", previousStatus)
    .replace("{nextStatus}", nextStatus);
};

/**
 * Maps lead create and update payloads into the database mutation shape.
 */
const createLeadMutationPayload = (
  payload: CreateLeadRequestData | UpdateLeadDetailsRequestData,
  resolvedReferenceIds: {
    leadSourceId: string;
    statusId?: string;
    carBrandId: string | null;
    carModelId: string | null;
  },
): UpdateLeadRecordInputData => {
  return {
    full_name: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    lead_source_id: resolvedReferenceIds.leadSourceId,
    ...(resolvedReferenceIds.statusId
      ? { status_id: resolvedReferenceIds.statusId }
      : {}),
    car_brand_id: resolvedReferenceIds.carBrandId,
    car_model_id: resolvedReferenceIds.carModelId,
    variant_name: payload.variantName ?? null,
    color_preference: payload.colorPreference ?? null,
    budget: payload.budget ?? null,
    is_used: payload.isUsed ?? null,
  };
};

/**
 * Creates the default data-access dependencies backed by Supabase REST calls.
 */
const createDefaultSalesLeadsServiceDependencies =
  (): SalesLeadsServiceDependenciesData => {
    /**
     * Executes a Supabase read request and returns the parsed response body.
     */
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

    /**
     * Executes a Supabase mutation request and returns the first changed record.
     */
    const executeMutationRequest = async <T>({
      method,
      requestUrl,
      body,
    }: {
      method: "POST" | "PATCH";
      requestUrl: URL;
      body: object;
    }): Promise<T> => {
      let requestBody = body;

      for (;;) {
        const response = await fetch(requestUrl, {
          method,
          headers: buildServiceRoleHeaders(),
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorMessage = await getSupabaseErrorMessage(response);
          console.error("[sales-leads] Supabase mutation failed", {
            method,
            table: requestUrl.pathname,
            status: response.status,
            errorMessage,
            body: requestBody,
          });
          const missingColumnName = getMissingColumnName(errorMessage);
          const nextRequestBody = missingColumnName
            ? omitUnsupportedLeadColumn(requestBody, missingColumnName)
            : requestBody;

          if (nextRequestBody !== requestBody) {
            requestBody = nextRequestBody;
            continue;
          }

          throw new Error(errorMessage);
        }

        const responseBody = (await response.json()) as T[];
        const firstRecord = responseBody[0];

        if (!firstRecord) {
          throw new Error("Supabase mutation did not return a record.");
        }

        return firstRecord;
      }
    };

    return {
      getLeadRecords: async () => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("order", "created_at.desc");

        return executeReadRequest<SalesLeadRecordData[]>(requestUrl);
      },
      getCarBrandRecords: async () => {
        const requestUrl = createSupabaseTableUrl("car_brands");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("order", "name.asc");

        return executeReadRequest<NamedEntityRecordData[]>(requestUrl);
      },
      getCarModelRecordsByBrandId: async (carBrandId) => {
        const requestUrl = createSupabaseTableUrl("car_models");
        requestUrl.searchParams.set("select", "id,name,car_brand_id");
        requestUrl.searchParams.set("car_brand_id", `eq.${carBrandId}`);
        requestUrl.searchParams.set("order", "name.asc");

        return executeReadRequest<CarModelRecordData[]>(requestUrl);
      },
      getLeadRecord: async (leadId) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("id", `eq.${leadId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<SalesLeadRecordData[]>(
          requestUrl,
        );

        return responseBody[0] ?? null;
      },
      getLeadRecordsByIds: async (leadIds) => {
        if (leadIds.length === 0) {
          return [];
        }

        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("id", `in.(${leadIds.join(",")})`);
        requestUrl.searchParams.set("order", "created_at.desc");

        return executeReadRequest<SalesLeadRecordData[]>(requestUrl);
      },
      getLeadActivityRecords: async (leadId) => {
        const requestUrl = createSupabaseTableUrl("lead_status_log");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("lead_id", `eq.${leadId}`);
        requestUrl.searchParams.set("order", "updated_at.desc");

        return executeReadRequest<SalesLeadActivityRecordData[]>(requestUrl);
      },
      getLeadUserRecords: async (leadId) => {
        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("lead_id", `eq.${leadId}`);

        return executeReadRequest<LeadUserRecordData[]>(requestUrl);
      },
      getLeadRecordsByUserIdentifier: async (userIdentifier) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set(
          "or",
          `(creator_user_id.eq.${userIdentifier},created_by.eq.${userIdentifier})`,
        );
        requestUrl.searchParams.set("order", "created_at.desc");

        return executeReadRequest<SalesLeadRecordData[]>(requestUrl);
      },
      getLeadUserRecordsByUserIdentifier: async (userIdentifier) => {
        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("user_id", `eq.${userIdentifier}`);

        return executeReadRequest<LeadUserRecordData[]>(requestUrl);
      },
      getLeadNoteRecords: async (leadId) => {
        const requestUrl = createSupabaseTableUrl("lead_notes_log");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("lead_id", `eq.${leadId}`);
        requestUrl.searchParams.set("order", "created_at.desc");

        return executeReadRequest<SalesLeadNoteRecordData[]>(requestUrl);
      },
      getUserByRecordIdentifier,
      getLeadByPhone: async (phone) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("select", "*");
        requestUrl.searchParams.set("phone", `eq.${phone}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<SalesLeadRecordData[]>(
          requestUrl,
        );

        return responseBody[0] ?? null;
      },
      getLeadSourceIdByName: async (sourceName) => {
        const requestUrl = createSupabaseTableUrl("lead_sources");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("name", `ilike.${sourceName}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.id ?? null;
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
      getStatusIdByName: async (statusName) => {
        const requestUrl = createSupabaseTableUrl("statuses");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("name", `ilike.${statusName}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.id ?? null;
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
      getLostReasonIdByName: async (lostReasonName) => {
        const requestUrl = createSupabaseTableUrl("lost_reasons");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("name", `ilike.${lostReasonName}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.id ?? null;
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
      getCarBrandIdByName: async (brandName) => {
        const requestUrl = createSupabaseTableUrl("car_brands");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("name", `ilike.${brandName}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.id ?? null;
      },
      getCarBrandNameById: async (brandId) => {
        const requestUrl = createSupabaseTableUrl("car_brands");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${brandId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.name ?? null;
      },
      getCarModelIdByName: async (modelName, carBrandId) => {
        const requestUrl = createSupabaseTableUrl("car_models");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("name", `ilike.${modelName}`);

        if (carBrandId) {
          requestUrl.searchParams.set("car_brand_id", `eq.${carBrandId}`);
        }

        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.id ?? null;
      },
      getCarModelNameById: async (modelId) => {
        const requestUrl = createSupabaseTableUrl("car_models");
        requestUrl.searchParams.set("select", "id,name");
        requestUrl.searchParams.set("id", `eq.${modelId}`);
        requestUrl.searchParams.set("limit", "1");

        const responseBody = await executeReadRequest<NamedEntityRecordData[]>(
          requestUrl,
        );

        return responseBody[0]?.name ?? null;
      },
      updateLeadRecord: async (leadId, payload) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("id", `eq.${leadId}`);
        requestUrl.searchParams.set("select", "*");

        return executeMutationRequest<SalesLeadRecordData>({
          method: "PATCH",
          requestUrl,
          body: payload,
        });
      },
      createLeadRecord: async (payload) => {
        const requestUrl = createSupabaseTableUrl("leads");
        requestUrl.searchParams.set("select", "*");

        return executeMutationRequest<SalesLeadRecordData>({
          method: "POST",
          requestUrl,
          body: payload,
        });
      },
      createLeadNoteRecord: async (payload) => {
        const requestUrl = createSupabaseTableUrl("lead_notes_log");
        requestUrl.searchParams.set("select", "*");

        return executeMutationRequest<SalesLeadNoteRecordData>({
          method: "POST",
          requestUrl,
          body: payload,
        });
      },
      createLeadUserRecord: async (payload) => {
        const requestUrl = createSupabaseTableUrl("lead_user");
        requestUrl.searchParams.set("select", "*");

        return executeMutationRequest<LeadUserRecordData>({
          method: "POST",
          requestUrl,
          body: payload,
        });
      },
      createLeadActivityRecord: async (payload) => {
        const requestUrl = createSupabaseTableUrl("lead_status_log");
        requestUrl.searchParams.set("select", "*");

        return executeMutationRequest<SalesLeadActivityRecordData>({
          method: "POST",
          requestUrl,
          body: payload,
        });
      },
    };
  };

export interface SalesLeadsServiceData {
  getAllLeadsService: (
    authenticatedUser: AuthenticatedUserData,
  ) => Promise<QueryResponseData<LeadListItemData[]>>;
  getCarBrandsService: (
    authenticatedUser: AuthenticatedUserData,
  ) => Promise<QueryResponseData<CarBrandData[]>>;
  getCarModelsService: (
    authenticatedUser: AuthenticatedUserData,
    carBrandId: string,
  ) => Promise<QueryResponseData<CarModelData[]>>;
  getLeadDetailsService: (
    authenticatedUser: AuthenticatedUserData,
    leadId: string,
  ) => Promise<QueryResponseData<LeadDetailsData>>;
  getLeadActivitiesService: (
    authenticatedUser: AuthenticatedUserData,
    leadId: string,
  ) => Promise<QueryResponseData<LeadActivityData[]>>;
  getLeadNotesService: (
    authenticatedUser: AuthenticatedUserData,
    leadId: string,
  ) => Promise<QueryResponseData<LeadNoteData[]>>;
  updateLeadStatusService: (
    authenticatedUser: AuthenticatedUserData,
    leadId: string,
    payload: UpdateLeadStatusRequestData,
  ) => Promise<QueryResponseData<LeadDetailsData>>;
  updateLeadDetailsService: (
    authenticatedUser: AuthenticatedUserData,
    leadId: string,
    payload: UpdateLeadDetailsRequestData,
  ) => Promise<QueryResponseData<LeadDetailsData>>;
  createLeadNoteService: (
    authenticatedUser: AuthenticatedUserData,
    leadId: string,
    payload: CreateLeadNoteRequestData,
  ) => Promise<QueryResponseData<LeadNoteData>>;
  createLeadService: (
    authenticatedUser: AuthenticatedUserData,
    payload: CreateLeadRequestData,
  ) => Promise<QueryResponseData<CreateLeadResponseData>>;
}

/**
 * Creates the sales leads service with injectable data-access dependencies.
 */
export const createSalesLeadsService = (
  dependencies: SalesLeadsServiceDependenciesData = createDefaultSalesLeadsServiceDependencies(),
): SalesLeadsServiceData => {
  const resolveLeadReferenceIds = async (
    payload: CreateLeadRequestData | UpdateLeadDetailsRequestData,
    statusName?: LeadStatusData,
  ): Promise<{
    leadSourceId: string;
    statusId?: string;
    carBrandId: string | null;
    carModelId: string | null;
  }> => {
    const leadSourceId = await dependencies.getLeadSourceIdByName(payload.source);

    if (!leadSourceId) {
      throw createSalesLeadServiceError(
        "NOT_FOUND",
        `Lead source not found: ${payload.source}.`,
      );
    }

    const statusId = statusName
      ? await dependencies.getStatusIdByName(statusName)
      : undefined;

    if (statusName && !statusId) {
      throw createSalesLeadServiceError(
        "NOT_FOUND",
        `Lead status not found: ${statusName}.`,
      );
    }

    const carBrandId = payload.carBrand
      ? await dependencies.getCarBrandIdByName(payload.carBrand)
      : null;

    if (payload.carBrand && !carBrandId) {
      throw createSalesLeadServiceError(
        "NOT_FOUND",
        `Car brand not found: ${payload.carBrand}.`,
      );
    }

    if (payload.carModel && !payload.carBrand) {
      throw createSalesLeadServiceError(
        "BAD_REQUEST",
        CAR_MODEL_REQUIRES_BRAND_MESSAGE,
      );
    }

    const carModelId = payload.carModel
      ? await dependencies.getCarModelIdByName(payload.carModel, carBrandId)
      : null;

    if (payload.carModel && !carModelId) {
      const anyBrandCarModelId = await dependencies.getCarModelIdByName(
        payload.carModel,
        null,
      );

      if (payload.carBrand && anyBrandCarModelId) {
        throw createSalesLeadServiceError(
          "BAD_REQUEST",
          `Car model ${payload.carModel} does not belong to car brand ${payload.carBrand}.`,
        );
      }

      throw createSalesLeadServiceError(
        "NOT_FOUND",
        `Car model not found: ${payload.carModel}.`,
      );
    }

    return {
      leadSourceId,
      statusId: statusId ?? undefined,
      carBrandId,
      carModelId,
    };
  };

  /**
   * Collects the lead user identifiers that should be allowed to access the lead.
   */
  const getLeadUserIdentifiers = (
    leadRecord: SalesLeadRecordData,
    leadUserRecords: LeadUserRecordData[],
  ): string[] => {
    return [
      leadRecord.creator_user_id,
      leadRecord.created_by,
      ...leadUserRecords.map((leadUserRecordItem) => leadUserRecordItem.user_id),
    ].filter((value): value is string => typeof value === "string" && value.length > 0);
  };

  /**
   * Maps a raw lead record into the API response shape with user summaries.
   */
  const mapLeadDetails = async (
    leadRecord: SalesLeadRecordData,
  ): Promise<LeadDetailsData> => {
    const leadUserRecords = await dependencies.getLeadUserRecords(leadRecord.id);
    const primaryLeadUserRecord =
      leadUserRecords.find((leadUserRecordItem) => leadUserRecordItem.is_primary) ??
      leadUserRecords[0] ??
      null;
    const [
      assignedToUserRecord,
      createdByUserRecord,
      resolvedLeadSourceName,
      resolvedStatusName,
      resolvedLostReasonName,
      resolvedCarBrandName,
      resolvedCarModelName,
    ] = await Promise.all([
      primaryLeadUserRecord?.user_id
        ? dependencies.getUserByRecordIdentifier(primaryLeadUserRecord.user_id)
        : Promise.resolve(null),
      (leadRecord.creator_user_id ?? leadRecord.created_by)
        ? dependencies.getUserByRecordIdentifier(
            (leadRecord.creator_user_id ?? leadRecord.created_by) as string,
          )
        : Promise.resolve(null),
      typeof leadRecord.lead_source_id === "string"
        ? dependencies.getLeadSourceNameById(leadRecord.lead_source_id)
        : Promise.resolve(null),
      typeof leadRecord.status_id === "string"
        ? dependencies.getStatusNameById(leadRecord.status_id)
        : Promise.resolve(null),
      typeof leadRecord.lost_reason_id === "string"
        ? dependencies.getLostReasonNameById(leadRecord.lost_reason_id)
        : Promise.resolve(null),
      typeof leadRecord.car_brand_id === "string"
        ? dependencies.getCarBrandNameById(leadRecord.car_brand_id)
        : Promise.resolve(null),
      typeof leadRecord.car_model_id === "string"
        ? dependencies.getCarModelNameById(leadRecord.car_model_id)
        : Promise.resolve(null),
    ]);

    return {
      id: leadRecord.id,
      fullName: leadRecord.full_name,
      phone: leadRecord.phone,
      email: leadRecord.email,
      source:
        resolvedLeadSourceName ??
        getOptionalString(leadRecord, ["source", "lead_source_id"]) ??
        "",
      status:
        ((resolvedStatusName ??
          getOptionalString(leadRecord, ["status", "status_id"])) as LeadStatusData | null) ??
        "NEW",
      lostReason:
        resolvedLostReasonName ??
        getOptionalString(leadRecord, ["lost_reason", "lostReason"]) ??
        null,
      referrerName:
        getOptionalString(leadRecord, ["referrer_name", "referrerName"]) ??
        null,
      referrerPhone:
        getOptionalString(leadRecord, ["referrer_phone", "referrerPhone"]) ??
        null,
      carBrand:
        resolvedCarBrandName ??
        getOptionalString(leadRecord, ["car_brand_id", "car_brand"]) ??
        null,
      carModel:
        resolvedCarModelName ??
        getOptionalString(leadRecord, ["car_model_id", "car_model"]) ??
        null,
      variantName:
        getOptionalString(leadRecord, ["variant_name", "variantName"]) ?? null,
      colorPreference:
        getOptionalString(leadRecord, [
          "color_preference",
          "colorPreference",
        ]) ?? null,
      budget: getOptionalString(leadRecord, ["budget"]) ?? null,
      isUsed: getOptionalBoolean(leadRecord, ["is_used", "isUsed"]),
      assignedTo: mapLeadUserSummary(assignedToUserRecord),
      createdBy: mapLeadUserSummary(createdByUserRecord),
      createdAt: leadRecord.created_at,
      updatedAt: leadRecord.updated_at,
    };
  };

  /**
   * Maps full lead details into the lighter list payload.
   */
  const mapLeadListItem = (leadDetails: LeadDetailsData): LeadListItemData => {
    return {
      id: leadDetails.id,
      fullName: leadDetails.fullName,
      phone: leadDetails.phone,
      email: leadDetails.email,
      source: leadDetails.source,
      status: leadDetails.status,
      carBrand: leadDetails.carBrand,
      carModel: leadDetails.carModel,
      assignedTo: leadDetails.assignedTo,
      createdAt: leadDetails.createdAt,
      updatedAt: leadDetails.updatedAt,
    };
  };

  /**
   * Ensures the authenticated user is allowed to read or mutate the lead.
   */
  const ensureLeadAccess = async ({
    authenticatedUser,
    leadId,
  }: {
    authenticatedUser: AuthenticatedUserData;
    leadId: string;
  }): Promise<SalesLeadRecordData> => {
    const leadRecord = await dependencies.getLeadRecord(leadId);
    const leadUserRecords = await dependencies.getLeadUserRecords(leadId);

    if (!leadRecord) {
      throw createSalesLeadServiceError("NOT_FOUND", LEAD_NOT_FOUND_MESSAGE);
    }

    if (authenticatedUser.role === ADMIN_ROLE_VALUE) {
      return leadRecord;
    }

    const authorizedIdentifiers = new Set<string>([
      authenticatedUser.recordId,
      authenticatedUser.userId,
    ]);

    const isAuthorized = getLeadUserIdentifiers(leadRecord, leadUserRecords).some(
      (userIdentifier) => authorizedIdentifiers.has(userIdentifier),
    );

    if (!isAuthorized) {
      throw createSalesLeadServiceError(
        "FORBIDDEN",
        LEAD_ACCESS_FORBIDDEN_MESSAGE,
      );
    }

    return leadRecord;
  };

  /**
   * Maps lead activity records into the API response format.
   */
  const mapLeadActivities = async (
    leadId: string,
  ): Promise<LeadActivityData[]> => {
    const activityRecords = await dependencies.getLeadActivityRecords(leadId);
    return Promise.all(
      activityRecords.map(async (activityRecordItem) => {
        const [previousStatusName, nextStatusName] = await Promise.all([
          typeof activityRecordItem.from_status_id === "string"
            ? dependencies.getStatusNameById(activityRecordItem.from_status_id)
            : Promise.resolve(null),
          typeof activityRecordItem.to_status_id === "string"
            ? dependencies.getStatusNameById(activityRecordItem.to_status_id)
            : Promise.resolve(null),
        ]);

        return {
          id: `${activityRecordItem.lead_id}:${activityRecordItem.updated_at ?? "unknown"}`,
          leadId: activityRecordItem.lead_id,
          type: "status_change" as const,
          description: createStatusChangeDescription({
            previousStatus: (previousStatusName ?? "UNKNOWN") as LeadStatusData,
            nextStatus: (nextStatusName ??
              activityRecordItem.to_status_id) as LeadStatusData,
          }),
          metaJson: {
            fromStatusId: activityRecordItem.from_status_id,
            toStatusId: activityRecordItem.to_status_id,
            userId: activityRecordItem.user_id,
          },
          createdAt: activityRecordItem.updated_at,
        };
      }),
    );
  };

  /**
   * Maps lead notes and resolves each note author into a summary object.
   */
  const mapLeadNotes = async (leadId: string): Promise<LeadNoteData[]> => {
    const noteRecords = await dependencies.getLeadNoteRecords(leadId);
    const authorIdentifiers = Array.from(
      new Set(
        noteRecords
          .map((noteRecordItem) => noteRecordItem.user_id)
          .filter(
            (authorIdentifier): authorIdentifier is string =>
              typeof authorIdentifier === "string" &&
              authorIdentifier.length > 0,
          ),
      ),
    );
    const authorEntries = await Promise.all(
      authorIdentifiers.map(async (authorIdentifier) => {
        return [
          authorIdentifier,
          await dependencies.getUserByRecordIdentifier(authorIdentifier),
        ] as const;
      }),
    );
    const authorRecordMap = new Map<string, SupabaseUserRecordData | null>(
      authorEntries,
    );

    return noteRecords.map((noteRecordItem) => ({
      id: `${noteRecordItem.lead_id}:${noteRecordItem.created_at ?? "unknown"}`,
      leadId: noteRecordItem.lead_id,
      author: noteRecordItem.user_id
        ? mapLeadUserSummary(
            authorRecordMap.get(noteRecordItem.user_id) ?? null,
          )
        : null,
      content: noteRecordItem.note_text,
      createdAt: noteRecordItem.created_at,
    }));
  };

  /**
   * Normalizes unknown runtime errors into the module service error contract.
   */
  const mapServiceError = (error: unknown): SalesLeadServiceErrorData => {
    if (
      error instanceof Error &&
      "code" in error &&
      SALES_LEAD_SERVICE_ERROR_CODES.has(
        (error as SalesLeadServiceErrorData).code,
      )
    ) {
      return error as SalesLeadServiceErrorData;
    }

    if (isDuplicatePhoneConstraintError(error)) {
      return createSalesLeadServiceError("CONFLICT", LEAD_DUPLICATE_PHONE_MESSAGE);
    }

    return createSalesLeadServiceError(
      "INTERNAL",
      error instanceof Error ? error.message : "Lead request failed.",
    );
  };

  return {
    getAllLeadsService: async (authenticatedUser) => {
      try {
        const accessibleLeadMap = new Map<string, SalesLeadRecordData>();

        if (authenticatedUser.role === ADMIN_ROLE_VALUE) {
          const leadRecords = dependencies.getLeadRecords
            ? await dependencies.getLeadRecords()
            : [];

          leadRecords.forEach((leadRecordItem) => {
            accessibleLeadMap.set(leadRecordItem.id, leadRecordItem);
          });
        } else {
          const userIdentifiers = Array.from(
            new Set([authenticatedUser.recordId, authenticatedUser.userId]),
          );
          const leadCollections = await Promise.all(
            userIdentifiers.map((userIdentifier) =>
              dependencies.getLeadRecordsByUserIdentifier
                ? dependencies.getLeadRecordsByUserIdentifier(userIdentifier)
                : Promise.resolve([]),
            ),
          );
          const assignedLeadUserCollections = await Promise.all(
            userIdentifiers.map((userIdentifier) =>
              dependencies.getLeadUserRecordsByUserIdentifier
                ? dependencies.getLeadUserRecordsByUserIdentifier(userIdentifier)
                : Promise.resolve([]),
            ),
          );
          const ownedLeadRecords = leadCollections.flat();
          const assignedLeadUserRecords = assignedLeadUserCollections.flat();

          ownedLeadRecords.forEach((leadRecordItem) => {
            accessibleLeadMap.set(leadRecordItem.id, leadRecordItem);
          });

          const assignedLeadIds = Array.from(
            new Set(
              assignedLeadUserRecords.map(
                (leadUserRecordItem) => leadUserRecordItem.lead_id,
              ),
            ),
          );

          const assignedLeadRecords =
            dependencies.getLeadRecordsByIds
              ? await dependencies.getLeadRecordsByIds(assignedLeadIds)
              : [];

          assignedLeadRecords.forEach((leadRecordItem) => {
            accessibleLeadMap.set(leadRecordItem.id, leadRecordItem);
          });
        }

        const leadItems = await Promise.all(
          Array.from(accessibleLeadMap.values())
            .sort((leftItem, rightItem) => {
              const leftTimestamp = leftItem.created_at
                ? Date.parse(leftItem.created_at)
                : 0;
              const rightTimestamp = rightItem.created_at
                ? Date.parse(rightItem.created_at)
                : 0;

              return rightTimestamp - leftTimestamp;
            })
            .map(async (leadRecordItem) => {
              const leadDetails = await mapLeadDetails(leadRecordItem);
              return mapLeadListItem(leadDetails);
            }),
        );

        return {
          data: leadItems,
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getCarBrandsService: async (_authenticatedUser) => {
      try {
        const carBrandRecords = dependencies.getCarBrandRecords
          ? await dependencies.getCarBrandRecords()
          : [];

        return {
          data: carBrandRecords.map((carBrandItem) => ({
            id: carBrandItem.id,
            name: carBrandItem.name,
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
    getCarModelsService: async (_authenticatedUser, carBrandId) => {
      try {
        const carBrandName = await dependencies.getCarBrandNameById(carBrandId);

        if (!carBrandName) {
          throw createSalesLeadServiceError(
            "NOT_FOUND",
            `Car brand not found: ${carBrandId}.`,
          );
        }

        const carModelRecords = dependencies.getCarModelRecordsByBrandId
          ? await dependencies.getCarModelRecordsByBrandId(carBrandId)
          : [];

        return {
          data: carModelRecords.map((carModelItem) => ({
            id: carModelItem.id,
            name: carModelItem.name,
            carBrandId: carModelItem.car_brand_id,
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
    getLeadDetailsService: async (authenticatedUser, leadId) => {
      try {
        const leadRecord = await ensureLeadAccess({ authenticatedUser, leadId });

        return {
          data: await mapLeadDetails(leadRecord),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getLeadActivitiesService: async (authenticatedUser, leadId) => {
      try {
        await ensureLeadAccess({ authenticatedUser, leadId });

        return {
          data: await mapLeadActivities(leadId),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    getLeadNotesService: async (authenticatedUser, leadId) => {
      try {
        await ensureLeadAccess({ authenticatedUser, leadId });

        return {
          data: await mapLeadNotes(leadId),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    updateLeadStatusService: async (authenticatedUser, leadId, payload) => {
      try {
        const leadRecord = await ensureLeadAccess({ authenticatedUser, leadId });
        const statusId = await dependencies.getStatusIdByName(payload.status);
        const lostReasonId =
          payload.status === "LOST" && payload.lostReason
            ? await dependencies.getLostReasonIdByName(payload.lostReason)
            : null;

        if (!statusId) {
          return {
            data: null,
            error: createSalesLeadServiceError(
              "NOT_FOUND",
              `Lead status not found: ${payload.status}.`,
            ),
          };
        }

        if (payload.status === "LOST" && payload.lostReason && !lostReasonId) {
          return {
            data: null,
            error: createSalesLeadServiceError(
              "NOT_FOUND",
              `Lost reason not found: ${payload.lostReason}.`,
            ),
          };
        }

        const previousStatusId =
          leadRecord.status_id ??
          (leadRecord.status
            ? await dependencies.getStatusIdByName(leadRecord.status)
            : null);

        const updatedLeadRecord = await dependencies.updateLeadRecord(leadId, {
          status_id: statusId,
          lost_reason_id: payload.status === "LOST" ? lostReasonId : null,
        });

        await dependencies.createLeadActivityRecord({
          lead_id: leadId,
          from_status_id: previousStatusId,
          to_status_id: statusId,
          user_id: authenticatedUser.recordId,
        });

        return {
          data: await mapLeadDetails(updatedLeadRecord),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    updateLeadDetailsService: async (authenticatedUser, leadId, payload) => {
      try {
        await ensureLeadAccess({ authenticatedUser, leadId });
        const existingLeadRecord = await dependencies.getLeadByPhone(payload.phone);

        if (existingLeadRecord && existingLeadRecord.id !== leadId) {
          return {
            data: null,
            error: createSalesLeadServiceError(
              "CONFLICT",
              LEAD_DUPLICATE_PHONE_MESSAGE,
            ),
          };
        }

        const resolvedReferenceIds = await resolveLeadReferenceIds(
          payload,
          undefined,
        );
        const updatedLeadRecord = await dependencies.updateLeadRecord(
          leadId,
          createLeadMutationPayload(payload, resolvedReferenceIds),
        );

        return {
          data: await mapLeadDetails(updatedLeadRecord),
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
    createLeadNoteService: async (authenticatedUser, leadId, payload) => {
      try {
        await ensureLeadAccess({ authenticatedUser, leadId });
        const noteRecord = await dependencies.createLeadNoteRecord({
          lead_id: leadId,
          user_id: authenticatedUser.recordId,
          note_text: payload.content,
        });

        return {
          data: {
            id: `${noteRecord.lead_id}:${noteRecord.created_at ?? "unknown"}`,
            leadId: noteRecord.lead_id,
            author: {
              id: authenticatedUser.userId,
              name: authenticatedUser.fullName,
            },
            content: noteRecord.note_text,
            createdAt: noteRecord.created_at,
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
    createLeadService: async (authenticatedUser, payload) => {
      try {
        console.log("[sales-leads] createLeadService:start", {
          authenticatedUser,
          payload,
        });
        const existingLeadRecord = await dependencies.getLeadByPhone(payload.phone);

        if (existingLeadRecord) {
          return {
            data: null,
            error: createSalesLeadServiceError(
              "CONFLICT",
              LEAD_DUPLICATE_PHONE_MESSAGE,
            ),
          };
        }

        const resolvedReferenceIds = await resolveLeadReferenceIds(
          payload,
          "NEW",
        );
        const leadRecord = await dependencies.createLeadRecord({
          ...createLeadMutationPayload(payload, resolvedReferenceIds),
          lead_source_id: resolvedReferenceIds.leadSourceId,
          status_id: resolvedReferenceIds.statusId,
          creator_user_id: authenticatedUser.recordId,
          full_name: payload.fullName,
          phone: payload.phone,
          email: payload.email,
          car_brand_id: resolvedReferenceIds.carBrandId,
          car_model_id: resolvedReferenceIds.carModelId,
          variant_name: payload.variantName ?? null,
          color_preference: payload.colorPreference ?? null,
          budget: payload.budget ?? null,
          is_used: payload.isUsed ?? null,
        });

        await dependencies.createLeadUserRecord({
          lead_id: leadRecord.id,
          user_id: authenticatedUser.recordId,
          is_primary: true,
        });

        let createdNote: LeadNoteData | null = null;

        if (payload.initialNote) {
          const noteRecord = await dependencies.createLeadNoteRecord({
            lead_id: leadRecord.id,
            user_id: authenticatedUser.recordId,
            note_text: payload.initialNote,
          });

          createdNote = {
            id: `${noteRecord.lead_id}:${noteRecord.created_at ?? "unknown"}`,
            leadId: noteRecord.lead_id,
            author: {
              id: authenticatedUser.userId,
              name: authenticatedUser.fullName,
            },
            content: noteRecord.note_text,
            createdAt: noteRecord.created_at,
          };
        }

        return {
          data: {
            lead: await mapLeadDetails(leadRecord),
            note: createdNote,
          },
          error: null,
        };
      } catch (error) {
        console.error("[sales-leads] createLeadService:error", {
          authenticatedUser,
          payload,
          error,
        });
        return {
          data: null,
          error: mapServiceError(error),
        };
      }
    },
  };
};

let salesLeadsService: SalesLeadsServiceData = createSalesLeadsService();

/**
 * Returns the shared sales leads service instance used by the module.
 */
export const getSalesLeadsService = (): SalesLeadsServiceData => {
  return salesLeadsService;
};

/**
 * Replaces the shared sales leads service instance, mainly for tests.
 */
export const setSalesLeadsService = (
  service: SalesLeadsServiceData,
): void => {
  salesLeadsService = service;
};
