// CONSTANTS //
import { ADMIN_DASHBOARD_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  getAdminSummaryController,
  getLeadsBySourceController,
  getTopPerformersController,
  getTopReferrersController,
} from "./admin-dashboard.controller.js";
// LIBRARIES //
import { Hono } from "hono";

/**
 * Registers admin dashboard REST endpoints under the shared dashboard base path.
 */
export const adminDashboardRoutes = new Hono();

adminDashboardRoutes.get(
  `${ADMIN_DASHBOARD_ROUTE_BASE_PATH}/summary`,
  getAdminSummaryController,
);
adminDashboardRoutes.get(
  `${ADMIN_DASHBOARD_ROUTE_BASE_PATH}/sources`,
  getLeadsBySourceController,
);
adminDashboardRoutes.get(
  `${ADMIN_DASHBOARD_ROUTE_BASE_PATH}/top-performers`,
  getTopPerformersController,
);
adminDashboardRoutes.get(
  `${ADMIN_DASHBOARD_ROUTE_BASE_PATH}/top-referrers`,
  getTopReferrersController,
);
