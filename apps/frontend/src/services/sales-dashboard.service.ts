// TYPES //
import type {
  LeadBranchData,
  LeadListItemData,
  LeadStatusData,
  LeadStatusOptionData,
} from "@/types/leads";

/**
 * Resolves greeting text from current local time.
 */
export const getGreetingService = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good Morning";
  }

  if (currentHour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

/**
 * Resolves initials from user full name.
 */
export const getAvatarLabelService = (nameValue: string): string => {
  return nameValue
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((wordItem) => wordItem.charAt(0).toUpperCase())
    .join("");
};

/**
 * Resolves API status into page card key.
 */
export const getPhaseKeyService = (statusValue: LeadStatusData): string => {
  return statusValue.toLowerCase();
};

/**
 * Resolves user-facing phase label from API status.
 */
export const getPhaseLabelService = (statusValue: LeadStatusData): string => {
  return statusValue
    .split("_")
    .map((wordItem) => wordItem.charAt(0) + wordItem.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Resolves branch name from flexible API payload fields.
 */
export const getBranchNameService = (branchItem: LeadBranchData): string => {
  return (
    branchItem.name ??
    branchItem.label ??
    branchItem.branch ??
    branchItem.value ??
    branchItem.id ??
    ""
  );
};

/**
 * Checks whether a timestamp falls on today in IST.
 */
export const isTodayService = (dateValue: string | null | undefined): boolean => {
  if (!dateValue) {
    return false;
  }

  const targetDate = new Date(dateValue);

  if (Number.isNaN(targetDate.getTime())) {
    return false;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Kolkata",
    year: "numeric",
  });

  return formatter.format(targetDate) === formatter.format(new Date());
};

/**
 * Resolves whether a lead should count in Won Today summary.
 */
export const isWonTodayService = (leadItem: LeadListItemData): boolean => {
  if (leadItem.status !== "WON") {
    return false;
  }

  return isTodayService(
    leadItem.wonAt ??
      leadItem.statusChangedAt ??
      leadItem.statusUpdatedAt ??
      leadItem.updatedAt ??
      leadItem.createdAt ??
      null,
  );
};

/**
 * Builds phase card rows from API statuses and leads.
 */
export const getPhaseCardsService = (
  leadStatusItems: LeadStatusOptionData[],
  salesLeads: LeadListItemData[],
): { count: number; key: string; label: string }[] => {
  const phaseCardItems = leadStatusItems.map((statusItem) => {
    const phaseKey = getPhaseKeyService(statusItem.name);

    return {
      count: salesLeads.filter((leadItem) => leadItem.status === statusItem.name)
        .length,
      key: phaseKey,
      label: getPhaseLabelService(statusItem.name),
    };
  });

  return [
    {
      count: salesLeads.length,
      key: "all",
      label: "All",
    },
    ...phaseCardItems,
  ];
};
