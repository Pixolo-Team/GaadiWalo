"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  LeadBranchData,
  LeadListItemData,
  LeadStatusData,
  LeadStatusOptionData,
} from "@/types/leads";

// COMPONENTS //
import ImportInput from "@/components/icons/neevo-icons/ImportInput";
import UserAddPlus from "@/components/icons/neevo-icons/UserAddPlus";
import { LeadCard } from "@/components/sales/LeadCard";
import { PhaseCards } from "@/components/sales/PhaseCards";
import { QuickActionCard } from "@/components/sales/QuickActionCard";
import { SalesDashboardHeader } from "@/components/sales/SalesDashboardHeader";
import { SectionHeader } from "@/components/sales/SectionHeader";

// API SERVICES //
import {
  getLeadBranchesRequest,
  getLeadStatusesRequest,
  getSalesLeadsRequest,
} from "@/services/api/sales-leads.api.service";

// SERVICES //
import {
  getAvatarLabelService,
  getGreetingService,
  getStatusLabelService,
  getStatusToneService,
  getVehicleNameService,
  isTodayService,
} from "@/services/sales-dashboard.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/**
 * Renders the sales home screen.
 */
export default function Home() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const [isDashboardLoading, setIsDashboardLoading] = useState<boolean>(true);
  const [selectedPhaseKey, setSelectedPhaseKey] = useState<string>("all");
  const [salesBranches, setSalesBranches] = useState<string[]>([]);
  const [salesLeads, setSalesLeads] = useState<LeadListItemData[]>([]);
  const [leadStatusItems, setLeadStatusItems] = useState<
    LeadStatusOptionData[]
  >([]);
 
  // Helper Functions

  /**
   * Fetches dashboard leads payload from API.
   */
  const fetchDashboardDataService = useCallback((): void => {
    // Read cached dashboard payloads
    const cachedLeadsValue = window.localStorage.getItem(
      CONSTANTS.DASHBOARD_LEADS_CACHE_KEY,
    );

    if (cachedLeadsValue) {
      try {
        const parsedLeads = JSON.parse(cachedLeadsValue) as LeadListItemData[];

        // Set cached leads state
        setSalesLeads(parsedLeads);

        // Set loading false when cache is available
        setIsDashboardLoading(false);
      } catch {
        // Ignore invalid cache payload
      }
    }

    /**
     * Call get sales leads API.
     */
    getSalesLeadsRequest()
      .then((salesLeadsResponse: ApiResponseData<LeadListItemData[]>) => {
        if (salesLeadsResponse.status_code === 200) {
          const salesLeadsPayload = salesLeadsResponse.data ?? [];

          // Set sales leads state
          setSalesLeads(salesLeadsPayload);

          // Cache leads payload
          window.localStorage.setItem(
            CONSTANTS.DASHBOARD_LEADS_CACHE_KEY,
            JSON.stringify(salesLeadsPayload),
          );
        } else {
          // Reset sales leads state
          setSalesLeads([]);
        }
      })
      .catch(() => {
        // Error toast
        toast.error(
          "Unable to load dashboard leads right now. Please try again.",
        );

        // Reset sales leads state
        setSalesLeads([]);
      })
      .finally(() => {
        // Set loading false
        setIsDashboardLoading(false);
      });
  }, []);

  /**
   * Fetches branch options for dashboard dropdown.
   */
  const fetchLeadBranchesService = useCallback((): void => {
    /**
     * Call get lead branches API.
     */
    getLeadBranchesRequest()
      .then((leadBranchesResponse: ApiResponseData<LeadBranchData[]>) => {
        if (leadBranchesResponse.status_code === 200) {
          // Set sales branch options state
          setSalesBranches(
            (leadBranchesResponse.data ?? []).map(
              (leadBranchItem) => leadBranchItem.name,
            ),
          );
        } else {
          // Reset sales branch options state
          setSalesBranches([]);
        }
      })
      .catch(() => {
        // Reset sales branch options state
        setSalesBranches([]);
      });
  }, []);

  /**
   * Fetches lead status master items for dashboard phase cards.
   */
  const fetchLeadStatusesService = useCallback((): void => {
    /**
     * Call get lead statuses API.
     */
    getLeadStatusesRequest()
      .then((leadStatusesResponse: ApiResponseData<LeadStatusOptionData[]>) => {
        if (leadStatusesResponse.status_code === 200) {
          // Set lead status items state
          setLeadStatusItems(leadStatusesResponse.data ?? []);
        } else {
          // Reset lead status items state
          setLeadStatusItems([]);
        }
      })
      .catch(() => {
        // Reset lead status items state
        setLeadStatusItems([]);
      });
  }, []);
  const statusPhaseCardsDetails = leadStatusItems.map((leadStatusItem) => ({
    count: salesLeads.filter(
      (leadItem) => leadItem.status === leadStatusItem.name,
    ).length,
    key: leadStatusItem.name.toLowerCase().replaceAll("_", "-"),
    label: getStatusLabelService(leadStatusItem.name),
    status: leadStatusItem.name,
  }));

  const salesPhaseCardsDetails = [
    { count: salesLeads.length, key: "all", label: "All", status: "ALL" },
    ...statusPhaseCardsDetails,
  ];

  const salesSummaryMetrics = [
    {
      key: "calls-due",
      label: "Calls Due",
      value: String(
        salesLeads.filter((leadItem) =>
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
        salesLeads.filter((leadItem) => leadItem.status === "NEW").length,
      ).padStart(2, "0"),
    },
    {
      key: "won-today",
      label: "Won Today",
      value: String(
        salesLeads.filter(
          (leadItem) =>
            leadItem.status === "WON" &&
            isTodayService(
              leadItem.wonAt ??
                leadItem.statusChangedAt ??
                leadItem.statusUpdatedAt ??
                leadItem.updatedAt ??
                leadItem.createdAt,
            ),
        ).length,
      ).padStart(2, "0"),
    },
  ];

  const phaseToLeadStatusData = salesPhaseCardsDetails.reduce<
    Record<string, LeadStatusData | "ALL">
  >((phaseStatusMap, phaseCardItem) => {
    phaseStatusMap[phaseCardItem.key] = phaseCardItem.status as
      | LeadStatusData
      | "ALL";
    return phaseStatusMap;
  }, {});

  const filteredPhaseLeads =
    selectedPhaseKey === "all"
      ? salesLeads
      : salesLeads.filter(
          (leadItem) =>
            leadItem.status === phaseToLeadStatusData[selectedPhaseKey],
        );

  const salesRecentLeads = filteredPhaseLeads.slice(0, 5);
  const branchOptions =
    salesBranches.length > 0
      ? salesBranches
      : user?.branch
        ? [user.branch]
        : [];
  const selectedBranchName = user?.branch ?? branchOptions[0] ?? "";

  // Use Effects
  useEffect(() => {
    const fetchTimeout = window.setTimeout(() => {
      fetchDashboardDataService();
      fetchLeadBranchesService();
      fetchLeadStatusesService();
    }, 0);

    return () => {
      window.clearTimeout(fetchTimeout);
    };
  }, [fetchDashboardDataService, fetchLeadBranchesService, fetchLeadStatusesService]);

  return (
    <section className="bg-n-100 h-full">
      <div className="flex h-full flex-col gap-6">
        {/* Sales dashboard header */}
        <SalesDashboardHeader
          avatarLabel={getAvatarLabelService(user?.name ?? "Sales User")}
          greeting={`${getGreetingService()} 👋`}
          locationName={selectedBranchName}
          locationOptions={branchOptions}
          name={user?.name ?? "Sales User"}
          summaryMetrics={salesSummaryMetrics}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col gap-6">
            {/* Leads by phase section */}
            <div className="flex flex-col gap-2">
              {/* Title */}
              <p className="font-secondary text-n-600 text-xs font-semibold tracking-wide uppercase">
                LEADS BY PHASE
              </p>

              {/* Phase Cards List Component */}
              <PhaseCards
                activeKey={selectedPhaseKey}
                tabs={salesPhaseCardsDetails}
                onCardPress={(phaseKey: string) => {
                  setSelectedPhaseKey(phaseKey);
                }}
              />
            </div>

            {/* Recent leads section */}
            <div className="flex flex-col gap-3">
              {/* Section Header component with title and action link */}
              <SectionHeader
                title="Recent Leads"
                href={ROUTES.sales.leads}
                label="View All"
              />

              {/* Recent leads list */}
              <div className="flex flex-col gap-3">
                {isDashboardLoading && salesRecentLeads.length === 0 ? (
                  <p className="font-secondary text-n-600 py-6 text-center text-sm">
                    Loading dashboard...
                  </p>
                ) : null}

                {!isDashboardLoading && salesRecentLeads.length === 0 ? (
                  <p className="font-secondary text-n-600 py-6 text-center text-sm">
                    No recent leads found.
                  </p>
                ) : null}

                {/* Leads */}
                {!isDashboardLoading
                  ? salesRecentLeads.map((leadItem) => (
                      // LeadCard Component
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

            {/* Quick actions section */}
            <div className="flex flex-col gap-3">
              {/* Section Header component with title and action link */}
              <SectionHeader title="Quick Actions" />

              {/* Quick actions list */}
              <div className="flex gap-2">
                {/* Import Excel QuickAction Component */}
                <QuickActionCard
                  href={ROUTES.sales.leadImport}
                  icon={
                    // Icon
                    <ImportInput
                      primaryColor="var(--color-n-800)"
                      className="size-6"
                    />
                  }
                  label="Import Excel"
                />

                {/* Add New Lead QuickAction Component */}
                <QuickActionCard
                  href={ROUTES.sales.leadAdd}
                  icon={
                    // Icon
                    <UserAddPlus
                      primaryColor="var(--color-n-800)"
                      className="size-6"
                    />
                  }
                  label="Add New Lead"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
