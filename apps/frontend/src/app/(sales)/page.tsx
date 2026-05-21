"use client";

// REACT //
import { useEffect, useMemo, useState } from "react";

// TYPES //
import type {
  LeadBranchData,
  LeadListItemData,
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
  getSalesLeadsRequest,
} from "@/services/api/sales-leads.api.service";

// SERVICES //
import {
  getAvatarLabelService,
  getBranchNameService,
  getGreetingService,
  getPhaseCardsService,
  isWonTodayService,
} from "@/services/sales-dashboard.service";
import {
  getLeadStatusLabel,
  getLeadStatusTone,
  getLeadVehicleName,
} from "@/services/leads.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

// HOOKS //

// LIBRARIES //

/**
 * Renders the sales home screen with live dashboard data.
 */
export default function Home() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const [isDashboardLoading, setIsDashboardLoading] = useState<boolean>(true);
  const [leadBranchItems, setLeadBranchItems] = useState<LeadBranchData[]>([]);
  const leadStatusItems = useMemo<LeadStatusOptionData[]>(
    () => [
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
    ],
    [],
  );
  const [salesLeads, setSalesLeads] = useState<LeadListItemData[]>([]);
  const [selectedPhaseKey, setSelectedPhaseKey] = useState<string>("all");

  // Helper Functions
  /**
   * Fetches dashboard leads, statuses, and branches.
   */
  const fetchDashboardDataService = async (): Promise<void> => {
    try {
      const cachedSalesLeads = window.localStorage.getItem(
        CONSTANTS.DASHBOARD_LEADS_CACHE_KEY,
      );

      if (cachedSalesLeads) {
        // Hydrate dashboard quickly from cache while fresh data loads.
        setSalesLeads(JSON.parse(cachedSalesLeads) as LeadListItemData[]);
      }
    } catch {
      // Ignore malformed cache and continue with API data.
    }

    try {
      /**
       * Call dashboard APIs.
       */
      const [salesLeadsResponse, leadBranchesResponse] = await Promise.all([
        getSalesLeadsRequest(),
        getLeadBranchesRequest(),
      ]);

      if (salesLeadsResponse.status_code === 200) {
        // Set sales leads state.
        const salesLeadItems = salesLeadsResponse.data ?? [];
        setSalesLeads(salesLeadItems);
        window.localStorage.setItem(
          CONSTANTS.DASHBOARD_LEADS_CACHE_KEY,
          JSON.stringify(salesLeadItems),
        );
      } else {
        // Reset sales leads state.
        setSalesLeads([]);
      }

      if (leadBranchesResponse.status_code === 200) {
        // Set lead branches state.
        setLeadBranchItems(leadBranchesResponse.data ?? []);
      } else {
        // Reset lead branches state.
        setLeadBranchItems([]);
      }
    } catch {
      // Error toast.
      toast.error("Unable to load dashboard right now. Please try again.");

      // Reset dashboard state.
      setLeadBranchItems([]);
      setSalesLeads([]);
    } finally {
      // Set loading state to false.
      setIsDashboardLoading(false);
    }
  };

  const salesPhaseCardItems = useMemo(
    () => getPhaseCardsService(leadStatusItems, salesLeads),
    [leadStatusItems, salesLeads],
  );

  const filteredRecentLeadItems = useMemo(() => {
    const phaseFilteredLeadItems =
      selectedPhaseKey === "all"
        ? salesLeads
        : salesLeads.filter(
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
  }, [salesLeads, selectedPhaseKey]);

  const branchLocationOptions = useMemo(() => {
    const branchNameValues = leadBranchItems
      .map((branchItem) => getBranchNameService(branchItem))
      .filter(Boolean);

    if (branchNameValues.length > 0) {
      return branchNameValues;
    }

    return user?.branch ? [user.branch] : [];
  }, [leadBranchItems, user]);

  const dashboardSummaryMetrics = useMemo(
    () => [
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
          salesLeads.filter((leadItem) => isWonTodayService(leadItem)).length,
        ).padStart(2, "0"),
      },
    ],
    [salesLeads],
  );

  // Use Effects
  useEffect(() => {
    const dashboardLoadTimeout = window.setTimeout(() => {
      void fetchDashboardDataService();
    }, 0);

    return () => {
      window.clearTimeout(dashboardLoadTimeout);
    };
  }, []);

  return (
    <section className="bg-n-100 min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Sales dashboard header */}
        <SalesDashboardHeader
          avatarLabel={getAvatarLabelService(user?.name ?? "Sales User")}
          greeting={getGreetingService()}
          locationName={branchLocationOptions[0] ?? user?.branch ?? "Branch"}
          locationOptions={branchLocationOptions}
          name={user?.name ?? "Sales User"}
          summaryMetrics={dashboardSummaryMetrics}
        />

        <div className="flex flex-col gap-6 px-6 pb-6">
          {/* Leads by phase section */}
          <div className="flex flex-col gap-2">
            {/* Title */}
            <p className="font-secondary text-n-600 text-xs font-semibold tracking-wide uppercase">
              LEADS BY PHASE
            </p>

            {/* Phase Cards List Component */}
            <PhaseCards
              activeKey={selectedPhaseKey}
              tabs={salesPhaseCardItems}
              onCardPress={setSelectedPhaseKey}
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
              {isDashboardLoading && filteredRecentLeadItems.length === 0 ? (
                <p className="font-secondary text-n-600 py-6 text-center text-sm">
                  Loading dashboard...
                </p>
              ) : null}

              {!isDashboardLoading && filteredRecentLeadItems.length === 0 ? (
                <p className="font-secondary text-n-600 py-6 text-center text-sm">
                  No leads found for this phase.
                </p>
              ) : null}

              {filteredRecentLeadItems.map((leadItem) => (
                // LeadCard Component
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
              ))}
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
    </section>
  );
}
