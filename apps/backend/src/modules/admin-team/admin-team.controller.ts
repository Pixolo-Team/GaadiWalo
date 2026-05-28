// TYPES //
import type { Context } from "hono";
import type { AdminTeamServiceErrorData } from "./admin-team.types.js";
import {
  adminTeamParamsSchema,
  adminTeamQuerySchema,
  createSalespersonRequestSchema,
  removeSalespersonRequestSchema,
  updateSalespersonRequestSchema,
} from "./admin-team.types.js";
// CONSTANTS //
import {
  ADMIN_TEAM_CREATED_SUCCESS_MESSAGE,
  ADMIN_TEAM_DETAILS_SUCCESS_MESSAGE,
  ADMIN_TEAM_LIST_SUCCESS_MESSAGE,
  ADMIN_TEAM_OPTIONS_SUCCESS_MESSAGE,
  ADMIN_TEAM_PASSWORD_RESET_SUCCESS_MESSAGE,
  ADMIN_TEAM_REMOVED_SUCCESS_MESSAGE,
  ADMIN_TEAM_UPDATED_SUCCESS_MESSAGE,
  INVALID_ADMIN_TEAM_MEMBER_MESSAGE,
  INVALID_ADMIN_TEAM_QUERY_MESSAGE,
  INVALID_CREATE_SALESPERSON_REQUEST_MESSAGE,
  INVALID_REMOVE_SALESPERSON_REQUEST_MESSAGE,
  INVALID_UPDATE_SALESPERSON_REQUEST_MESSAGE,
} from "../../common/constants/admin-team.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { requireAuthenticatedAdminUser } from "../../common/utils/authenticated-user.js";
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getAdminTeamService } from "./admin-team.service.js";

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

  const adminTeamError = error as Partial<AdminTeamServiceErrorData>;

  switch (adminTeamError.code) {
    case "BAD_REQUEST":
      return {
        statusCode: HTTP_STATUS_CODES.badRequest,
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

const parseSalespersonIdParams = (
  context: Context,
): { salespersonId: string | null; errorResponse: Response | null } => {
  const paramsParseResult = adminTeamParamsSchema.safeParse(context.req.param());

  if (!paramsParseResult.success) {
    return {
      salespersonId: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_ADMIN_TEAM_MEMBER_MESSAGE,
        error: paramsParseResult.error.message,
      }),
    };
  }

  return {
    salespersonId: paramsParseResult.data.salespersonId,
    errorResponse: null,
  };
};

/**
 * Handles GET /admin/team and returns the sales team list.
 */
export const getTeamController = async (context: Context): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const queryParseResult = adminTeamQuerySchema.safeParse(context.req.query());

  if (!queryParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_ADMIN_TEAM_QUERY_MESSAGE,
      error: queryParseResult.error.message,
    });
  }

  const teamResult = await getAdminTeamService().getTeamService(
    authenticatedUser,
    queryParseResult.data,
  );

  if (teamResult.error || !teamResult.data) {
    const mappedError = mapServiceError(teamResult.error);

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
    message: ADMIN_TEAM_LIST_SUCCESS_MESSAGE,
    data: teamResult.data,
  });
};

/**
 * Handles GET /admin/team/options and returns lookup values for team forms.
 */
export const getTeamOptionsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const optionsResult =
    await getAdminTeamService().getTeamOptionsService(authenticatedUser);

  if (optionsResult.error || !optionsResult.data) {
    const mappedError = mapServiceError(optionsResult.error);

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
    message: ADMIN_TEAM_OPTIONS_SUCCESS_MESSAGE,
    data: optionsResult.data,
  });
};

/**
 * Handles GET /admin/team/:salespersonId and returns one salesperson.
 */
export const getSalespersonByIdController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { salespersonId, errorResponse: paramsErrorResponse } =
    parseSalespersonIdParams(context);

  if (paramsErrorResponse || !salespersonId) {
    return paramsErrorResponse as Response;
  }

  const period = context.req.query("period") ?? "this-month";
  const salespersonResult =
    await getAdminTeamService().getSalespersonByIdService(
      authenticatedUser,
      salespersonId,
      period,
    );

  if (salespersonResult.error || !salespersonResult.data) {
    const mappedError = mapServiceError(salespersonResult.error);

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
    message: ADMIN_TEAM_DETAILS_SUCCESS_MESSAGE,
    data: salespersonResult.data,
  });
};

/**
 * Handles POST /admin/team and creates a new salesperson.
 */
export const createSalespersonController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = createSalespersonRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_CREATE_SALESPERSON_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const createResult = await getAdminTeamService().createSalespersonService(
    authenticatedUser,
    requestParseResult.data,
  );

  if (createResult.error || !createResult.data) {
    const mappedError = mapServiceError(createResult.error);

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
    message: ADMIN_TEAM_CREATED_SUCCESS_MESSAGE,
    data: createResult.data,
  });
};

/**
 * Handles PATCH /admin/team/:salespersonId and updates salesperson fields.
 */
export const updateSalespersonController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { salespersonId, errorResponse: paramsErrorResponse } =
    parseSalespersonIdParams(context);

  if (paramsErrorResponse || !salespersonId) {
    return paramsErrorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = updateSalespersonRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_UPDATE_SALESPERSON_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const updateResult = await getAdminTeamService().updateSalespersonService(
    authenticatedUser,
    salespersonId,
    requestParseResult.data,
  );

  if (updateResult.error || !updateResult.data) {
    const mappedError = mapServiceError(updateResult.error);

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
    message: ADMIN_TEAM_UPDATED_SUCCESS_MESSAGE,
    data: updateResult.data,
  });
};

/**
 * Handles POST /admin/team/:salespersonId/reset-password and rotates password.
 */
export const resetSalespersonPasswordController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { salespersonId, errorResponse: paramsErrorResponse } =
    parseSalespersonIdParams(context);

  if (paramsErrorResponse || !salespersonId) {
    return paramsErrorResponse as Response;
  }

  const resetResult =
    await getAdminTeamService().resetSalespersonPasswordService(
      authenticatedUser,
      salespersonId,
    );

  if (resetResult.error || !resetResult.data) {
    const mappedError = mapServiceError(resetResult.error);

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
    message: ADMIN_TEAM_PASSWORD_RESET_SUCCESS_MESSAGE,
    data: resetResult.data,
  });
};

/**
 * Handles DELETE /admin/team/:salespersonId and deactivates the salesperson.
 */
export const removeSalespersonController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { salespersonId, errorResponse: paramsErrorResponse } =
    parseSalespersonIdParams(context);

  if (paramsErrorResponse || !salespersonId) {
    return paramsErrorResponse as Response;
  }

  const { requestBody, errorResponse: bodyErrorResponse } =
    await parseRequestBody(context);

  if (bodyErrorResponse) {
    return bodyErrorResponse;
  }

  const requestParseResult = removeSalespersonRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_REMOVE_SALESPERSON_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const removeResult = await getAdminTeamService().removeSalespersonService(
    authenticatedUser,
    salespersonId,
    requestParseResult.data,
  );

  if (removeResult.error || !removeResult.data) {
    const mappedError = mapServiceError(removeResult.error);

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
    message: ADMIN_TEAM_REMOVED_SUCCESS_MESSAGE,
    data: removeResult.data,
  });
};
