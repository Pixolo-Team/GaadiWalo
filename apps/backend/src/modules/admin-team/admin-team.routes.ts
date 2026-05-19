// CONSTANTS //
import { ADMIN_TEAM_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  createSalespersonController,
  getSalespersonByIdController,
  getTeamController,
  getTeamOptionsController,
  removeSalespersonController,
  resetSalespersonPasswordController,
  updateSalespersonController,
} from "./admin-team.controller.js";
// LIBRARIES //
import { Hono } from "hono";

export const adminTeamRoutes = new Hono();

adminTeamRoutes.get(`${ADMIN_TEAM_ROUTE_BASE_PATH}`, getTeamController);
adminTeamRoutes.get(`${ADMIN_TEAM_ROUTE_BASE_PATH}/options`, getTeamOptionsController);
adminTeamRoutes.get(
  `${ADMIN_TEAM_ROUTE_BASE_PATH}/:salespersonId`,
  getSalespersonByIdController,
);
adminTeamRoutes.post(`${ADMIN_TEAM_ROUTE_BASE_PATH}`, createSalespersonController);
adminTeamRoutes.patch(
  `${ADMIN_TEAM_ROUTE_BASE_PATH}/:salespersonId`,
  updateSalespersonController,
);
adminTeamRoutes.post(
  `${ADMIN_TEAM_ROUTE_BASE_PATH}/:salespersonId/reset-password`,
  resetSalespersonPasswordController,
);
adminTeamRoutes.delete(
  `${ADMIN_TEAM_ROUTE_BASE_PATH}/:salespersonId`,
  removeSalespersonController,
);
