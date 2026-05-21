// TYPES //
import type { LeadListItemData, LeadStatusData } from "@/types/leads";

const INDIA_TIMEZONE = "Asia/Kolkata";

/**
 * Resolves greeting text from local time.
 */
export const getGreetingService = (): string => {
  const hourValue = new Date().getHours();

  if (hourValue < 12) {
    return "Good Morning";
  }

  if (hourValue < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

/**
 * Resolves status label from API enum value.
 */
export const getStatusLabelService = (statusValue: LeadStatusData): string => {
  if (statusValue === "TEST_DRIVE") {
    return "Test Drive";
  }

  if (statusValue === "VEHICLE_NA") {
    return "Vehicle NA";
  }

  return statusValue.charAt(0) + statusValue.slice(1).toLowerCase();
};

/**
 * Resolves lead card tone from API status value.
 */
export const getStatusToneService = (
  statusValue: LeadStatusData,
): "amber" | "blue" | "green" | "purple" | "red" => {
  if (statusValue === "NEW") {
    return "blue";
  }

  if (statusValue === "CONTACTED") {
    return "amber";
  }

  if (statusValue === "WON") {
    return "green";
  }

  if (statusValue === "LOST" || statusValue === "VEHICLE_NA") {
    return "red";
  }

  return "purple";
};

/**
 * Builds display vehicle title from API fields.
 */
export const getVehicleNameService = (leadItem: LeadListItemData): string => {
  const vehicleValues = [
    leadItem.carBrand,
    leadItem.carModel,
    leadItem.variantName,
  ].filter((valueItem): valueItem is string => Boolean(valueItem));

  return vehicleValues.length > 0 ? vehicleValues.join(" ") : "Not specified";
};

/**
 * Resolves initials from profile or auth user name.
 */
export const getAvatarLabelService = (sourceName: string): string => {
  const nameParts = sourceName
    .trim()
    .split(" ")
    .filter((namePartItem) => Boolean(namePartItem));

  if (nameParts.length === 0) {
    return "SU";
  }

  return nameParts
    .slice(0, 2)
    .map((namePartItem) => namePartItem.charAt(0).toUpperCase())
    .join("");
};

/**
 * Checks whether a date-time value belongs to today.
 */
export const isTodayService = (
  dateValue: string | null | undefined,
): boolean => {
  if (!dateValue) {
    return false;
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const parsedDateLabel = parsedDate.toLocaleDateString("en-CA", {
    timeZone: INDIA_TIMEZONE,
  });
  const todayDateLabel = new Date().toLocaleDateString("en-CA", {
    timeZone: INDIA_TIMEZONE,
  });

  return parsedDateLabel === todayDateLabel;
};
