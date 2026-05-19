// LIBRARIES //
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";
import {
  getAdminReferrersService,
  setAdminReferrersService,
} from "../src/modules/admin-referrers/admin-referrers.service.js";
import type { AdminReferrersServiceData } from "../src/modules/admin-referrers/admin-referrers.service.js";

const createStubAdminReferrersService = (): AdminReferrersServiceData => {
  return {
    getReferrersService: async () => ({
      data: {
        items: [
          {
            id: "ref-1",
            name: "Amit Verma",
            phone: "9876543210",
            email: "amit@example.com",
            city: "Mumbai",
            since: "Feb 2025",
            totalReferrals: 4,
            won: 2,
            conversionRate: 50,
          },
        ],
        page: 1,
        limit: 10,
        totalItems: 1,
        totalPages: 1,
      },
      error: null,
    }),
    getReferrerByIdService: async (_authenticatedUser, referrerId) => ({
      data: {
        id: referrerId,
        name: "Amit Verma",
        phone: "9876543210",
        email: "amit@example.com",
        city: "Mumbai",
        since: "Feb 2025",
        totalReferrals: 4,
        won: 2,
        conversionRate: 50,
        isTopReferrer: true,
      },
      error: null,
    }),
    getReferredLeadsService: async () => ({
      data: {
        items: [
          {
            id: "lead-1",
            leadName: "Lead One",
            status: "WON",
            month: "May 2026",
          },
        ],
        page: 1,
        limit: 5,
        totalItems: 1,
        totalPages: 1,
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
const originalAdminReferrersService = getAdminReferrersService();

afterEach(() => {
  globalThis.fetch = originalFetch;
  setAdminReferrersService(originalAdminReferrersService);
});

describe("admin referrers routes", () => {
  it("returns 401 when referrers are requested without a bearer token", async () => {
    const response = await app.request("/admin/referrers");
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

  it("returns 403 when a non-admin user requests referrers", async () => {
    globalThis.fetch = createFetchForRole("sales");

    const response = await app.request("/admin/referrers", {
      headers: {
        Authorization: "Bearer valid-sales-token",
      },
    });

    assert.equal(response.status, 403);
  });

  it("returns 400 when list query parameters are invalid", async () => {
    globalThis.fetch = createFetchForRole("admin");

    const response = await app.request("/admin/referrers?page=0", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 400);
    assert.equal(responseBody.message, "Invalid admin referrers query.");
  });

  it("returns 404 when a referrer is not found", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReferrersService({
      ...createStubAdminReferrersService(),
      getReferrerByIdService: async () => ({
        data: null,
        error: Object.assign(new Error("Referrer not found."), {
          code: "NOT_FOUND",
        }),
      }),
    });

    const response = await app.request("/admin/referrers/missing-referrer", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });

    assert.equal(response.status, 404);
  });

  it("returns 200 for a successful referrers list response", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReferrersService(createStubAdminReferrersService());

    const response = await app.request("/admin/referrers", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });
    const responseBody = (await response.json()) as {
      status: string;
      data: {
        items: Array<{ id: string }>;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.data.items[0]?.id, "ref-1");
  });

  it("returns 200 for a successful detail response", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReferrersService(createStubAdminReferrersService());

    const response = await app.request("/admin/referrers/ref-1", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });
    const responseBody = (await response.json()) as {
      status: string;
      data: {
        id: string;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.data.id, "ref-1");
  });

  it("returns 200 for a successful referred leads response", async () => {
    globalThis.fetch = createFetchForRole("admin");
    setAdminReferrersService(createStubAdminReferrersService());

    const response = await app.request("/admin/referrers/ref-1/leads", {
      headers: {
        Authorization: "Bearer valid-admin-token",
      },
    });
    const responseBody = (await response.json()) as {
      status: string;
      data: {
        items: Array<{ id: string }>;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.data.items[0]?.id, "lead-1");
  });
});
