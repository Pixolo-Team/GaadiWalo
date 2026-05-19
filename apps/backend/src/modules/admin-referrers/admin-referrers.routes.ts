// CONSTANTS //
import { ADMIN_REFERRERS_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  getReferrerByIdController,
  getReferrersController,
  getReferredLeadsController,
} from "./admin-referrers.controller.js";
// LIBRARIES //
import { Hono } from "hono";

export const adminReferrersRoutes = new Hono();

adminReferrersRoutes.get(`${ADMIN_REFERRERS_ROUTE_BASE_PATH}`, getReferrersController);
adminReferrersRoutes.get(
  `${ADMIN_REFERRERS_ROUTE_BASE_PATH}/:referrerId`,
  getReferrerByIdController,
);
adminReferrersRoutes.get(
  `${ADMIN_REFERRERS_ROUTE_BASE_PATH}/:referrerId/leads`,
  getReferredLeadsController,
);
