"use client";

// COMPONENTS //
import { Header } from "@/components/common/Header";

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
  /**
   * Finds max chart value for proportional weekly bar heights.
   */
  const maxWeeklyValue = Math.max(
    ...salesPerformanceWeeklyCallsLeads.flatMap((dayItem) => [
      dayItem.calls,
      dayItem.leads,
    ]),
  );

  /**
   * Resolves metric value color by tone.
   */
  const getMetricValueColorClassName = (tone: string): string => {
    if (tone === "green") {
      return "text-green-500";
    }

    if (tone === "red") {
      return "text-red-500";
    }

    return "text-n-800";
  };

  // Use Effects

  return (
    <section className="h-full bg-n-100">
      {/* Performance page shell */}
      <div className="flex h-full flex-col">
        {/* Performance header */}
        <Header title="My Performance" />

        {/* Performance scroll content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Profile summary */}
          <div className="bg-linear-to-br from-blue-700 to-[#0d3b9e] px-6 py-7">
            {/* Summary row */}
            <div className="flex items-start gap-3.5">
              {/* Avatar */}
              <div className="flex size-[52px] items-center justify-center rounded-full bg-white/20">
                <p className="font-primary text-n-50 text-xl font-semibold">
                  {salesProfileSummaryData.avatarLabel}
                </p>
              </div>

              {/* Summary text */}
              <div className="flex flex-col gap-0.5">
                <p className="font-primary text-n-50 text-[1.125rem] font-bold">
                  {salesProfileSummaryData.name}
                </p>
                <p className="font-secondary text-sm font-medium text-white/75">
                  {salesProfileSummaryData.role} · ID:{" "}
                  {salesProfileSummaryData.userId}
                </p>
                <p className="font-secondary text-xs text-white/50">
                  Joined: {salesProfileSummaryData.joined} ·{" "}
                  {salesProfileSummaryData.branch}
                </p>
              </div>
            </div>
          </div>

          {/* Content stack */}
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* Top metrics grid */}
            <div className="grid grid-cols-2 gap-2">
              {salesPerformanceTopMetrics.map((metricItem) => (
                <div key={metricItem.key} className="bg-n-50 rounded-[14px] p-3.5">
                  {/* Metric label */}
                  <p className="font-secondary text-n-500 text-xs font-medium tracking-wide uppercase">
                    {metricItem.label}
                  </p>

                  {/* Metric value */}
                  <p
                    className={`font-primary mt-0.5 text-[2.125rem] leading-none font-bold ${getMetricValueColorClassName(metricItem.tone)}`}
                  >
                    {metricItem.value}
                  </p>

                  {/* Metric helper */}
                  {metricItem.helper ? (
                    <p className="font-secondary text-n-600 mt-1 text-xs">
                      {metricItem.helper}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Pipeline progress section */}
            <div className="flex flex-col gap-1.5">
              <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                Pipeline Progress
              </p>
              <div className="bg-n-50 rounded-[14px] p-5">
                <div className="flex flex-col gap-3">
                  {salesPerformancePipelineProgress.map((item) => (
                    <div key={item.key} className="flex flex-col gap-1">
                      {/* Pipeline row header */}
                      <div className="flex items-center justify-between">
                        <p className="font-secondary text-n-600 text-xs">{item.label}</p>
                        <p
                          className={`font-secondary text-xs font-bold ${item.key === "won" ? "text-green-500" : "text-n-950"}`}
                        >
                          {item.count}
                        </p>
                      </div>

                      {/* Pipeline row progress */}
                      <div className="bg-n-200 h-[5px] w-full rounded-[3px]">
                        <div
                          className={`${item.colorClassName} h-[5px] rounded-[3px]`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly calls vs leads section */}
            <div className="flex flex-col gap-1.5">
              <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                Weekly Calls vs Leads
              </p>
              <div className="bg-n-50 rounded-[14px] p-5">
                {/* Chart */}
                <div className="flex h-[150px] items-end justify-between gap-2">
                  {salesPerformanceWeeklyCallsLeads.map((dayItem) => {
                    const callsHeight = (dayItem.calls / maxWeeklyValue) * 100;
                    const leadsHeight = (dayItem.leads / maxWeeklyValue) * 100;

                    return (
                      <div key={dayItem.key} className="flex flex-1 flex-col items-center gap-2">
                        {/* Bars */}
                        <div className="flex h-[120px] items-end gap-1">
                          <div
                            className="w-2 rounded-t-sm bg-blue-200"
                            style={{ height: `${callsHeight}%` }}
                          />
                          <div
                            className="w-2 rounded-t-sm bg-blue-600"
                            style={{ height: `${leadsHeight}%` }}
                          />
                        </div>

                        {/* Day label */}
                        <p className="font-secondary text-n-500 text-[10px]">{dayItem.day}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Source breakdown section */}
            <div className="flex flex-col gap-1.5">
              <p className="font-secondary text-n-600 text-xs font-medium tracking-wide uppercase">
                Source Breakdown
              </p>
              <div className="bg-n-50 rounded-[14px] p-5">
                <div className="flex flex-col gap-3">
                  {salesPerformanceSourceBreakdown.map((sourceItem, index) => {
                    const isLast = index === salesPerformanceSourceBreakdown.length - 1;

                    return (
                      <div key={sourceItem.key} className="flex flex-col gap-3">
                        {/* Source row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`${sourceItem.colorClassName} size-[9px] rounded-[4.5px]`}
                            />
                            <p className="font-secondary text-n-600 text-xs">
                              {sourceItem.source}
                            </p>
                          </div>
                          <p className="font-secondary text-n-950 text-xs font-semibold">
                            {sourceItem.count}
                          </p>
                        </div>

                        {/* Divider */}
                        {isLast ? null : <div className="bg-n-200 h-px w-full" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
