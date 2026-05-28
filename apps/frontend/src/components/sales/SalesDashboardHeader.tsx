"use client";

// REACT //
import { useMemo } from "react";

// COMPONENTS //
import FilterDropdown from "@/components/common/FilterDropdown";
import Building1 from "@/components/icons/neevo-icons/Building1";
import { CountPlaceholder } from "@/components/sales/CountPlaceholder";

interface SalesSummaryMetricItemData {
  key: string;
  label: string;
  value: string;
}

interface SalesDashboardHeaderPropsData {
  avatarLabel: string;
  greeting: string;
  isSummaryLoading: boolean;
  onLocationChange: (locationValue: string) => void;
  locationName: string;
  locationOptions: ReadonlyArray<string>;
  name: string;
  selectedLocation: string;
  summaryMetrics: ReadonlyArray<SalesSummaryMetricItemData>;
}

/** Sales Dashboard Header */
export function SalesDashboardHeader({
  avatarLabel,
  greeting,
  isSummaryLoading,
  onLocationChange,
  locationName,
  locationOptions,
  name,
  selectedLocation,
  summaryMetrics,
}: SalesDashboardHeaderPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const normalizedLocationOptions = useMemo<ReadonlyArray<string>>(() => {
    const uniqueLocationValues = new Set(
      [locationName, ...locationOptions].filter(Boolean),
    );

    return Array.from(uniqueLocationValues);
  }, [locationName, locationOptions]);

  const currentLocationValue = normalizedLocationOptions.includes(
    selectedLocation,
  )
    ? selectedLocation
    : (normalizedLocationOptions[0] ?? locationName);

  // Use Effects

  return (
    <div className="flex flex-col gap-3.5 bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-10">
      {/* Greeting and location row */}
      <div className="flex items-start justify-between gap-3">
        {/* User greeting block */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Avatar */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-3xl bg-white/20">
            <span className="text-n-50 text-base font-semibold">
              {avatarLabel}
            </span>
          </div>

          {/* Greeting text */}
          <div className="min-w-0">
            <p className="font-secondary text-n-50 truncate text-sm">
              {greeting} 👋
            </p>
            <p className="text-n-50 truncate text-xl leading-tight font-bold">
              {name}
            </p>
          </div>
        </div>

        {/* Location selector */}
        <FilterDropdown
          title={currentLocationValue}
          options={normalizedLocationOptions}
          selectedOption={currentLocationValue}
          onChange={onLocationChange}
          prefix={
            <Building1 primaryColor="var(--color-n-500)" className="size-4" />
          }
          className="border-n-300 text-n-600 h-10 max-w-40 shrink-0 rounded-3xl text-xs font-bold sm:max-w-52"
        />
      </div>

      {/* Today summary card */}
      <div className="bg-n-50/12 flex flex-col gap-3 rounded-2xl p-4 backdrop-blur-sm">
        <p className="font-secondary text-n-50 text-xs tracking-wide uppercase">
          TODAY&apos;S SUMMARY
        </p>

        {/* Summary metrics */}
        <div className="flex items-center">
          {summaryMetrics.map((summaryMetricItem, summaryMetricIndex) => (
            /* Summary metric */
            <div key={summaryMetricItem.key} className="contents">
              <div className="flex flex-1 flex-col items-center">
                {isSummaryLoading ? (
                  <div className="flex h-[36px] items-center">
                    <CountPlaceholder
                      tone="inverse"
                      className="h-8 w-14 rounded-2xl"
                    />
                  </div>
                ) : (
                  <p className="text-n-50 text-3xl font-bold">
                    {summaryMetricItem.value}
                  </p>
                )}
                <p className="font-secondary text-n-50 text-center text-xs">
                  {summaryMetricItem.label}
                </p>
              </div>

              {/* Summary divider */}
              {summaryMetricIndex < summaryMetrics.length - 1 ? (
                <span className="bg-n-50/20 h-14 w-0.5" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
