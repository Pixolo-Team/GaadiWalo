// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createAdminReportsService } from "../src/modules/admin-reports/admin-reports.service.js";
import type { AdminReportsServiceErrorData } from "../src/modules/admin-reports/admin-reports.types.js";

const authenticatedAdminUser = {
  recordId: "admin-row-1",
  userId: "A001",
  email: "admin@example.com",
  fullName: "Admin User",
  role: "admin",
} as const;

const createDependencies = () => {
  return {
    getLeadRecordsWithinRange: async () => [
      {
        id: "lead-prev-1",
        created_at: "2026-05-07T10:00:00.000Z",
        lead_source_id: "source-1",
        status_id: "status-won",
      },
      {
        id: "lead-prev-2",
        created_at: "2026-05-08T10:00:00.000Z",
        lead_source_id: "source-2",
        status_id: "status-lost",
        lost_reason_id: "lost-price",
      },
      {
        id: "lead-1",
        created_at: "2026-05-10T10:00:00.000Z",
        lead_source_id: "source-1",
        status_id: "status-won",
      },
      {
        id: "lead-2",
        created_at: "2026-05-10T12:00:00.000Z",
        lead_source_id: "source-1",
        status_id: "status-test-drive",
      },
      {
        id: "lead-3",
        created_at: "2026-05-11T09:00:00.000Z",
        lead_source_id: "source-2",
        status_id: "status-contacted",
      },
      {
        id: "lead-4",
        created_at: "2026-05-12T11:00:00.000Z",
        lead_source_id: "source-2",
        status_id: "status-lost",
        lost_reason_id: "lost-price",
      },
      {
        id: "lead-5",
        created_at: "2026-05-13T08:00:00.000Z",
        lead_source_id: "source-3",
        status_id: "status-vehicle-na",
      },
      {
        id: "lead-6",
        created_at: "2026-05-14T18:00:00.000Z",
        status_id: "status-interested",
      },
    ],
    getLeadSourceNameById: async (sourceId: string) =>
      sourceId === "source-1"
        ? "CarWale"
        : sourceId === "source-2"
          ? "Referral"
          : sourceId === "source-3"
            ? "Walk In"
            : null,
    getStatusNameById: async (statusId: string) =>
      statusId === "status-won"
        ? "WON"
        : statusId === "status-test-drive"
          ? "TEST_DRIVE"
          : statusId === "status-contacted"
            ? "CONTACTED"
            : statusId === "status-lost"
              ? "LOST"
              : statusId === "status-vehicle-na"
                ? "VEHICLE_NA"
                : statusId === "status-interested"
                  ? "INTERESTED"
                  : null,
    getLostReasonNameById: async (lostReasonId: string) =>
      lostReasonId === "lost-price" ? "High Price" : null,
  };
};

