/**
 * Defines supported lead status values.
 */
export type LeadStatusData =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "TEST_DRIVE"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "VEHICLE_NA";

/**
 * Defines supported lead activity values.
 */
export type LeadActivityTypeData =
  | "call"
  | "whatsapp"
  | "note"
  | "status_change"
  | "system";

/**
 * Defines lightweight user summary for lead payloads.
 */
export interface LeadUserSummaryData {
  id: string;
  name: string;
}

/**
 * Defines lead detail payload returned by sales lead APIs.
 */
export interface LeadDetailsData {
  assignedTo: LeadUserSummaryData | null;
  budget: string | null;
  carBrand: string | null;
  carModel: string | null;
  colorPreference: string | null;
  createdAt: string | null;
  createdBy: LeadUserSummaryData | null;
  email: string | null;
  fullName: string;
  id: string;
  isUsed: boolean | null;
  lostReason: string | null;
  phone: string;
  referrerName: string | null;
  referrerPhone: string | null;
  source: string;
  status: LeadStatusData;
  updatedAt: string | null;
  variantName: string | null;
}

/**
 * Defines lead list item payload.
 */
export interface LeadListItemData {
  carBrand: string | null;
  carModel: string | null;
  fullName: string;
  id: string;
  phone: string;
  source: string;
  status: LeadStatusData;
  variantName: string | null;
}

/**
 * Defines lead activity payload.
 */
export interface LeadActivityData {
  createdAt: string | null;
  description: string;
  id: string;
  leadId: string;
  metaJson: Record<string, unknown> | null;
  type: LeadActivityTypeData;
}

/**
 * Defines lead note payload.
 */
export interface LeadNoteData {
  author: LeadUserSummaryData | null;
  content: string;
  createdAt: string | null;
  id: string;
  leadId: string;
}

/**
 * Defines request payload to update lead status.
 */
export interface UpdateLeadStatusRequestData {
  lostReason?: string | null;
  status: LeadStatusData;
}

/**
 * Defines request payload to update lead details.
 */
export interface UpdateLeadDetailsRequestData {
  budget?: string | null;
  carBrand?: string | null;
  carModel?: string | null;
  colorPreference?: string | null;
  email: string | null;
  fullName: string;
  isUsed?: boolean | null;
  phone: string;
  referrerName?: string | null;
  referrerPhone?: string | null;
  source: string;
  variantName?: string | null;
}

/**
 * Defines request payload to create lead note.
 */
export interface CreateLeadNoteRequestData {
  content: string;
}

/**
 * Defines request payload to create lead.
 */
export interface CreateLeadRequestData {
  budget?: string | null;
  carBrand?: string | null;
  carModel?: string | null;
  colorPreference?: string | null;
  email: string | null;
  fullName: string;
  initialNote?: string | null;
  isUsed?: boolean | null;
  phone: string;
  referrerName?: string | null;
  referrerPhone?: string | null;
  source: string;
  variantName?: string | null;
}

/**
 * Defines response payload for create lead.
 */
export interface CreateLeadResponseData {
  lead: LeadDetailsData;
  note: LeadNoteData | null;
}
