// LIBRARIES //
import * as XLSX from "xlsx";

// TYPES //
import type {
  LeadImportParseResultData,
  LeadImportPreviewRowData,
  LeadImportRawRowData,
  LeadImportRequestRowData,
} from "@/types/lead-import";
import type { LeadStatusData } from "@/types/leads";

type LeadImportColumnKeyData =
  | "budget"
  | "carBrand"
  | "carModel"
  | "colorPreference"
  | "email"
  | "fullName"
  | "initialNote"
  | "isUsed"
  | "lostReason"
  | "phone"
  | "referrerName"
  | "referrerPhone"
  | "source"
  | "status"
  | "variantName";

const leadImportColumnAliases: Record<
  LeadImportColumnKeyData,
  readonly string[]
> = {
  budget: ["budget", "budget range"],
  carBrand: ["brand", "car brand", "vehicle brand"],
  carModel: ["car model", "model", "vehicle model"],
  colorPreference: ["color", "color preference"],
  email: ["email", "email address"],
  fullName: ["customer name", "full name", "lead name", "name"],
  initialNote: ["initial note", "note", "notes"],
  isUsed: ["is used", "used", "used car"],
  lostReason: ["lost reason"],
  phone: ["mobile", "phone", "phone number"],
  referrerName: ["referrer name", "referral name"],
  referrerPhone: ["referrer phone", "referral phone"],
  source: ["lead source", "source"],
  status: ["lead status", "status"],
  variantName: ["variant", "variant name"],
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parses an uploaded Excel or CSV file into normalized raw rows.
 */
export const parseLeadImportFileService = async (
  file: File,
): Promise<LeadImportRawRowData[]> => {
  const fileBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(fileBuffer, { type: "array" });
  const worksheetName = workbook.SheetNames[0];
  const worksheet = worksheetName ? workbook.Sheets[worksheetName] : null;

  if (!worksheet) {
    return [];
  }

  const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
  });

  return sheetRows.map((sheetRowItem, sheetRowIndex) => {
    return {
      budget: getNullableStringValue(sheetRowItem, "budget"),
      carBrand: getNullableStringValue(sheetRowItem, "carBrand"),
      carModel: getNullableStringValue(sheetRowItem, "carModel"),
      colorPreference: getNullableStringValue(sheetRowItem, "colorPreference"),
      email: getNullableEmailValue(sheetRowItem),
      fullName: getStringValue(sheetRowItem, "fullName"),
      initialNote: getNullableStringValue(sheetRowItem, "initialNote"),
      isUsed: getNullableBooleanValue(sheetRowItem, "isUsed"),
      lostReason: getNullableStringValue(sheetRowItem, "lostReason"),
      phone: getNormalizedPhoneValue(getStringValue(sheetRowItem, "phone")),
      referrerName: getNullableStringValue(sheetRowItem, "referrerName"),
      referrerPhone: getNormalizedPhoneValue(
        getNullableStringValue(sheetRowItem, "referrerPhone"),
      ),
      rowNumber: sheetRowIndex + 2,
      source: getNullableStringValue(sheetRowItem, "source"),
      status: getNullableStatusValue(sheetRowItem),
      variantName: getNullableStringValue(sheetRowItem, "variantName"),
    };
  });
};

/**
 * Builds the import preview result using parsed rows and the selected source override.
 */
export const buildLeadImportPreviewService = (
  rawRows: LeadImportRawRowData[],
  sourceOverride: string | null,
): LeadImportParseResultData => {
  const resolvedOverride = normalizeSourceOverride(sourceOverride);
  const phoneCountMap = new Map<string, number>();

  rawRows.forEach((rawRowItem) => {
    if (!rawRowItem.phone) {
      return;
    }

    const previousCount = phoneCountMap.get(rawRowItem.phone) ?? 0;
    phoneCountMap.set(rawRowItem.phone, previousCount + 1);
  });

  const previewRows = rawRows.map((rawRowItem) => {
    const resolvedSource = rawRowItem.source ?? resolvedOverride;
    const validationErrors = getRowValidationErrors(rawRowItem, resolvedSource);
    const hasDuplicatePhone = (phoneCountMap.get(rawRowItem.phone) ?? 0) > 1;

    if (hasDuplicatePhone) {
      validationErrors.push("Duplicate phone number found in this file.");
    }

    const previewStatus =
      validationErrors.length === 0
        ? "valid"
        : hasDuplicatePhone && validationErrors.length === 1
          ? "duplicate"
          : validationErrors.includes("Duplicate phone number found in this file.")
            ? "duplicate"
            : "error";

    return {
      ...rawRowItem,
      previewStatus,
      resolvedSource,
      validationErrors,
    } satisfies LeadImportPreviewRowData;
  });

  const importRows = previewRows
    .filter((previewRowItem) => previewRowItem.previewStatus === "valid")
    .map((previewRowItem) => createImportRequestRow(previewRowItem));

  return {
    duplicateCount: previewRows.filter(
      (previewRowItem) => previewRowItem.previewStatus === "duplicate",
    ).length,
    errorCount: previewRows.filter(
      (previewRowItem) => previewRowItem.previewStatus === "error",
    ).length,
    importRows,
    rows: previewRows,
    totalRows: previewRows.length,
    validCount: importRows.length,
  };
};

/**
 * Creates a sample CSV template for lead import downloads.
 */
