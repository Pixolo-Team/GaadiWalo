// TYPES //
import type { SalesPerformanceSourceItemData } from "@/types/profile";

interface SourceBreakdownPropsData {
  items: SalesPerformanceSourceItemData[];
}

/** Renders the lead source breakdown list with counts. */
export function SourceBreakdown({ items }: SourceBreakdownPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="border-n-200 bg-n-50 flex flex-col gap-4 rounded-2xl border p-4">
      {/* Section title */}
      <p className="font-secondary text-n-600 text-xs font-semibold tracking-wide uppercase">
        Source Breakdown
      </p>

      {/* Source rows */}
      <div className="flex flex-col">
        {items.length === 0 ? (
          <p className="font-secondary text-n-500 py-2 text-sm">
            No source data for this period.
          </p>
        ) : null}

        {items.map((sourceItem, sourceIndex) => (
          <div
            key={sourceItem.key}
            className={`flex items-center justify-between py-3 ${
              sourceIndex < items.length - 1 ? "border-n-200 border-b" : ""
            }`}
          >
            {/* Source name with color dot */}
            <div className="flex items-center gap-2.5">
              <span
                className={`size-2.5 rounded-full ${sourceItem.colorClassName}`}
              />
              <p className="font-secondary text-n-700 text-sm">
                {sourceItem.source}
              </p>
            </div>

            {/* Count */}
            <p className="text-n-800 text-sm font-bold">{sourceItem.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
