// LIBRARIES //
import { z } from "zod";
// CONSTANTS //
import {
  ADMIN_REPORTS_DATE_REGEX,
  ADMIN_REPORTS_FUNNEL_STAGE_ORDER,
} from "../../common/constants/admin-reports.constants.js";

export interface DailyTrendPointData {
  date: string;
  leads: number;
  won: number;
}

export interface ReportOverviewData {
  totalLeads: number;
  totalLeadsChange: number;
  converted: number;
  conversionRate: number;
  won: number;
  testDrive: number;
  lostLeads: number;
  lostRate: number;
  dailyTrend: DailyTrendPointData[];
}

export interface SourcePerformanceData {
  source: string;
  leads: number;
  won: number;
  rate: number;
  trend: number;
}

export interface BestSourceInsightData {
  source: string;
  leads: number;
  won: number;
  rate: number;
  guidance: string;
}

export interface SourcePerformanceReportData {
  sources: SourcePerformanceData[];
  bestSource: BestSourceInsightData | null;
}

export interface FunnelStageData {
  stage: (typeof ADMIN_REPORTS_FUNNEL_STAGE_ORDER)[number];
  count: number;
  percentage: number;
}

export interface LostReasonBreakdownData {
  reason: string;
  count: number;
  percentage: number;
}

export interface FunnelReportData {
  stages: FunnelStageData[];
  lostReasons: LostReasonBreakdownData[];
}

export interface AdminReportsServiceErrorData extends Error {
  code: "BAD_REQUEST" | "INTERNAL";
}

const isValidCalendarDate = (value: string): boolean => {
  const [yearValue, monthValue, dayValue] = value.split("-");

  if (!yearValue || !monthValue || !dayValue) {
    return false;
  }

  const yearNumber = Number(yearValue);
  const monthNumber = Number(monthValue);
  const dayNumber = Number(dayValue);
  const normalizedDate = new Date(
    Date.UTC(yearNumber, monthNumber - 1, dayNumber),
  );

  return (
    normalizedDate.getUTCFullYear() === yearNumber &&
    normalizedDate.getUTCMonth() === monthNumber - 1 &&
    normalizedDate.getUTCDate() === dayNumber
  );
};

const dateSchema = z
  .string()
  .trim()
  .regex(ADMIN_REPORTS_DATE_REGEX, "Date must use YYYY-MM-DD format.")
  .refine(isValidCalendarDate, "Date must be a valid calendar date.");

export const adminReportsDateRangeQuerySchema = z
  .object({
    from: dateSchema,
    to: dateSchema,
  })
  .superRefine((query, context) => {
    if (query.from > query.to) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "from must be less than or equal to to.",
      });
    }
  });

export type AdminReportsDateRangeQueryData = z.infer<
  typeof adminReportsDateRangeQuerySchema
>;