export const downloadLeadImportTemplateService = (): void => {
  const templateHeaders = [
    "Name",
    "Phone",
    "Email",
    "Source",
    "Car Brand",
    "Car Model",
    "Variant",
    "Budget",
    "Initial Note",
  ];
  const sampleValues = [
    "Rahul Sharma",
    "9876543210",
    "rahul@example.com",
    "CarWale",
    "Hyundai",
    "i10",
    "Sportz",
    "6-8 Lakh",
    "Customer asked for a callback after 6 PM.",
  ];
  const csvContent = `${templateHeaders.join(",")}\n${sampleValues.join(",")}\n`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const objectUrl = window.URL.createObjectURL(blob);
  const linkElement = document.createElement("a");

  linkElement.href = objectUrl;
  linkElement.download = "gaadiwalo-leads-import-template.csv";
  linkElement.click();
  window.URL.revokeObjectURL(objectUrl);
};

const normalizeHeaderValue = (headerValue: string): string => {
  return headerValue.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
};

const getMappedValue = (
  sheetRow: Record<string, unknown>,
  columnKey: LeadImportColumnKeyData,
): unknown => {
  const normalizedEntries = Object.entries(sheetRow).map(([key, value]) => [
    normalizeHeaderValue(key),
    value,
  ]);

  const aliasValues = leadImportColumnAliases[columnKey];

  for (const aliasItem of aliasValues) {
    const normalizedAlias = normalizeHeaderValue(aliasItem);
    const matchedEntry = normalizedEntries.find(
      ([normalizedKey]) => normalizedKey === normalizedAlias,
    );

    if (matchedEntry) {
      return matchedEntry[1];
    }
  }

  return null;
};

const getStringValue = (
  sheetRow: Record<string, unknown>,
  columnKey: LeadImportColumnKeyData,
): string => {
  const rawValue = getMappedValue(sheetRow, columnKey);

  if (rawValue === null || rawValue === undefined) {
    return "";
  }

  return String(rawValue).trim();
};

const getNullableStringValue = (
  sheetRow: Record<string, unknown>,
  columnKey: LeadImportColumnKeyData,
): string | null => {
  const stringValue = getStringValue(sheetRow, columnKey);

  return stringValue.length > 0 ? stringValue : null;
};

const getNullableEmailValue = (
  sheetRow: Record<string, unknown>,
): string | null => {
  const emailValue = getNullableStringValue(sheetRow, "email");

  return emailValue ? emailValue.toLowerCase() : null;
};

const getNullableBooleanValue = (
  sheetRow: Record<string, unknown>,
  columnKey: LeadImportColumnKeyData,
): boolean | null => {
  const rawValue = getNullableStringValue(sheetRow, columnKey);

  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.toLowerCase();

  if (["true", "yes", "used", "1"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "new", "no", "0"].includes(normalizedValue)) {
    return false;
  }

  return null;
};

const getNullableStatusValue = (
  sheetRow: Record<string, unknown>,
): LeadImportRawRowData["status"] => {
  const rawStatusValue = getNullableStringValue(sheetRow, "status");

  if (!rawStatusValue) {
    return undefined;
  }

  const normalizedStatusValue = rawStatusValue.toUpperCase().replace(/\s+/g, "_");
  const allowedStatusValues = new Set<LeadStatusData>([
    "NEW",
    "CONTACTED",
    "INTERESTED",
    "TEST_DRIVE",
    "NEGOTIATION",
    "WON",
    "LOST",
    "VEHICLE_NA",
  ]);

  return allowedStatusValues.has(
    normalizedStatusValue as LeadStatusData,
  )
    ? (normalizedStatusValue as LeadStatusData)
    : undefined;
};

const getNormalizedPhoneValue = (phoneValue: string | null): string => {
  if (!phoneValue) {
    return "";
  }

  const digitsOnlyValue = phoneValue.replace(/\D/g, "");

  if (digitsOnlyValue.length === 12 && digitsOnlyValue.startsWith("91")) {
    return digitsOnlyValue.slice(2);
  }

  return digitsOnlyValue;
};

const normalizeSourceOverride = (sourceOverride: string | null): string | null => {
  if (!sourceOverride || sourceOverride === "skip-mixed-sources") {
    return null;
  }

  return sourceOverride;
};

const getRowValidationErrors = (
  rawRow: LeadImportRawRowData,
  resolvedSource: string | null,
): string[] => {
  const validationErrors: string[] = [];

  if (rawRow.fullName.trim().length < 2) {
    validationErrors.push("Name must be at least 2 characters long.");
  }

  if (!/^[0-9]{10}$/.test(rawRow.phone)) {
    validationErrors.push("Phone number must be a valid 10-digit number.");
  }

  if (rawRow.email && !emailRegex.test(rawRow.email)) {
    validationErrors.push("Email address is invalid.");
  }

  if (!resolvedSource) {
    validationErrors.push("Lead source is required.");
  }

  if (rawRow.referrerPhone && !/^[0-9]{10}$/.test(rawRow.referrerPhone)) {
    validationErrors.push("Referrer phone number must be a valid 10-digit number.");
  }

  if (rawRow.carModel && !rawRow.carBrand) {
    validationErrors.push("Car brand is required when car model is provided.");
  }

  if (rawRow.status === "LOST" && !rawRow.lostReason) {
    validationErrors.push("Lost reason is required when status is LOST.");
  }

  return validationErrors;
};

const createImportRequestRow = (
  previewRow: LeadImportPreviewRowData,
): LeadImportRequestRowData => {
  return {
    budget: previewRow.budget,
    carBrand: previewRow.carBrand,
    carModel: previewRow.carModel,
    colorPreference: previewRow.colorPreference,
    email: previewRow.email,
    fullName: previewRow.fullName,
    initialNote: previewRow.initialNote,
    isUsed: previewRow.isUsed,
    lostReason: previewRow.lostReason,
    phone: previewRow.phone,
    referrerName: previewRow.referrerName,
    referrerPhone: previewRow.referrerPhone,
    rowNumber: previewRow.rowNumber,
    source: previewRow.resolvedSource ?? "",
    status: previewRow.status,
    variantName: previewRow.variantName,
  };
};
