// REACT //
import type { ReactNode } from "react";

interface QuickActionCardPropsData {
  icon: ReactNode;
  label: string;
}

/**
 * Renders a quick action tile with icon and label.
 */
export function QuickActionCard({
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
