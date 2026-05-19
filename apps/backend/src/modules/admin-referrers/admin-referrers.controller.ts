// TYPES //
import type {
  AdminReferrerParamsData,
  AdminReferrersListQueryData,
  AdminReferrersServiceErrorData,
  AdminReferredLeadsQueryData,
} from "./admin-referrers.types.js";
import {
  adminReferrerParamsSchema,
  adminReferrersListQuerySchema,
  adminReferredLeadsQuerySchema,
} from "./admin-referrers.types.js";
// CONSTANTS //
import {
  ADMIN_REFERRERS_LIST_SUCCESS_MESSAGE,
  ADMIN_REFERRER_DETAILS_SUCCESS_MESSAGE,
  ADMIN_REFERRER_LEADS_SUCCESS_MESSAGE,
  INVALID_ADMIN_REFERRERS_QUERY_MESSAGE,
  INVALID_ADMIN_REFERRER_ID_MESSAGE,
} from "../../common/constants/admin-referrers.constants.js";
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { requireAuthenticatedAdminUser } from "../../common/utils/authenticated-user.js";
import { formatZodError } from "../../common/utils/format-zod-error.js";
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getAdminReferrersService } from "./admin-referrers.service.js";
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

  const serviceError = error as Partial<AdminReferrersServiceErrorData>;

  if (serviceError.code === "BAD_REQUEST") {
    return {
      statusCode: HTTP_STATUS_CODES.badRequest,
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

  return {
    statusCode: HTTP_STATUS_CODES.internalServerError,
    message: INTERNAL_SERVER_ERROR_MESSAGE,
    errorDetail: INTERNAL_SERVER_ERROR_MESSAGE,
  };
};

const parseParams = (
  context: Context,
): {
  params: AdminReferrerParamsData | null;
  errorResponse: Response | null;
} => {
  const paramsParseResult = adminReferrerParamsSchema.safeParse(context.req.param());

  if (!paramsParseResult.success) {
    return {
      params: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_ADMIN_REFERRER_ID_MESSAGE,
        error: formatZodError(paramsParseResult.error),
      }),
    };
  }

  return {
    params: paramsParseResult.data,
    errorResponse: null,
  };
};

const parseListQuery = (
  context: Context,
): {
  query: AdminReferrersListQueryData | null;
  errorResponse: Response | null;
} => {
  const queryParseResult = adminReferrersListQuerySchema.safeParse(
    context.req.query(),
  );

  if (!queryParseResult.success) {
    return {
      query: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_ADMIN_REFERRERS_QUERY_MESSAGE,
        error: formatZodError(queryParseResult.error),
      }),
    };
  }

  return {
    query: queryParseResult.data,
    errorResponse: null,
  };
};

const parseLeadsQuery = (
  context: Context,
): {
  query: AdminReferredLeadsQueryData | null;
  errorResponse: Response | null;
} => {
  const queryParseResult = adminReferredLeadsQuerySchema.safeParse(
    context.req.query(),
  );

  if (!queryParseResult.success) {
    return {
      query: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_ADMIN_REFERRERS_QUERY_MESSAGE,
        error: formatZodError(queryParseResult.error),
      }),
    };
  }

  return {
    query: queryParseResult.data,
    errorResponse: null,
  };
};

export const getReferrersController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseListQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const referrersResult = await getAdminReferrersService().getReferrersService(
    authenticatedUser,
    query,
  );

  if (referrersResult.error || !referrersResult.data) {
    const mappedError = mapServiceError(referrersResult.error);

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
    message: ADMIN_REFERRERS_LIST_SUCCESS_MESSAGE,
    data: referrersResult.data,
  });
};

export const getReferrerByIdController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const referrerResult =
    await getAdminReferrersService().getReferrerByIdService(
      authenticatedUser,
      params.referrerId,
    );

  if (referrerResult.error || !referrerResult.data) {
    const mappedError = mapServiceError(referrerResult.error);

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
    message: ADMIN_REFERRER_DETAILS_SUCCESS_MESSAGE,
    data: referrerResult.data,
  });
};

export const getReferredLeadsController = async (
  context: Context,
): Promise<Response> => {
  const { authenticatedUser, errorResponse } =
    await requireAuthenticatedAdminUser(context);

  if (errorResponse || !authenticatedUser) {
    return errorResponse as Response;
  }

  const { params, errorResponse: paramsErrorResponse } = parseParams(context);

  if (paramsErrorResponse || !params) {
    return paramsErrorResponse as Response;
  }

  const { query, errorResponse: queryErrorResponse } = parseLeadsQuery(context);

  if (queryErrorResponse || !query) {
    return queryErrorResponse as Response;
  }

  const leadsResult = await getAdminReferrersService().getReferredLeadsService(
    authenticatedUser,
    params.referrerId,
    query,
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
    message: ADMIN_REFERRER_LEADS_SUCCESS_MESSAGE,
    data: leadsResult.data,
  });
};
