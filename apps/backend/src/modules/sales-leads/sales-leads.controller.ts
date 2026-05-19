// TYPES //
import type { Context } from "hono";
import type { SalesLeadServiceErrorData } from "./sales-leads.types.js";
import {
  carBrandIdParamsSchema,
  createLeadNoteRequestSchema,
  createLeadRequestSchema,
  leadDetailsMutationSchema,
  leadIdParamsSchema,
  updateLeadStatusRequestSchema,
} from "./sales-leads.types.js";
// CONSTANTS //
import {
  CAR_BRANDS_SUCCESS_MESSAGE,
  CAR_MODELS_SUCCESS_MESSAGE,
  INVALID_CREATE_LEAD_NOTE_REQUEST_MESSAGE,
  INVALID_CREATE_LEAD_REQUEST_MESSAGE,
  INVALID_CAR_BRAND_ID_MESSAGE,
  INVALID_LEAD_DETAILS_REQUEST_MESSAGE,
  INVALID_LEAD_ID_MESSAGE,
  INVALID_LEAD_STATUS_REQUEST_MESSAGE,
  LEADS_SUCCESS_MESSAGE,
  LEAD_ACTIVITIES_SUCCESS_MESSAGE,
  LEAD_CREATED_SUCCESS_MESSAGE,
  LEAD_DETAILS_SUCCESS_MESSAGE,
  LEAD_DETAILS_UPDATED_SUCCESS_MESSAGE,
  LEAD_NOTE_CREATED_SUCCESS_MESSAGE,
  LEAD_NOTES_SUCCESS_MESSAGE,
  LEAD_STATUS_UPDATED_SUCCESS_MESSAGE,
} from "../../common/constants/lead.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { requireAuthenticatedSalesUser } from "../../common/utils/authenticated-user.js";
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getSalesLeadsService } from "./sales-leads.service.js";

/**
 * Maps service-layer errors into controller response metadata.
 */
const mapServiceError = (
  error: Error | null,
): { statusCode: number; message: string; errorDetail: string } => {
  if (!error) {
    return {
      statusCode: HTTP_STATUS_CODES.internalServerError,
      message: INTERNAL_SERVER_ERROR_MESSAGE,
      errorDetail: INTERNAL_SERVER_ERROR_MESSAGE,
    };
  }

  const salesLeadError = error as Partial<SalesLeadServiceErrorData>;

  switch (salesLeadError.code) {
    case "BAD_REQUEST":
      return {
        statusCode: HTTP_STATUS_CODES.badRequest,
        message: error.message,
        errorDetail: error.message,
      };
    case "UNAUTHORIZED":
      return {
        statusCode: HTTP_STATUS_CODES.unauthorized,
        message: error.message,
        errorDetail: error.message,
      };
    case "FORBIDDEN":
      return {
        statusCode: HTTP_STATUS_CODES.forbidden,
        message: error.message,
        errorDetail: error.message,
      };
    case "NOT_FOUND":
      return {
        statusCode: HTTP_STATUS_CODES.notFound,
        message: error.message,
        errorDetail: error.message,
      };
    case "CONFLICT":
      return {
        statusCode: HTTP_STATUS_CODES.conflict,
        message: error.message,
        errorDetail: error.message,
      };
    default:
      return {
        statusCode: HTTP_STATUS_CODES.internalServerError,
        message: INTERNAL_SERVER_ERROR_MESSAGE,
        errorDetail: INTERNAL_SERVER_ERROR_MESSAGE,
      };
  }
};

/**
 * Safely parses the JSON request body and returns a bad-request response on failure.
 */
const parseRequestBody = async (
  context: Context,
): Promise<{ requestBody: unknown; errorResponse: Response | null }> => {
  try {
    return {
      requestBody: await context.req.json(),
      errorResponse: null,
    };
  } catch {
    return {
      requestBody: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: "Invalid request body.",
        error: "Request body must be valid JSON.",
      }),
    };
  }
};

/**
 * Validates and extracts the lead id route parameter.
 */
