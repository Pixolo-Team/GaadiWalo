// REACT //
import type { ReactNode } from "react";

// COMPONENTS //
import Link from "next/link";

interface QuickActionCardPropsData {
  href?: string;
  icon: ReactNode;
  label: string;
}

/** Quick Action Card Component */
export function QuickActionCard({
  href,
  icon,
  label,
}: Readonly<QuickActionCardPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <Link
      href={href || "#"}
      className="bg-n-50 flex flex-1 flex-col items-center gap-2 rounded-2xl p-4"
    >
      {/* Action icon */}
      <div className="size-6">{icon}</div>

      {/* Action label */}
      <span className="font-secondary text-n-800 text-sm font-semibold">
        {label}
      </span>
    </Link>
  );
}
