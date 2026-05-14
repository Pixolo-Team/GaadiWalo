"use client";

// LIBRARIES //
import Link from "next/link";
import { usePathname } from "next/navigation";

// COMPONENTS //
import BellNotification from "@/components/icons/neevo-icons/BellNotification";
import Home3 from "@/components/icons/neevo-icons/Home3";
import UserAddPlus from "@/components/icons/neevo-icons/UserAddPlus";
import UserCircleSingle from "@/components/icons/neevo-icons/UserCircleSingle";
import UserGroup from "@/components/icons/neevo-icons/UserGroup";
import { ROUTES } from "@/constants/routes";

/**
 * Renders sales app bottom navigation bar.
 */
export function BottomNav() {
  // Define Navigation
  const pathname = usePathname();

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const isHomeSelected = pathname === ROUTES.home;
  const isLeadsSelected = pathname.startsWith(ROUTES.sales.leads);

  // Use Effects

  return (
    <nav className="border-n-200 bg-n-50 mt-auto w-full overflow-visible border-t-2 px-6 pt-3 pb-4">
      {/* Bottom navigation items */}
      <div className="flex items-end justify-between gap-1">
        {/* Home */}
        <Link
          href={ROUTES.home}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 ${
            isHomeSelected ? "text-blue-600" : "text-n-500"
          }`}
        >
          <Home3
            primaryColor={
              isHomeSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
            }
            className="size-7"
          />
          <span
            className={`font-secondary text-[10px] ${
              isHomeSelected ? "font-bold" : "font-semibold"
            }`}
          >
            Home
          </span>
        </Link>

        {/* Leads */}
        <Link
          href={ROUTES.sales.leads}
          className={`flex min-w-0 flex-1 flex-col items-center gap-1 ${
            isLeadsSelected ? "text-blue-600" : "text-n-500"
          }`}
        >
          <UserGroup
            primaryColor={
              isLeadsSelected ? "var(--color-blue-600)" : "var(--color-n-500)"
            }
            className="size-7"
          />
          <span
            className={`font-secondary text-[10px] ${
              isLeadsSelected ? "font-bold" : "font-semibold"
            }`}
          >
            Leads
          </span>
        </Link>

        {/* Add */}
        <button
          type="button"
          className="text-n-500 -mt-12 flex w-14 shrink-0 flex-col items-center gap-1"
        >
          <span className="flex size-12 items-center justify-center rounded-[32px] bg-blue-600 shadow-[0_4px_12px_rgba(26,86,219,0.3)]">
            <UserAddPlus primaryColor="white" className="size-5" />
          </span>
          <span className="font-secondary text-[10px] font-semibold">Add</span>
        </button>

        {/* Alerts */}
        <button
          type="button"
          className="text-n-500 flex min-w-0 flex-1 flex-col items-center gap-1"
        >
          <BellNotification
            primaryColor="var(--color-n-500)"
            className="size-7"
          />
          <span className="font-secondary text-[10px] font-semibold">
            Alerts
          </span>
        </button>

        {/* Profile */}
        <button
          type="button"
          className="text-n-500 flex min-w-0 flex-1 flex-col items-center gap-1"
        >
          <UserCircleSingle
            primaryColor="var(--color-n-500)"
            className="size-7"
          />
          <span className="font-secondary text-[10px] font-semibold">
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
}
