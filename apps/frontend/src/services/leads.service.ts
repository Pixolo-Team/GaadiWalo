// TYPES //
import type {
  LeadActivityData,
  LeadActivityViewData,
  LeadDetailsData,
  LeadInfoRowData,
  LeadListItemData,
  LeadNoteData,
  LeadNoteViewData,
  LeadProfileViewData,
  LeadStatusData,
  LeadStatusOptionData,
  LeadStatusToneData,
} from "@/types/leads";

/**
 * Centralized tone map for every lead status.
 */
export const leadStatusToneMap: Record<LeadStatusData, LeadStatusToneData> = {
  NEW: "blue",
  CONTACTED: "amber",
  INTERESTED: "purple",
  TEST_DRIVE: "cyan",
  NEGOTIATION: "pink",
  WON: "green",
  LOST: "red",
  VEHICLE_NA: "orange",
};

/**
 * Formats API datetime value into short UI text.
 */
export const getFormattedDateValue = (dateValue: string | null): string => {
  if (!dateValue) {
    return "";
  }

  const dateObject = new Date(dateValue);
  return dateObject.toLocaleString();
};

/**
 * Resolves display tone class key from lead status.
 */
export const getLeadStatusTone = (
  statusValue: LeadStatusData,
): LeadStatusToneData => {
  return leadStatusToneMap[statusValue];
};

/**
 * Maps API lead status to user-facing label.
 */
export const getLeadStatusLabel = (statusValue: LeadStatusData): string => {
  return statusValue
    .split("_")
    .map((wordItem) => wordItem.charAt(0) + wordItem.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Builds display-ready vehicle name from lead fields.
 */
export const getLeadVehicleName = (leadItem: LeadListItemData): string => {
  const vehicleValues = [
    leadItem.carBrand,
    leadItem.carModel,
    leadItem.variantName,
  ].filter((valueItem): valueItem is string => Boolean(valueItem));

  return vehicleValues.length > 0 ? vehicleValues.join(" ") : "Not specified";
};

/**
 * Resolves user-facing label for reason value.
 */
export const getReasonLabel = (reasonValue: string): string => {
  return reasonValue
    .split("_")
    .map((wordItem) => wordItem.charAt(0) + wordItem.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Maps lead status API options into dropdown options.
 */
export const getLeadStatusOptions = (
  leadStatusItems: LeadStatusOptionData[],
): { label: string; value: string }[] => {
  return leadStatusItems.map((statusItem) => ({
    label: getLeadStatusLabel(statusItem.name),
    value: statusItem.name,
  }));
};

/**
 * Maps lost reason API values into dropdown options.
 */
export const getLostReasonOptions = (
  leadStatusItems: LeadStatusOptionData[],
  selectedLeadStatus: LeadStatusData,
): { label: string; value: string }[] => {
  const selectedStatusItem = leadStatusItems.find(
    (statusItem) => statusItem.name === selectedLeadStatus,
  );

  return (selectedStatusItem?.reason ?? []).map((reasonItem) => ({
    label: getReasonLabel(reasonItem),
    value: reasonItem,
  }));
};

/**
 * Maps lead details payload into profile view data.
 */
export const getLeadProfileView = (
  leadDetails: LeadDetailsData | null,
): LeadProfileViewData | null => {
  if (!leadDetails) {
    return null;
  }

  return {
    age: "",
    avatarLabel: leadDetails.fullName
      .split(" ")
      .slice(0, 2)
      .map((wordItem) => wordItem.charAt(0).toUpperCase())
      .join(""),
    name: leadDetails.fullName,
    phoneNumber: leadDetails.phone,
    status: getLeadStatusLabel(leadDetails.status),
    statusTone: getLeadStatusTone(leadDetails.status),
  };
};

/**
 * Maps lead details payload into contact info rows.
 */
export const getLeadContactInfoRows = (
  leadDetails: LeadDetailsData | null,
): LeadInfoRowData[] => {
  if (!leadDetails) {
    return [];
  }

  return [
    {
      isHighlighted: true,
      key: "phone",
      label: "Phone",
      value: leadDetails.phone,
    },
    {
      isHighlighted: false,
      key: "email",
      label: "Email",
      value: leadDetails.email ?? "-",
    },
    {
      isHighlighted: false,
      key: "source",
      label: "Source",
      value: leadDetails.source,
    },
    {
      isHighlighted: false,
      key: "updated-at",
      label: "Updated",
      value: getFormattedDateValue(leadDetails.updatedAt) || "-",
    },
  ];
};

/**
 * Maps lead details payload into car interest rows.
 */
export const getLeadCarInterestRows = (
  leadDetails: LeadDetailsData | null,
): LeadInfoRowData[] => {
  if (!leadDetails) {
    return [];
  }

  return [
    {
      isHighlighted: true,
      key: "car-brand",
      label: "Car Brand",
      value: leadDetails.carBrand ?? "-",
    },
    {
      isHighlighted: false,
      key: "car-model",
      label: "Car Model",
      value: leadDetails.carModel ?? "-",
    },
    {
      isHighlighted: false,
      key: "budget",
      label: "Budget",
      value: leadDetails.budget ?? "-",
    },
  ];
};

/**
 * Maps lead activities payload into timeline view data.
 */
export const getLeadActivityViews = (
  leadActivities: LeadActivityData[],
): LeadActivityViewData[] => {
  return leadActivities.map((activityItem) => {
    const tone: "amber" | "blue" | "green" | "neutral" | "purple" =
      activityItem.type === "status_change"
        ? "purple"
        : activityItem.type === "note"
          ? "blue"
          : activityItem.type === "system"
            ? "green"
            : activityItem.type === "call"
              ? "amber"
              : "neutral";

    const type: "calendar" | "call" | "lead" | "status" | "whatsapp" =
      activityItem.type === "status_change"
        ? "status"
        : activityItem.type === "note"
          ? "calendar"
          : activityItem.type === "system"
            ? "lead"
            : activityItem.type === "call"
              ? "call"
              : "whatsapp";

    return {
      description: activityItem.description,
      key: activityItem.id,
      meta: getFormattedDateValue(activityItem.createdAt),
      tone,
      type,
    };
  });
};

/**
 * Maps lead notes payload into notes view data.
 */
export const getLeadNoteViews = (
  leadNotes: LeadNoteData[],
): LeadNoteViewData[] => {
  return leadNotes.map((noteItem) => ({
    author: noteItem.author?.name ?? "Unknown",
    key: noteItem.id,
    message: noteItem.content,
    meta: getFormattedDateValue(noteItem.createdAt),
    variant: "outgoing",
  }));
};
