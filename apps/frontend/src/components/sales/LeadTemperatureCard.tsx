"use client";

// TYPES //
import type { LeadListItemData } from "@/types/leads";

// COMPONENTS //
import GraphArrowIncrease from "@/components/icons/neevo-icons/GraphArrowIncrease";

interface LeadTemperatureCardPropsData {
  isLoading: boolean;
  leads: ReadonlyArray<LeadListItemData>;
}

/** Displays a breakdown of leads by temperature (Hot / Warm / Cold). */
export function LeadTemperatureCard({
  isLoading,
  leads,
}: LeadTemperatureCardPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const hotCount = leads.filter((leadItem) => leadItem.temperature === "HOT").length;
  const warmCount = leads.filter((leadItem) => leadItem.temperature === "WARM").length;
  const coldCount = leads.filter((leadItem) => leadItem.temperature === "COLD").length;

  const temperatureBuckets = [
    { label: "HOT", count: hotCount, icon: "🔴" },
    { label: "WARM", count: warmCount, icon: "🟡" },
    { label: "COLD", count: coldCount, icon: "🔵" },
  ] as const;

  // Use Effects

  return (
    <div className="bg-n-50 rounded-2xl p-4">
      {/* Card header */}
      <div className="mb-4 flex items-center gap-3">
        {/* Icon badge */}
        <div className="bg-n-100 flex size-10 shrink-0 items-center justify-center rounded-xl">
          <GraphArrowIncrease
            primaryColor="var(--color-n-700)"
            className="size-5"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-0.5">
          <p className="font-sans text-n-800 text-sm font-semibold leading-tight">
            Lead Temperature
          </p>
          <p className="font-secondary text-n-500 text-xs">By heat level</p>
        </div>
      </div>

      {/* Temperature buckets */}
      <div className="grid grid-cols-3 gap-2">
        {temperatureBuckets.map((bucketItem) => (
          <div
            key={bucketItem.label}
            className="bg-n-100 flex flex-col items-center gap-1.5 rounded-xl px-3 py-4"
          >
            {/* Temperature icon */}
            <span className="text-xl leading-none">{bucketItem.icon}</span>

            {/* Count */}
            {isLoading ? (
              <div className="bg-n-200 h-7 w-10 animate-pulse rounded-lg" />
            ) : (
              <p className="font-sans text-n-900 text-2xl font-bold leading-none">
                {bucketItem.count}
              </p>
            )}

            {/* Label */}
            <p className="font-secondary text-n-500 text-xs font-semibold tracking-wider uppercase">
              {bucketItem.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
