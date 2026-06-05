"use client";

// REACT //
import { useEffect, useState } from "react";

// TYPES //
import type {
  AdminFunnelReportData,
  AdminReportOverviewData,
  AdminSourcePerformanceResponseData,
} from "@/types/admin";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import { PoweredByFooter } from "@/components/common/PoweredByFooter";
import { DatePicker } from "@/components/common/DatePicker";
import { Button } from "@/components/ui/button";
import MetricItem from "@/components/sales/profile/MetricItem";

// SERVICES //
import {
  getAdminFunnelReportRequest,
  getAdminReportOverviewRequest,
  getAdminSourcePerformanceRequest,
} from "@/services/api/admin-reports.api.service";


// LIBRARIES //
import { toast } from "sonner";

/** Returns YYYY-MM-DD string for a given Date. */
const formatDateService = (date: Date): string => date.toISOString().split("T")[0] ?? "";

/** Returns the first day of the current month. */
const getMonthStartService = (): string => {
  const now = new Date();
  return formatDateService(new Date(now.getFullYear(), now.getMonth(), 1));
};

/** Returns today's date as YYYY-MM-DD. */
const getTodayService = (): string => formatDateService(new Date());

const funnelStageLabels: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  TEST_DRIVE: "Test Drive",
  WON: "Won",
};

const funnelStageColors: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-purple-500",
  INTERESTED: "bg-amber-500",
  TEST_DRIVE: "bg-orange-500",
  WON: "bg-green-500",
};

