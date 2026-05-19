export const ADMIN_TEAM_DEFAULT_PERIOD = "this-month";
export const ADMIN_TEAM_DEFAULT_STATUS = "active";
export const ADMIN_TEAM_TEMP_PASSWORD_LENGTH = 12;

export const INVALID_ADMIN_TEAM_MEMBER_MESSAGE =
  "Invalid salesperson identifier.";
export const INVALID_ADMIN_TEAM_QUERY_MESSAGE = "Invalid admin team query.";
export const INVALID_CREATE_SALESPERSON_REQUEST_MESSAGE =
  "Invalid create salesperson request.";
export const INVALID_UPDATE_SALESPERSON_REQUEST_MESSAGE =
  "Invalid update salesperson request.";
export const INVALID_REMOVE_SALESPERSON_REQUEST_MESSAGE =
  "Invalid remove salesperson request.";
export const INVALID_RESET_SALESPERSON_PASSWORD_REQUEST_MESSAGE =
  "Invalid reset salesperson password request.";

export const ADMIN_TEAM_LIST_SUCCESS_MESSAGE =
  "Sales team fetched successfully.";
export const ADMIN_TEAM_DETAILS_SUCCESS_MESSAGE =
  "Salesperson details fetched successfully.";
export const ADMIN_TEAM_OPTIONS_SUCCESS_MESSAGE =
  "Admin team options fetched successfully.";
export const ADMIN_TEAM_CREATED_SUCCESS_MESSAGE =
  "Salesperson created successfully.";
export const ADMIN_TEAM_UPDATED_SUCCESS_MESSAGE =
  "Salesperson updated successfully.";
export const ADMIN_TEAM_PASSWORD_RESET_SUCCESS_MESSAGE =
  "Salesperson password reset successfully.";
export const ADMIN_TEAM_REMOVED_SUCCESS_MESSAGE =
  "Salesperson removed successfully.";

export const ADMIN_TEAM_INACTIVE_STATUS_LABEL = "Inactive";
export const ADMIN_TEAM_ACTIVE_STATUS_LABEL = "Active";
export const ADMIN_TEAM_SALESPERSON_NOT_FOUND_MESSAGE =
  "Salesperson not found.";
export const ADMIN_TEAM_ROLE_NOT_FOUND_MESSAGE = "Role not found.";
export const ADMIN_TEAM_BRANCH_NOT_FOUND_MESSAGE = "Branch not found.";
export const ADMIN_TEAM_REASSIGN_TARGET_NOT_FOUND_MESSAGE =
  "Reassignment target not found.";
export const ADMIN_TEAM_REASSIGN_TARGET_INVALID_MESSAGE =
  "Reassignment target must be a different active salesperson.";
export const ADMIN_TEAM_DUPLICATE_EMAIL_MESSAGE =
  "A salesperson with this email already exists.";
export const ADMIN_TEAM_DUPLICATE_PHONE_MESSAGE =
  "A salesperson with this phone number already exists.";
export const ADMIN_TEAM_DUPLICATE_USER_ID_MESSAGE =
  "A salesperson with this user ID already exists.";
export const ADMIN_TEAM_AUTH_ID_MISSING_MESSAGE =
  "Salesperson is missing a linked authentication account.";

export const ADMIN_TEAM_ACTIVE_LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "TEST_DRIVE",
  "NEGOTIATION",
  "VEHICLE_NA",
] as const;

export const ADMIN_TEAM_WON_STATUS = "WON";
export const ADMIN_TEAM_ROLE_NAME_FILTER = "sales";
