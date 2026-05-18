"use client";
// REACT //
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import ImportInput from "@/components/icons/neevo-icons/ImportInput";
import UserAddPlus from "@/components/icons/neevo-icons/UserAddPlus";
import { LeadCard } from "@/components/sales/LeadCard";
import { PhaseCards } from "@/components/sales/PhaseCards";
import { QuickActionCard } from "@/components/sales/QuickActionCard";
import { SalesDashboardHeader } from "@/components/sales/SalesDashboardHeader";
import { SectionHeader } from "@/components/sales/SectionHeader";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";

// DATA //
import { salesPhaseCardsDetails, salesRecentLeads } from "@/data/sales";

/**
 * Renders the sales home screen.
 */
export default function Home() {
  // Define Navigation
  const router = useRouter();

  // Define Context
  const { isAuthenticated, isLoading } = useAuthContext();

  // Use Effects
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      // Protect sales home route when auth session is missing.
      router.replace(ROUTES.auth.login);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isAuthenticated !== true) {
    return null;
  }

  return (
    <section className="bg-n-100">
      <div className="flex flex-col gap-6">
        {/* Sales dashboard header */}
        <SalesDashboardHeader />

        <div className="flex flex-col gap-6 px-6 pb-6">
          {/* Leads by phase section */}
          <div className="flex flex-col gap-2">
            {/* Title */}
            <p className="font-secondary text-n-600 text-xs font-semibold tracking-wide uppercase">
              LEADS BY PHASE
            </p>
            {/* Phase Cards List Component */}
            <PhaseCards activeKey="all" tabs={salesPhaseCardsDetails} />
          </div>

          {/* Recent leads section */}
          <div className="flex flex-col gap-3">
            {/* Section Header component with title and action link */}
            <SectionHeader title="Recent Leads" href="#" label="View All" />

            {/* Recent leads list */}
            <div className="flex flex-col gap-3">
              {/* Leads */}
              {salesRecentLeads.map((leadItem) => (
                // LeadCard Component
                <LeadCard
                  key={leadItem.key}
                  name={leadItem.name}
                  phoneNumber={leadItem.phoneNumber}
                  source={leadItem.source}
                  statusLabel={leadItem.statusLabel}
                  statusTone={leadItem.statusTone}
                  vehicleName={leadItem.vehicleName}
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
    </section>
  );
}
