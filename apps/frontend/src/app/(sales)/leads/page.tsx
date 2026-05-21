"use client";

// REACT //
import { useEffect, useState } from "react";

// LIBRARIES //
import { useRouter, useSearchParams } from "next/navigation";

// COMPONENTS //
import FilterDropdown from "@/components/common/FilterDropdown";
import { Header } from "@/components/common/Header";
import { SearchInput } from "@/components/common/SearchInput";
import HorizontalSlider2 from "@/components/icons/neevo-icons/HorizontalSlider2";
import { LeadCard } from "@/components/sales/LeadCard";
import { LeadsFilterDrawer } from "@/components/sales/LeadsFilterDrawer";

// SERVICES //
import {
  getCarBrandsRequest,
  getLeadBranchesRequest,
  getLeadSourcesRequest,
  getLeadStatusesRequest,
  getSalesLeadsRequest,
} from "@/services/api/sales-leads.api.service";
import {
  getStatusLabelService,
  getStatusToneService,
  getVehicleNameService,
} from "@/services/sales-dashboard.service";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { DropdownOptionData } from "@/types/dropdown";
import type {
  LeadBranchData,
  LeadCarBrandData,
  LeadListItemData,
  LeadSourceData,
  LeadStatusOptionData,
  LeadsFilterStateData,
} from "@/types/leads";

// OTHERS //
import { toast } from "sonner";

