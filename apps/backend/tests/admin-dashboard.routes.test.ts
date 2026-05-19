// LIBRARIES //
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("admin dashboard routes", () => {
  it("returns 401 when summary is requested without a bearer token", async () => {
    const response = await app.request("/admin/dashboard/summary");
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

  it("returns 401 when summary is requested with an invalid bearer token", async () => {
    globalThis.fetch = async (input: string | URL | Request) => {
      const requestUrl =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      if (requestUrl.includes("/auth/v1/user")) {
        return new Response(JSON.stringify({ message: "Invalid JWT" }), {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      throw new Error(`Unexpected fetch call in test: ${requestUrl}`);
    };

    try {
      const response = await app.request("/admin/dashboard/summary", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });
      const responseBody = (await response.json()) as {
        status: string;
        message: string;
      };

      assert.equal(response.status, 401);
      assert.equal(responseBody.status, "error");
      assert.equal(responseBody.message, "Access token is invalid.");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("returns a readable validation error when leaderboard limit is invalid", async () => {
    globalThis.fetch = async (input: string | URL | Request) => {
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
            email: "admin@example.com",
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
              id: "admin-row-1",
              user_code: "A001",
              email: "admin@example.com",
              full_name: "Admin User",
              phone: "9999999999",
              role_id: "role-admin",
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
              name: "admin",
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

    const response = await app.request(
      "/admin/dashboard/top-referrers?limit=abc",
      {
        headers: {
          Authorization: "Bearer valid-admin-token",
        },
      },
    );
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
      error: string;
    };

    assert.equal(response.status, 400);
    assert.equal(responseBody.status, "error");
    assert.equal(
      responseBody.message,
      "Invalid admin dashboard leaderboard query.",
    );
    assert.equal(responseBody.error, "limit must be a valid number.");
  });
});
