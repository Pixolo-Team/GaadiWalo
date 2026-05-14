"use client";

// REACT //
import type { ReactNode } from "react";

// LIBRARIES //
import { usePathname } from "next/navigation";

// COMPONENTS //
import { BottomNav } from "@/components/sales/BottomNav";
import { ROUTES } from "@/constants/routes";

interface SalesLayoutShellPropsData {
  children: ReactNode;
}

/**
 * Renders the shared sales layout shell and controls bottom navigation visibility.
 */
export function SalesLayoutShell({
  children,
}: Readonly<SalesLayoutShellPropsData>) {
  // Define Navigation
  const pathname = usePathname();

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const shouldHideBottomNav =
    pathname.startsWith(`${ROUTES.sales.leads}/`) ||
    pathname.startsWith(`${ROUTES.sales.profile}/`);

  // Use Effects

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col bg-n-100">
      {/* Sales page content */}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

      {/* Bottom navigation */}
      {shouldHideBottomNav ? null : <BottomNav />}
    </div>
  );
}
