// REACT //
import { useState } from "react";

// COMPONENTS //
import FilterDropdown from "@/components/common/FilterDropdown";
import Building1 from "@/components/icons/neevo-icons/Building1";

// DATA //
import {
  salesHeaderUser,
  salesLocationOptions,
  salesSummaryMetrics,
} from "@/data/sales";

/** Sales Dashboard Header */
export function SalesDashboardHeader() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [selectedLocation, setSelectedLocation] = useState<string>(
    salesLocationOptions[0],
  );

  // Helper Functions

  // Use Effects

  return (
    <div className="flex flex-col gap-3.5 bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-10">
      {/* Greeting and location row */}
      <div className="flex items-center justify-between">
        {/* User greeting block */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex size-11 items-center justify-center rounded-3xl bg-white/20">
            <span className="text-n-50 text-base font-semibold">
              {salesHeaderUser.avatarLabel}
            </span>
          </div>
          {/* Greeting text */}
          <div>
            <p className="font-secondary text-n-50 text-sm">
              {salesHeaderUser.greeting}
            </p>
            <p className="text-n-50 text-xl font-bold">
              {salesHeaderUser.name}
            </p>
          </div>
        </div>

        {/* Location selector */}
        <FilterDropdown
          title={salesLocationOptions[0]}
          options={salesLocationOptions}
          selectedOption={selectedLocation}
          onChange={setSelectedLocation}
          prefix={
            <Building1 primaryColor="var(--color-n-500)" className="size-4" />
          }
          className="border-n-300 text-n-600 h-10 rounded-3xl text-xs font-bold"
        />
      </div>

      {/* Today summary card */}
      <div className="bg-n-50/12 flex flex-col gap-3 rounded-2xl p-4 backdrop-blur-sm">
        <p className="font-secondary text-n-50 text-xs tracking-wide uppercase">
          TODAY&apos;S SUMMARY
        </p>
        {/* Summary metrics */}
        <div className="flex items-center">
          {salesSummaryMetrics.map((summaryMetricItem, summaryMetricIndex) => (
            /* Summary metric */
            <div key={summaryMetricItem.key} className="contents">
              <div className="flex flex-1 flex-col items-center">
                <p className="text-n-50 text-3xl font-bold">
                  {summaryMetricItem.value}
                </p>
                <p className="font-secondary text-n-50 text-xs">
                  {summaryMetricItem.label}
                </p>
              </div>

              {/* Summary divider */}
              {summaryMetricIndex < salesSummaryMetrics.length - 1 ? (
                <span className="bg-n-50/20 h-14 w-0.5" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
