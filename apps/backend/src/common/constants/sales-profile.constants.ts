export const SALES_PROFILE_DEFAULT_PERIOD = "this-month";
export const SALES_PROFILE_DEFAULT_LANGUAGE = "English";

export const INVALID_SALES_PROFILE_ID_MESSAGE =
  "Invalid sales profile identifier.";
export const INVALID_SALES_PROFILE_QUERY_MESSAGE =
  "Invalid sales profile query.";
export const INVALID_UPDATE_SALES_PROFILE_REQUEST_MESSAGE =
  "Invalid sales profile update request.";
export const INVALID_CHANGE_PASSWORD_REQUEST_MESSAGE =
  "Invalid sales password change request.";
export const INVALID_UPDATE_NOTIFICATIONS_REQUEST_MESSAGE =
  "Invalid notification preferences request.";

export const SALES_PROFILE_FETCH_SUCCESS_MESSAGE =
  "Sales profile fetched successfully.";
export const SALES_PROFILE_UPDATED_SUCCESS_MESSAGE =
  "Sales profile updated successfully.";
export const SALES_PROFILE_PASSWORD_UPDATED_SUCCESS_MESSAGE =
  "Sales password updated successfully.";
export const SALES_PROFILE_NOTIFICATIONS_UPDATED_SUCCESS_MESSAGE =
  "Sales notification preferences updated successfully.";
export const SALES_PROFILE_PERFORMANCE_SUCCESS_MESSAGE =
  "Sales performance fetched successfully.";

export const SALES_PROFILE_NOT_FOUND_MESSAGE = "Sales profile not found.";
export const SALES_PROFILE_ACCESS_FORBIDDEN_MESSAGE =
  "You are not allowed to access this sales profile.";
export const SALES_PROFILE_PASSWORD_CHANGE_FORBIDDEN_MESSAGE =
  "You are not allowed to change this sales password.";
export const SALES_PROFILE_DUPLICATE_EMAIL_MESSAGE =
  "A user with this email already exists.";
export const SALES_PROFILE_DUPLICATE_PHONE_MESSAGE =
  "A user with this phone number already exists.";

export const SALES_PROFILE_WON_STATUS = "WON";
export const SALES_PROFILE_LOST_STATUSES = ["LOST", "VEHICLE_NA"] as const;
export const SALES_PROFILE_PIPELINE_STATUSES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "TEST_DRIVE",
  "WON",
] as const;

export const SALES_PROFILE_WEEKDAY_ORDER = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;
