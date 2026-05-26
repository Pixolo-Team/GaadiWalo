"use client";

// REACT //
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// TYPES //
import type { DropdownOptionData } from "@/types/dropdown";
import type {
  LeadBranchData,
  LeadCarBrandData,
  LeadListItemData,
  LeadsFilterStateData,
  LeadSourceData,
  LeadStatusOptionData,
} from "@/types/leads";

// COMPONENTS //
import FilterDropdown from "@/components/common/FilterDropdown";
import { Header } from "@/components/common/Header";
import { SearchInput } from "@/components/common/SearchInput";
import HorizontalSlider2 from "@/components/icons/neevo-icons/HorizontalSlider2";
import { CountPlaceholder } from "@/components/sales/CountPlaceholder";
import { LeadCard } from "@/components/sales/LeadCard";
import { LeadsFilterDrawer } from "@/components/sales/LeadsFilterDrawer";

// API SERVICES //
import {
  getCarBrandsRequest,
  getLeadBranchesRequest,
  getLeadSourcesRequest,
  getLeadStatusesRequest,
  getSalesLeadsRequest,
} from "@/services/api/sales-leads.api.service";

// SERVICES //
import {
  getBranchNameService,
  getPhaseLabelService,
  getSalesDashboardCacheService,
  hasSalesDashboardBranchCacheService,
  setSalesDashboardBranchCacheService,
  setSalesDashboardLeadCacheService,
} from "@/services/sales-dashboard.service";
import {
  getLeadStatusLabel,
  getLeadStatusTone,
  getLeadVehicleName,
} from "@/services/leads.service";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { toast } from "sonner";

// LIBRARIES //

const salesSortOptions = ["Newest", "Oldest"] as const;
const leadMasterDataStaleTime = 10 * 60 * 1000;
const salesLeadsStaleTime = 30 * 1000;

const initialLeadsFilterState: LeadsFilterStateData = {
  selectedBranch: "all",
  selectedCarBrand: "all",
  selectedEndDate: "",
  selectedSourceFilters: [],
  selectedStartDate: "",
  selectedStatusFilters: [],
};

/**
 * Renders sales leads listing with API data.
 */
