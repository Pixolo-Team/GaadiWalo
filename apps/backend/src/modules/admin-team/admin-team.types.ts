// LIBRARIES //
import { z } from "zod";
// CONSTANTS //
import {
  ADMIN_TEAM_DEFAULT_PERIOD,
  ADMIN_TEAM_DEFAULT_STATUS,
} from "../../common/constants/admin-team.constants.js";

const mobilePhoneRegex = /^[0-9]{10}$/;

export interface TeamOptionItemData {
  id: string;
  name: string;
}

export interface SalespersonStatsData {
  leads: number;
  won: number;
  winRate: number;
}

export interface SalespersonData {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  branch: TeamOptionItemData;
  role: TeamOptionItemData;
  status: "Active" | "Inactive";
  joinedAt: string;
  thisMonth: SalespersonStatsData;
}

export interface SalespersonDetailData extends SalespersonData {
  activeLeadCount: number;
}

export interface AdminTeamOptionsData {
  roles: TeamOptionItemData[];
  branches: TeamOptionItemData[];
}

export interface CreateSalespersonResponseData {
  salesperson: SalespersonData;
  tempPassword: string;
}

export interface ResetSalespersonPasswordResponseData {
  tempPassword: string;
}

export interface RemoveSalespersonResponseData {
  success: boolean;
  removalStrategy: "reassign" | "unassigned";
  reassignedLeadCount: number;
  unassignedLeadCount: number;
}

export interface AdminTeamServiceErrorData extends Error {
  code: "BAD_REQUEST" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "INTERNAL";
}

export const adminTeamParamsSchema = z.object({
  salespersonId: z.string().trim().min(1),
});

export const adminTeamQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional().default(ADMIN_TEAM_DEFAULT_STATUS),
  branchId: z.string().trim().optional(),
  period: z.string().trim().optional().default(ADMIN_TEAM_DEFAULT_PERIOD),
});

export const createSalespersonRequestSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().regex(mobilePhoneRegex, "Phone number must be 10 digits."),
  email: z.string().trim().email(),
  branchId: z.string().trim().min(1),
  roleId: z.string().trim().min(1),
});

export const updateSalespersonRequestSchema = z
  .object({
    fullName: z.string().trim().min(2).optional(),
    phone: z
      .string()
      .trim()
      .regex(mobilePhoneRegex, "Phone number must be 10 digits.")
      .optional(),
    email: z.string().trim().email().optional(),
    branchId: z.string().trim().min(1).optional(),
    roleId: z.string().trim().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one update field is required.",
  });

export const removeSalespersonRequestSchema = z
  .object({
    strategy: z.enum(["reassign", "unassigned"]),
    reassignToId: z.string().trim().optional(),
  })
  .superRefine((payload, context) => {
    if (payload.strategy === "reassign" && !payload.reassignToId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reassignToId"],
        message: "reassignToId is required when strategy is reassign.",
      });
    }

    if (payload.strategy === "unassigned" && payload.reassignToId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reassignToId"],
        message: "reassignToId must be omitted when strategy is unassigned.",
      });
    }
  });

export type AdminTeamParamsData = z.infer<typeof adminTeamParamsSchema>;
export type AdminTeamQueryData = z.infer<typeof adminTeamQuerySchema>;
export type CreateSalespersonRequestData = z.infer<
  typeof createSalespersonRequestSchema
>;
export type UpdateSalespersonRequestData = z.infer<
  typeof updateSalespersonRequestSchema
>;
export type RemoveSalespersonRequestData = z.infer<
  typeof removeSalespersonRequestSchema
>;
