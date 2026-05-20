// TYPES //
import type {
  ChangeSalesPasswordRequestData,
  NotificationPreferencesRequestData,
  SalesPerformanceQueryData,
  SalesProfileParamsData,
  SalesProfileServiceErrorData,
  UpdateSalesProfileRequestData,
} from "./sales-profile.types.js";
import {
  changeSalesPasswordRequestSchema,
  notificationPreferencesSchema,
  salesPerformanceQuerySchema,
  salesProfileParamsSchema,
  updateSalesProfileRequestSchema,
} from "./sales-profile.types.js";
// CONSTANTS //
import {
  INVALID_CHANGE_PASSWORD_REQUEST_MESSAGE,
  INVALID_SALES_PROFILE_ID_MESSAGE,
  INVALID_SALES_PROFILE_QUERY_MESSAGE,
  INVALID_UPDATE_NOTIFICATIONS_REQUEST_MESSAGE,
  INVALID_UPDATE_SALES_PROFILE_REQUEST_MESSAGE,
  SALES_PROFILE_FETCH_SUCCESS_MESSAGE,
  SALES_PROFILE_NOTIFICATIONS_UPDATED_SUCCESS_MESSAGE,
  SALES_PROFILE_PASSWORD_UPDATED_SUCCESS_MESSAGE,
  SALES_PROFILE_PERFORMANCE_SUCCESS_MESSAGE,
  SALES_PROFILE_UPDATED_SUCCESS_MESSAGE,
} from "../../common/constants/sales-profile.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { requireAuthenticatedSalesUser } from "../../common/utils/authenticated-user.js";
import { formatZodError } from "../../common/utils/format-zod-error.js";
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getSalesProfileService } from "./sales-profile.service.js";
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

  const serviceError = error as Partial<SalesProfileServiceErrorData>;

  if (serviceError.code === "BAD_REQUEST") {
    return {
      statusCode: HTTP_STATUS_CODES.badRequest,
      message: error.message,
      errorDetail: error.message,
    };
  }

  if (serviceError.code === "FORBIDDEN") {
    return {
      statusCode: HTTP_STATUS_CODES.forbidden,
      message: error.message,
      errorDetail: error.message,
    };
  }

  if (serviceError.code === "NOT_FOUND") {
    return {
      statusCode: HTTP_STATUS_CODES.notFound,
      message: error.message,
      errorDetail: error.message,
    };
  }

  if (serviceError.code === "CONFLICT") {
    return {
      statusCode: HTTP_STATUS_CODES.conflict,
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

const parseParams = (
  context: Context,
): {
  params: SalesProfileParamsData | null;
  errorResponse: Response | null;
} => {
  const paramsParseResult = salesProfileParamsSchema.safeParse(context.req.param());

  if (!paramsParseResult.success) {
    return {
      params: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_SALES_PROFILE_ID_MESSAGE,
        error: formatZodError(paramsParseResult.error),
      }),
    };
  }

  return {
    params: paramsParseResult.data,
    errorResponse: null,
  };
};

const parsePerformanceQuery = (
  context: Context,
): {
  query: SalesPerformanceQueryData | null;
  errorResponse: Response | null;
} => {
  const queryParseResult = salesPerformanceQuerySchema.safeParse(
    context.req.query(),
  );

  if (!queryParseResult.success) {
    return {
      query: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_SALES_PROFILE_QUERY_MESSAGE,
        error: formatZodError(queryParseResult.error),
      }),
    };
  }

  return {
    query: queryParseResult.data,
    errorResponse: null,
  };
};

const parseUpdateBody = async (
  context: Context,
): Promise<{
  body: UpdateSalesProfileRequestData | null;
  errorResponse: Response | null;
}> => {
  const requestBody = await context.req.json().catch(() => null);
  const bodyParseResult = updateSalesProfileRequestSchema.safeParse(requestBody);

  if (!bodyParseResult.success) {
    return {
      body: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_UPDATE_SALES_PROFILE_REQUEST_MESSAGE,
        error: formatZodError(bodyParseResult.error),
      }),
    };
  }

  return {
    body: bodyParseResult.data,
    errorResponse: null,
  };
};

