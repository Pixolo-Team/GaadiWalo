"use client";

// REACT //
import type React from "react";

// COMPONENTS //
import { BottomBar } from "@/components/sales/BottomBar";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// NAVIGATION //
import { usePathname } from "next/navigation";

// LIBRARIES //

/** Sales Layout Component */
export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define Navigation
  const pathname = usePathname();

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const shouldHideBottomNav = pathname.startsWith(`${ROUTES.sales.leads}/`);

  // Use Effects

  return (
    <section className="bg-n-100 h-screen">
      {/* Sales page frame */}
      <div className="bg-n-100 mx-auto flex h-full w-full max-w-md flex-col">
        {/* Sales page content */}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {/* Bottom navigation */}
        {shouldHideBottomNav ? null : <BottomBar />}
      </div>
    </section>
  );
}

