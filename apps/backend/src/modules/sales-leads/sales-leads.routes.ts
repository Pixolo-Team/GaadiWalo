// CONSTANTS //
import { SALES_LEADS_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  createLeadController,
  createLeadNoteController,
  getCarBrandsController,
  getCarModelsController,
  getAllLeadsController,
  getLeadSourcesController,
  getLeadStatusesController,
  getLeadActivitiesController,
  getLeadDetailsController,
  getLeadNotesController,
  updateLeadDetailsController,
  updateLeadStatusController,
} from "./sales-leads.controller.js";
// LIBRARIES //
import { Hono } from "hono";

export const salesLeadsRoutes = new Hono();

salesLeadsRoutes.get(`${SALES_LEADS_ROUTE_BASE_PATH}`, getAllLeadsController);
salesLeadsRoutes.get(
  `${SALES_LEADS_ROUTE_BASE_PATH}/statuses`,
  getLeadStatusesController,
);
salesLeadsRoutes.get(
  `${SALES_LEADS_ROUTE_BASE_PATH}/lead-sources`,
  getLeadSourcesController,
);
salesLeadsRoutes.get(
  `${SALES_LEADS_ROUTE_BASE_PATH}/car-brands`,
  getCarBrandsController,
);
salesLeadsRoutes.get(
  `${SALES_LEADS_ROUTE_BASE_PATH}/car-brands/:carBrandName/car-models`,
  getCarModelsController,
);
salesLeadsRoutes.get(`${SALES_LEADS_ROUTE_BASE_PATH}/:leadId`, getLeadDetailsController);
salesLeadsRoutes.get(
  `${SALES_LEADS_ROUTE_BASE_PATH}/:leadId/activities`,
  getLeadActivitiesController,
);
salesLeadsRoutes.get(
  `${SALES_LEADS_ROUTE_BASE_PATH}/:leadId/notes`,
  getLeadNotesController,
);
salesLeadsRoutes.patch(
  `${SALES_LEADS_ROUTE_BASE_PATH}/:leadId/status`,
  updateLeadStatusController,
);
salesLeadsRoutes.patch(
  `${SALES_LEADS_ROUTE_BASE_PATH}/:leadId`,
  updateLeadDetailsController,
);
salesLeadsRoutes.post(
  `${SALES_LEADS_ROUTE_BASE_PATH}/:leadId/notes`,
  createLeadNoteController,
);
salesLeadsRoutes.post(`${SALES_LEADS_ROUTE_BASE_PATH}`, createLeadController);
