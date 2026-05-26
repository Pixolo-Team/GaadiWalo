// TYPES //
import type {
  LeadBranchData,
  LeadListItemData,
  LeadStatusData,
  LeadStatusOptionData,
} from "@/types/leads";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";

export interface SalesDashboardSummaryMetricItemData {
  key: string;
  label: string;
  value: string;
}

export interface SalesDashboardHydratedCacheData {
  leadBranchItems: LeadBranchData[];
  salesLeads: LeadListItemData[];
}

export const ALL_BRANCHES_OPTION = "All Branches";

/**
 * Defines static lead statuses shown in dashboard phase cards.
 */
export const dashboardLeadStatusItems: LeadStatusOptionData[] = [
  {
    id: "new",
    name: "NEW",
    reason: [],
  },
  {
    id: "contacted",
    name: "CONTACTED",
    reason: [],
  },
  {
    id: "interested",
    name: "INTERESTED",
    reason: [],
  },
  {
    id: "negotiation",
    name: "NEGOTIATION",
    reason: [],
  },
  {
    id: "test-drive",
    name: "TEST_DRIVE",
    reason: [],
  },
  {
    id: "vehicle-na",
    name: "VEHICLE_NA",
    reason: [],
  },
  {
    id: "won",
    name: "WON",
    reason: [],
  },
  {
    id: "lost",
    name: "LOST",
    reason: [],
  },
];

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
 * Reads persisted dashboard cache safely from localStorage.
 */
export const getSalesDashboardCacheService =
  (): SalesDashboardHydratedCacheData => {
    if (typeof window === "undefined") {
      return {
        leadBranchItems: [],
        salesLeads: [],
      };
    }

    try {
      const cachedSalesLeads = window.localStorage.getItem(
        CONSTANTS.DASHBOARD_LEADS_CACHE_KEY,
      );
      const cachedLeadBranches = window.localStorage.getItem(
        CONSTANTS.DASHBOARD_BRANCHES_CACHE_KEY,
      );

      return {
        leadBranchItems: cachedLeadBranches
          ? (JSON.parse(cachedLeadBranches) as LeadBranchData[])
          : [],
        salesLeads: cachedSalesLeads
          ? (JSON.parse(cachedSalesLeads) as LeadListItemData[])
          : [],
      };
    } catch {
      return {
        leadBranchItems: [],
        salesLeads: [],
      };
    }
  };

/**
 * Resolves whether branch cache already exists in storage.
 */
export const hasSalesDashboardBranchCacheService = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    window.localStorage.getItem(CONSTANTS.DASHBOARD_BRANCHES_CACHE_KEY),
  );
};

/**
 * Reads the previously selected dashboard branch from storage.
 */
export const getStoredDashboardBranchFilterService = (): string => {
  if (typeof window === "undefined") {
    return ALL_BRANCHES_OPTION;
  }

  return (
    window.localStorage.getItem(CONSTANTS.DASHBOARD_BRANCH_FILTER_KEY) ??
    ALL_BRANCHES_OPTION
  );
};

/**
 * Persists dashboard lead cache.
 */
export const setSalesDashboardLeadCacheService = (
  salesLeads: LeadListItemData[],
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CONSTANTS.DASHBOARD_LEADS_CACHE_KEY,
    JSON.stringify(salesLeads),
  );
};

/**
 * Persists dashboard branch cache.
 */
export const setSalesDashboardBranchCacheService = (
  leadBranchItems: LeadBranchData[],
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CONSTANTS.DASHBOARD_BRANCHES_CACHE_KEY,
    JSON.stringify(leadBranchItems),
  );
};

/**
 * Persists selected dashboard branch filter.
 */
export const setStoredDashboardBranchFilterService = (
  branchNameValue: string,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CONSTANTS.DASHBOARD_BRANCH_FILTER_KEY,
    branchNameValue,
  );
};

/**
 * Normalizes branch values before comparing dashboard filters.
 */
export const getNormalizedDashboardBranchNameService = (
  branchValue: string,
): string => {
  return branchValue.trim().toLowerCase();
};

/**
 * Resolves dashboard branch dropdown options.
 */
