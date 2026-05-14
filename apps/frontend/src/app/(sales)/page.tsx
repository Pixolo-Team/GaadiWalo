"use client";
// COMPONENTS //
import ImportInput from "@/components/icons/neevo-icons/ImportInput";
import UserAddPlus from "@/components/icons/neevo-icons/UserAddPlus";
import { LeadCard } from "@/components/sales/LeadCard";
import { PhaseTabs } from "@/components/sales/PhaseTabs";
import { QuickActionCard } from "@/components/sales/QuickActionCard";
import { SalesTopHeader } from "@/components/sales/SalesTopHeader";
import { SectionHeader } from "@/components/sales/SectionHeader";
import { ROUTES } from "@/constants/routes";
import { salesPhaseTabs, salesRecentLeads } from "@/data/sales";

/**
 * Renders the sales home screen.
 */
export default function Home() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <section className="bg-n-100">
      {/* Sales home content */}
      <div className="flex flex-col gap-6">
        {/* Top summary header */}
        <SalesTopHeader />

        {/* Main sales content */}
        <div className="flex flex-col gap-6 px-6 pb-6">
          {/* Leads by phase section */}
          <div className="flex flex-col gap-2">
            <p className="font-secondary text-n-600 text-xs font-semibold tracking-wide uppercase">
              LEADS BY PHASE
            </p>
            <PhaseTabs activeKey="all" tabs={salesPhaseTabs} />
          </div>

          {/* Recent leads section */}
          <div className="flex flex-col gap-3">
            <SectionHeader
              title="Recent Leads"
              actionHref="#"
              actionLabel="View All"
            />

            {/* Recent leads list */}
            <div className="flex flex-col gap-3">
              {salesRecentLeads.map((leadItem) => (
                <LeadCard
                  key={leadItem.key}
                  detailsHref={ROUTES.sales.leadDetails(leadItem.key)}
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
            <SectionHeader title="Quick Actions" />

            {/* Quick actions list */}
            <div className="flex gap-2">
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
