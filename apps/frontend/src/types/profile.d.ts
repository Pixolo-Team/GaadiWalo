/**
 * Defines sales profile payload.
 */
export interface SalesProfileData {
  branch: string;
  email: string;
  fullName: string;
  joinedAt: string;
  languagePreference: string;
  notificationPreferences?: Record<string, unknown>;
  phone: string;
  profilePhotoUrl?: string | null;
  role: string;
  userId: string;
}

/**
 * Defines request payload for profile update.
 */
export interface UpdateSalesProfileRequestData {
  email: string;
  fullName: string;
  languagePreference: string;
  phone: string;
}

/**
 * Defines request payload for sales password change.
 */
export interface ChangeSalesPasswordRequestData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Defines weekly activity item from the performance API.
 */
export interface SalesPerformanceWeeklyActivityData {
  calls: number;
  day: string;
  leads: number;
}

/**
 * Defines source breakdown item from the performance API.
 */
export interface SalesPerformanceSourceBreakdownData {
  count: number;
  source: string;
}

/**
 * Defines the raw sales performance payload returned by the API.
 */
export interface SalesPerformanceResponseData {
  callsMade: number;
  lost: number;
  lostRate: number;
  pipeline: Record<string, number>;
  rank: number | null;
  sourceBreakdown: SalesPerformanceSourceBreakdownData[];
  totalLeads: number;
  weeklyActivity: SalesPerformanceWeeklyActivityData[];
  won: number;
  wonRate: number;
}

/**
 * Defines weekly performance item payload.
 */
export interface SalesPerformanceWeeklyItemData {
  calls: number;
  day: string;
  key: string;
  leads: number;
}

/**
 * Defines source breakdown item payload.
 */
export interface SalesPerformanceSourceItemData {
  colorClassName: string;
  count: number;
  key: string;
  source: string;
}

/**
 * Defines pipeline progress item payload.
 */
export interface SalesPerformancePipelineItemData {
  colorClassName: string;
  count: number;
  key: string;
  label: string;
  progress: number;
}

/**
 * Defines top metric item payload.
 */
export interface SalesPerformanceTopMetricItemData {
  helper: string;
  key: string;
  label: string;
  tone: "blue" | "green" | "neutral" | "red";
  value: string;
}

/**
 * Defines sales performance payload.
 */
export interface SalesPerformanceData {
  pipelineProgress: SalesPerformancePipelineItemData[];
  sourceBreakdown: SalesPerformanceSourceItemData[];
  topMetrics: SalesPerformanceTopMetricItemData[];
  weeklyCallsLeads: SalesPerformanceWeeklyItemData[];
}
