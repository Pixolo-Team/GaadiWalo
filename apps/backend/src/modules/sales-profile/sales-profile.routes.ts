// CONSTANTS //
import { SALES_PROFILE_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  changeSalesPasswordController,
  getSalesPerformanceController,
  getSalesProfileController,
  updateSalesNotificationsController,
  updateSalesProfileController,
} from "./sales-profile.controller.js";
// LIBRARIES //
import { Hono } from "hono";

export const salesProfileRoutes = new Hono();

salesProfileRoutes.get(
  `${SALES_PROFILE_ROUTE_BASE_PATH}/:userCode`,
  getSalesProfileController,
);
salesProfileRoutes.patch(
  `${SALES_PROFILE_ROUTE_BASE_PATH}/:userCode`,
  updateSalesProfileController,
);
salesProfileRoutes.post(
  `${SALES_PROFILE_ROUTE_BASE_PATH}/:userCode/change-password`,
  changeSalesPasswordController,
);
salesProfileRoutes.patch(
  `${SALES_PROFILE_ROUTE_BASE_PATH}/:userCode/notifications`,
  updateSalesNotificationsController,
);
salesProfileRoutes.get(
  `${SALES_PROFILE_ROUTE_BASE_PATH}/:userCode/performance`,
  getSalesPerformanceController,
);
