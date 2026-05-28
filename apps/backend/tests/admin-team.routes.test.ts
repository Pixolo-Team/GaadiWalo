// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";

describe("admin team routes", () => {
  it("returns 401 when team list is requested without a bearer token", async () => {
    const response = await app.request("/admin/team");
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

  it("returns 401 when create salesperson is requested with an invalid token", async () => {
    const originalFetch = globalThis.fetch;

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
      const response = await app.request("/admin/team", {
        method: "POST",
        headers: {
          Authorization: "Bearer invalid-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Sneha Kapoor",
        }),
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
});
