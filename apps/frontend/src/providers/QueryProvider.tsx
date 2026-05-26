"use client";

// REACT //
import { useState } from "react";

// LIBRARIES //
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderPropsData {
  children: React.ReactNode;
}

/** Provides TanStack Query cache for the full frontend app. */
export function QueryProvider({ children }: QueryProviderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [queryClient] = useState<QueryClient>(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 30 * 60 * 1000,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  // Helper Functions

  // Use Effects

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
