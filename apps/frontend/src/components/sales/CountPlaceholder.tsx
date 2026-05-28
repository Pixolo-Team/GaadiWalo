// LIBRARIES //
import { cn } from "@/lib/utils";

interface CountPlaceholderPropsData {
  className?: string;
  tone?: "default" | "inverse";
}

/**
 * Renders a lightweight loading placeholder for count-based UI.
 */
export function CountPlaceholder({
  className,
  tone = "default",
}: CountPlaceholderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex animate-pulse rounded-full",
        tone === "inverse" ? "bg-n-50/25" : "bg-n-200",
        className,
      )}
    />
  );
}
