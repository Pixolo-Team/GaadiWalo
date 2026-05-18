export const HEALTH_ROUTE_PATH = "/health";
export const AUTH_ROUTE_BASE_PATH = "/auth";
export const SALES_LEADS_ROUTE_BASE_PATH = "/sales/leads";
export const ADMIN_DASHBOARD_ROUTE_BASE_PATH = "/admin/dashboard";

export const SERVICE_NAME = "@gaadiwalo/backend";
export const SERVICE_VERSION = "1.0.0";

export const HEALTH_SUCCESS_MESSAGE = "Health check completed successfully.";
export const INVALID_HEALTH_REQUEST_MESSAGE = "Invalid health check request.";
export const ROUTE_NOT_FOUND_MESSAGE = "The requested endpoint was not found.";
export const INTERNAL_SERVER_ERROR_MESSAGE = "An unexpected error occurred.";

export const HTTP_STATUS_CODES = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  tooManyRequests: 429,
  internalServerError: 500,
} as const;
