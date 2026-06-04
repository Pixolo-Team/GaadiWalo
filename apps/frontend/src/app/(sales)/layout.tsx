"use client";

// REACT //
import { useEffect } from "react";
import type React from "react";
import { usePathname, useRouter } from "next/navigation";

// HOOKS //
import { useAuthContext } from "@/context/AuthContext";

// COMPONENTS //
import { BottomBar } from "@/components/sales/BottomBar";

// MODULES //
import { ROUTES } from "@/constants/routes";

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
  const { isAuthenticated, isAuthLoading } = useAuthContext();

  // Define Refs

  // Define States

  // Helper Functions
  const shouldHideBottomBar = pathname.startsWith(`${ROUTES.sales.leads}/`);

  // Use Effects
  useEffect(() => {
    // Only redirect once auth state is resolved — avoids false redirects during hydration.
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(ROUTES.auth.login);
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Render nothing while auth is being resolved to avoid hydration mismatch.
  if (isAuthLoading || !isAuthenticated) {
    return null;
  }

  return (
    <section className="bg-n-100 h-[100dvh]">
      {/* Sales page frame */}
      <div className="bg-n-100 mx-auto flex h-full w-full max-w-md flex-col">
        {/* Sales page content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Bottom navigation */}
        {shouldHideBottomBar ? null : <BottomBar />}
      </div>
    </section>
  );
}