describe("admin-reports.service", () => {
  it("returns overview metrics and fills daily trend gaps with zeroes", async () => {
    const adminReportsService = createAdminReportsService(createDependencies());

    const overviewResult = await adminReportsService.getReportOverviewService(
      authenticatedAdminUser,
      {
        from: "2026-05-10",
        to: "2026-05-14",
      },
    );

    assert.equal(overviewResult.error, null);
    assert.deepEqual(overviewResult.data, {
      totalLeads: 6,
      totalLeadsChange: 200,
      converted: 1,
      conversionRate: 16.67,
      won: 1,
      testDrive: 1,
      lostLeads: 2,
      lostRate: 33.33,
      dailyTrend: [
        { date: "2026-05-10", leads: 2, won: 1 },
        { date: "2026-05-11", leads: 1, won: 0 },
        { date: "2026-05-12", leads: 1, won: 0 },
        { date: "2026-05-13", leads: 1, won: 0 },
        { date: "2026-05-14", leads: 1, won: 0 },
      ],
    });
  });

  it("aggregates sources with rates, trends, and best-source tie breaking", async () => {
    const adminReportsService = createAdminReportsService(createDependencies());

    const sourcePerformanceResult =
      await adminReportsService.getSourcePerformanceService(
        authenticatedAdminUser,
        {
          from: "2026-05-10",
          to: "2026-05-14",
        },
      );

    assert.equal(sourcePerformanceResult.error, null);
    assert.deepEqual(sourcePerformanceResult.data, {
      sources: [
        {
          source: "CarWale",
          leads: 2,
          won: 1,
          rate: 50,
          trend: 100,
        },
        {
          source: "Referral",
          leads: 2,
          won: 0,
          rate: 0,
          trend: 100,
        },
        {
          source: "Other",
          leads: 1,
          won: 0,
          rate: 0,
          trend: 100,
        },
        {
          source: "Walk In",
          leads: 1,
          won: 0,
          rate: 0,
          trend: 100,
        },
      ],
      bestSource: {
        source: "CarWale",
        leads: 2,
        won: 1,
        rate: 50,
        guidance:
          "CarWale is converting best for the selected range. Prioritize follow-ups and repeat the acquisition playbook behind these 1 wins.",
      },
    });
  });

  it("returns funnel stages in fixed order and lost-reason percentages", async () => {
    const adminReportsService = createAdminReportsService(createDependencies());

    const funnelResult = await adminReportsService.getFunnelReportService(
      authenticatedAdminUser,
      {
        from: "2026-05-10",
        to: "2026-05-14",
      },
    );

    assert.equal(funnelResult.error, null);
    assert.deepEqual(funnelResult.data, {
      stages: [
        { stage: "NEW", count: 0, percentage: 0 },
        { stage: "CONTACTED", count: 1, percentage: 16.67 },
        { stage: "INTERESTED", count: 1, percentage: 16.67 },
        { stage: "TEST_DRIVE", count: 1, percentage: 16.67 },
        { stage: "WON", count: 1, percentage: 16.67 },
      ],
      lostReasons: [
        { reason: "High Price", count: 1, percentage: 50 },
        { reason: "Unknown Reason", count: 1, percentage: 50 },
      ],
    });
  });

  it("returns zeroed report structures for an empty range", async () => {
    const adminReportsService = createAdminReportsService({
      ...createDependencies(),
      getLeadRecordsWithinRange: async () => [],
    });

    const overviewResult = await adminReportsService.getReportOverviewService(
      authenticatedAdminUser,
      {
        from: "2026-05-10",
        to: "2026-05-12",
      },
    );
    const sourcePerformanceResult =
      await adminReportsService.getSourcePerformanceService(
        authenticatedAdminUser,
        {
          from: "2026-05-10",
          to: "2026-05-12",
        },
      );
    const funnelResult = await adminReportsService.getFunnelReportService(
      authenticatedAdminUser,
      {
        from: "2026-05-10",
        to: "2026-05-12",
      },
    );

    assert.deepEqual(overviewResult.data, {
      totalLeads: 0,
      totalLeadsChange: 0,
      converted: 0,
      conversionRate: 0,
      won: 0,
      testDrive: 0,
      lostLeads: 0,
      lostRate: 0,
      dailyTrend: [
        { date: "2026-05-10", leads: 0, won: 0 },
        { date: "2026-05-11", leads: 0, won: 0 },
        { date: "2026-05-12", leads: 0, won: 0 },
      ],
    });
    assert.deepEqual(sourcePerformanceResult.data, {
      sources: [],
      bestSource: null,
    });
    assert.deepEqual(funnelResult.data, {
      stages: [
        { stage: "NEW", count: 0, percentage: 0 },
        { stage: "CONTACTED", count: 0, percentage: 0 },
        { stage: "INTERESTED", count: 0, percentage: 0 },
        { stage: "TEST_DRIVE", count: 0, percentage: 0 },
        { stage: "WON", count: 0, percentage: 0 },
      ],
      lostReasons: [],
    });
  });

  it("returns a bad-request error when the date range cannot be parsed", async () => {
    const adminReportsService = createAdminReportsService(createDependencies());

    const overviewResult = await adminReportsService.getReportOverviewService(
      authenticatedAdminUser,
      {
        from: "invalid-date",
        to: "2026-05-14",
      },
    );

    assert.equal(overviewResult.data, null);
    assert.equal(overviewResult.error?.message, "Date must use YYYY-MM-DD format.");
    assert.equal(
      (overviewResult.error as AdminReportsServiceErrorData | null)?.code,
      "BAD_REQUEST",
    );
  });
});
