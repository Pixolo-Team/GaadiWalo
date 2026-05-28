// LIBRARIES //
import { z } from "zod";
// CONSTANTS //
import {
  ADMIN_DASHBOARD_DEFAULT_LIMIT,
  ADMIN_DASHBOARD_DEFAULT_PERIOD,
  ADMIN_DASHBOARD_MAX_LIMIT,
} from "../../common/constants/admin-dashboard.constants.js";

/**
 * Summary cards shown on the admin dashboard for the selected period.
 */
export interface AdminSummaryData {
  totalLeads: number;
  totalLeadsChange: number;
  converted: number;
  conversionRate: number;
  activeLeads: number;
  won: number;
  wonChange: number;
}

/**
 * Lead distribution item used by the admin dashboard source chart.
 */
export interface LeadsBySourceData {
  source: string;
  count: number;
  color: string;
}

/**
 * Ranked salesperson performance row for the top performers widget.
 */
export interface TeamPerformerData {
  rank: number;
  userId: string;
  name: string;
  leads: number;
  won: number;
  winRate: number;
}

/**
 * Ranked referrer performance row for the top referrers widget.
 */
export interface TopReferrerData {
  id: string;
  name: string;
  referrals: number;
  converted: number;
  conversionRate: number;
}

/**
 * Service-level error shape used to distinguish bad input from internal failures.
 */
export interface AdminDashboardServiceErrorData extends Error {
  code: "BAD_REQUEST" | "INTERNAL";
}

/**
 * Validates and normalizes summary endpoint query values.
 */
export const adminSummaryQuerySchema = z.object({
  period: z.string().trim().optional().default(ADMIN_DASHBOARD_DEFAULT_PERIOD),
});

/**
 * Validates and normalizes leaderboard endpoint query values.
 */
export const adminLeaderboardQuerySchema = z.object({
  period: z.string().trim().optional().default(ADMIN_DASHBOARD_DEFAULT_PERIOD),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(ADMIN_DASHBOARD_MAX_LIMIT)
    .optional()
    .default(ADMIN_DASHBOARD_DEFAULT_LIMIT),
});

/**
 * Parsed query shape for summary-style dashboard endpoints.
 */
export type AdminSummaryQueryData = z.infer<typeof adminSummaryQuerySchema>;

/**
 * Parsed query shape for leaderboard-style dashboard endpoints.
 */
export type AdminLeaderboardQueryData = z.infer<
  typeof adminLeaderboardQuerySchema
>;
