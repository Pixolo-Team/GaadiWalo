// CONSTANTS //
import { HEALTH_ROUTE_PATH } from "../../common/constants/http.constants.js";

// SERVICES //
import { getHealthController } from "./health.controller.js";

// LIBRARIES //
import { Hono } from "hono";

export const healthRoutes = new Hono();

healthRoutes.get(HEALTH_ROUTE_PATH, getHealthController);
