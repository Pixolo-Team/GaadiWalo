// TYPES //
import type { MiddlewareHandler } from "hono";

// CONSTANTS //
import {
  INTERNAL_SERVER_ERROR_MESSAGE,
  ROUTE_NOT_FOUND_MESSAGE,
} from "./common/constants/http.constants.js";

// UTILS //
import { sendResponse } from "./common/utils/send-response.js";

// SERVICES //
import { healthRoutes } from "./modules/health/health.routes.js";

// LIBRARIES //
import { Hono } from "hono";

const requestLoggerMiddleware: MiddlewareHandler = async (context, next) => {
  // Keep the middleware lightweight while still exposing traceable timing.
  const requestStartedAt = Date.now();

  await next();

  const responseDuration = Date.now() - requestStartedAt;
  context.header("x-response-time-ms", responseDuration.toString());
};

export const app = new Hono();

app.use("*", requestLoggerMiddleware);
app.route("/", healthRoutes);

app.notFound((context) =>
  sendResponse({
    context,
    statusCode: 404,
    status: "error",
    message: ROUTE_NOT_FOUND_MESSAGE,
    error: ROUTE_NOT_FOUND_MESSAGE,
  }),
);

app.onError((error, context) =>
  sendResponse({
    context,
    statusCode: 500,
    status: "error",
    message: INTERNAL_SERVER_ERROR_MESSAGE,
    error: error.message,
  }),
);