/** Admin Reports Page */
export default function AdminReportsPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [fromDate, setFromDate] = useState<string>(getMonthStartService());
  const [toDate, setToDate] = useState<string>(getTodayService());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [overview, setOverview] = useState<AdminReportOverviewData | null>(null);
  const [sourcePerformance, setSourcePerformance] =
    useState<AdminSourcePerformanceResponseData | null>(null);
  const [funnelReport, setFunnelReport] = useState<AdminFunnelReportData | null>(null);

  // Helper Functions
  /** Fetches all report data in parallel. */
  const fetchReportsService = async (from: string, to: string): Promise<void> => {
    if (!from || !to) return;
    setIsLoading(true);
    try {
      const [overviewResponse, sourcesResponse, funnelResponse] =
        await Promise.all([
          getAdminReportOverviewRequest(from, to),
          getAdminSourcePerformanceRequest(from, to),
          getAdminFunnelReportRequest(from, to),
        ]);

      if (overviewResponse.status_code === 200)
        setOverview(overviewResponse.data ?? null);
      if (sourcesResponse.status_code === 200)
        setSourcePerformance(sourcesResponse.data ?? null);
      if (funnelResponse.status_code === 200)
        setFunnelReport(funnelResponse.data ?? null);
    } catch {
      toast.error("Unable to load reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDates = (): void => {
    void fetchReportsService(fromDate, toDate);
  };

  // Use Effects
  useEffect(() => {
    void fetchReportsService(fromDate, toDate);
  }, []);

  return (
    <section className="bg-n-100 h-full">
      <div className="flex flex-col">
        <Header title="Reports" />

        <div className="flex flex-col gap-5 p-6">
          {/* Date range picker */}
          <div className="bg-n-50 flex flex-col gap-4 rounded-2xl p-4">
            <p className="text-n-800 text-sm font-bold">Date Range</p>

            <div className="flex gap-3">
              {/* From */}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <label className="font-secondary text-n-500 text-[10px] font-semibold uppercase tracking-wide">
                  From
                </label>
                <DatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder="From date"
                  className="w-full"
                />
              </div>

              {/* To */}
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <label className="font-secondary text-n-500 text-[10px] font-semibold uppercase tracking-wide">
                  To
                </label>
                <DatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder="To date"
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={handleApplyDates}
              className="w-full"
            >
              Apply
            </Button>
          </div>

          {/* Overview metrics */}
          <div>
            <p className="font-secondary text-n-600 mb-3 text-xs font-semibold uppercase tracking-wide">
              Overview
            </p>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, indexItem) => (
                  <div
                    key={indexItem}
                    className="bg-n-200 h-16 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            ) : overview ? (
              <div className="grid grid-cols-2 gap-3">
                <MetricItem
                  label="Total Leads"
                  value={String(overview.totalLeads)}
                  helper={
                    overview.totalLeadsChange !== undefined
                      ? `${overview.totalLeadsChange >= 0 ? "+" : ""}${overview.totalLeadsChange} vs last month`
                      : ""
                  }
                  helperTone={
                    overview.totalLeadsChange === undefined ? "neutral"
                      : overview.totalLeadsChange >= 0 ? "positive"
                      : "negative"
                  }
                  tone="blue"
                />
                <MetricItem
                  label="Converted"
                  value={String(overview.converted)}
                  helper=""
                  tone="neutral"
                />
                <MetricItem
                  label="Won"
                  value={String(overview.won)}
                  helper=""
                  tone="green"
                />
                <MetricItem
                  label="Conv. Rate"
                  value={`${overview.conversionRate}%`}
                  helper=""
                  tone="blue"
                />
                <MetricItem
                  label="Test Drive"
                  value={String(overview.testDrive)}
                  helper=""
                  tone="neutral"
                />
                <MetricItem
                  label="Lost"
                  value={String(overview.lostLeads)}
                  helper={`${overview.lostRate}% loss rate`}
                  helperTone="negative"
                  tone="red"
                />
              </div>
            ) : (
              <p className="font-secondary text-n-500 py-4 text-center text-sm">
                No data for this period.
              </p>
            )}
          </div>

          {/* Best Source highlight */}
          {!isLoading && sourcePerformance?.bestSource ? (
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="font-secondary mb-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Best Source
              </p>
              <p className="text-n-900 text-base font-bold">
                {sourcePerformance.bestSource.source}
              </p>
              <p className="font-secondary text-n-600 mt-0.5 text-xs">
                {sourcePerformance.bestSource.leads} leads ·{" "}
                {sourcePerformance.bestSource.won} won ·{" "}
                {sourcePerformance.bestSource.rate}% rate
              </p>
              <p className="font-secondary mt-2 text-xs italic text-blue-600">
                {sourcePerformance.bestSource.guidance}
              </p>
            </div>
          ) : null}

          {/* Source performance */}
          {!isLoading && (sourcePerformance?.sources?.length ?? 0) > 0 ? (
            <div className="bg-n-50 rounded-2xl p-4">
              <p className="text-n-800 mb-3 text-sm font-semibold">
                Source Performance
              </p>
              <div className="flex flex-col gap-3">
                {(sourcePerformance?.sources ?? []).map((sourceItem) => (
                  <div key={sourceItem.source}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-secondary text-n-700 text-xs font-medium">
                        {sourceItem.source}
                      </span>
                      <span className="font-secondary text-n-500 text-xs">
                        {sourceItem.leads} leads · {sourceItem.rate}%
                        {sourceItem.trend > 0 ? (
                          <span className="ml-1 text-green-600">
                            ↑{sourceItem.trend}%
                          </span>
                        ) : sourceItem.trend < 0 ? (
                          <span className="ml-1 text-red-500">
                            ↓{Math.abs(sourceItem.trend)}%
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <div className="bg-n-200 h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(sourceItem.rate, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Funnel */}
          {!isLoading && (funnelReport?.stages?.length ?? 0) > 0 ? (
            <div className="bg-n-50 rounded-2xl p-4">
              <p className="text-n-800 mb-3 text-sm font-semibold">
                Conversion Funnel
              </p>
              <div className="flex flex-col gap-3">
                {(funnelReport?.stages ?? []).map((stageItem) => (
                  <div key={stageItem.stage}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-secondary text-n-700 text-xs font-medium">
                        {funnelStageLabels[stageItem.stage] ?? stageItem.stage}
                      </span>
                      <span className="font-secondary text-n-500 text-xs">
                        {stageItem.count} · {stageItem.percentage}%
                      </span>
                    </div>
                    <div className="bg-n-200 h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          funnelStageColors[stageItem.stage] ?? "bg-blue-500"
                        }`}
                        style={{ width: `${stageItem.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Lost reasons */}
          {!isLoading && (funnelReport?.lostReasons?.length ?? 0) > 0 ? (
            <div className="bg-n-50 rounded-2xl p-4">
              <p className="text-n-800 mb-3 text-sm font-semibold">
                Lost Reasons
              </p>
              <div className="flex flex-col gap-2">
                {(funnelReport?.lostReasons ?? []).map((reasonItem) => (
                  <div
                    key={reasonItem.reason}
                    className="flex items-center justify-between gap-3"
                  >
                    <p className="font-secondary text-n-700 text-xs">
                      {reasonItem.reason}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="bg-n-200 h-1.5 w-20 overflow-hidden rounded-full">
                        <div
                          className="h-1.5 rounded-full bg-red-400"
                          style={{ width: `${reasonItem.percentage}%` }}
                        />
                      </div>
                      <span className="font-secondary text-n-500 w-8 text-right text-xs">
                        {reasonItem.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <PoweredByFooter />
        </div>
      </div>
    </section>
  );
}

