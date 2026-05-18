export const ADMIN_DASHBOARD_DEFAULT_PERIOD = "this-month";
export const ADMIN_DASHBOARD_DEFAULT_LIMIT = 3;
export const ADMIN_DASHBOARD_MAX_LIMIT = 25;

export const ADMIN_SUMMARY_SUCCESS_MESSAGE =
  "Admin summary fetched successfully.";
export const ADMIN_LEADS_BY_SOURCE_SUCCESS_MESSAGE =
  "Admin leads by source fetched successfully.";
export const ADMIN_TOP_PERFORMERS_SUCCESS_MESSAGE =
  "Admin top performers fetched successfully.";
export const ADMIN_TOP_REFERRERS_SUCCESS_MESSAGE =
  "Admin top referrers fetched successfully.";

export const ADMIN_DASHBOARD_CONVERTED_STATUSES = [
  "INTERESTED",
  "TEST_DRIVE",
  "NEGOTIATION",
  "WON",
] as const;

export const ADMIN_DASHBOARD_ACTIVE_STATUSES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "TEST_DRIVE",
  "NEGOTIATION",
] as const;

export const ADMIN_DASHBOARD_WON_STATUS = "WON";
export const ADMIN_DASHBOARD_OTHER_SOURCE_LABEL = "Other";
export const ADMIN_DASHBOARD_UNKNOWN_REFERRER_LABEL = "Unknown Referrer";

export const ADMIN_DASHBOARD_SOURCE_COLOR_MAP: Record<string, string> = {
  carwale: "#2563EB",
  cardekho: "#16A34A",
  "walk in": "#EA580C",
  "walk-in": "#EA580C",
  referral: "#9333EA",
  other: "#64748B",
};