export default function LeadsPage() {
  // Define Navigation
  const router = useRouter();
  const searchParams = useSearchParams();

  // Define Context

  // Define Refs

  // Define States
  const [appliedFilterState, setAppliedFilterState] =
    useState<LeadsFilterStateData>(initialLeadsFilterState);
  const [draftFilterState, setDraftFilterState] =
    useState<LeadsFilterStateData>(initialLeadsFilterState);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [leadSearchValue, setLeadSearchValue] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>(salesSortOptions[0]);

  // Helper Functions
  const selectedStatusQueryValue =
    searchParams.get("status")?.toLowerCase() ?? "all";
  const cachedSalesLeadItems = useMemo<LeadListItemData[]>(() => {
    return getSalesDashboardCacheService().salesLeads;
  }, []);
  const cachedLeadBranchItems = useMemo<LeadBranchData[]>(() => {
    return getSalesDashboardCacheService().leadBranchItems;
  }, []);
  const hasCachedSalesLeads = cachedSalesLeadItems.length > 0;
  const shouldFetchLeadBranches = !hasSalesDashboardBranchCacheService();

  /**
   * Resolves sales leads payload for TanStack Query.
   */
  const getSalesLeadsQueryService = async (): Promise<LeadListItemData[]> => {
    /**
     * Call get sales leads API.
     */
    const salesLeadsResponse = await getSalesLeadsRequest();

    if (salesLeadsResponse.status_code !== 200) {
      throw new Error(
        salesLeadsResponse.error ??
          salesLeadsResponse.message ??
          "Unable to load sales leads.",
      );
    }

    const salesLeadItems = salesLeadsResponse.data ?? [];
    setSalesDashboardLeadCacheService(salesLeadItems);

    return salesLeadItems;
  };

  /**
   * Resolves lead statuses payload for TanStack Query.
   */
  const getLeadStatusesQueryService = async (): Promise<
    LeadStatusOptionData[]
  > => {
    /**
     * Call get lead statuses API.
     */
    const leadStatusesResponse = await getLeadStatusesRequest();

    if (leadStatusesResponse.status_code !== 200) {
      throw new Error(
        leadStatusesResponse.error ??
          leadStatusesResponse.message ??
          "Unable to load lead statuses.",
      );
    }

    return leadStatusesResponse.data ?? [];
  };

  /**
   * Resolves lead sources payload for TanStack Query.
   */
  const getLeadSourcesQueryService = async (): Promise<LeadSourceData[]> => {
    /**
     * Call get lead sources API.
     */
    const leadSourcesResponse = await getLeadSourcesRequest();

    if (leadSourcesResponse.status_code !== 200) {
      throw new Error(
        leadSourcesResponse.error ??
          leadSourcesResponse.message ??
          "Unable to load lead sources.",
      );
    }

    return leadSourcesResponse.data ?? [];
  };

  /**
   * Resolves lead branches payload for TanStack Query.
   */
  const getLeadBranchesQueryService = async (): Promise<LeadBranchData[]> => {
    /**
     * Call get lead branches API.
     */
    const leadBranchesResponse = await getLeadBranchesRequest();

    if (leadBranchesResponse.status_code !== 200) {
      throw new Error(
        leadBranchesResponse.error ??
          leadBranchesResponse.message ??
          "Unable to load lead branches.",
      );
    }

    // Persist shared branch cache so dashboard and leads reuse the same data.
    const leadBranchValues = leadBranchesResponse.data ?? [];
    setSalesDashboardBranchCacheService(leadBranchValues);

    return leadBranchValues;
  };

  /**
   * Resolves car brand payload for TanStack Query.
   */
  const getLeadCarBrandsQueryService = async (): Promise<
    LeadCarBrandData[]
  > => {
    /**
     * Call get car brands API.
     */
    const leadCarBrandsResponse = await getCarBrandsRequest();

    if (leadCarBrandsResponse.status_code !== 200) {
      throw new Error(
        leadCarBrandsResponse.error ??
          leadCarBrandsResponse.message ??
          "Unable to load car brands.",
      );
    }

    return leadCarBrandsResponse.data ?? [];
  };

  /**
   * Loads leads list with short-lived cache for smooth back navigation.
   */
  const {
    data: salesLeads = [],
    error: salesLeadsError,
    isLoading: isSalesLeadsLoading,
    isFetched: hasSalesLeadsFetched,
  } = useQuery<LeadListItemData[]>({
    initialData: hasCachedSalesLeads ? cachedSalesLeadItems : undefined,
    queryKey: ["sales-leads"],
    queryFn: getSalesLeadsQueryService,
    staleTime: salesLeadsStaleTime,
  });
  const shouldShowLeadsCountPlaceholders =
    isSalesLeadsLoading && !hasCachedSalesLeads && !hasSalesLeadsFetched;

  /**
   * Loads lead status master data with longer cache.
   */
  const { data: leadStatusItems = [], error: leadStatusesError } = useQuery<
    LeadStatusOptionData[]
  >({
    queryKey: ["lead-statuses"],
    queryFn: getLeadStatusesQueryService,
    staleTime: leadMasterDataStaleTime,
  });

  /**
   * Loads lead source master data with longer cache.
   */
  const { data: leadSourceItems = [], error: leadSourcesError } = useQuery<
    LeadSourceData[]
  >({
    queryKey: ["lead-sources"],
    queryFn: getLeadSourcesQueryService,
    staleTime: leadMasterDataStaleTime,
  });

  /**
   * Loads lead branch master data with longer cache.
   */
  const { data: leadBranchItems = [], error: leadBranchesError } = useQuery<
    LeadBranchData[]
  >({
    enabled: shouldFetchLeadBranches,
    initialData: cachedLeadBranchItems,
    queryKey: ["lead-branches"],
    queryFn: getLeadBranchesQueryService,
    staleTime: leadMasterDataStaleTime,
  });

  /**
   * Loads car brand master data with longer cache.
   */
  const { data: leadCarBrandItems = [], error: leadCarBrandsError } = useQuery<
    LeadCarBrandData[]
  >({
    queryKey: ["lead-car-brands"],
    queryFn: getLeadCarBrandsQueryService,
    staleTime: leadMasterDataStaleTime,
  });

  const statusTabItems = useMemo(() => {
    const dynamicStatusTabs = leadStatusItems.map((statusItem) => ({
      count: salesLeads.filter(
        (leadItem) => leadItem.status === statusItem.name,
      ).length,
      key: statusItem.name.toLowerCase(),
      label: getPhaseLabelService(statusItem.name),
    }));

    return [
      {
        count: salesLeads.length,
        key: "all",
        label: "All",
      },
      ...dynamicStatusTabs,
    ];
  }, [leadStatusItems, salesLeads]);

  const branchOptions = useMemo<DropdownOptionData[]>(() => {
    const normalizedBranchOptions = leadBranchItems
      .map((branchItem) => getBranchNameService(branchItem))
      .filter(Boolean)
      .map((branchValue) => ({
        label: branchValue,
        value: branchValue,
      }));

    return [
      { label: "All Branches", value: "all" },
      ...normalizedBranchOptions,
    ];
  }, [leadBranchItems]);

  const carBrandOptions = useMemo<DropdownOptionData[]>(() => {
    const normalizedCarBrandOptions = leadCarBrandItems.map((carBrandItem) => ({
      label: carBrandItem.name,
      value: carBrandItem.name,
    }));

    return [
      { label: "All Brands", value: "all" },
      ...normalizedCarBrandOptions,
    ];
  }, [leadCarBrandItems]);

  const sourceFilterOptions = useMemo<string[]>(
    () => ["All", ...leadSourceItems.map((sourceItem) => sourceItem.name)],
    [leadSourceItems],
  );

  const statusFilterOptions = useMemo<string[]>(
    () => [
      "All",
      ...leadStatusItems.map((statusItem) =>
        getPhaseLabelService(statusItem.name),
      ),
    ],
    [leadStatusItems],
  );

  const filteredLeads = useMemo(() => {
    const normalizedSearchValue = leadSearchValue.trim().toLowerCase();

    const visibleLeadItems = salesLeads.filter((leadItem) => {
      const normalizedLeadStatus = leadItem.status.toLowerCase();
      const statusLabelValue = getLeadStatusLabel(leadItem.status);

      if (
        selectedStatusQueryValue !== "all" &&
        normalizedLeadStatus !== selectedStatusQueryValue
      ) {
        return false;
      }

      if (
        appliedFilterState.selectedStatusFilters.length > 0 &&
        !appliedFilterState.selectedStatusFilters.includes(statusLabelValue)
      ) {
        return false;
      }

      if (
        appliedFilterState.selectedSourceFilters.length > 0 &&
        !appliedFilterState.selectedSourceFilters.includes(leadItem.source)
      ) {
        return false;
      }

      if (
        appliedFilterState.selectedBranch !== "all" &&
        leadItem.branch !== appliedFilterState.selectedBranch
      ) {
        return false;
      }

      if (
        appliedFilterState.selectedCarBrand !== "all" &&
        leadItem.carBrand !== appliedFilterState.selectedCarBrand
      ) {
        return false;
      }

      const leadDateValue = leadItem.updatedAt ?? leadItem.createdAt ?? null;
      const leadDateObject = leadDateValue ? new Date(leadDateValue) : null;

      if (appliedFilterState.selectedStartDate && leadDateObject) {
        const startDateObject = new Date(appliedFilterState.selectedStartDate);
        if (leadDateObject < startDateObject) {
          return false;
        }
      }

      if (appliedFilterState.selectedEndDate && leadDateObject) {
        const endDateObject = new Date(appliedFilterState.selectedEndDate);
        endDateObject.setHours(23, 59, 59, 999);

        if (leadDateObject > endDateObject) {
          return false;
        }
      }

      if (!normalizedSearchValue) {
        return true;
      }

      return (
        leadItem.fullName.toLowerCase().includes(normalizedSearchValue) ||
        leadItem.phone.includes(normalizedSearchValue) ||
        leadItem.source.toLowerCase().includes(normalizedSearchValue) ||
        getLeadVehicleName(leadItem)
          .toLowerCase()
          .includes(normalizedSearchValue)
      );
    });

    return [...visibleLeadItems].sort((firstLeadItem, secondLeadItem) => {
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

      return selectedSort === "Oldest"
        ? firstLeadTime - secondLeadTime
        : secondLeadTime - firstLeadTime;
    });
  }, [
    appliedFilterState,
    leadSearchValue,
    salesLeads,
    selectedSort,
    selectedStatusQueryValue,
  ]);

  const handleOpenFilterDrawer = (): void => {
    setDraftFilterState(appliedFilterState);
    setIsFilterDrawerOpen(true);
  };

  const handleStatusTabChange = (statusKey: string): void => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (statusKey === "all") {
      nextSearchParams.delete("status");
    } else {
      nextSearchParams.set("status", statusKey.toLowerCase());
    }

    router.push(
      nextSearchParams.toString()
        ? `${ROUTES.sales.leads}?${nextSearchParams.toString()}`
        : ROUTES.sales.leads,
    );
  };

  const handleApplyFilters = (): void => {
    setAppliedFilterState(draftFilterState);
    setIsFilterDrawerOpen(false);
  };

  const handleClearFilters = (): void => {
    setAppliedFilterState(initialLeadsFilterState);
    setDraftFilterState(initialLeadsFilterState);
  };

  // Use Effects
  useEffect(() => {
    if (
      salesLeadsError ||
      leadStatusesError ||
      leadSourcesError ||
      leadBranchesError ||
      leadCarBrandsError
    ) {
      // Show safe query error feedback once queries fail.
      toast.error("Unable to load leads right now. Please try again.");
    }
  }, [
    leadBranchesError,
    leadCarBrandsError,
    leadSourcesError,
    leadStatusesError,
    salesLeadsError,
  ]);

  return (
    <section className="bg-n-100 h-full">
      {/* Leads page shell */}
      <div className="flex h-full flex-col">
        {/* Leads header container */}
        <div className="shrink-0">
          <Header
            title="My Leads"
            rightIcon={
              <HorizontalSlider2
                primaryColor="var(--color-n-700)"
                className="size-5"
              />
            }
            onRightIconClick={handleOpenFilterDrawer}
          />
        </div>

        {/* Leads scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {/* Search controls */}
            <div className="flex flex-col gap-3">
              <SearchInput
                value={leadSearchValue}
                onChange={setLeadSearchValue}
                placeholder="Search by name, phone, car..."
              />

              {/* Status tabs */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {statusTabItems.map((statusTabItem) => {
                  const isActive =
                    selectedStatusQueryValue === statusTabItem.key;

                  return (
                    <button
                      key={statusTabItem.key}
                      type="button"
                      onClick={() => handleStatusTabChange(statusTabItem.key)}
                      className={`font-secondary shrink-0 rounded-3xl border px-5 py-3 text-sm ${
                        isActive
                          ? "border-blue-600 bg-blue-600 font-bold text-white"
                          : "border-n-200 bg-n-50 text-n-700"
                      }`}
                    >
                      {statusTabItem.label}
                      {shouldShowLeadsCountPlaceholders ? (
                        <span className="inline-flex items-center">
                          {" "}
                          (
                          <CountPlaceholder className="mx-1 h-4 w-5 rounded-xl align-middle" />
                          )
                        </span>
                      ) : (
                        ` (${statusTabItem.count})`
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leads list section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-secondary text-n-500 text-xs">
                  {shouldShowLeadsCountPlaceholders ? (
                    <span className="inline-flex items-center gap-1">
                      <span>Showing</span>
                      <CountPlaceholder className="h-3.5 w-5 rounded-xl" />
                      <span>leads</span>
                    </span>
                  ) : (
                    `Showing ${filteredLeads.length} leads`
                  )}
                </p>

                <FilterDropdown
                  title={salesSortOptions[0]}
                  prefix="Sort: "
                  options={salesSortOptions}
                  selectedOption={selectedSort}
                  onChange={setSelectedSort}
                />
              </div>

              {/* Leads list */}
              <div className="flex flex-col gap-3">
                {isSalesLeadsLoading ? (
                  <p className="font-secondary text-n-600 py-6 text-center text-sm">
                    Loading leads...
                  </p>
                ) : null}

                {!isSalesLeadsLoading && filteredLeads.length === 0 ? (
                  <p className="font-secondary text-n-600 py-6 text-center text-sm">
                    No leads found.
                  </p>
                ) : null}

                {!isSalesLeadsLoading
                  ? filteredLeads.map((leadItem) => (
                      <LeadCard
                        key={leadItem.id}
                        href={ROUTES.sales.leadDetails(leadItem.id)}
                        name={leadItem.fullName}
                        phoneNumber={leadItem.phone}
                        source={leadItem.source}
                        statusLabel={getLeadStatusLabel(leadItem.status)}
                        statusTone={getLeadStatusTone(leadItem.status)}
                        vehicleName={getLeadVehicleName(leadItem)}
                      />
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>

        {/* Filter drawer */}
        <LeadsFilterDrawer
          branchOptions={branchOptions}
          carBrandOptions={carBrandOptions}
          filterState={draftFilterState}
          isOpen={isFilterDrawerOpen}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          onFilterStateChange={setDraftFilterState}
          onOpenChange={setIsFilterDrawerOpen}
          sourceFilterOptions={sourceFilterOptions}
          statusFilterOptions={statusFilterOptions}
        />
      </div>
    </section>
  );
}
