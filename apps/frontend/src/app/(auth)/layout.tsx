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
  const { isLoading, session } = useAuthContext();

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Block auth pages once valid auth session exists.
    if (session?.token) {
      router.replace(ROUTES.home);
    }
  }, [isLoading, router, session?.token]);

  if (isLoading) {
    return null;
  }

  if (session?.token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-n-100">
      <div className="mx-auto flex min-h-screen w-full flex-col bg-n-50">
        {children}
      </div>
    </div>
  );
}
