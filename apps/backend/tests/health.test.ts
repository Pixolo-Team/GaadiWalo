// LIBRARIES //
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// SERVICES //
import { app } from "../src/app.js";

describe("GET /health", () => {
  it("returns a standardized success response", async () => {
    const response = await app.request("/health");
    const responseBody = (await response.json()) as {
      data: {
        service: string;
        version: string;
        environment: string;
        timestamp: string;
        uptime_seconds: number;
      } | null;
      status: string;
      status_code: number;
      message: string;
      error: string | null;
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.status_code, 200);
    assert.equal(responseBody.error, null);
    assert.equal(responseBody.data?.service, "@gaadiwalo/backend");
  });
});
