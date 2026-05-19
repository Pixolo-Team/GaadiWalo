export const INVALID_ADMIN_REPORTS_QUERY_MESSAGE =
  "Invalid admin reports query.";

export const ADMIN_REPORTS_OVERVIEW_SUCCESS_MESSAGE =
  "Admin reports overview fetched successfully.";
export const ADMIN_REPORTS_SOURCES_SUCCESS_MESSAGE =
  "Admin reports sources fetched successfully.";
export const ADMIN_REPORTS_FUNNEL_SUCCESS_MESSAGE =
  "Admin reports funnel fetched successfully.";

export const ADMIN_REPORTS_WON_STATUS = "WON";
export const ADMIN_REPORTS_TEST_DRIVE_STATUS = "TEST_DRIVE";
export const ADMIN_REPORTS_LOST_STATUSES = ["LOST", "VEHICLE_NA"] as const;
export const ADMIN_REPORTS_FUNNEL_STAGE_ORDER = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "TEST_DRIVE",
  "WON",
] as const;

export const ADMIN_REPORTS_UNKNOWN_SOURCE_LABEL = "Other";
export const ADMIN_REPORTS_UNKNOWN_LOST_REASON_LABEL = "Unknown Reason";
export const ADMIN_REPORTS_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
