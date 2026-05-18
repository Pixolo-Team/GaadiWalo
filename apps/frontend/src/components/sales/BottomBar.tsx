"use client";

// COMPONENTS //
import BellNotification from "@/components/icons/neevo-icons/BellNotification";
import Home3 from "@/components/icons/neevo-icons/Home3";
import UserAddPlus from "@/components/icons/neevo-icons/UserAddPlus";
import UserCircleSingle from "@/components/icons/neevo-icons/UserCircleSingle";
import UserGroup from "@/components/icons/neevo-icons/UserGroup";
import { Tab } from "@/components/sales/Tab";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// NAVIGATION //
import { usePathname } from "next/navigation";

/**
 * Renders sales app bottom navigation bar.
 */
export function BottomBar() {
  // Define Navigation
  const pathname = usePathname();

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const isHomeSelected = pathname === ROUTES.home;
  const isLeadsSelected = pathname.startsWith(ROUTES.sales.leads);
  const isProfileSelected =
    pathname === ROUTES.sales.profile ||
    pathname.startsWith(`${ROUTES.sales.profile}/`);
  const isAlertsSelected = pathname === ROUTES.sales.alerts;

  // Use Effects

  return (
    <div className="border-n-200 bg-n-50 relative z-40 mt-auto w-full overflow-visible border-t-2 px-6 pt-3 pb-4">
      {/* Bottom navigation items */}
      <div className="flex items-end justify-between gap-1">
        {/* Home Tab */}
        <Tab
          href={ROUTES.home}
          label="Home"
          isActive={isHomeSelected}
          icon={
            <Home3
              primaryColor={
                isHomeSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />

        {/* Leads Tab*/}
        <Tab
          href={ROUTES.sales.leads}
          label="Leads"
          isActive={isLeadsSelected}
          icon={
            <UserGroup
              primaryColor={
                isLeadsSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />

        {/* Add New Lead Tab */}
        <Tab
          href={ROUTES.sales.addLead}
          label="Add"
          isFloating
          icon={
            <span className="flex size-12 items-center justify-center rounded-[32px] bg-blue-600 shadow-[0_4px_12px_rgba(26,86,219,0.3)]">
              <UserAddPlus primaryColor="white" className="size-5" />
            </span>
          }
        />

        {/* Alerts */}
        <Tab
          href={ROUTES.sales.alerts}
          label="Alerts"
          isActive={isAlertsSelected}
          icon={
            <BellNotification
              primaryColor={
                isAlertsSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />

        {/* Profile Tab*/}
        <Tab
          href={ROUTES.sales.profile}
          label="Profile"
          isActive={isProfileSelected}
          icon={
            <UserCircleSingle
              primaryColor={
                isProfileSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
              }
              className="size-7"
            />
          }
        />
      </div>
    </div>
  );
}
