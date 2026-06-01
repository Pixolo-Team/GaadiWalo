// TYPES //
import type { SalesPerformancePipelineItemData } from "@/types/profile";

interface PipelineProgressPropsData {
  items: SalesPerformancePipelineItemData[];
}

/** Renders the pipeline progress section with one bar per status. */
export function PipelineProgress({ items }: PipelineProgressPropsData) {
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
        Pipeline Progress
      </p>

      {/* Pipeline rows */}
      <div className="flex flex-col gap-3">
        {items.map((pipelineItem) => (
          <div key={pipelineItem.key} className="flex flex-col gap-1.5">
            {/* Label and count */}
            <div className="flex items-center justify-between">
              <p className="font-secondary text-n-700 text-sm">
                {pipelineItem.label}
              </p>
              <p className="text-n-800 text-sm font-bold">
                {pipelineItem.count}
              </p>
            </div>

            {/* Progress track */}
            <div className="bg-n-100 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${pipelineItem.colorClassName}`}
                style={{ width: `${pipelineItem.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
