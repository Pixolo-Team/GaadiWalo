// REACT //
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type React from "react";

// COMPONENTS //
import { useAuthContext } from "@/context/AuthContext";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

/**
 * Renders the shared authentication layout for all auth screens.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define Navigation
  const router = useRouter();

  // Define Context
  const { isAuthenticated, isLoading } = useAuthContext();

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Block auth pages once valid auth session exists.
    if (isAuthenticated) {
      router.replace(ROUTES.home);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-n-100 min-h-screen">
      <div className="bg-n-50 mx-auto flex min-h-screen w-full flex-col">
        {children}
      </div>
    </div>
  );
}
