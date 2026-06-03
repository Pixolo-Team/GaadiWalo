"use client";

// REACT //
import { useEffect } from "react";
import type React from "react";
import { usePathname, useRouter } from "next/navigation";

// HOOKS //
import { useAuthContext } from "@/context/AuthContext";

// COMPONENTS //
import { AdminBottomBar } from "@/components/admin/AdminBottomBar";

// MODULES //
import { ROUTES } from "@/constants/routes";

/** Admin Layout Component */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define Navigation
  const router = useRouter();
  const pathname = usePathname();

  // Define Context
  const { isAuthenticated, isAuthLoading, user } = useAuthContext();

  // Define Refs

  // Define States

  // Helper Functions
  const isAdminRole = user?.role === "admin";
  const shouldHideBottomBar =
    pathname.startsWith(`${ROUTES.admin.team}/`) ||
    pathname.startsWith(`${ROUTES.admin.referrers}/`) ||
    pathname === ROUTES.admin.teamAdd;

  // Use Effects
  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.auth.login);
      return;
    }

    if (!isAdminRole) {
      router.replace(ROUTES.home);
    }
  }, [isAuthLoading, isAuthenticated, isAdminRole, router]);

  if (isAuthLoading || !isAuthenticated || !isAdminRole) {
    return null;
  }

  return (
    <section className="bg-n-100 h-screen">
      {/* Admin page frame */}
      <div className="bg-n-100 mx-auto flex h-full w-full max-w-md flex-col">
        {/* Admin page content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Bottom navigation */}
        {shouldHideBottomBar ? null : <AdminBottomBar />}
      </div>
    </section>
  );
}
