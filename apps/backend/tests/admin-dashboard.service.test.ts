// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createAdminDashboardService } from "../src/modules/admin-dashboard/admin-dashboard.service.js";
import type { AdminDashboardServiceErrorData } from "../src/modules/admin-dashboard/admin-dashboard.types.js";

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
        created_at: "2026-04-06T10:00:00.000Z",
        lead_source_id: "source-1",
        status_id: "status-won",
        referred_by_referrer_id: "referrer-2",
        referrer: {
          id: "referrer-2",
          full_name: "Old Referrer",
          phone: "9999999999",
        },
      },
      {
        id: "lead-prev-2",
        created_at: "2026-04-12T10:00:00.000Z",
        lead_source_id: "source-1",
        status_id: "status-lost",
      },
      {
        id: "lead-1",
        created_at: "2026-05-02T10:00:00.000Z",
        lead_source_id: "source-1",
        status_id: "status-won",
        referred_by_referrer_id: "referrer-1",
        referrer: {
          id: "referrer-1",
          full_name: "Amit Verma",
          phone: "9876543210",
        },
      },
      {
        id: "lead-2",
        created_at: "2026-05-05T10:00:00.000Z",
        lead_source_id: "source-2",
        status_id: "status-contacted",
      },
      {
        id: "lead-3",
        created_at: "2026-05-10T10:00:00.000Z",
        lead_source_id: "source-2",
        status_id: "status-interested",
        referred_by_referrer_id: "referrer-1",
        referrer: {
          id: "referrer-1",
          full_name: "Amit Verma",
          phone: "9876543210",
        },
      },
      {
        id: "lead-4",
        created_at: "2026-05-12T10:00:00.000Z",
        lead_source_id: "source-3",
        status_id: "status-new",
      },
    ],
    getLeadUserRecordsByLeadIds: async () => [
      {
        lead_id: "lead-1",
        user_id: "sales-row-1",
        is_primary: true,
      },
      {
        lead_id: "lead-2",
        user_id: "sales-row-2",
        is_primary: true,
      },
      {
        lead_id: "lead-3",
        user_id: "sales-row-2",
        is_primary: true,
      },
      {
        lead_id: "lead-4",
        user_id: "sales-row-1",
        is_primary: true,
      },
    ],
    getLeadSourceNameById: async (sourceId: string) =>
      sourceId === "source-1"
        ? "CarWale"
        : sourceId === "source-2"
          ? "CarDekho"
          : sourceId === "source-3"
            ? "Walk In"
            : null,
    getStatusNameById: async (statusId: string) =>
      statusId === "status-won"
        ? "WON"
        : statusId === "status-lost"
          ? "LOST"
          : statusId === "status-contacted"
            ? "CONTACTED"
            : statusId === "status-interested"
              ? "INTERESTED"
              : statusId === "status-new"
                ? "NEW"
                : null,
    getUserByRecordIdentifier: async (userIdentifier: string) => ({
      id: userIdentifier,
      user_id: userIdentifier === "sales-row-1" ? "SP001" : "SP002",
      email: `${userIdentifier}@example.com`,
      full_name:
        userIdentifier === "sales-row-1" ? "Riya Sharma" : "Kabir Singh",
      role: "sales",
      is_active: true,
    }),
  };
};

describe("admin-dashboard.service", () => {
  it("returns summary metrics with previous-period comparisons", async () => {
    const adminDashboardService = createAdminDashboardService(createDependencies());

    const adminSummaryResult =
      await adminDashboardService.getAdminSummaryService(
        authenticatedAdminUser,
        "2026-05",
      );

    assert.equal(adminSummaryResult.error, null);
    assert.deepEqual(adminSummaryResult.data, {
      totalLeads: 4,
      totalLeadsChange: 100,
      converted: 2,
      conversionRate: 50,
      activeLeads: 3,
      won: 1,
      wonChange: 0,
    });
  });

  it("groups current-period leads by source and maps chart colors", async () => {
    const adminDashboardService = createAdminDashboardService(createDependencies());

    const leadsBySourceResult =
      await adminDashboardService.getLeadsBySourceService(
        authenticatedAdminUser,
        "2026-05",
      );

    assert.equal(leadsBySourceResult.error, null);
    assert.deepEqual(leadsBySourceResult.data, [
      {
        source: "CarDekho",
        count: 2,
        color: "#16A34A",
      },
      {
        source: "CarWale",
        count: 1,
        color: "#2563EB",
      },
      {
        source: "Walk In",
        count: 1,
        color: "#EA580C",
      },
    ]);
  });

  it("returns ranked top performers using assigned leads and won counts", async () => {
    const adminDashboardService = createAdminDashboardService(createDependencies());

    const topPerformersResult =
      await adminDashboardService.getTopPerformersService(
        authenticatedAdminUser,
        "2026-05",
        3,
      );

    assert.equal(topPerformersResult.error, null);
    assert.deepEqual(topPerformersResult.data, [
      {
        rank: 1,
        userId: "SP001",
        name: "Riya Sharma",
        leads: 2,
        won: 1,
        winRate: 50,
      },
      {
        rank: 2,
        userId: "SP002",
        name: "Kabir Singh",
        leads: 2,
        won: 0,
        winRate: 0,
      },
    ]);
  });

  it("aggregates top referrers by referrals and conversion rate", async () => {
    const adminDashboardService = createAdminDashboardService(createDependencies());

    const topReferrersResult =
      await adminDashboardService.getTopReferrersService(
        authenticatedAdminUser,
        "2026-05",
        3,
      );

    assert.equal(topReferrersResult.error, null);
    assert.deepEqual(topReferrersResult.data, [
      {
        id: "referrer-1",
        name: "Amit Verma",
        referrals: 2,
        converted: 1,
        conversionRate: 50,
      },
    ]);
  });

  it("returns a bad-request error for an unsupported period format", async () => {
    const adminDashboardService = createAdminDashboardService(createDependencies());

    const adminSummaryResult =
      await adminDashboardService.getAdminSummaryService(
        authenticatedAdminUser,
        "2026/05",
      );

    assert.equal(adminSummaryResult.data, null);
    assert.equal(
      adminSummaryResult.error?.message,
      "Period must be 'this-month', use YYYY-MM, or use a month name like 'May 2026'.",
    );
    assert.equal(
      (adminSummaryResult.error as AdminDashboardServiceErrorData | null)?.code,
      "BAD_REQUEST",
    );
  });

  it("accepts a month-name period format for dashboard requests", async () => {
    const adminDashboardService = createAdminDashboardService(createDependencies());

    const adminSummaryResult =
      await adminDashboardService.getAdminSummaryService(
        authenticatedAdminUser,
        "may-2026",
      );

    assert.equal(adminSummaryResult.error, null);
    assert.deepEqual(adminSummaryResult.data, {
      totalLeads: 4,
      totalLeadsChange: 100,
      converted: 2,
      conversionRate: 50,
      activeLeads: 3,
      won: 1,
      wonChange: 0,
    });
  });
});
