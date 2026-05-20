"use client";

// REACT //
import { useEffect, useState } from "react";

// COMPONENTS //
import FilterDropdown from "@/components/common/FilterDropdown";
import { Header } from "@/components/common/Header";
import { SearchInput } from "@/components/common/SearchInput";
import HorizontalSlider2 from "@/components/icons/neevo-icons/HorizontalSlider2";
import { LeadCard } from "@/components/sales/LeadCard";
import { LeadsFilterDrawer } from "@/components/sales/LeadsFilterDrawer";

// SERVICES //
import { getSalesLeadsRequest } from "@/services/api/sales-leads.api.service";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  LeadListItemData,
  LeadStatusData,
} from "@/types/leads";

// OTHERS //
import { toast } from "sonner";

const salesSortOptions = ["Newest", "Oldest"] as const;

/**
 * Renders sales leads listing with API data.
 */
export default function LeadsPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [leadSearchValue, setLeadSearchValue] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>(salesSortOptions[0]);
  const [isLeadsLoading, setIsLeadsLoading] = useState<boolean>(true);
  const [salesLeads, setSalesLeads] = useState<LeadListItemData[]>([]);

  // Helper Functions
  const handleOpenFilterDrawer = (): void => {
    setIsFilterDrawerOpen(true);
  };

  /**
   * Resolves status label from API enum value.
   */
  const getStatusLabelService = (statusValue: LeadStatusData): string => {
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
  const getStatusToneService = (
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
  const getVehicleNameService = (leadItem: LeadListItemData): string => {
    const vehicleValues = [
      leadItem.carBrand,
      leadItem.carModel,
      leadItem.variantName,
    ].filter((valueItem): valueItem is string => Boolean(valueItem));

    return vehicleValues.length > 0 ? vehicleValues.join(" ") : "Not specified";
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

  const normalizedSearchValue = leadSearchValue.trim().toLowerCase();
  const filteredLeads = salesLeads.filter((leadItem) => {
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
          isOpen={isFilterDrawerOpen}
          onOpenChange={setIsFilterDrawerOpen}
        />
      </div>
    </section>
  );
}
