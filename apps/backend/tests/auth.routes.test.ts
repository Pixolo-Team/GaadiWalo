// LIBRARIES //
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
// SERVICES //
import { app } from "../src/app.js";
import { setAuthService } from "../src/modules/auth/auth.service.js";
import type { AuthServiceData } from "../src/modules/auth/auth.service.js";

const createMockAuthService = (
  overrides: Partial<AuthServiceData> = {},
): AuthServiceData => {
  return {
    loginService: async () => ({ data: null, error: null }),
    forgotPasswordService: async () => ({ data: null, error: null }),
    verifyOtpService: async () => ({ data: null, error: null }),
    resendOtpService: async () => ({ data: null, error: null }),
    resetPasswordService: async () => ({ data: null, error: null }),
    ...overrides,
  };
};

afterEach(() => {
  setAuthService(createMockAuthService());
});

describe("auth routes", () => {
  it("returns 400 for an invalid login payload", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "",
      }),
    });

    assert.equal(response.status, 400);
  });

  it("returns 400 for a malformed JSON login payload", async () => {
    const response = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{",
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 400);
    assert.equal(responseBody.status, "error");
    assert.equal(responseBody.message, "Invalid request body.");
  });

  it("returns 401 for invalid credentials", async () => {
    setAuthService(
      createMockAuthService({
        loginService: async () => ({
          data: null,
          error: Object.assign(new Error("Invalid User ID or password."), {
            code: "INVALID_CREDENTIALS",
          }),
        }),
      }),
    );

    const response = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "SP001",
        password: "wrong",
      }),
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
    };

    assert.equal(response.status, 401);
    assert.equal(responseBody.status, "error");
    assert.equal(responseBody.message, "Invalid User ID or password.");
  });

  it("returns 200 for a successful forgot password request", async () => {
    setAuthService(
      createMockAuthService({
        forgotPasswordService: async () => ({
          data: {
            identifier: "sales@example.com",
          },
          error: null,
        }),
      }),
    );

    const response = await app.request("/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: "sales@example.com",
      }),
    });

    assert.equal(response.status, 200);
  });

  it("returns 429 when resend OTP is rate limited", async () => {
    setAuthService(
      createMockAuthService({
        resendOtpService: async () => ({
          data: null,
          error: Object.assign(
            new Error("Too many attempts. Please try again later."),
            {
              code: "RATE_LIMITED",
            },
          ),
        }),
      }),
    );

    const response = await app.request("/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: "sales@example.com",
      }),
    });

    assert.equal(response.status, 429);
  });

  it("returns 401 for a replayed reset token", async () => {
    setAuthService(
      createMockAuthService({
        resetPasswordService: async () => ({
          data: null,
          error: Object.assign(new Error("Reset token is invalid or expired."), {
            code: "INVALID_RESET_TOKEN",
          }),
        }),
      }),
    );

    const response = await app.request("/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resetToken: "signed-reset-token",
        newPassword: "StrongPass1",
      }),
    });

    assert.equal(response.status, 401);
  });
});
