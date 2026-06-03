"use client";

// REACT //
import { useCallback, useEffect, useMemo, useState } from "react";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  SalesPerformanceData,
  SalesPerformanceResponseData,
  SalesProfileData,
} from "@/types/profile";

// SERVICES //
import {
  getSalesPerformanceRequest,
  getSalesProfileRequest,
} from "@/services/api/sales-profile.api.service";
import { mapSalesPerformanceViewService } from "@/services/sales-performance.service";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import FilterDropdown from "@/components/common/FilterDropdown";
import MetricItem from "@/components/sales/profile/MetricItem";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";
import { PipelineProgress } from "@/components/sales/profile/performance/PipelineProgress";
import { SourceBreakdown } from "@/components/sales/profile/performance/SourceBreakdown";
import { WeeklyActivityChart } from "@/components/sales/profile/performance/WeeklyActivityChart";

// HOOKS //
import { useAuthContext } from "@/context/AuthContext";

// LIBRARIES //
import { toast } from "sonner";

// MODULES //
import {
  SALES_PERFORMANCE_YEAR_RANGE,
  salesPerformanceMonthList,
  salesPerformanceMonthToNumber,
} from "@/data/sales";

/**
 * Renders the sales profile performance screen with live API data.
 * Supports month/year period filter — defaults to current month.
 */
export default function ProfilePerformancePage() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const [salesProfile, setSalesProfile] = useState<SalesProfileData | null>(
    null,
  );
  const [performanceView, setPerformanceView] =
    useState<SalesPerformanceData | null>(null);
  const [isPerformanceLoading, setIsPerformanceLoading] =
    useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    salesPerformanceMonthList[new Date().getMonth()],
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(new Date().getFullYear()),
  );

  // Helper Functions
  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";

  const yearOptions = useMemo<string[]>(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: SALES_PERFORMANCE_YEAR_RANGE + 1 }, (_, indexItem) =>
      String(currentYear - SALES_PERFORMANCE_YEAR_RANGE + indexItem),
    );
  }, []);

  const selectedPeriod = useMemo<string>(() => {
    const monthNumber = salesPerformanceMonthToNumber[selectedMonth] ?? "01";
    return `${selectedYear}-${monthNumber}`;
  }, [selectedMonth, selectedYear]);

  /**
   * Loads sales profile and performance data for the given period.
   */
  const loadPerformanceScreen = useCallback(
    (period: string): void => {
      if (!userCode) {
        setIsPerformanceLoading(false);
        return;
      }

      setIsPerformanceLoading(true);

      /**
       * Call get sales profile and performance APIs together.
       */
      Promise.all([
        getSalesProfileRequest(userCode),
        getSalesPerformanceRequest(userCode, period),
      ])
        .then(
          ([profileResponse, performanceResponse]: [
            ApiResponseData<SalesProfileData>,
            ApiResponseData<SalesPerformanceResponseData>,
          ]) => {
            if (profileResponse.status_code === 200 && profileResponse.data) {
              // Set sales profile state
              setSalesProfile(profileResponse.data);
            }

            if (
              performanceResponse.status_code === 200 &&
              performanceResponse.data
            ) {
              // Map raw performance payload into the screen view model
              setPerformanceView(
                mapSalesPerformanceViewService(performanceResponse.data),
              );
            } else {
              // Clear stale performance data when no data for selected period
              setPerformanceView(null);
            }
          },
        )
        .catch(() => {
          // Error toast
          toast.error("Unable to load performance right now. Please try again.");
        })
        .finally(() => {
          // Set performance loading false
          setIsPerformanceLoading(false);
        });
    },
    [userCode],
  );

  const avatarLabel =
    salesProfile?.fullName
      ?.split(" ")
      .slice(0, 2)
      .map((wordItem) => wordItem.charAt(0).toUpperCase())
      .join("") ?? "";

  const joinedLabel = salesProfile?.joinedAt
    ? new Date(salesProfile.joinedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  // Use Effects
  useEffect(() => {
    const performanceLoadTimeout = window.setTimeout(() => {
      loadPerformanceScreen(selectedPeriod);
    }, 0);

    return () => {
      window.clearTimeout(performanceLoadTimeout);
    };
  }, [loadPerformanceScreen, selectedPeriod]);

  return (
    <section className="bg-n-100 h-full">
      {/* Performance page shell */}
      <div className="flex h-full flex-col">
        {/* Performance header */}
        <Header title="My Performance" />

        {/* Period filter bar — sticky below header */}
        <div className="border-n-200 bg-n-50 flex shrink-0 items-center gap-2 border-b px-6 py-3">
          {/* Period label */}
          <p className="font-secondary text-n-600 shrink-0 text-sm font-medium">
            Period
          </p>

          {/* Month selector */}
          <FilterDropdown
            title={selectedMonth}
            options={salesPerformanceMonthList}
            selectedOption={selectedMonth}
            onChange={setSelectedMonth}
          />

          {/* Year selector */}
          <FilterDropdown
            title={selectedYear}
            options={yearOptions}
            selectedOption={selectedYear}
            onChange={setSelectedYear}
          />
        </div>

        {/* Loading state */}
        {isPerformanceLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-secondary text-n-600 text-sm">
              Loading performance...
            </p>
          </div>
        ) : (
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            {/* Profile summary */}
            {salesProfile ? (
              <ProfileTopSummary
                avatarLabel={avatarLabel}
                branch={salesProfile.branch}
                joined={joinedLabel}
                name={salesProfile.fullName}
                role={salesProfile.role}
                userId={salesProfile.userId}
              />
            ) : null}

            {/* Content stack */}
            <div className="flex flex-col gap-6 px-6 py-6">
              {performanceView ? (
                <>
                  {/* Top metrics grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {performanceView.topMetrics.map((topMetricItem) => (
                      <MetricItem
                        key={topMetricItem.key}
                        helper={topMetricItem.helper}
                        label={topMetricItem.label}
                        tone={topMetricItem.tone}
                        value={topMetricItem.value}
                      />
                    ))}
                  </div>

                  {/* Pipeline progress */}
                  <PipelineProgress items={performanceView.pipelineProgress} />

                  {/* Weekly calls vs leads */}
                  <WeeklyActivityChart
                    items={performanceView.weeklyCallsLeads}
                  />

                  {/* Source breakdown */}
                  <SourceBreakdown items={performanceView.sourceBreakdown} />
                </>
              ) : (
                <p className="font-secondary text-n-600 py-6 text-center text-sm">
                  No performance data available for {selectedMonth}{" "}
                  {selectedYear}.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
