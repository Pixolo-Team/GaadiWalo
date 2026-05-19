export const LEAD_STATUS_VALUES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "TEST_DRIVE",
  "NEGOTIATION",
  "WON",
  "LOST",
  "VEHICLE_NA",
] as const;

export const LEAD_ACTIVITY_TYPE_VALUES = [
  "call",
  "whatsapp",
  "note",
  "status_change",
  "system",
] as const;

export const SALES_ROLE_VALUE = "sales";
export const ADMIN_ROLE_VALUE = "admin";

export const INVALID_LEAD_ID_MESSAGE = "Invalid lead identifier.";
export const INVALID_LEAD_STATUS_REQUEST_MESSAGE =
  "Invalid lead status update request.";
export const INVALID_LEAD_DETAILS_REQUEST_MESSAGE =
  "Invalid lead details update request.";
export const INVALID_CAR_BRAND_ID_MESSAGE = "Invalid car brand identifier.";
export const INVALID_CREATE_LEAD_REQUEST_MESSAGE =
  "Invalid create lead request.";
export const INVALID_CREATE_LEAD_NOTE_REQUEST_MESSAGE =
  "Invalid create lead note request.";

export const LEAD_DETAILS_SUCCESS_MESSAGE =
  "Lead details fetched successfully.";
export const LEADS_SUCCESS_MESSAGE = "Leads fetched successfully.";
export const CAR_BRANDS_SUCCESS_MESSAGE =
  "Car brands fetched successfully.";
export const CAR_MODELS_SUCCESS_MESSAGE =
  "Car models fetched successfully.";
export const LEAD_ACTIVITIES_SUCCESS_MESSAGE =
  "Lead activities fetched successfully.";
export const LEAD_NOTES_SUCCESS_MESSAGE = "Lead notes fetched successfully.";
export const LEAD_STATUS_UPDATED_SUCCESS_MESSAGE =
  "Lead status updated successfully.";
export const LEAD_DETAILS_UPDATED_SUCCESS_MESSAGE =
  "Lead details updated successfully.";
export const LEAD_NOTE_CREATED_SUCCESS_MESSAGE =
  "Lead note created successfully.";
export const LEAD_CREATED_SUCCESS_MESSAGE = "Lead created successfully.";

export const LEAD_NOT_FOUND_MESSAGE = "Lead not found.";
export const LEAD_ACCESS_FORBIDDEN_MESSAGE =
  "You are not allowed to access this lead.";
export const LEAD_CREATE_FORBIDDEN_MESSAGE =
  "You are not allowed to create leads.";
export const LEAD_DUPLICATE_PHONE_MESSAGE =
  "A lead with this phone number already exists.";
export const LEAD_UNAUTHORIZED_MESSAGE =
  "Authentication is required to access this resource.";
export const CAR_MODEL_REQUIRES_BRAND_MESSAGE =
  "Car brand is required when car model is provided.";
export const LEAD_STATUS_CHANGE_ACTIVITY_TEMPLATE =
  "Lead status changed from {previousStatus} to {nextStatus}.";
export const LEAD_NOTE_ACTIVITY_DESCRIPTION = "A note was added to the Lead.";
export const LEAD_CREATED_ACTIVITY_DESCRIPTION = "Lead created.";
