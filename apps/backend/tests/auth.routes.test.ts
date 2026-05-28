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
    refreshTokenService: async () => ({ data: null, error: null }),
    logoutService: async () => ({ data: null, error: null }),
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

  it("returns 400 for an invalid refresh token payload", async () => {
    const response = await app.request("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: "",
      }),
    });

    assert.equal(response.status, 400);
  });

  it("returns 200 for a successful refresh token request", async () => {
    setAuthService(
      createMockAuthService({
        refreshTokenService: async () => ({
          data: {
            accessToken: "new-access-token",
            refreshToken: "new-refresh-token",
            expiresIn: 3600,
            user: {
              id: "SP001",
              name: "Sales Person",
              email: "sales@example.com",
              role: "sales",
            },
          },
          error: null,
        }),
      }),
    );

    const response = await app.request("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: "valid-refresh-token",
      }),
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
      data: {
        accessToken: string;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.message, "Session refreshed successfully.");
    assert.equal(responseBody.data.accessToken, "new-access-token");
  });

  it("returns 401 for an expired refresh token", async () => {
    setAuthService(
      createMockAuthService({
        refreshTokenService: async () => ({
          data: null,
          error: Object.assign(
            new Error("Refresh token is invalid or expired."),
            {
              code: "INVALID_REFRESH_TOKEN",
            },
          ),
        }),
      }),
    );

    const response = await app.request("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: "expired-refresh-token",
      }),
    });

    assert.equal(response.status, 401);
  });

  it("returns 401 when logout is requested without a bearer token", async () => {
    const response = await app.request("/auth/logout", {
      method: "POST",
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
      error: string;
    };

    assert.equal(response.status, 401);
    assert.equal(responseBody.status, "error");
    assert.equal(responseBody.message, "Invalid logout request.");
    assert.equal(responseBody.error, "Authorization header is required.");
  });

  it("returns 401 when logout is requested with an invalid bearer token", async () => {
    setAuthService(
      createMockAuthService({
        logoutService: async () => ({
          data: null,
          error: Object.assign(
            new Error("Access token is invalid or expired."),
            {
              code: "INVALID_ACCESS_TOKEN",
            },
          ),
        }),
      }),
    );

    const response = await app.request("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid-access-token",
      },
    });

    assert.equal(response.status, 401);
  });

  it("returns 200 for a successful logout request", async () => {
    setAuthService(
      createMockAuthService({
        logoutService: async () => ({
          data: {
            success: true,
          },
          error: null,
        }),
      }),
    );

    const response = await app.request("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-access-token",
      },
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
      data: {
        success: boolean;
      };
    };

    assert.equal(response.status, 200);
    assert.equal(responseBody.status, "success");
    assert.equal(responseBody.message, "Logged out successfully.");
    assert.equal(responseBody.data.success, true);
  });

  it("returns 200 for a successful forgot password request", async () => {
    setAuthService(
      createMockAuthService({
        forgotPasswordService: async () => ({
          data: {
            email: "sales@example.com",
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
        email: "sales@example.com",
      }),
    });

    assert.equal(response.status, 200);
  });

  it("returns 429 when forgot password is rate limited", async () => {
    setAuthService(
      createMockAuthService({
        forgotPasswordService: async () => ({
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

    const response = await app.request("/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "sales@example.com",
      }),
    });

    assert.equal(response.status, 429);
  });

  it("returns 404 when forgot password email is not registered", async () => {
    setAuthService(
      createMockAuthService({
        forgotPasswordService: async () => ({
          data: null,
          error: Object.assign(
            new Error(
              "This email ID is not registered. Please use a registered email ID.",
            ),
            {
              code: "IDENTIFIER_NOT_FOUND",
            },
          ),
        }),
      }),
    );

    const response = await app.request("/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "missing@example.com",
      }),
    });
    const responseBody = (await response.json()) as {
      status: string;
      message: string;
      error: string;
    };

    assert.equal(response.status, 404);
    assert.equal(responseBody.status, "error");
    assert.equal(
      responseBody.message,
      "This email ID is not registered. Please use a registered email ID.",
    );
    assert.equal(
      responseBody.error,
      "This email ID is not registered. Please use a registered email ID.",
    );
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
        email: "sales@example.com",
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
