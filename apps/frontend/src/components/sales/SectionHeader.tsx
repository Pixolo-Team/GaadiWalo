// LIBRARIES //
import Link from "next/link";

interface SectionHeaderPropsData {
  title: string;
  actionHref?: string;
  actionLabel?: string;
}

/**
 * Renders a reusable section header with optional right-side action link.
 */
export function SectionHeader({
  actionHref,
  actionLabel,
  title,
}: Readonly<SectionHeaderPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex items-center justify-between">
      {/* Section title */}
      <h2 className="text-base font-semibold text-n-800">{title}</h2>

      {/* Section action */}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="font-secondary text-sm font-medium text-blue-600"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
