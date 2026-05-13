// CONSTANTS //
import {
  HEALTH_SUCCESS_MESSAGE,
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
  INVALID_HEALTH_REQUEST_MESSAGE,
} from "../../common/constants/http.constants.js";
// UTILS //
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { getHealthStatusService } from "./health.service.js";
// TYPES //
import { healthQuerySchema } from "./health.types.js";
// LIBRARIES //
import type { Context } from "hono";

/**
 * Returns the current API health information.
 */
export const getHealthController = async (context: Context): Promise<Response> => {
  const queryParseResult = healthQuerySchema.safeParse(context.req.query());

  if (!queryParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_HEALTH_REQUEST_MESSAGE,
      error: queryParseResult.error.message,
    });
  }

  const healthStatusResult = await getHealthStatusService();

  if (healthStatusResult.error || !healthStatusResult.data) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.internalServerError,
      status: "error",
      message: INTERNAL_SERVER_ERROR_MESSAGE,
      error: INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: HEALTH_SUCCESS_MESSAGE,
    data: healthStatusResult.data,
  });
};
