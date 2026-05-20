"use client";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import MetricItem from "@/components/sales/profile/MetricItem";
import PipelineProgressCard from "@/components/sales/profile/PipelineProgressCard";
import ProfileTopSummary from "@/components/sales/profile/ProfileTopSummary";
import SourceBreakdownCard from "@/components/sales/profile/SourceBreakdownCard";
import WeeklyCallsLeadsCard from "@/components/sales/profile/WeeklyCallsLeadsCard";

// DATA //
import {
  salesPerformancePipelineProgress,
  salesPerformanceSourceBreakdown,
  salesPerformanceTopMetrics,
  salesPerformanceWeeklyCallsLeads,
  salesProfileSummaryData,
} from "@/data/sales";

/**
 * Renders the profile performance report screen.
 */
export default function ProfilePerformancePage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Performance page shell */}
      <div className="flex h-full flex-col">
        {/* Performance header */}
        <Header title="My Performance" />

        {/* Performance scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Profile summary */}
          <ProfileTopSummary
            avatarLabel={salesProfileSummaryData.avatarLabel}
            branch={salesProfileSummaryData.branch}
            detailsClassName="items-start"
            joined={salesProfileSummaryData.joined}
            name={salesProfileSummaryData.name}
            role={salesProfileSummaryData.role}
            userId={salesProfileSummaryData.userId}
          />

          {/* Content stack */}
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* Top metrics grid */}
            <div className="grid grid-cols-2 gap-2">
              {salesPerformanceTopMetrics.map((metricItem) => (
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

            <PipelineProgressCard items={salesPerformancePipelineProgress} />
            <WeeklyCallsLeadsCard items={salesPerformanceWeeklyCallsLeads} />
            <SourceBreakdownCard items={salesPerformanceSourceBreakdown} />
          </div>
        </div>
      </div>
    </section>
  );
}
