"use client";

// REACT //
import { useEffect, useEffectEvent, useMemo, useState } from "react";

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
import { PoweredByFooter } from "@/components/common/PoweredByFooter";

// API SERVICES //
import {
  getLeadBranchesRequest,
  getSalesLeadsRequest,
} from "@/services/api/sales-leads.api.service";

// SERVICES //
import {
  ALL_BRANCHES_OPTION,
  dashboardLeadStatusItems,
  getAvatarLabelService,
  getDashboardBranchLocationOptionsService,
  getDashboardSummaryMetricsService,
  getFilteredDashboardBranchLeadItemsService,
  getFilteredRecentLeadItemsService,
  getGreetingService,
  getResolvedDashboardBranchNameService,
  getSalesDashboardCacheService,
  getPhaseCardsService,
  getStoredDashboardBranchFilterService,
  hasSalesDashboardBranchCacheService,
  setSalesDashboardBranchCacheService,
  setSalesDashboardLeadCacheService,
  setStoredDashboardBranchFilterService,
} from "@/services/sales-dashboard.service";
import {
  getLeadStatusLabel,
  getLeadStatusTone,
  getLeadVehicleName,
} from "@/services/leads.service";

// CONSTANTS //
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
    () => dashboardLeadStatusItems,
    [],
  );
  const [salesLeads, setSalesLeads] = useState<LeadListItemData[]>([]);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(() => {
    if (typeof window === "undefined") {
      return ALL_BRANCHES_OPTION;
    }

    return getStoredDashboardBranchFilterService();
  });
  const [selectedPhaseKey, setSelectedPhaseKey] = useState<string>("all");
  const cachedDashboardState = useMemo(() => getSalesDashboardCacheService(), []);
  const hasCachedDashboardLeads = cachedDashboardState.salesLeads.length > 0;
  const hasCachedDashboardBranches =
    cachedDashboardState.leadBranchItems.length > 0;
  const shouldShowDashboardCountPlaceholders =
    isDashboardLoading && !hasCachedDashboardLeads;

  // Helper Functions
  /**
   * Fetches dashboard leads and branches for the home page.
   */
  const fetchDashboardDataService = useEffectEvent(async (): Promise<void> => {
    if (hasCachedDashboardLeads) {
      // Hydrate dashboard quickly from cache while fresh data loads.
      setSalesLeads(cachedDashboardState.salesLeads);
    }

    if (hasCachedDashboardBranches) {
      // Hydrate branch options from cache and avoid branch API on repeat visits.
      setLeadBranchItems(cachedDashboardState.leadBranchItems);
    }

    try {
      const hasCachedLeadBranches = hasSalesDashboardBranchCacheService();

      /**
       * Call dashboard sales leads API.
       */
      const salesLeadsResponse = await getSalesLeadsRequest();

      if (salesLeadsResponse.status_code === 200) {
        // Set sales leads state.
        const salesLeadItems = salesLeadsResponse.data ?? [];
        setSalesLeads(salesLeadItems);
        setSalesDashboardLeadCacheService(salesLeadItems);
      } else {
        // Reset sales leads state.
        setSalesLeads([]);
      }

      if (!hasCachedLeadBranches) {
        // Call branch API only when branch cache does not exist yet.
        const leadBranchesResponse = await getLeadBranchesRequest();
        if (leadBranchesResponse.status_code === 200) {
          // Set lead branches state.
          const leadBranchValues = leadBranchesResponse.data ?? [];
          setLeadBranchItems(leadBranchValues);
          setSalesDashboardBranchCacheService(leadBranchValues);
        } else {
          // Reset lead branches state.
          setLeadBranchItems([]);
        }
      }
    } catch {
      // Error toast.
      toast.error("Unable to load dashboard right now. Please try again.");

      if (!hasCachedDashboardBranches) {
        // Reset dashboard branch state only when no cached fallback exists.
        setLeadBranchItems([]);
      }

      if (!hasCachedDashboardLeads) {
        // Reset dashboard lead state only when no cached fallback exists.
        setSalesLeads([]);
      }
    } finally {
      // Set loading state to false.
      setIsDashboardLoading(false);
    }
  });

  const branchLocationOptions = useMemo(() => {
    return getDashboardBranchLocationOptionsService(
      leadBranchItems,
      user?.branch,
    );
  }, [leadBranchItems, user]);

  const resolvedBranchName = useMemo(() => {
    return getResolvedDashboardBranchNameService(
      branchLocationOptions,
      selectedBranchName,
      user?.branch,
    );
  }, [branchLocationOptions, selectedBranchName, user]);

  const filteredBranchLeadItems = useMemo(() => {
    return getFilteredDashboardBranchLeadItemsService(
      salesLeads,
      resolvedBranchName,
    );
  }, [resolvedBranchName, salesLeads]);

  const filteredRecentLeadItems = useMemo(() => {
    return getFilteredRecentLeadItemsService(
      filteredBranchLeadItems,
      selectedPhaseKey,
    );
  }, [filteredBranchLeadItems, selectedPhaseKey]);

  const dashboardSummaryMetrics = useMemo(
    () => getDashboardSummaryMetricsService(filteredBranchLeadItems),
    [filteredBranchLeadItems],
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

  useEffect(() => {
    if (!resolvedBranchName) {
      return;
    }

    // Persist dashboard branch filter across navigation and refresh.
    setStoredDashboardBranchFilterService(resolvedBranchName);
  }, [resolvedBranchName]);

  return (
    <section className="bg-n-100 min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Sales dashboard header */}
        <SalesDashboardHeader
          avatarLabel={getAvatarLabelService(user?.name ?? "Sales User")}
          greeting={getGreetingService()}
          isSummaryLoading={shouldShowDashboardCountPlaceholders}
          onLocationChange={setSelectedBranchName}
          locationName={resolvedBranchName || ALL_BRANCHES_OPTION}
          locationOptions={branchLocationOptions}
          name={user?.name ?? "Sales User"}
          selectedLocation={resolvedBranchName}
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
              isCountLoading={shouldShowDashboardCountPlaceholders}
              tabs={getPhaseCardsService(
                leadStatusItems,
                filteredBranchLeadItems,
              )}
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
              {isDashboardLoading && filteredRecentLeadItems.length === 0
                ? Array.from({ length: 4 }).map((_, indexItem) => (
                    <div
                      key={indexItem}
                      className="bg-n-50 flex animate-pulse items-center gap-3 rounded-2xl p-4"
                    >
                      <div className="bg-n-200 size-10 shrink-0 rounded-full" />
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="bg-n-200 h-3.5 w-2/3 rounded-full" />
                        <div className="bg-n-200 h-3 w-1/2 rounded-full" />
                      </div>
                      <div className="bg-n-200 h-5 w-14 rounded-full" />
                    </div>
                  ))
                : null}

              {!isDashboardLoading && filteredRecentLeadItems.length === 0 ? (
                <p className="font-secondary text-n-600 py-6 text-center text-sm">
                  No leads found for this phase.
                </p>
              ) : null}

              {filteredRecentLeadItems.map((leadItem, leadIndex) => (
                <LeadCard
                  key={leadItem.id}
                  href={ROUTES.sales.leadDetails(leadItem.id)}
                  motionDelay={leadIndex * 0.08}
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

          {/* Powered by GaadiWalo */}
          <PoweredByFooter />
        </div>
      </div>
    </section>
  );
}
