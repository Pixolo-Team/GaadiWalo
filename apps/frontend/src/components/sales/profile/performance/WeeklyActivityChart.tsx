// TYPES //
import type { SalesPerformanceWeeklyItemData } from "@/types/profile";

interface WeeklyActivityChartPropsData {
  items: SalesPerformanceWeeklyItemData[];
}

/** Renders the weekly calls-vs-leads grouped bar chart. */
export function WeeklyActivityChart({ items }: WeeklyActivityChartPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const maxActivityValue = Math.max(
    1,
    ...items.map((weeklyItem) => Math.max(weeklyItem.calls, weeklyItem.leads)),
  );

  // Use Effects

  return (
    <div className="border-n-200 bg-n-50 flex flex-col gap-4 rounded-2xl border p-4">
      {/* Header row with title and legend */}
      <div className="flex items-center justify-between">
        <p className="font-secondary text-n-600 text-xs font-semibold tracking-wide uppercase">
          Weekly Calls vs Leads
        </p>

        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-600" />
            <span className="font-secondary text-n-600 text-xs">Calls</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-300" />
            <span className="font-secondary text-n-600 text-xs">Leads</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="flex h-40 items-end justify-between gap-2">
        {items.map((weeklyItem) => (
          <div
            key={weeklyItem.key}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            {/* Grouped bars */}
            <div className="flex h-full w-full items-end justify-center gap-1">
              {/* Calls bar */}
              <div
                className="w-1/2 max-w-3 rounded-t bg-blue-600"
                style={{
                  height: `${(weeklyItem.calls / maxActivityValue) * 100}%`,
                }}
              />

              {/* Leads bar */}
              <div
                className="w-1/2 max-w-3 rounded-t bg-blue-300"
                style={{
                  height: `${(weeklyItem.leads / maxActivityValue) * 100}%`,
                }}
              />
            </div>

            {/* Day label */}
            <span className="font-secondary text-n-500 text-[10px]">
              {weeklyItem.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