export const getDashboardBranchLocationOptionsService = (
  leadBranchItems: LeadBranchData[],
  userBranchValue: string | null | undefined,
): string[] => {
  const branchNameValues = Array.from(
    new Set(
      leadBranchItems
        .map((branchItem) => getBranchNameService(branchItem))
        .filter(Boolean),
    ),
  );

  if (branchNameValues.length > 0) {
    return [ALL_BRANCHES_OPTION, ...branchNameValues];
  }

  return userBranchValue
    ? [ALL_BRANCHES_OPTION, userBranchValue]
    : [ALL_BRANCHES_OPTION];
};

/**
 * Resolves the active dashboard branch filter from selection and options.
 */
export const getResolvedDashboardBranchNameService = (
  branchLocationOptions: string[],
  selectedBranchName: string,
  userBranchValue: string | null | undefined,
): string => {
  if (branchLocationOptions.includes(selectedBranchName)) {
    return selectedBranchName;
  }

  if (branchLocationOptions.includes(ALL_BRANCHES_OPTION)) {
    return ALL_BRANCHES_OPTION;
  }

  return branchLocationOptions[0] ?? userBranchValue ?? ALL_BRANCHES_OPTION;
};

/**
 * Filters dashboard leads by selected branch when branch data exists.
 */
export const getFilteredDashboardBranchLeadItemsService = (
  salesLeads: LeadListItemData[],
  resolvedBranchName: string,
): LeadListItemData[] => {
  if (
    !resolvedBranchName ||
    resolvedBranchName === ALL_BRANCHES_OPTION
  ) {
    return salesLeads;
  }

  const hasLeadBranchValues = salesLeads.some((leadItem) =>
    Boolean(leadItem.branch?.trim()),
  );

  if (!hasLeadBranchValues) {
    return salesLeads;
  }

  const normalizedSelectedBranchName =
    getNormalizedDashboardBranchNameService(resolvedBranchName);

  return salesLeads.filter((leadItem) => {
    const normalizedLeadBranchName = getNormalizedDashboardBranchNameService(
      leadItem.branch ?? "",
    );

    return normalizedLeadBranchName === normalizedSelectedBranchName;
  });
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

/**
 * Filters and sorts recent dashboard leads for the selected phase.
 */
export const getFilteredRecentLeadItemsService = (
  filteredBranchLeadItems: LeadListItemData[],
  selectedPhaseKey: string,
): LeadListItemData[] => {
  const phaseFilteredLeadItems =
    selectedPhaseKey === "all"
      ? filteredBranchLeadItems
      : filteredBranchLeadItems.filter(
          (leadItem) => leadItem.status.toLowerCase() === selectedPhaseKey,
        );

  return [...phaseFilteredLeadItems]
    .sort((firstLeadItem, secondLeadItem) => {
      const firstLeadTime = new Date(
        firstLeadItem.updatedAt ??
          firstLeadItem.createdAt ??
          "1970-01-01T00:00:00.000Z",
      ).getTime();
      const secondLeadTime = new Date(
        secondLeadItem.updatedAt ??
          secondLeadItem.createdAt ??
          "1970-01-01T00:00:00.000Z",
      ).getTime();

      return secondLeadTime - firstLeadTime;
    })
    .slice(0, 5);
};

/**
 * Builds dashboard summary metrics from filtered branch leads.
 */
export const getDashboardSummaryMetricsService = (
  filteredBranchLeadItems: LeadListItemData[],
): SalesDashboardSummaryMetricItemData[] => {
  return [
    {
      key: "calls-due",
      label: "Calls Due",
      value: String(
        filteredBranchLeadItems.filter((leadItem) =>
          ["CONTACTED", "INTERESTED", "NEGOTIATION", "TEST_DRIVE"].includes(
            leadItem.status,
          ),
        ).length,
      ).padStart(2, "0"),
    },
    {
      key: "new-leads",
      label: "New Leads",
      value: String(
        filteredBranchLeadItems.filter((leadItem) => leadItem.status === "NEW")
          .length,
      ).padStart(2, "0"),
    },
    {
      key: "won-today",
      label: "Won Today",
      value: String(
        filteredBranchLeadItems.filter((leadItem) => isWonTodayService(leadItem))
          .length,
      ).padStart(2, "0"),
    },
  ];
};
