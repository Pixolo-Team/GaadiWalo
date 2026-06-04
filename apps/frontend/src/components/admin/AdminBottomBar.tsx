"use client";

// COMPONENTS //
import Home3 from "@/components/icons/neevo-icons/Home3";
import UserGroup from "@/components/icons/neevo-icons/UserGroup";
import DesktopMonitorBrowseActivityPerformance from "@/components/icons/neevo-icons/DesktopMonitorBrowseActivityPerformance";
import ContentInsightIdeaTrivia from "@/components/icons/neevo-icons/ContentInsightIdeaTrivia";
import { Tab } from "@/components/sales/Tab";

// MODULES //
import { ROUTES } from "@/constants/routes";

// NAVIGATION //
import { usePathname } from "next/navigation";

/**
 * Renders admin app bottom navigation bar.
 */
export function AdminBottomBar() {
  // Define Navigation
  const pathname = usePathname();

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const isDashboardSelected = pathname === ROUTES.admin.dashboard;
  const isTeamSelected = pathname.startsWith(ROUTES.admin.team);
  const isReferrersSelected = pathname.startsWith(ROUTES.admin.referrers);
  const isReportsSelected = pathname.startsWith(ROUTES.admin.reports);

  // Use Effects

  return (
    <div className="border-n-200 bg-n-50 relative z-40 mt-auto w-full overflow-visible border-t-2 px-6 pt-3 pb-4">
      {/* Bottom navigation items */}
      <div className="flex items-end justify-between gap-1">
        {/* Dashboard Tab */}
        <Tab
          href={ROUTES.admin.dashboard}
          label="Dashboard"
          isActive={isDashboardSelected}
          icon={
            <Home3
              primaryColor={
                isDashboardSelected
                  ? "var(--color-blue-600)"
                  : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />

        {/* Team Tab */}
        <Tab
          href={ROUTES.admin.team}
          label="Team"
          isActive={isTeamSelected}
          icon={
            <UserGroup
              primaryColor={
                isTeamSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />

        {/* Referrers Tab */}
        <Tab
          href={ROUTES.admin.referrers}
          label="Referrers"
          isActive={isReferrersSelected}
          icon={
            <DesktopMonitorBrowseActivityPerformance
              primaryColor={
                isReferrersSelected
                  ? "var(--color-blue-600)"
                  : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />

        {/* Reports Tab */}
        <Tab
          href={ROUTES.admin.reports}
          label="Reports"
          isActive={isReportsSelected}
          icon={
            <ContentInsightIdeaTrivia
              primaryColor={
                isReportsSelected
                  ? "var(--color-blue-600)"
                  : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />
      </div>
    </div>
  );
}
