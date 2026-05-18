// TYPES //
import type {
  AdminDashboardServiceErrorData,
  AdminLeaderboardQueryData,
  AdminSummaryQueryData,
} from "./admin-dashboard.types.js";
import {
  adminLeaderboardQuerySchema,
  adminSummaryQuerySchema,
} from "./admin-dashboard.types.js";
// CONSTANTS //
import {
  ADMIN_LEADS_BY_SOURCE_SUCCESS_MESSAGE,
  ADMIN_SUMMARY_SUCCESS_MESSAGE,
  ADMIN_TOP_PERFORMERS_SUCCESS_MESSAGE,
  ADMIN_TOP_REFERRERS_SUCCESS_MESSAGE,
} from "../../common/constants/admin-dashboard.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { requireAuthenticatedAdminUser } from "../../common/utils/authenticated-user.js";
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getAdminDashboardService } from "./admin-dashboard.service.js";
// LIBRARIES //
import type { Context } from "hono";

/**
 * Translates service-layer errors into the standardized HTTP response contract.
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

  const adminDashboardError = error as Partial<AdminDashboardServiceErrorData>;

  if (adminDashboardError.code === "BAD_REQUEST") {
    return {
      statusCode: HTTP_STATUS_CODES.badRequest,
      message: error.message,
      errorDetail: error.message,
    };
  }

  return {
    statusCode: HTTP_STATUS_CODES.internalServerError,
    message: INTERNAL_SERVER_ERROR_MESSAGE,
    errorDetail: INTERNAL_SERVER_ERROR_MESSAGE,
  };
};

/**
 * Validates summary endpoint query params before controller execution continues.
 */
const parseSummaryQuery = (
  context: Context,
): {
  query: AdminSummaryQueryData | null;
  errorResponse: Response | null;
} => {
  const queryParseResult = adminSummaryQuerySchema.safeParse(context.req.query());

  if (!queryParseResult.success) {
    return {
      query: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: "Invalid admin dashboard summary query.",
        error: queryParseResult.error.message,
      }),
    };
  }

  return {
    query: queryParseResult.data,
    errorResponse: null,
  };
};

/**
 * Validates leaderboard endpoint query params before controller execution continues.
 */
const parseLeaderboardQuery = (
  context: Context,
): {
  query: AdminLeaderboardQueryData | null;
  errorResponse: Response | null;
} => {
  const queryParseResult = adminLeaderboardQuerySchema.safeParse(
    context.req.query(),
  );

  if (!queryParseResult.success) {
    return {
      query: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: "Invalid admin dashboard leaderboard query.",
        error: queryParseResult.error.message,
      }),
    };
  }

  return {
    query: queryParseResult.data,
    errorResponse: null,
  };
};

/**
 * Handles GET /admin/dashboard/summary and returns admin summary metrics.
 */
export const getAdminSummaryController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseSummaryQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const adminSummaryResult =
    await getAdminDashboardService().getAdminSummaryService(
      authenticatedUser,
      query.period,
    );

  if (adminSummaryResult.error || !adminSummaryResult.data) {
    const mappedError = mapServiceError(adminSummaryResult.error);

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
    message: ADMIN_SUMMARY_SUCCESS_MESSAGE,
    data: adminSummaryResult.data,
  });
};

/**
 * Handles GET /admin/dashboard/sources and returns lead counts grouped by source.
 */
export const getLeadsBySourceController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseSummaryQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const leadsBySourceResult =
    await getAdminDashboardService().getLeadsBySourceService(
      authenticatedUser,
      query.period,
    );

  if (leadsBySourceResult.error || !leadsBySourceResult.data) {
    const mappedError = mapServiceError(leadsBySourceResult.error);

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
    message: ADMIN_LEADS_BY_SOURCE_SUCCESS_MESSAGE,
    data: leadsBySourceResult.data,
  });
};

/**
 * Handles GET /admin/dashboard/top-performers and returns ranked salesperson metrics.
 */
export const getTopPerformersController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } =
    parseLeaderboardQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const topPerformersResult =
    await getAdminDashboardService().getTopPerformersService(
      authenticatedUser,
      query.period,
      query.limit,
    );

  if (topPerformersResult.error || !topPerformersResult.data) {
    const mappedError = mapServiceError(topPerformersResult.error);

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
    message: ADMIN_TOP_PERFORMERS_SUCCESS_MESSAGE,
    data: topPerformersResult.data,
  });
};

/**
 * Handles GET /admin/dashboard/top-referrers and returns ranked referrer metrics.
 */
export const getTopReferrersController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } =
    parseLeaderboardQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const topReferrersResult =
    await getAdminDashboardService().getTopReferrersService(
      authenticatedUser,
      query.period,
      query.limit,
    );

  if (topReferrersResult.error || !topReferrersResult.data) {
    const mappedError = mapServiceError(topReferrersResult.error);

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
    message: ADMIN_TOP_REFERRERS_SUCCESS_MESSAGE,
    data: topReferrersResult.data,
  });
};