const salesSortOptions = ["Newest", "Oldest"] as const;
const allFilterOptionData = { label: "All", value: "all" } as const;
const initialLeadsFilterStateData: LeadsFilterStateData = {
  selectedBranch: allFilterOptionData.value,
  selectedCarBrand: allFilterOptionData.value,
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

  // Define Context
  const searchParams = useSearchParams();

  // Define Refs

  // Define States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [leadSearchValue, setLeadSearchValue] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>(salesSortOptions[0]);
  const [isLeadsLoading, setIsLeadsLoading] = useState<boolean>(true);
  const [draftFilterState, setDraftFilterState] =
    useState<LeadsFilterStateData>(initialLeadsFilterStateData);
  const [appliedFilterState, setAppliedFilterState] =
    useState<LeadsFilterStateData>(initialLeadsFilterStateData);
  const [branchOptions, setBranchOptions] = useState<DropdownOptionData[]>([
    allFilterOptionData,
  ]);
  const [carBrandOptions, setCarBrandOptions] = useState<DropdownOptionData[]>([
    allFilterOptionData,
  ]);
  const [sourceFilterOptions, setSourceFilterOptions] = useState<string[]>([
    "All",
  ]);
  const [leadStatusItems, setLeadStatusItems] = useState<LeadStatusOptionData[]>(
    [],
  );
  const [salesLeads, setSalesLeads] = useState<LeadListItemData[]>([]);

  // Helper Functions
  const handleOpenFilterDrawer = (): void => {
    setDraftFilterState(appliedFilterState);
    setIsFilterDrawerOpen(true);
  };

  const handleClearFilters = (): void => {
    setDraftFilterState(initialLeadsFilterStateData);
    setAppliedFilterState(initialLeadsFilterStateData);
  };

  const handleApplyFilters = (): void => {
    setAppliedFilterState(draftFilterState);
  };

  /**
   * Fetches leads list payload.
   */
  const fetchSalesLeadsService = (): void => {
    /**
     * Call get sales leads API.
     */
    getSalesLeadsRequest()
      .then((response: ApiResponseData<LeadListItemData[]>) => {
        if (response.status_code === 200) {
          // Set sales leads state
          setSalesLeads(response.data ?? []);
        } else {
          // Reset sales leads state
          setSalesLeads([]);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load leads right now. Please try again.");

        // Reset sales leads state
        setSalesLeads([]);
      })
      .finally(() => {
        // Set loading state to false
        setIsLeadsLoading(false);
      });
  };

  /**
   * Fetches lead status master items.
   */
  const fetchLeadStatusesService = (): void => {
    /**
     * Call get lead statuses API.
     */
    getLeadStatusesRequest()
      .then((response: ApiResponseData<LeadStatusOptionData[]>) => {
        if (response.status_code === 200) {
          // Set lead status items state
          setLeadStatusItems(response.data ?? []);
        } else {
          // Reset lead status items state
          setLeadStatusItems([]);
        }
      })
      .catch(() => {
        // Reset lead status items state
        setLeadStatusItems([]);
      });
  };

  /**
   * Fetches lead source filter options.
   */
  const fetchLeadSourcesService = (): void => {
    /**
     * Call get lead sources API.
     */
    getLeadSourcesRequest()
      .then((response: ApiResponseData<LeadSourceData[]>) => {
        if (response.status_code === 200) {
          // Set lead source options state
          setSourceFilterOptions([
            "All",
            ...(response.data ?? []).map((leadSourceItem) =>
              leadSourceItem.name.toUpperCase(),
            ),
          ]);
        } else {
          // Reset lead source options state
          setSourceFilterOptions(["All"]);
        }
      })
      .catch(() => {
        // Reset lead source options state
        setSourceFilterOptions(["All"]);
      });
  };

  /**
   * Fetches branch filter options.
   */
  const fetchLeadBranchesService = (): void => {
    /**
     * Call get lead branches API.
     */
    getLeadBranchesRequest()
      .then((response: ApiResponseData<LeadBranchData[]>) => {
        if (response.status_code === 200) {
          // Set lead branch options state
          setBranchOptions([
            allFilterOptionData,
            ...(response.data ?? []).map((leadBranchItem) => ({
              label: leadBranchItem.name,
              value: leadBranchItem.name,
            })),
          ]);
        } else {
          // Reset lead branch options state
          setBranchOptions([allFilterOptionData]);
        }
      })
      .catch(() => {
        // Reset lead branch options state
        setBranchOptions([allFilterOptionData]);
      });
  };

  /**
   * Fetches car brand filter options.
   */
  const fetchCarBrandsService = (): void => {
    /**
     * Call get car brands API.
     */
    getCarBrandsRequest()
      .then((response: ApiResponseData<LeadCarBrandData[]>) => {
        if (response.status_code === 200) {
          // Set car brand options state
          setCarBrandOptions([
            allFilterOptionData,
            ...(response.data ?? []).map((leadCarBrandItem) => ({
              label: leadCarBrandItem.name,
              value: leadCarBrandItem.name,
            })),
          ]);
        } else {
          // Reset car brand options state
          setCarBrandOptions([allFilterOptionData]);
        }
      })
      .catch(() => {
        // Reset car brand options state
        setCarBrandOptions([allFilterOptionData]);
      });
  };

  const normalizedSearchValue = leadSearchValue.trim().toLowerCase();
  const selectedStatusParam = (searchParams.get("status") ?? "all").toUpperCase();
  const leadStatusTabs = [
    { count: salesLeads.length, key: "ALL", label: "All" },
    ...leadStatusItems.map((leadStatusItem) => ({
      count: salesLeads.filter(
        (leadItem) => leadItem.status === leadStatusItem.name,
      ).length,
      key: leadStatusItem.name,
      label: getStatusLabelService(leadStatusItem.name),
    })),
  ];

  const filteredLeads = salesLeads.filter((leadItem) => {
    const matchesDrawerStatus =
      appliedFilterState.selectedStatusFilters.length === 0 ||
      appliedFilterState.selectedStatusFilters.some(
        (selectedStatusFilterItem) =>
          leadItem.status === selectedStatusFilterItem.toUpperCase(),
      );
    const matchesSource =
      appliedFilterState.selectedSourceFilters.length === 0 ||
      appliedFilterState.selectedSourceFilters.some(
        (selectedSourceFilterItem) =>
          leadItem.source.toUpperCase() ===
          selectedSourceFilterItem.toUpperCase(),
      );
    const matchesCarBrand =
      appliedFilterState.selectedCarBrand === allFilterOptionData.value ||
      (leadItem.carBrand ?? "").toLowerCase() ===
        appliedFilterState.selectedCarBrand.toLowerCase();
    const matchesBranch =
      appliedFilterState.selectedBranch === allFilterOptionData.value ||
      ((leadItem as LeadListItemData & { branch?: string | null }).branch ?? "")
        .toLowerCase() === appliedFilterState.selectedBranch.toLowerCase();
    const createdAtValue = leadItem.createdAt ? new Date(leadItem.createdAt) : null;
    const matchesStartDate =
      !appliedFilterState.selectedStartDate ||
      (createdAtValue !== null &&
        createdAtValue >= new Date(appliedFilterState.selectedStartDate));
    const matchesEndDate =
      !appliedFilterState.selectedEndDate ||
      (createdAtValue !== null &&
        createdAtValue <= new Date(`${appliedFilterState.selectedEndDate}T23:59:59`));
    const isStatusMatch =
      selectedStatusParam === "ALL" || leadItem.status === selectedStatusParam;

    if (
      !isStatusMatch ||
      !matchesDrawerStatus ||
      !matchesSource ||
      !matchesCarBrand ||
      !matchesBranch ||
      !matchesStartDate ||
      !matchesEndDate
    ) {
      return false;
    }

    if (!normalizedSearchValue) {
      return true;
    }

    return (
      leadItem.fullName.toLowerCase().includes(normalizedSearchValue) ||
      leadItem.phone.includes(normalizedSearchValue) ||
      leadItem.source.toLowerCase().includes(normalizedSearchValue) ||
      getVehicleNameService(leadItem).toLowerCase().includes(normalizedSearchValue)
    );
  });

  // Use Effects
  useEffect(() => {
    fetchSalesLeadsService();
    fetchLeadStatusesService();
    fetchLeadSourcesService();
    fetchLeadBranchesService();
    fetchCarBrandsService();
  }, []);

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
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {/* Search controls */}
            <div className="flex flex-col gap-2">
              <SearchInput
                value={leadSearchValue}
                onChange={setLeadSearchValue}
                placeholder="Search by name, phone, car..."
              />

              {/* Status filter chips */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {leadStatusTabs.map((leadStatusTabItem) => {
                  const isActive = selectedStatusParam === leadStatusTabItem.key;

                  return (
                    <button
                      key={leadStatusTabItem.key}
                      type="button"
                      onClick={() => {
                        const nextSearchParams = new URLSearchParams(
                          searchParams.toString(),
                        );

                        if (leadStatusTabItem.key === "ALL") {
                          nextSearchParams.delete("status");
                        } else {
                          nextSearchParams.set(
                            "status",
                            leadStatusTabItem.key.toLowerCase(),
                          );
                        }

                        router.push(
                          nextSearchParams.toString()
                            ? `${ROUTES.sales.leads}?${nextSearchParams.toString()}`
                            : ROUTES.sales.leads,
                        );
                      }}
                      className={`rounded-full border px-5 py-3 text-base leading-none font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-n-200 bg-white text-slate-600"
                      }`}
                    >
                      {`${leadStatusTabItem.label} (${leadStatusTabItem.count})`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leads list section */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-secondary text-n-500 text-xs">
                  Showing {filteredLeads.length} leads
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
                {isLeadsLoading ? (
                  <p className="font-secondary text-n-600 py-6 text-center text-sm">
                    Loading leads...
                  </p>
                ) : null}

                {!isLeadsLoading && filteredLeads.length === 0 ? (
                  <p className="font-secondary text-n-600 py-6 text-center text-sm">
                    No leads found.
                  </p>
                ) : null}

                {!isLeadsLoading
                  ? filteredLeads.map((leadItem) => (
                      <LeadCard
                        key={leadItem.id}
                        href={ROUTES.sales.leadDetails(leadItem.id)}
                        name={leadItem.fullName}
                        phoneNumber={leadItem.phone}
                        source={leadItem.source}
                        statusLabel={getStatusLabelService(leadItem.status)}
                        statusTone={getStatusToneService(leadItem.status)}
                        vehicleName={getVehicleNameService(leadItem)}
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
          statusFilterOptions={leadStatusTabs.map(
            (leadStatusTabItem) => leadStatusTabItem.label,
          )}
        />
      </div>
    </section>
  );
}
