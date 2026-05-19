// LIBRARIES //
import { z } from "zod";
// CONSTANTS //
import {
  ADMIN_REFERRERS_DEFAULT_LIMIT,
  ADMIN_REFERRERS_DEFAULT_PAGE,
  ADMIN_REFERRERS_DEFAULT_SORT,
  ADMIN_REFERRERS_MAX_LIMIT,
  ADMIN_REFERRERS_PROFILE_DEFAULT_LEADS_LIMIT,
} from "../../common/constants/admin-referrers.constants.js";
import { LEAD_STATUS_VALUES } from "../../common/constants/lead.constants.js";

export interface ReferrerData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  since: string;
  totalReferrals: number;
  won: number;
  conversionRate: number;
}

export interface ReferrerDetailData extends ReferrerData {
  isTopReferrer: boolean;
}

export interface ReferredLeadData {
  id: string;
  leadName: string;
  status: (typeof LEAD_STATUS_VALUES)[number];
  month: string;
}

export interface PaginatedReferrersData {
  items: ReferrerData[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedReferredLeadsData {
  items: ReferredLeadData[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminReferrersServiceErrorData extends Error {
  code: "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL";
}

export const adminReferrerParamsSchema = z.object({
  referrerId: z.string().trim().min(1),
});

export const adminReferrersListQuerySchema = z.object({
  search: z.string().trim().optional(),
  sort: z
    .enum(["most-referrals", "best-conversion"])
    .optional()
    .default(ADMIN_REFERRERS_DEFAULT_SORT),
  page: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(ADMIN_REFERRERS_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(ADMIN_REFERRERS_MAX_LIMIT)
    .optional()
    .default(ADMIN_REFERRERS_DEFAULT_LIMIT),
});

export const adminReferredLeadsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(ADMIN_REFERRERS_DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(ADMIN_REFERRERS_MAX_LIMIT)
    .optional()
    .default(ADMIN_REFERRERS_PROFILE_DEFAULT_LEADS_LIMIT),
});

export type AdminReferrerParamsData = z.infer<typeof adminReferrerParamsSchema>;
export type AdminReferrersListQueryData = z.infer<
  typeof adminReferrersListQuerySchema
>;
export type AdminReferredLeadsQueryData = z.infer<
  typeof adminReferredLeadsQuerySchema
>;
