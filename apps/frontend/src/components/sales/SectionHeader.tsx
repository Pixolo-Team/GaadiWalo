// LIBRARIES //
import Link from "next/link";

interface SectionHeaderPropsData {
  title: string;
  href?: string;
  label?: string;
}

/** Section header component */
export function SectionHeader({
  href,
  label,
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
      <h2 className="text-n-800 text-base font-semibold">{title}</h2>

      {/* Section action */}
      {href && label ? (
        <Link
          href={href}
          className="font-secondary text-sm font-medium text-blue-600"
        >
          {label}
        </Link>
      ) : null}
    </div>
  );
}
