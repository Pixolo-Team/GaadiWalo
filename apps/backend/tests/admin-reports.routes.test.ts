// LIBRARIES //
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";
import {
  getAdminReportsService,
  setAdminReportsService,
} from "../src/modules/admin-reports/admin-reports.service.js";
import type { AdminReportsServiceData } from "../src/modules/admin-reports/admin-reports.service.js";

const createStubAdminReportsService = (): AdminReportsServiceData => {
  return {
    getReportOverviewService: async () => ({
      data: {
        totalLeads: 2,
        totalLeadsChange: 0,
        converted: 1,
        conversionRate: 50,
        won: 1,
        testDrive: 0,
        lostLeads: 0,
        lostRate: 0,
        dailyTrend: [{ date: "2026-05-10", leads: 2, won: 1 }],
      },
      error: null,
    }),
    getSourcePerformanceService: async () => ({
      data: {
        sources: [
          {
            source: "CarWale",
            leads: 2,
            won: 1,
            rate: 50,
            trend: 0,
          },
        ],
        bestSource: {
          source: "CarWale",
          leads: 2,
          won: 1,
          rate: 50,
          guidance: "CarWale is converting best.",
        },
      },
      error: null,
    }),
    getFunnelReportService: async () => ({
      data: {
        stages: [
          { stage: "NEW", count: 1, percentage: 50 },
          { stage: "CONTACTED", count: 0, percentage: 0 },
          { stage: "INTERESTED", count: 0, percentage: 0 },
          { stage: "TEST_DRIVE", count: 0, percentage: 0 },
          { stage: "WON", count: 1, percentage: 50 },
        ],
        lostReasons: [],
      },
      error: null,
    }),
  };
};

const createFetchForRole = (roleName: "admin" | "sales") => {
  return async (input: string | URL | Request) => {
    const requestUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    if (requestUrl.includes("/auth/v1/user")) {
      return new Response(
        JSON.stringify({
          id: "auth-user-1",
          email: `${roleName}@example.com`,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (requestUrl.includes("/rest/v1/users")) {
      return new Response(
        JSON.stringify([
          {
            id: `${roleName}-row-1`,
            user_code: roleName === "admin" ? "A001" : "S001",
            email: `${roleName}@example.com`,
            full_name: roleName === "admin" ? "Admin User" : "Sales User",
            phone: "9999999999",
            role_id: roleName === "admin" ? "role-admin" : "role-sales",
            branch_id: "branch-1",
            is_active: true,
            created_at: "2026-01-01T00:00:00.000Z",
            auth_id: "auth-user-1",
          },
        ]),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (requestUrl.includes("/rest/v1/roles")) {
      return new Response(
        JSON.stringify([
          {
            name: roleName,
          },
        ]),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    throw new Error(`Unexpected fetch call in test: ${requestUrl}`);
  };
};

const originalFetch = globalThis.fetch;
const originalAdminReportsService = getAdminReportsService();

afterEach(() => {
  globalThis.fetch = originalFetch;
  setAdminReportsService(originalAdminReportsService);
});

describe("admin reports routes", () => {
  it("returns 401 when overview is requested without a bearer token", async () => {
    const response = await app.request("/admin/reports/overview?from=2026-05-10&to=2026-05-14");
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 401);
    assert.equal(responseBody.status, "error");
    assert.equal(
      responseBody.message,
      "Authentication is required to access this resource.",
    );
  });

  it("returns 403 when a non-admin user requests reports", async () => {
    globalThis.fetch = createFetchForRole("sales");

    const response = await app.request(
      "/admin/reports/overview?from=2026-05-10&to=2026-05-14",
      {
        headers: {
          Authorization: "Bearer valid-sales-token",
        },
      },
    );
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 403);
    assert.equal(responseBody.status, "error");
    assert.equal(
      responseBody.message,
      "Authentication is required to access this resource.",
    );
  });

  it("returns 400 when the date range query is missing required fields", async () => {
    globalThis.fetch = createFetchForRole("admin");

    const response = await app.request("/admin/reports/overview?from=2026-05-10", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 400);
    assert.equal(responseBody.status, "error");
    assert.equal(responseBody.message, "Invalid admin reports query.");
  });

  it("returns 400 when the date values are malformed", async () => {
    globalThis.fetch = createFetchForRole("admin");

    const response = await app.request(
      "/admin/reports/overview?from=2026-13-10&to=2026-05-14",
      {
        headers: {
          Authorization: "Bearer valid-admin-token",
        },
      },
    );

    assert.equal(response.status, 400);
  });

  it("returns 400 when from is greater than to", async () => {
    globalThis.fetch = createFetchForRole("admin");

    const response = await app.request(
      "/admin/reports/overview?from=2026-05-15&to=2026-05-14",
      {
        headers: {
          Authorization: "Bearer valid-admin-token",
        },
      },
    );

    assert.equal(response.status, 400);
  });

  it("returns 200 for a successful overview response", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReportsService(createStubAdminReportsService());

    const response = await app.request(
      "/admin/reports/overview?from=2026-05-10&to=2026-05-14",
      {
        headers: {
          Authorization: "Bearer valid-admin-token",
        },
      },
    );
    const responseBody = (await response.json()) as {
      status: string;
      data: {
        totalLeads: number;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.data.totalLeads, 2);
  });

  it("returns 200 for a successful sources response", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReportsService(createStubAdminReportsService());

    const response = await app.request(
      "/admin/reports/sources?from=2026-05-10&to=2026-05-14",
      {
        headers: {
          Authorization: "Bearer valid-admin-token",
        },
      },
    );
    const responseBody = (await response.json()) as {
      status: string;
      data: {
        sources: Array<{ source: string }>;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.data.sources[0]?.source, "CarWale");
  });

  it("returns 200 for a successful funnel response", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReportsService(createStubAdminReportsService());

    const response = await app.request(
      "/admin/reports/funnel?from=2026-05-10&to=2026-05-14",
      {
        headers: {
          Authorization: "Bearer valid-admin-token",
        },
      },
    );
    const responseBody = (await response.json()) as {
      status: string;
      data: {
        stages: Array<{ stage: string }>;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.data.stages[0]?.stage, "NEW");
  });
});
