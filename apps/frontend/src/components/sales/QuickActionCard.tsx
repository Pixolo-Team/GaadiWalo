// REACT //
import type { ReactNode } from "react";

// LIBRARIES //
import Link from "next/link";

interface QuickActionCardPropsData {
  href?: string;
  icon: ReactNode;
  label: string;
}

/**
 * Renders a quick action tile with icon and label.
 */
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

  // Render link-style action card
  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-n-50 p-4"
      >
        {/* Action icon */}
        <div className="size-6">{icon}</div>

        {/* Action label */}
        <span className="font-secondary text-sm font-semibold text-n-800">
          {label}
        </span>
      </Link>
    );
  }

  // Render button-style action card
  return (
    <button
      type="button"
      className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-n-50 p-4"
    >
      {/* Action icon */}
      <div className="size-6">{icon}</div>

      {/* Action label */}
      <span className="font-secondary text-sm font-semibold text-n-800">
        {label}
      </span>
    </button>
  );
}
