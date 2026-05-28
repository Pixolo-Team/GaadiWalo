// LIBRARIES //
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";
import {
  getSalesLeadsService,
  setSalesLeadsService,
} from "../src/modules/sales-leads/sales-leads.service.js";
import type { SalesLeadsServiceData } from "../src/modules/sales-leads/sales-leads.service.js";

const createStubSalesLeadsService = (): SalesLeadsServiceData => {
  return {
    getAllLeadsService: async () => ({ data: [], error: null }),
    getLeadStatusesService: async () => ({ data: [], error: null }),
    getLeadSourcesService: async () => ({ data: [], error: null }),
    getBranchesService: async () => ({ data: [], error: null }),
    getCarBrandsService: async () => ({ data: [], error: null }),
    getCarModelsService: async () => ({ data: [], error: null }),
    getLeadDetailsService: async () => ({ data: null, error: null }),
    getLeadActivitiesService: async () => ({ data: [], error: null }),
    getLeadNotesService: async () => ({ data: [], error: null }),
    updateLeadStatusService: async () => ({ data: null, error: null }),
    updateLeadDetailsService: async () => ({ data: null, error: null }),
    createLeadNoteService: async () => ({ data: null, error: null }),
    createLeadService: async () => ({ data: null, error: null }),
    importLeadsService: async () => ({
      data: {
        importedCount: 1,
        updatedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        totalRows: 1,
        results: [
          {
            rowNumber: 2,
            status: "imported",
            reason: "Lead imported successfully.",
            leadId: "lead-1",
          },
        ],
      },
      error: null,
    }),
  };
};

const createFetchForRole = (roleName: "admin" | "sales", userId: string) => {
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
            user_id: userId,
            email: `${roleName}@example.com`,
            full_name: roleName === "admin" ? "Admin User" : "Sales User",
            role_id: roleName === "admin" ? "role-admin" : "role-sales",
            is_active: true,
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
const originalSalesLeadsService = getSalesLeadsService();

afterEach(() => {
  globalThis.fetch = originalFetch;
  setSalesLeadsService(originalSalesLeadsService);
});

describe("sales leads routes", () => {
  it("returns 401 when import is requested without a bearer token", async () => {
    const response = await app.request("/sales/leads/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        duplicateMode: "skip",
        rows: [],
      }),
    });

    assert.equal(response.status, 401);
  });

  it("returns 400 for an invalid lead import payload", async () => {
    globalThis.fetch = createFetchForRole("sales", "SP001");

    const response = await app.request("/sales/leads/import", {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-sales-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        duplicateMode: "skip",
        rows: [
          {
            rowNumber: 0,
            fullName: "",
          },
        ],
      }),
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 400);
    assert.equal(responseBody.status, "error");
    assert.equal(responseBody.message, "Invalid lead import request.");
  });

  it("returns 200 and the import summary for a valid lead import payload", async () => {
    globalThis.fetch = createFetchForRole("sales", "SP001");
    setSalesLeadsService(createStubSalesLeadsService());

    const response = await app.request("/sales/leads/import", {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-sales-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        duplicateMode: "skip",
        rows: [
          {
            rowNumber: 2,
            fullName: "Priya Mehta",
            phone: "9999999991",
            email: "priya@example.com",
            source: "CarWale",
            referrerName: null,
            referrerPhone: null,
            carBrand: "Hyundai",
            carModel: "i10",
            variantName: null,
            colorPreference: null,
            budget: null,
            isUsed: null,
            status: "NEW",
            lostReason: null,
            initialNote: null,
          },
        ],
      }),
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
      data: {
        importedCount: number;
        totalRows: number;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.message, "Lead import completed successfully.");
    assert.equal(responseBody.data.importedCount, 1);
    assert.equal(responseBody.data.totalRows, 1);
  });
});
