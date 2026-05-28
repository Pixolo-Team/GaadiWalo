// TYPES //
import type { CreateLeadRequestData } from "@/types/leads";
import type { LeadStatusData } from "@/types/leads";

export type LeadImportDuplicateModeData = "skip" | "upsert";

export type LeadImportPreviewStatusData = "valid" | "duplicate" | "error";

export type LeadImportResultStatusData =
  | "imported"
  | "updated"
  | "skipped"
  | "error";

/**
 * Defines a raw row parsed from an upload file before preview validation.
 */
export interface LeadImportRawRowData {
  budget: string | null;
  carBrand: string | null;
  carModel: string | null;
  colorPreference: string | null;
  email: string | null;
  fullName: string;
  initialNote: string | null;
  isUsed: boolean | null;
  lostReason: string | null;
  phone: string;
  referrerName: string | null;
  referrerPhone: string | null;
  rowNumber: number;
  source: string | null;
  status?: LeadStatusData;
  variantName: string | null;
}

/**
 * Defines a validated preview row shown before import submission.
 */
export interface LeadImportPreviewRowData extends LeadImportRawRowData {
  previewStatus: LeadImportPreviewStatusData;
  resolvedSource: string | null;
  validationErrors: string[];
}

/**
 * Defines one row sent to the backend import API.
 */
export interface LeadImportRequestRowData extends CreateLeadRequestData {
  rowNumber: number;
  status?: LeadStatusData;
  lostReason?: string | null;
}

/**
 * Defines the full parsed preview result for an uploaded file.
 */
export interface LeadImportParseResultData {
  duplicateCount: number;
  errorCount: number;
  importRows: LeadImportRequestRowData[];
  rows: LeadImportPreviewRowData[];
  totalRows: number;
  validCount: number;
}

/**
 * Defines the frontend payload sent to the import API.
 */
export interface ImportLeadsRequestData {
  duplicateMode: LeadImportDuplicateModeData;
  rows: LeadImportRequestRowData[];
}

/**
 * Defines one backend import result row.
 */
export interface LeadImportResultRowData {
  leadId: string | null;
  reason: string;
  rowNumber: number;
  status: LeadImportResultStatusData;
}

/**
 * Defines the backend import summary payload.
 */
export interface ImportLeadsResponseData {
  errorCount: number;
  importedCount: number;
  results: LeadImportResultRowData[];
  skippedCount: number;
  totalRows: number;
  updatedCount: number;
}