const parseLeadIdParams = (
  context: Context,
): { leadId: string | null; errorResponse: Response | null } => {
  const paramsParseResult = leadIdParamsSchema.safeParse(context.req.param());

  if (!paramsParseResult.success) {
    return {
      leadId: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_LEAD_ID_MESSAGE,
        error: paramsParseResult.error.message,
      }),
    };
  }

  return {
    leadId: paramsParseResult.data.leadId,
    errorResponse: null,
  };
};

/**
 * Validates and extracts the car brand id route parameter.
 */
const parseCarBrandIdParams = (
  context: Context,
): { carBrandId: string | null; errorResponse: Response | null } => {
  const paramsParseResult = carBrandIdParamsSchema.safeParse(context.req.param());

  if (!paramsParseResult.success) {
    return {
      carBrandId: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_CAR_BRAND_ID_MESSAGE,
        error: paramsParseResult.error.message,
      }),
    };
  }

  return {
    carBrandId: paramsParseResult.data.carBrandId,
    errorResponse: null,
  };
};

/**
 * Resolves the authenticated Sales user required by the controller actions.
 */
const resolveAuthenticatedUser = async (
  context: Context,
): Promise<{
  authenticatedUser: Awaited<
    ReturnType<typeof requireAuthenticatedSalesUser>
  >["authenticatedUser"];
  errorResponse: Response | null;
}> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedSalesUser(context);

  return {
    authenticatedUser,
    errorResponse,
  };
};

/**
 * Handles GET /sales/leads and returns all leads accessible to the Sales user.
 */
export const getAllLeadsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const leadsResult = await getSalesLeadsService().getAllLeadsService(
    authenticatedUser,
  );

  if (leadsResult.error || !leadsResult.data) {
    const mappedError = mapServiceError(leadsResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LEADS_SUCCESS_MESSAGE,
    data: leadsResult.data,
  });
};

/**
 * Handles GET /sales/leads/car-brands and returns available car brands.
 */
export const getCarBrandsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const carBrandsResult = await getSalesLeadsService().getCarBrandsService(
    authenticatedUser,
  );

  if (carBrandsResult.error || !carBrandsResult.data) {
    const mappedError = mapServiceError(carBrandsResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: CAR_BRANDS_SUCCESS_MESSAGE,
    data: carBrandsResult.data,
  });
};

/**
 * Handles GET /sales/leads/car-brands/:carBrandId/car-models and returns models for the given brand.
 */
export const getCarModelsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { carBrandId, errorResponse: paramsErrorResponse } =
    parseCarBrandIdParams(context);

  if (paramsErrorResponse || !carBrandId) {
    return paramsErrorResponse as Response;
  }

  const carModelsResult = await getSalesLeadsService().getCarModelsService(
    authenticatedUser,
    carBrandId,
  );

  if (carModelsResult.error || !carModelsResult.data) {
    const mappedError = mapServiceError(carModelsResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: CAR_MODELS_SUCCESS_MESSAGE,
    data: carModelsResult.data,
  });
};

/**
 * Handles GET /sales/leads/:leadId and returns the Sales user's lead details.
 */
export const getLeadDetailsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { leadId, errorResponse: paramsErrorResponse } = parseLeadIdParams(
    context,
  );

  if (paramsErrorResponse || !leadId) {
    return paramsErrorResponse as Response;
  }

  const leadDetailsResult = await getSalesLeadsService().getLeadDetailsService(
    authenticatedUser,
    leadId,
  );

  if (leadDetailsResult.error || !leadDetailsResult.data) {
    const mappedError = mapServiceError(leadDetailsResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LEAD_DETAILS_SUCCESS_MESSAGE,
    data: leadDetailsResult.data,
  });
};

/**
 * Handles GET /sales/leads/:leadId/activities and returns the Lead activity ledger.
 */