const parsePasswordBody = async (
  context: Context,
): Promise<{
  body: ChangeSalesPasswordRequestData | null;
  errorResponse: Response | null;
}> => {
  const requestBody = await context.req.json().catch(() => null);
  const bodyParseResult =
    changeSalesPasswordRequestSchema.safeParse(requestBody);

  if (!bodyParseResult.success) {
    return {
      body: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_CHANGE_PASSWORD_REQUEST_MESSAGE,
        error: formatZodError(bodyParseResult.error),
      }),
    };
  }

  return {
    body: bodyParseResult.data,
    errorResponse: null,
  };
};

const parseNotificationsBody = async (
  context: Context,
): Promise<{
  body: NotificationPreferencesRequestData | null;
  errorResponse: Response | null;
}> => {
  const requestBody = await context.req.json().catch(() => null);
  const bodyParseResult = notificationPreferencesSchema.safeParse(requestBody);

  if (!bodyParseResult.success) {
    return {
      body: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_UPDATE_NOTIFICATIONS_REQUEST_MESSAGE,
        error: formatZodError(bodyParseResult.error),
      }),
    };
  }

  return {
    body: bodyParseResult.data,
    errorResponse: null,
  };
};

export const getSalesProfileController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedSalesUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const profileResult = await getSalesProfileService().getSalesProfileService(
    authenticatedUser,
    params.userCode,
  );

  if (profileResult.error || !profileResult.data) {
    const mappedError = mapServiceError(profileResult.error);

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
    message: SALES_PROFILE_FETCH_SUCCESS_MESSAGE,
    data: profileResult.data,
  });
};

export const updateSalesProfileController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedSalesUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const { body, errorResponse: bodyErrorResponse } = await parseUpdateBody(
    context,
  );

  if (bodyErrorResponse || !body) {
    return bodyErrorResponse as Response;
  }

  const updateResult = await getSalesProfileService().updateSalesProfileService(
    authenticatedUser,
    params.userCode,
    body,
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
    message: SALES_PROFILE_UPDATED_SUCCESS_MESSAGE,
    data: updateResult.data,
  });
};

export const changeSalesPasswordController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedSalesUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const { body, errorResponse: bodyErrorResponse } = await parsePasswordBody(
    context,
  );

  if (bodyErrorResponse || !body) {
    return bodyErrorResponse as Response;
  }

  const changePasswordResult =
    await getSalesProfileService().changeSalesPasswordService(
      authenticatedUser,
      params.userCode,
      body,
    );

  if (changePasswordResult.error || !changePasswordResult.data) {
    const mappedError = mapServiceError(changePasswordResult.error);

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
    message: SALES_PROFILE_PASSWORD_UPDATED_SUCCESS_MESSAGE,
    data: changePasswordResult.data,
  });
};

export const updateSalesNotificationsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedSalesUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const { body, errorResponse: bodyErrorResponse } =
    await parseNotificationsBody(context);

  if (bodyErrorResponse || !body) {
    return bodyErrorResponse as Response;
  }

  const updateNotificationsResult =
    await getSalesProfileService().updateSalesNotificationsService(
      authenticatedUser,
      params.userCode,
      body,
    );

  if (updateNotificationsResult.error || !updateNotificationsResult.data) {
    const mappedError = mapServiceError(updateNotificationsResult.error);

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
    message: SALES_PROFILE_NOTIFICATIONS_UPDATED_SUCCESS_MESSAGE,
    data: updateNotificationsResult.data,
  });
};

export const getSalesPerformanceController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedSalesUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } =
    parsePerformanceQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const performanceResult =
    await getSalesProfileService().getSalesPerformanceService(
      authenticatedUser,
      params.userCode,
      query.period,
    );

  if (performanceResult.error || !performanceResult.data) {
    const mappedError = mapServiceError(performanceResult.error);

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
    message: SALES_PROFILE_PERFORMANCE_SUCCESS_MESSAGE,
    data: performanceResult.data,
  });
};
