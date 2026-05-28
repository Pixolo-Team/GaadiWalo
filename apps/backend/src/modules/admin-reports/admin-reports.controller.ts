// TYPES //
import type {
  AdminReportsDateRangeQueryData,
  AdminReportsServiceErrorData,
} from "./admin-reports.types.js";
import { adminReportsDateRangeQuerySchema } from "./admin-reports.types.js";
// CONSTANTS //
import {
  ADMIN_REPORTS_FUNNEL_SUCCESS_MESSAGE,
  ADMIN_REPORTS_OVERVIEW_SUCCESS_MESSAGE,
  ADMIN_REPORTS_SOURCES_SUCCESS_MESSAGE,
  INVALID_ADMIN_REPORTS_QUERY_MESSAGE,
} from "../../common/constants/admin-reports.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { requireAuthenticatedAdminUser } from "../../common/utils/authenticated-user.js";
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getAdminReportsService } from "./admin-reports.service.js";
// LIBRARIES //
import type { Context } from "hono";

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

  const adminReportsError = error as Partial<AdminReportsServiceErrorData>;

  if (adminReportsError.code === "BAD_REQUEST") {
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

const parseDateRangeQuery = (
  context: Context,
): {
  query: AdminReportsDateRangeQueryData | null;
  errorResponse: Response | null;
} => {
  const queryParseResult = adminReportsDateRangeQuerySchema.safeParse(
    context.req.query(),
  );

  if (!queryParseResult.success) {
    return {
      query: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_ADMIN_REPORTS_QUERY_MESSAGE,
        error: queryParseResult.error.message,
      }),
    };
  }

  return {
    query: queryParseResult.data,
    errorResponse: null,
  };
};

export const getReportOverviewController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseDateRangeQuery(
    context,
  );

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const reportOverviewResult =
    await getAdminReportsService().getReportOverviewService(
      authenticatedUser,
      query,
    );

  if (reportOverviewResult.error || !reportOverviewResult.data) {
    const mappedError = mapServiceError(reportOverviewResult.error);

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
    message: ADMIN_REPORTS_OVERVIEW_SUCCESS_MESSAGE,
    data: reportOverviewResult.data,
  });
};

export const getSourcePerformanceController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseDateRangeQuery(
    context,
  );

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const sourcePerformanceResult =
    await getAdminReportsService().getSourcePerformanceService(
      authenticatedUser,
      query,
    );

  if (sourcePerformanceResult.error || !sourcePerformanceResult.data) {
    const mappedError = mapServiceError(sourcePerformanceResult.error);

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
    message: ADMIN_REPORTS_SOURCES_SUCCESS_MESSAGE,
    data: sourcePerformanceResult.data,
  });
};

export const getFunnelReportController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseDateRangeQuery(
    context,
  );

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const funnelReportResult = await getAdminReportsService().getFunnelReportService(
    authenticatedUser,
    query,
  );

  if (funnelReportResult.error || !funnelReportResult.data) {
    const mappedError = mapServiceError(funnelReportResult.error);

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
    message: ADMIN_REPORTS_FUNNEL_SUCCESS_MESSAGE,
    data: funnelReportResult.data,
  });
};
