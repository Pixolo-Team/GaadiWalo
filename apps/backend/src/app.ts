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
import { adminReferrersRoutes } from "./modules/admin-referrers/admin-referrers.routes.js";
import { adminReportsRoutes } from "./modules/admin-reports/admin-reports.routes.js";
import { adminTeamRoutes } from "./modules/admin-team/admin-team.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { salesLeadsRoutes } from "./modules/sales-leads/sales-leads.routes.js";
import { salesProfileRoutes } from "./modules/sales-profile/sales-profile.routes.js";

// LIBRARIES //
import { Hono } from "hono";
import type { Context, Next } from "hono";
import { cors } from "hono/cors";

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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",

  // Current Vercel frontend
  "https://gaadi-walo-git-master-gaadiwalopixolo-4249s-projects.vercel.app",

  // Future/custom production domain if you use it
  "https://gaadi-walo.vercel.app",
];

app.use(
  "*",
  cors({
    origin: (origin) => {
      console.log("[cors] incoming origin:", origin);

      if (!origin) {
        return "";
      }

      const isExactAllowed = allowedOrigins.includes(origin);

      const isGaadiWaloVercelPreview =
        origin.endsWith(".vercel.app") && origin.includes("gaadi-walo");

      if (isExactAllowed || isGaadiWaloVercelPreview) {
        return origin;
      }

      console.warn("[cors] blocked origin:", origin);
      return "";
    },

    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],

    credentials: true,
  }),
);

app.use("*", requestLoggerMiddleware);

app.route("/", healthRoutes);
app.route("/", authRoutes);
app.route("/", salesLeadsRoutes);
app.route("/", salesProfileRoutes);
app.route("/", adminDashboardRoutes);
app.route("/", adminReferrersRoutes);
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