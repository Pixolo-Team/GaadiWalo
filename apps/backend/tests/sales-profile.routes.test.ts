// LIBRARIES //
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";
import {
  getSalesProfileService,
  setSalesProfileService,
} from "../src/modules/sales-profile/sales-profile.service.js";
import type { SalesProfileServiceData } from "../src/modules/sales-profile/sales-profile.service.js";

const createStubSalesProfileService = (): SalesProfileServiceData => {
  return {
    getSalesProfileService: async () => ({
      data: {
        userId: "S001",
        fullName: "Sales One",
        phone: "9876543210",
        email: "sales1@example.com",
        role: "sales",
        branch: "Mumbai",
        joinedAt: "2026-01-01T00:00:00.000Z",
        profilePhotoUrl: null,
        languagePreference: "English",
        notificationPreferences: {
          overdueFollowUps: false,
          testDriveReminders: false,
          newLeadAssigned: false,
          statusChangeAlerts: false,
          wonLostSummary: false,
          pushNotification: false,
          sms: false,
          whatsApp: false,
          quietHoursEnabled: false,
          quietHoursFrom: null,
          quietHoursTo: null,
        },
      },
      error: null,
    }),
    updateSalesProfileService: async () => ({
      data: {
        userId: "S001",
        fullName: "Updated Sales One",
        phone: "9876543210",
        email: "sales1@example.com",
        role: "sales",
        branch: "Mumbai",
        joinedAt: "2026-01-01T00:00:00.000Z",
        profilePhotoUrl: null,
        languagePreference: "English",
        notificationPreferences: {
          overdueFollowUps: false,
          testDriveReminders: false,
          newLeadAssigned: false,
          statusChangeAlerts: false,
          wonLostSummary: false,
          pushNotification: false,
          sms: false,
          whatsApp: false,
          quietHoursEnabled: false,
          quietHoursFrom: null,
          quietHoursTo: null,
        },
      },
      error: null,
    }),
    changeSalesPasswordService: async () => ({
      data: {
        success: true,
      },
      error: null,
    }),
    updateSalesNotificationsService: async () => ({
      data: {
        success: true,
      },
      error: null,
    }),
    getSalesPerformanceService: async () => ({
      data: {
        totalLeads: 2,
        callsMade: 2,
        won: 1,
        wonRate: 50,
        lost: 1,
        lostRate: 50,
        rank: 1,
        pipeline: {
          NEW: 0,
          CONTACTED: 0,
          INTERESTED: 0,
          TEST_DRIVE: 0,
          WON: 1,
        },
        weeklyActivity: [
          { day: "Mon", calls: 1, leads: 1 },
        ],
        sourceBreakdown: [
          { source: "CarWale", count: 1 },
        ],
      },
      error: null,
    }),
  };
};

const createFetchForRole = (roleName: "admin" | "sales", userCode: string) => {
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
            user_code: userCode,
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
const originalSalesProfileService = getSalesProfileService();

afterEach(() => {
  globalThis.fetch = originalFetch;
  setSalesProfileService(originalSalesProfileService);
});

describe("sales profile routes", () => {
  it("returns 401 when profile is requested without a bearer token", async () => {
    const response = await app.request("/sales/profile/S001");
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

  it("returns 403 when another sales rep tries to access a different user code", async () => {
    globalThis.fetch = createFetchForRole("sales", "S002");
    setSalesProfileService({
      ...createStubSalesProfileService(),
      getSalesProfileService: async () => ({
        data: null,
        error: Object.assign(
          new Error("You are not allowed to access this sales profile."),
          { code: "FORBIDDEN" },
        ),
      }),
    });

    const response = await app.request("/sales/profile/S001", {
      headers: {
        Authorization: "Bearer valid-sales-token",
      },
    });

    assert.equal(response.status, 403);
  });

  it("returns 400 for invalid params or body payloads", async () => {
    globalThis.fetch = createFetchForRole("sales", "S001");

    const queryResponse = await app.request("/sales/profile/S001/performance?period=2026/05", {
      headers: {
        Authorization: "Bearer valid-sales-token",
      },
    });
    const bodyResponse = await app.request("/sales/profile/S001", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer valid-sales-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: "123",
      }),
    });

    assert.equal(queryResponse.status, 400);
    assert.equal(bodyResponse.status, 400);
  });

  it("returns 404 when a user code is unknown", async () => {
    globalThis.fetch = createFetchForRole("admin", "A001");
    setSalesProfileService({
      ...createStubSalesProfileService(),
      getSalesProfileService: async () => ({
        data: null,
        error: Object.assign(new Error("Sales profile not found."), {
          code: "NOT_FOUND",
        }),
      }),
    });

    const response = await app.request("/sales/profile/S404", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });

    assert.equal(response.status, 404);
  });

  it("returns 200 when an admin requests their own profile", async () => {
    globalThis.fetch = createFetchForRole("admin", "A001");
    setSalesProfileService(createStubSalesProfileService());

    const response = await app.request("/sales/profile/A001", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });

    assert.equal(response.status, 200);
  });

  it("returns 200 for successful profile, update, notifications, performance, and password responses", async () => {
    globalThis.fetch = createFetchForRole("sales", "S001");
    setSalesProfileService(createStubSalesProfileService());

    const profileResponse = await app.request("/sales/profile/S001", {
      headers: {
        Authorization: "Bearer valid-sales-token",
      },
    });
    const updateResponse = await app.request("/sales/profile/S001", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer valid-sales-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: "Updated Sales One",
      }),
    });
    const notificationsResponse = await app.request(
      "/sales/profile/S001/notifications",
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer valid-sales-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          overdueFollowUps: false,
          testDriveReminders: false,
          newLeadAssigned: false,
          statusChangeAlerts: false,
          wonLostSummary: false,
          pushNotification: false,
          sms: false,
          whatsApp: false,
          quietHoursEnabled: false,
          quietHoursFrom: null,
          quietHoursTo: null,
        }),
      },
    );
    const performanceResponse = await app.request(
      "/sales/profile/S001/performance?period=2026-05",
      {
        headers: {
          Authorization: "Bearer valid-sales-token",
        },
      },
    );
    const passwordResponse = await app.request(
      "/sales/profile/S001/change-password",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-sales-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: "Correct123",
          newPassword: "NewStrong123",
        }),
      },
    );

    assert.equal(profileResponse.status, 200);
    assert.equal(updateResponse.status, 200);
    assert.equal(notificationsResponse.status, 200);
    assert.equal(performanceResponse.status, 200);
    assert.equal(passwordResponse.status, 200);
  });

  it("returns 200 when an admin changes their own password", async () => {
    globalThis.fetch = createFetchForRole("admin", "A001");
    setSalesProfileService(createStubSalesProfileService());

    const response = await app.request(
      "/sales/profile/A001/change-password",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-admin-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: "Correct123",
          newPassword: "NewStrong123",
        }),
      },
    );

    assert.equal(response.status, 200);
  });
});
