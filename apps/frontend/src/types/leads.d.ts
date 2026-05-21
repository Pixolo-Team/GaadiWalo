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
  createdAt?: string | null;
  fullName: string;
  id: string;
  phone: string;
  source: string;
  status: LeadStatusData;
  statusChangedAt?: string | null;
  statusUpdatedAt?: string | null;
  updatedAt?: string | null;
  variantName: string | null;
  wonAt?: string | null;
}

/**
 * Defines lead branch option payload.
 */
export interface LeadBranchData {
  id: string;
  name: string;
}

/**
 * Defines active leads filter state used by the list screen.
 */
export interface LeadsFilterStateData {
  selectedBranch: string;
  selectedCarBrand: string;
  selectedEndDate: string;
  selectedSourceFilters: string[];
  selectedStartDate: string;
  selectedStatusFilters: string[];
}

/**
 * Defines car brand option payload.
 */
export interface LeadCarBrandData {
  id: string;
  models: string[];
  name: string;
}

/**
 * Defines lead source option payload.
 */
export interface LeadSourceData {
  description: string;
  id: string;
  name: string;
}

/**
 * Defines lead-details tab values.
 */
export type SalesLeadDetailsTabData = "Info" | "Activity" | "Notes";

/**
 * Defines local lead status form state shape.
 */
export interface LeadStatusFormStateData {
  selectedLeadStatus: LeadStatusData;
  selectedLostReason: string;
}

/**
 * Defines local request loading/submission state shape.
 */
export interface LeadRequestStateData {
  isLeadLoading: boolean;
  isSendingNote: boolean;
  isUpdatingStatus: boolean;
}

/**
 * Defines info-card row shape for lead details UI.
 */
export interface LeadInfoRowData {
  isHighlighted: boolean;
  key: string;
  label: string;
  value: string;
}

/**
 * Defines lead profile view model for lead details UI.
 */
export interface LeadProfileViewData {
  age: string;
  avatarLabel: string;
  name: string;
  phoneNumber: string;
  status: string;
  statusTone: "amber" | "blue" | "green" | "purple" | "red";
}

/**
 * Defines lead activity timeline view item.
 */
export interface LeadActivityViewData {
  description: string;
  key: string;
  meta: string;
  tone: "amber" | "blue" | "green" | "neutral" | "purple";
  type: "calendar" | "call" | "lead" | "status" | "whatsapp";
}

/**
 * Defines lead note view item.
 */
export interface LeadNoteViewData {
  author: string;
  key: string;
  message: string;
  meta: string;
  variant: "incoming" | "outgoing";
}

/**
 * Defines lead status option payload from status master API.
 */
export interface LeadStatusOptionData {
  id: string;
  name: LeadStatusData;
  reason: string[];
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
