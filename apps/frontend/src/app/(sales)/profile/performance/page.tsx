"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import MetricItem from "@/components/sales/profile/MetricItem";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";
import { PipelineProgress } from "@/components/sales/profile/performance/PipelineProgress";
import { SourceBreakdown } from "@/components/sales/profile/performance/SourceBreakdown";
import { WeeklyActivityChart } from "@/components/sales/profile/performance/WeeklyActivityChart";

// SERVICES //
import {
  getSalesPerformanceRequest,
  getSalesProfileRequest,
} from "@/services/api/sales-profile.api.service";
import { mapSalesPerformanceViewService } from "@/services/sales-performance.service";

// CONSTANTS //
import { SALES_PERFORMANCE_DEFAULT_PERIOD } from "@/constants/performance";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  SalesPerformanceData,
  SalesPerformanceResponseData,
  SalesProfileData,
} from "@/types/profile";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/**
 * Renders the sales profile performance screen with live API data.
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

  // Helper Functions
  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";

  /**
   * Loads sales profile and performance data for the performance screen.
   */
  const loadPerformanceScreen = useCallback((): void => {
    if (!userCode) {
      setIsPerformanceLoading(false);
      return;
    }

    /**
     * Call get sales profile and performance APIs together.
     */
    Promise.all([
      getSalesProfileRequest(userCode),
      getSalesPerformanceRequest(userCode, SALES_PERFORMANCE_DEFAULT_PERIOD),
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
  }, [userCode]);

  // Use Effects
  useEffect(() => {
    const performanceLoadTimeout = window.setTimeout(() => {
      loadPerformanceScreen();
    }, 0);

    return () => {
      window.clearTimeout(performanceLoadTimeout);
    };
  }, [loadPerformanceScreen]);

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

  return (
    <section className="bg-n-100 h-full">
      {/* Performance page shell */}
      <div className="flex h-full flex-col">
        {/* Performance header */}
        <Header title="My Performance" />

        {/* Loading state */}
        {isPerformanceLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-secondary text-n-600 text-sm">
              Loading performance...
            </p>
          </div>
        ) : (
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            {/* Profile summary — same full-width hero as the profile page */}
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
              {/* Performance sections */}
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
                  No performance data available yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
