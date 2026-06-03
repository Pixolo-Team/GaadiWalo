// TYPES //
import type {
  SalesPerformanceData,
  SalesPerformancePipelineItemData,
  SalesPerformanceResponseData,
  SalesPerformanceSourceItemData,
  SalesPerformanceTopMetricItemData,
  SalesPerformanceWeeklyItemData,
} from "@/types/profile";

// CONSTANTS //
import {
  SALES_PERFORMANCE_PIPELINE_CONFIG,
  SALES_PERFORMANCE_SOURCE_COLORS,
} from "@/constants/performance";

/**
 * Builds the four summary metric cards from the raw performance payload.
 */
export const getPerformanceTopMetricsService = (
  performance: SalesPerformanceResponseData,
): SalesPerformanceTopMetricItemData[] => {
  return [
    {
      helper: "",
      key: "total-leads",
      label: "Total Leads",
      tone: "neutral",
      value: String(performance.totalLeads),
    },
    {
      helper: "",
      key: "calls-made",
      label: "Calls Made",
      tone: "neutral",
      value: String(performance.callsMade),
    },
    {
      helper: `${performance.wonRate}% rate`,
      key: "won",
      label: "Won 🎉",
      tone: "green",
      value: String(performance.won),
    },
    {
      helper: `${performance.lostRate}% lost`,
      key: "lost",
      label: "Lost",
      tone: "red",
      value: String(performance.lost),
    },
  ];
};

/**
 * Maps the pipeline status counts into ordered progress bar rows.
 */
export const getPerformancePipelineService = (
  performance: SalesPerformanceResponseData,
): SalesPerformancePipelineItemData[] => {
  const pipelineCounts = SALES_PERFORMANCE_PIPELINE_CONFIG.map(
    (pipelineConfigItem) => performance.pipeline[pipelineConfigItem.key] ?? 0,
  );
  const maxPipelineCount = Math.max(...pipelineCounts, 0);

  return SALES_PERFORMANCE_PIPELINE_CONFIG.map((pipelineConfigItem) => {
    const pipelineCount = performance.pipeline[pipelineConfigItem.key] ?? 0;

    return {
      colorClassName: pipelineConfigItem.barClassName,
      count: pipelineCount,
      key: pipelineConfigItem.key,
      label: pipelineConfigItem.label,
      progress:
        maxPipelineCount > 0 ? (pipelineCount / maxPipelineCount) * 100 : 0,
    };
  });
};

/**
 * Maps the weekly activity entries into chart rows.
 */
export const getPerformanceWeeklyService = (
  performance: SalesPerformanceResponseData,
): SalesPerformanceWeeklyItemData[] => {
  return performance.weeklyActivity.map((weeklyActivityItem) => ({
    calls: weeklyActivityItem.calls,
    day: weeklyActivityItem.day,
    key: weeklyActivityItem.day,
    leads: weeklyActivityItem.leads,
  }));
};

/**
 * Maps the source breakdown entries and assigns a color per source.
 */
export const getPerformanceSourceService = (
  performance: SalesPerformanceResponseData,
): SalesPerformanceSourceItemData[] => {
  return performance.sourceBreakdown.map((sourceBreakdownItem, sourceIndex) => ({
    colorClassName:
      SALES_PERFORMANCE_SOURCE_COLORS[
        sourceIndex % SALES_PERFORMANCE_SOURCE_COLORS.length
      ] ?? SALES_PERFORMANCE_SOURCE_COLORS[0],
    count: sourceBreakdownItem.count,
    key: sourceBreakdownItem.source,
    source: sourceBreakdownItem.source,
  }));
};

/**
 * Maps the raw performance API payload into the full screen view model.
 */
export const mapSalesPerformanceViewService = (
  performance: SalesPerformanceResponseData,
): SalesPerformanceData => {
  return {
    pipelineProgress: getPerformancePipelineService(performance),
    sourceBreakdown: getPerformanceSourceService(performance),
    topMetrics: getPerformanceTopMetricsService(performance),
    weeklyCallsLeads: getPerformanceWeeklyService(performance),
  };
};
