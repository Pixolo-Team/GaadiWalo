// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";

describe("GET /health", () => {
  it("returns a standardized success response", async () => {
    const response = await app.request("/health");
    const responseBody = (await response.json()) as {
      status: string;
      status_code: number;
      error: string | null;
      data?: {
        service?: string;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.status_code, 200);
    assert.equal(responseBody.error, null);
    assert.equal(responseBody.data?.service, "@gaadiwalo/backend");
  });
});
