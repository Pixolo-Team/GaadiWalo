/**
 * Defines centralized display config for the sales performance screen.
 */

/** Default period requested from the performance API. */
export const SALES_PERFORMANCE_DEFAULT_PERIOD = "this-month";

/**
 * Pipeline statuses in display order with their label and bar color.
 * Keys match the backend pipeline status keys.
 */
export const SALES_PERFORMANCE_PIPELINE_CONFIG = [
  { barClassName: "bg-blue-500", key: "NEW", label: "New" },
  { barClassName: "bg-amber-500", key: "CONTACTED", label: "Contacted" },
  { barClassName: "bg-purple-500", key: "INTERESTED", label: "Interested" },
  { barClassName: "bg-cyan-500", key: "TEST_DRIVE", label: "Test Drive" },
  { barClassName: "bg-green-500", key: "WON", label: "Won" },
] as const;

/**
 * Rotating color palette for source breakdown dots.
 * Applied in order to whichever sources the API returns.
 */
export const SALES_PERFORMANCE_SOURCE_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-orange-500",
] as const;
