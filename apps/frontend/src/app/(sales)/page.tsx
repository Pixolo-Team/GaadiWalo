"use client";

// REACT //
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import { useAuthContext } from "@/context/AuthContext";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

/**
 * Renders the protected home page.
 */
export default function HomePage() {
  // Define Navigation
  const router = useRouter();

  // Define Context
  const { session, user } = useAuthContext();

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects
  useEffect(() => {
    if (!session?.token) {
      // Protect sales home route when auth session is missing.
      router.replace(ROUTES.auth.login);
    }
  }, [router, session?.token]);

  if (!session?.token) {
    return null;
  }

  return (
    <section className="bg-n-100 flex min-h-screen items-center justify-center">
      {/* Home content */}
      <div className="bg-n-50 border-n-200 rounded-2xl border px-6 py-5 text-center">
        {/* Title */}
        <p className="text-n-800 text-2xl font-bold">Welcome</p>

        {/* Subtitle */}
        <p className="font-secondary text-n-600 mt-2 text-sm">
          {user?.name ? `Logged in as ${user.name}` : "You are logged in."}
        </p>
      </div>
    </section>
  );
}
