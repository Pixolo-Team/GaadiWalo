"use client";

// REACT //
import { useCallback, useEffect, useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import MetricItem from "@/components/sales/profile/MetricItem";
import PipelineProgressCard from "@/components/sales/profile/PipelineProgressCard";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";
import SourceBreakdownCard from "@/components/sales/profile/SourceBreakdownCard";
import WeeklyCallsLeadsCard from "@/components/sales/profile/WeeklyCallsLeadsCard";

// SERVICES //
import {
  getSalesPerformanceRequest,
  getSalesProfileRequest,
} from "@/services/api/sales-profile.api.service";

// DATA //
import { salesProfileSummaryData } from "@/data/sales";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { SalesPerformanceData, SalesProfileData } from "@/types/profile";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/**
 * Renders the sales profile performance placeholder screen.
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
  const [salesPerformance, setSalesPerformance] =
    useState<SalesPerformanceData | null>(null);
  const [isPerformanceLoading, setIsPerformanceLoading] =
    useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);

  // Helper Functions
  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";

  /**
   * Fetches sales profile for performance header.
   */
  const getSalesProfile = useCallback((): void => {
    if (!userCode) {
      setIsProfileLoading(false);
      return;
    }

    /**
     * Call get sales profile API.
     */
    getSalesProfileRequest(userCode)
      .then((response: ApiResponseData<SalesProfileData>) => {
        if (response.status_code === 200 && response.data) {
          // Set sales profile state
          setSalesProfile(response.data);
        } else {
          // Reset sales profile state
          setSalesProfile(null);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load profile right now.");

        // Reset sales profile state
        setSalesProfile(null);
      })
      .finally(() => {
        // Set profile loading false
        setIsProfileLoading(false);
      });
  }, [userCode]);

  /**
   * Fetches sales performance for selected period.
   */
  const getSalesPerformance = useCallback((): void => {
    if (!userCode) {
      setIsPerformanceLoading(false);
      return;
    }

    setIsPerformanceLoading(true);

    /**
     * Call get sales performance API.
     */
    getSalesPerformanceRequest(userCode, "this-month")
      .then((response: ApiResponseData<SalesPerformanceData>) => {
        if (response.status_code === 200 && response.data) {
          // Set sales performance state
          setSalesPerformance(response.data);
        } else {
          // Reset sales performance state
          setSalesPerformance(null);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to load performance right now.");

        // Reset sales performance state
        setSalesPerformance(null);
      })
      .finally(() => {
        // Set performance loading false
        setIsPerformanceLoading(false);
      });
  }, [userCode]);

  // Use Effects
  useEffect(() => {
    const profileLoadTimeout = window.setTimeout(() => {
      getSalesProfile();
    }, 0);

    return () => {
      window.clearTimeout(profileLoadTimeout);
    };
  }, [getSalesProfile]);

  useEffect(() => {
    const performanceLoadTimeout = window.setTimeout(() => {
      getSalesPerformance();
    }, 0);

    return () => {
      window.clearTimeout(performanceLoadTimeout);
    };
  }, [getSalesPerformance]);

  const topMetrics = salesPerformance?.topMetrics ?? [];
  const pipelineProgress = salesPerformance?.pipelineProgress ?? [];
  const weeklyCallsLeads = salesPerformance?.weeklyCallsLeads ?? [];
  const sourceBreakdown = salesPerformance?.sourceBreakdown ?? [];

  const summaryProfile = {
    avatarLabel:
      salesProfile?.fullName
        ?.split(" ")
        .slice(0, 2)
        .map((wordItem) => wordItem.charAt(0).toUpperCase())
        .join("") ?? salesProfileSummaryData.avatarLabel,
    branch: salesProfile?.branch ?? salesProfileSummaryData.branch,
    joined:
      (salesProfile?.joinedAt
        ? new Date(salesProfile.joinedAt).toLocaleDateString()
        : "") || salesProfileSummaryData.joined,
    name: salesProfile?.fullName ?? salesProfileSummaryData.name,
    role: salesProfile?.role ?? salesProfileSummaryData.role,
    userId: salesProfile?.userId ?? salesProfileSummaryData.userId,
  };

  if (isProfileLoading || isPerformanceLoading) {
    return (
      <section className="bg-n-100 h-full">
        <div className="flex h-full items-center justify-center">
          <p className="font-secondary text-n-600 text-sm">
            Loading performance...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-n-100 h-full">
      <div className="flex h-full flex-col">
        <Header title="My Performance" />

        {/* Performance scroll content */}
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          {/* Profile summary */}
          <ProfileTopSummary
            avatarLabel={summaryProfile.avatarLabel}
            branch={summaryProfile.branch}
            detailsClassName="items-start"
            joined={summaryProfile.joined}
            name={summaryProfile.name}
            role={summaryProfile.role}
            userId={summaryProfile.userId}
          />

          {/* Content stack */}
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* Top metrics grid */}
            <div className="grid grid-cols-2 gap-2">
              {topMetrics.map((metricItem) => (
                <MetricItem
                  key={metricItem.key}
                  className="items-start px-3.5 py-3.5"
                  helper={metricItem.helper}
                  label={metricItem.label}
                  tone={metricItem.tone}
                  value={metricItem.value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