export const getLeadActivitiesController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { leadId, errorResponse: paramsErrorResponse } = parseLeadIdParams(
    context,
  );

  if (paramsErrorResponse || !leadId) {
    return paramsErrorResponse as Response;
  }

  const leadActivitiesResult =
    await getSalesLeadsService().getLeadActivitiesService(
      authenticatedUser,
      leadId,
    );

  if (leadActivitiesResult.error || !leadActivitiesResult.data) {
    const mappedError = mapServiceError(leadActivitiesResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LEAD_ACTIVITIES_SUCCESS_MESSAGE,
    data: leadActivitiesResult.data,
  });
};

/**
 * Handles GET /sales/leads/:leadId/notes and returns Lead notes for the Sales user.
 */
export const getLeadNotesController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { leadId, errorResponse: paramsErrorResponse } = parseLeadIdParams(
    context,
  );

  if (paramsErrorResponse || !leadId) {
    return paramsErrorResponse as Response;
  }

  const leadNotesResult = await getSalesLeadsService().getLeadNotesService(
    authenticatedUser,
    leadId,
  );

  if (leadNotesResult.error || !leadNotesResult.data) {
    const mappedError = mapServiceError(leadNotesResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LEAD_NOTES_SUCCESS_MESSAGE,
    data: leadNotesResult.data,
  });
};

/**
 * Handles PATCH /sales/leads/:leadId/status and updates Lead status for the Sales user.
 */
export const updateLeadStatusController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { leadId, errorResponse: paramsErrorResponse } = parseLeadIdParams(
    context,
  );

  if (paramsErrorResponse || !leadId) {
    return paramsErrorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = updateLeadStatusRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_LEAD_STATUS_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const updateLeadStatusResult =
    await getSalesLeadsService().updateLeadStatusService(
      authenticatedUser,
      leadId,
      requestParseResult.data,
    );

  if (updateLeadStatusResult.error || !updateLeadStatusResult.data) {
    const mappedError = mapServiceError(updateLeadStatusResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LEAD_STATUS_UPDATED_SUCCESS_MESSAGE,
    data: updateLeadStatusResult.data,
  });
};

/**
 * Handles PATCH /sales/leads/:leadId and updates Lead contact and preference fields.
 */
export const updateLeadDetailsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { leadId, errorResponse: paramsErrorResponse } = parseLeadIdParams(
    context,
  );

  if (paramsErrorResponse || !leadId) {
    return paramsErrorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = leadDetailsMutationSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_LEAD_DETAILS_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const updateLeadDetailsResult =
    await getSalesLeadsService().updateLeadDetailsService(
      authenticatedUser,
      leadId,
      requestParseResult.data,
    );

  if (updateLeadDetailsResult.error || !updateLeadDetailsResult.data) {
    const mappedError = mapServiceError(updateLeadDetailsResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LEAD_DETAILS_UPDATED_SUCCESS_MESSAGE,
    data: updateLeadDetailsResult.data,
  });
};

/**
 * Handles POST /sales/leads/:leadId/notes and creates a Lead note for the Sales user.
 */
export const createLeadNoteController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { leadId, errorResponse: paramsErrorResponse } = parseLeadIdParams(
    context,
  );

  if (paramsErrorResponse || !leadId) {
    return paramsErrorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = createLeadNoteRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_CREATE_LEAD_NOTE_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const createLeadNoteResult = await getSalesLeadsService().createLeadNoteService(
    authenticatedUser,
    leadId,
    requestParseResult.data,
  );

  if (createLeadNoteResult.error || !createLeadNoteResult.data) {
    const mappedError = mapServiceError(createLeadNoteResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.created,
    status: "success",
    message: LEAD_NOTE_CREATED_SUCCESS_MESSAGE,
    data: createLeadNoteResult.data,
  });
};

/**
 * Handles POST /sales/leads and creates a new Lead for the Sales user.
 */
export const createLeadController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await resolveAuthenticatedUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = createLeadRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_CREATE_LEAD_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const createLeadResult = await getSalesLeadsService().createLeadService(
    authenticatedUser,
    requestParseResult.data,
  );

  if (createLeadResult.error || !createLeadResult.data) {
    const mappedError = mapServiceError(createLeadResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.created,
    status: "success",
    message: LEAD_CREATED_SUCCESS_MESSAGE,
    data: createLeadResult.data,
  });
};
