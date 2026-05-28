// CONSTANTS //
import { ADMIN_REPORTS_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  getFunnelReportController,
  getReportOverviewController,
  getSourcePerformanceController,
} from "./admin-reports.controller.js";
// LIBRARIES //
import { Hono } from "hono";

export const adminReportsRoutes = new Hono();

adminReportsRoutes.get(
  `${ADMIN_REPORTS_ROUTE_BASE_PATH}/overview`,
  getReportOverviewController,
);
adminReportsRoutes.get(
  `${ADMIN_REPORTS_ROUTE_BASE_PATH}/sources`,
  getSourcePerformanceController,
);
adminReportsRoutes.get(
  `${ADMIN_REPORTS_ROUTE_BASE_PATH}/funnel`,
  getFunnelReportController,
);
