export const HEALTH_ROUTE_PATH = "/health";
export const SERVICE_NAME = "@gaadiwalo/backend";
export const SERVICE_VERSION = "1.0.0";
export const HEALTH_SUCCESS_MESSAGE = "Health check completed successfully.";
export const INVALID_HEALTH_REQUEST_MESSAGE = "Invalid health check request.";
export const ROUTE_NOT_FOUND_MESSAGE = "The requested endpoint was not found.";
export const INTERNAL_SERVER_ERROR_MESSAGE = "An unexpected error occurred.";

export const HTTP_STATUS_CODES = {
  ok: 200,
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
} as const;
