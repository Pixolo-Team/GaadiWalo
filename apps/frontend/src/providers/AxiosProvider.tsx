"use client";

// REACT //
import { useEffect } from "react";
import type { ReactNode } from "react";

// SERVICES //
import { setupAxiosInterceptorsService } from "@/lib/axios-interceptors";

interface AxiosProviderPropsData {
  children: ReactNode;
}

/**
 * Boots the global Axios response interceptor once on app mount.
 * Handles automatic token refresh and session expiry redirection.
 */
export function AxiosProvider({ children }: AxiosProviderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects
  useEffect(() => {
    setupAxiosInterceptorsService();
  }, []);

  return <>{children}</>;
}
