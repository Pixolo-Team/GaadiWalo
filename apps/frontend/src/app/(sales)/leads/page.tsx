"use client";

// REACT //
import { useEffect, useMemo, useState } from "react";
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
import { getBranchNameService, getPhaseLabelService } from "@/services/sales-dashboard.service";
import {
  getLeadStatusLabel,
  getLeadStatusTone,
  getLeadVehicleName,
} from "@/services/leads.service";

// LIBRARIES //
import { toast } from "sonner";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

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

const salesSortOptions = ["Newest", "Oldest"] as const;

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
  const [isLeadsLoading, setIsLeadsLoading] = useState<boolean>(true);
  const [leadBranchItems, setLeadBranchItems] = useState<LeadBranchData[]>([]);
  const [leadCarBrandItems, setLeadCarBrandItems] = useState<LeadCarBrandData[]>(
    [],
  );
  const [leadSearchValue, setLeadSearchValue] = useState<string>("");
  const [leadSourceItems, setLeadSourceItems] = useState<LeadSourceData[]>([]);
  const [leadStatusItems, setLeadStatusItems] = useState<LeadStatusOptionData[]>(
    [],
  );
  const [salesLeads, setSalesLeads] = useState<LeadListItemData[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(salesSortOptions[0]);

  // Helper Functions
  const selectedStatusQueryValue = searchParams.get("status")?.toLowerCase() ?? "all";

  /**
   * Fetches leads list payload and filter master data.
   */
  const fetchSalesLeadsService = async (): Promise<void> => {
    try {
      /**
       * Call leads APIs.
       */
      const [
        salesLeadsResponse,
        leadStatusesResponse,
        leadSourcesResponse,
        leadBranchesResponse,
        leadCarBrandsResponse,
      ] = await Promise.all([
        getSalesLeadsRequest(),
        getLeadStatusesRequest(),
        getLeadSourcesRequest(),
        getLeadBranchesRequest(),
        getCarBrandsRequest(),
      ]);

      if (salesLeadsResponse.status_code === 200) {
        // Set sales leads state.
        setSalesLeads(salesLeadsResponse.data ?? []);
      } else {
        // Reset sales leads state.
        setSalesLeads([]);
      }

      if (leadStatusesResponse.status_code === 200) {
        // Set lead statuses state.
        setLeadStatusItems(leadStatusesResponse.data ?? []);
      } else {
        // Reset lead statuses state.
        setLeadStatusItems([]);
      }

      if (leadSourcesResponse.status_code === 200) {
        // Set lead sources state.
        setLeadSourceItems(leadSourcesResponse.data ?? []);
      } else {
        // Reset lead sources state.
        setLeadSourceItems([]);
      }

      if (leadBranchesResponse.status_code === 200) {
        // Set lead branches state.
        setLeadBranchItems(leadBranchesResponse.data ?? []);
      } else {
        // Reset lead branches state.
        setLeadBranchItems([]);
      }

      if (leadCarBrandsResponse.status_code === 200) {
        // Set lead car brands state.
        setLeadCarBrandItems(leadCarBrandsResponse.data ?? []);
      } else {
        // Reset lead car brands state.
        setLeadCarBrandItems([]);
      }
    } catch {
      // Error toast.
      toast.error("Unable to load leads right now. Please try again.");

      // Reset leads page state.
      setLeadBranchItems([]);
      setLeadCarBrandItems([]);
      setLeadSourceItems([]);
      setLeadStatusItems([]);
      setSalesLeads([]);
    } finally {
      // Set loading state to false.
      setIsLeadsLoading(false);
    }
  };

  const statusTabItems = useMemo(() => {
    const dynamicStatusTabs = leadStatusItems.map((statusItem) => ({
      count: salesLeads.filter((leadItem) => leadItem.status === statusItem.name).length,
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

    return [{ label: "All Branches", value: "all" }, ...normalizedBranchOptions];
  }, [leadBranchItems]);

  const carBrandOptions = useMemo<DropdownOptionData[]>(() => {
    const normalizedCarBrandOptions = leadCarBrandItems.map((carBrandItem) => ({
      label: carBrandItem.name,
      value: carBrandItem.name,
    }));

    return [{ label: "All Brands", value: "all" }, ...normalizedCarBrandOptions];
  }, [leadCarBrandItems]);

  const sourceFilterOptions = useMemo<string[]>(
    () => ["All", ...leadSourceItems.map((sourceItem) => sourceItem.name)],
    [leadSourceItems],
  );

  const statusFilterOptions = useMemo<string[]>(
    () => ["All", ...leadStatusItems.map((statusItem) => getPhaseLabelService(statusItem.name))],
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
        getLeadVehicleName(leadItem).toLowerCase().includes(normalizedSearchValue)
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
  }, [appliedFilterState, leadSearchValue, salesLeads, selectedSort, selectedStatusQueryValue]);

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
    const leadsLoadTimeout = window.setTimeout(() => {
      void fetchSalesLeadsService();
    }, 0);

    return () => {
      window.clearTimeout(leadsLoadTimeout);
    };
  }, []);

  return (
    <section className="h-full bg-n-100">
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
            <div className="flex flex-col gap-3">
              <SearchInput
                value={leadSearchValue}
                onChange={setLeadSearchValue}
                placeholder="Search by name, phone, car..."
              />

              {/* Status tabs */}
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                {statusTabItems.map((statusTabItem) => {
                  const isActive = selectedStatusQueryValue === statusTabItem.key;

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
                      {statusTabItem.label} ({statusTabItem.count})
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
