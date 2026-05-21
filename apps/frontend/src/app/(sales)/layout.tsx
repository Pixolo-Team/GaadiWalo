"use client";

// REACT //
import { useEffect } from "react";
import type React from "react";

// COMPONENTS //
import { BottomBar } from "@/components/sales/BottomBar";
import { useAuthContext } from "@/context/AuthContext";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// NAVIGATION //
import { usePathname, useRouter } from "next/navigation";

// LIBRARIES //

/** Sales Layout Component */
export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define Navigation
  const router = useRouter();
  const pathname = usePathname();

  // Define Context
  const { isAuthenticated } = useAuthContext();

  // Define Refs

  // Define States

  // Helper Functions
  const shouldHideBottomBar = pathname.startsWith(`${ROUTES.sales.leads}/`);

  // Use Effects
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.auth.login);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="bg-n-100 h-screen">
      {/* Sales page frame */}
      <div className="bg-n-100 mx-auto flex h-full w-full max-w-md flex-col">
        {/* Sales page content */}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {/* Bottom navigation */}
        {shouldHideBottomBar ? null : <BottomBar />}
      </div>
    </section>
  );
}

