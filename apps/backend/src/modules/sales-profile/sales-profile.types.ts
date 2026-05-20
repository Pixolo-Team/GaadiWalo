// LIBRARIES //
import { z } from "zod";
// CONSTANTS //
import {
  SALES_PROFILE_DEFAULT_LANGUAGE,
  SALES_PROFILE_DEFAULT_PERIOD,
} from "../../common/constants/sales-profile.constants.js";
import {
  AUTH_MIN_PASSWORD_LENGTH,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_UPPERCASE_REGEX,
} from "../../common/constants/auth.constants.js";
import { LEAD_STATUS_VALUES } from "../../common/constants/lead.constants.js";

const mobilePhoneRegex = /^[0-9]{10}$/;
const salesProfilePeriodRegex =
  /^(this-month|\d{4}-\d{2}|[A-Za-z]+(?:[\s-]+)\d{4})$/;

export interface NotificationPreferencesData {
  overdueFollowUps: boolean;
  testDriveReminders: boolean;
  newLeadAssigned: boolean;
  statusChangeAlerts: boolean;
  wonLostSummary: boolean;
  pushNotification: boolean;
  sms: boolean;
  whatsApp: boolean;
  quietHoursEnabled: boolean;
  quietHoursFrom: string | null;
  quietHoursTo: string | null;
}

export interface SalesProfileData {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  branch: string;
  joinedAt: string;
  profilePhotoUrl: string | null;
  languagePreference: string;
  notificationPreferences: NotificationPreferencesData;
}

export interface WeeklyActivityData {
  day: string;
  calls: number;
  leads: number;
}

export interface SourceBreakdownData {
  source: string;
  count: number;
}

export interface PerformanceData {
  totalLeads: number;
  callsMade: number;
  won: number;
  wonRate: number;
  lost: number;
  lostRate: number;
  rank: number | null;
  pipeline: Record<string, number>;
  weeklyActivity: WeeklyActivityData[];
  sourceBreakdown: SourceBreakdownData[];
}

export interface SalesProfileServiceErrorData extends Error {
  code: "BAD_REQUEST" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "INTERNAL";
}

export const salesProfileParamsSchema = z.object({
  userCode: z.string().trim().min(1),
});

export const salesPerformanceQuerySchema = z.object({
  period: z
    .string()
    .trim()
    .regex(
      salesProfilePeriodRegex,
      "Period must be 'this-month', use YYYY-MM, or use a month name like 'May 2026'.",
    )
    .optional()
    .default(SALES_PROFILE_DEFAULT_PERIOD),
});

export const updateSalesProfileRequestSchema = z
  .object({
    fullName: z.string().trim().min(2).optional(),
    phone: z
      .string()
      .trim()
      .regex(mobilePhoneRegex, "Phone number must be 10 digits.")
      .optional(),
    email: z.string().trim().email().optional(),
    languagePreference: z
      .string()
      .trim()
      .min(1)
      .optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one update field is required.",
  });

export const changeSalesPasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(AUTH_MIN_PASSWORD_LENGTH)
      .refine((passwordValue) => PASSWORD_UPPERCASE_REGEX.test(passwordValue))
      .refine((passwordValue) => PASSWORD_NUMBER_REGEX.test(passwordValue)),
  })
  .strict();

const optionalTimeStringSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "Time must use HH:MM format.")
  .nullable();

export const notificationPreferencesSchema = z
  .object({
    overdueFollowUps: z.boolean(),
    testDriveReminders: z.boolean(),
    newLeadAssigned: z.boolean(),
    statusChangeAlerts: z.boolean(),
    wonLostSummary: z.boolean(),
    pushNotification: z.boolean(),
    sms: z.boolean(),
    whatsApp: z.boolean(),
    quietHoursEnabled: z.boolean(),
    quietHoursFrom: optionalTimeStringSchema,
    quietHoursTo: optionalTimeStringSchema,
  })
  .superRefine((payload, context) => {
    if (
      payload.quietHoursEnabled &&
      (!payload.quietHoursFrom || !payload.quietHoursTo)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quietHoursFrom"],
        message: "Quiet hours require both from and to times.",
      });
    }
  });

export type SalesProfileParamsData = z.infer<typeof salesProfileParamsSchema>;
export type SalesPerformanceQueryData = z.infer<
  typeof salesPerformanceQuerySchema
>;
export type UpdateSalesProfileRequestData = z.infer<
  typeof updateSalesProfileRequestSchema
>;
export type ChangeSalesPasswordRequestData = z.infer<
  typeof changeSalesPasswordRequestSchema
>;
export type NotificationPreferencesRequestData = z.infer<
  typeof notificationPreferencesSchema
>;

export type SalesLeadStatusData = (typeof LEAD_STATUS_VALUES)[number];
