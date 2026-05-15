// LIBRARIES //
import { z } from "zod";
// CONSTANTS //
import { LEAD_ACTIVITY_TYPE_VALUES, LEAD_STATUS_VALUES } from "../../common/constants/lead.constants.js";

const mobilePhoneRegex = /^[0-9]{10}$/;

const optionalTrimmedStringSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional();

export type LeadStatusData = (typeof LEAD_STATUS_VALUES)[number];
export type LeadActivityTypeData = (typeof LEAD_ACTIVITY_TYPE_VALUES)[number];

export interface LeadUserSummaryData {
  id: string;
  name: string;
}

export interface LeadDetailsData {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  source: string;
  status: LeadStatusData;
  lostReason: string | null;
  referrerName: string | null;
  referrerPhone: string | null;
  carBrand: string | null;
  carModel: string | null;
  variantName: string | null;
  colorPreference: string | null;
  budget: string | null;
  isUsed: boolean | null;
  assignedTo: LeadUserSummaryData | null;
  createdBy: LeadUserSummaryData | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LeadActivityData {
  id: string;
  leadId: string;
  type: LeadActivityTypeData;
  description: string;
  metaJson: Record<string, unknown> | null;
  createdAt: string | null;
}

export interface LeadNoteData {
  id: string;
  leadId: string;
  author: LeadUserSummaryData | null;
  content: string;
  createdAt: string | null;
}

export interface CreateLeadResponseData {
  lead: LeadDetailsData;
  note: LeadNoteData | null;
}

export interface SalesLeadServiceErrorData extends Error {
  code:
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "INTERNAL";
}

export const leadIdParamsSchema = z.object({
  leadId: z.string().trim().min(1),
});

export const updateLeadStatusRequestSchema = z
  .object({
    status: z.enum(LEAD_STATUS_VALUES),
    lostReason: optionalTrimmedStringSchema,
  })
  .superRefine((value, context) => {
    if (value.status === "LOST" && !value.lostReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lostReason"],
        message: "Lost reason is required when status is LOST.",
      });
    }

    if (value.status !== "LOST" && value.lostReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lostReason"],
        message: "Lost reason is allowed only when status is LOST.",
      });
    }
  });

export const leadDetailsMutationSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().regex(mobilePhoneRegex, "Phone number must be 10 digits."),
  email: z
    .string()
    .trim()
    .email()
    .or(z.literal(""))
    .transform((value) => (value.length > 0 ? value : null)),
  source: z.string().trim().min(1),
  referrerName: optionalTrimmedStringSchema,
  referrerPhone: z
    .string()
    .trim()
    .regex(mobilePhoneRegex, "Referrer phone number must be 10 digits.")
    .or(z.literal(""))
    .transform((value) => (value.length > 0 ? value : null))
    .nullable()
    .optional(),
  carBrand: optionalTrimmedStringSchema,
  carModel: optionalTrimmedStringSchema,
  variantName: optionalTrimmedStringSchema,
  colorPreference: optionalTrimmedStringSchema,
  budget: optionalTrimmedStringSchema,
  isUsed: z.boolean().nullable().optional(),
});

export const createLeadNoteRequestSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const createLeadRequestSchema = leadDetailsMutationSchema.extend({
  initialNote: optionalTrimmedStringSchema,
});

export type UpdateLeadStatusRequestData = z.infer<
  typeof updateLeadStatusRequestSchema
>;
export type UpdateLeadDetailsRequestData = z.infer<
  typeof leadDetailsMutationSchema
>;
export type CreateLeadNoteRequestData = z.infer<
  typeof createLeadNoteRequestSchema
>;
export type CreateLeadRequestData = z.infer<typeof createLeadRequestSchema>;
