// CONSTANTS //
import {
  HTTP_STATUS_CODES,
  INTERNAL_SERVER_ERROR_MESSAGE,
  ROUTE_NOT_FOUND_MESSAGE,
} from "./common/constants/http.constants.js";
// UTILS //
import { sendResponse } from "./common/utils/send-response.js";
// SERVICES //
import { adminDashboardRoutes } from "./modules/admin-dashboard/admin-dashboard.routes.js";
import { adminReportsRoutes } from "./modules/admin-reports/admin-reports.routes.js";
import { adminTeamRoutes } from "./modules/admin-team/admin-team.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { salesLeadsRoutes } from "./modules/sales-leads/sales-leads.routes.js";
// LIBRARIES //
import { Hono } from "hono";
import type { Context, Next } from "hono";

const requestLoggerMiddleware = async (
  context: Context,
  next: Next,
): Promise<void> => {
  const requestStartedAt = Date.now();

  await next();

  const responseDuration = Date.now() - requestStartedAt;
  context.header("x-response-time-ms", responseDuration.toString());
};

export const app = new Hono();

app.use("*", requestLoggerMiddleware);
app.route("/", healthRoutes);
app.route("/", authRoutes);
app.route("/", salesLeadsRoutes);
app.route("/", adminDashboardRoutes);
app.route("/", adminReportsRoutes);
app.route("/", adminTeamRoutes);

app.notFound((context) =>
  sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.notFound,
    status: "error",
    message: ROUTE_NOT_FOUND_MESSAGE,
    error: ROUTE_NOT_FOUND_MESSAGE,
  }),
);

app.onError((error, context) => {
  console.error("[app] unhandled error", {
    method: context.req.method,
    path: context.req.path,
    error,
  });

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.internalServerError,
    status: "error",
    message: INTERNAL_SERVER_ERROR_MESSAGE,
    error: INTERNAL_SERVER_ERROR_MESSAGE,
  });
});
