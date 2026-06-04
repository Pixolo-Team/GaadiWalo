/**
 * Admin Dashboard — summary metrics.
 */
export interface AdminSummaryData {
  activeLeads: number;
  converted: number;
  conversionRate: number;
  totalLeads: number;
  totalLeadsChange: number;
  won: number;
  wonChange: number;
}

/**
 * Admin Dashboard — leads by source item.
 */
export interface AdminLeadsBySourceData {
  color: string;
  count: number;
  source: string;
}

/**
 * Admin Dashboard — top performer item.
 */
export interface AdminTopPerformerData {
  leads: number;
  name: string;
  rank: number;
  userId: string;
  winRate: number;
  won: number;
}

/**
 * Admin Dashboard — top referrer item.
 */
export interface AdminTopReferrerData {
  converted: number;
  conversionRate: number;
  id: string;
  name: string;
  referrals: number;
}

/**
 * Admin Team — salesperson stats bucket.
 */
export interface AdminSalespersonStatsData {
  leads: number;
  winRate: number;
  won: number;
}

/**
 * Admin Team — salesperson list item.
 */
export interface AdminSalespersonData {
  activeLeadCount?: number;
  branch: AdminOptionItemData;
  email: string;
  fullName: string;
  id: string;
  joinedAt: string;
  phone: string;
  role: AdminOptionItemData;
  status: "Active" | "Inactive";
  thisMonth: AdminSalespersonStatsData;
  userId: string;
}

/**
 * Admin Team — options for dropdowns.
 */
export interface AdminTeamOptionsData {
  branches: AdminOptionItemData[];
  roles: AdminOptionItemData[];
}

/**
 * Generic option item used in dropdowns.
 */
export interface AdminOptionItemData {
  id: string;
  name: string;
}

/**
 * Admin Team — create salesperson request.
 */
export interface CreateSalespersonRequestData {
  branchId: string;
  email: string;
  fullName: string;
  phone: string;
  roleId: string;
}

/**
 * Admin Team — create salesperson response.
 */
export interface CreateSalespersonResponseData {
  salesperson: AdminSalespersonData;
  tempPassword: string;
}

/**
 * Admin Team — update salesperson request.
 */
export interface UpdateSalespersonRequestData {
  branchId?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  phone?: string;
  roleId?: string;
}

/**
 * Admin Team — edit fields state for salesperson detail form.
 */
export interface SalespersonEditFieldsData {
  branchId?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  phone?: string;
  roleId?: string;
}

/**
 * Admin Team — reset password response.
 */
export interface ResetSalespersonPasswordResponseData {
  tempPassword: string;
}

/**
 * Admin Team — remove salesperson request.
 */
export interface RemoveSalespersonRequestData {
  reassignToId?: string;
  strategy: "reassign" | "unassigned";
}

/**
 * Admin Team — remove salesperson response.
 */
export interface RemoveSalespersonResponseData {
  reassignedLeadCount: number;
  removalStrategy: "reassign" | "unassigned";
  success: true;
  unassignedLeadCount: number;
}

/**
 * Admin Referrers — referrer list item.
 */
export interface AdminReferrerData {
  city: string | null;
  conversionRate: number;
  email: string | null;
  id: string;
  name: string;
  phone: string;
  since: string;
  totalReferrals: number;
  won: number;
}

/**
 * Admin Referrers — referrer detail.
 */
export interface AdminReferrerDetailData extends AdminReferrerData {
  isTopReferrer: boolean;
}

/**
 * Admin Referrers — referred lead item.
 */
export interface AdminReferredLeadData {
  id: string;
  leadName: string;
  month: string;
  status: string;
}

/**
 * Generic paginated response wrapper.
 */
export interface PaginatedResponseData<T> {
  items: T[];
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Admin Reports — overview.
 */
export interface AdminReportOverviewData {
  conversionRate: number;
  converted: number;
  dailyTrend: AdminDailyTrendData[];
  lostLeads: number;
  lostRate: number;
  testDrive: number;
  totalLeads: number;
  totalLeadsChange: number;
  won: number;
}

/**
 * Admin Reports — daily trend data point.
 */
export interface AdminDailyTrendData {
  date: string;
  leads: number;
  won: number;
}

/**
 * Admin Reports — source performance item.
 */
export interface AdminSourcePerformanceData {
  rate: number;
  source: string;
  trend: number;
  leads: number;
  won: number;
}

/**
 * Admin Reports — source performance response.
 */
export interface AdminSourcePerformanceResponseData {
  bestSource: AdminBestSourceData | null;
  sources: AdminSourcePerformanceData[];
}

/**
 * Admin Reports — best source.
 */
export interface AdminBestSourceData {
  guidance: string;
  leads: number;
  rate: number;
  source: string;
  won: number;
}

/**
 * Admin Reports — funnel stage item.
 */
export interface AdminFunnelStageData {
  count: number;
  percentage: number;
  stage: "NEW" | "CONTACTED" | "INTERESTED" | "TEST_DRIVE" | "WON";
}

/**
 * Admin Reports — lost reason item.
 */
export interface AdminLostReasonData {
  count: number;
  percentage: number;
  reason: string;
}

/**
 * Admin Reports — funnel response.
 */
export interface AdminFunnelReportData {
  lostReasons: AdminLostReasonData[];
  stages: AdminFunnelStageData[];
}
