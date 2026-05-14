// LIBRARIES //
import assert from "node:assert/strict";
import { describe, it } from "node:test";
// SERVICES //
import { createAuthService } from "../src/modules/auth/auth.service.js";
import type { AuthServiceErrorData } from "../src/modules/auth/auth.types.js";

describe("auth.service", () => {
  it("returns a login payload for valid credentials", async () => {
    const authService = createAuthService({
      getUserByLoginIdentifier: async () => ({
        user_id: "SP001",
        email: "sales@example.com",
        full_name: "Sales Person",
        role: "sales",
        is_active: true,
      }),
      getUserByEmailIdentifier: async () => null,
      signInWithPassword: async () => ({
        access_token: "access-token",
        refresh_token: "refresh-token",
        expires_in: 3600,
      }),
      sendRecoveryOtp: async () => undefined,
      verifyRecoveryOtp: async () => ({
        access_token: "recovery-access-token",
      }),
      updatePasswordWithRecoveryToken: async () => undefined,
      isAuthEnvironmentConfigured: () => true,
      issueRecoveryToken: () => ({
        resetToken: "signed-reset-token",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
      verifyRecoveryToken: () => ({
        email: "sales@example.com",
        recoveryAccessToken: "recovery-access-token",
        exp: Date.now() + 300000,
      }),
      getResetTokenSecret: () => "secret",
      getResetTokenTtlMinutes: () => 10,
    });

    const loginResult = await authService.loginService({
      userId: "SP001",
      password: "StrongPassword1",
    });

    assert.equal(loginResult.error, null);
    assert.equal(loginResult.data?.accessToken, "access-token");
    assert.equal(loginResult.data?.user.id, "SP001");
  });

  it("returns an identifier-not-found error for an unknown forgot password email", async () => {
    const authService = createAuthService({
      getUserByLoginIdentifier: async () => null,
      getUserByEmailIdentifier: async () => null,
      signInWithPassword: async () => ({
        access_token: "access-token",
      }),
      sendRecoveryOtp: async () => undefined,
      verifyRecoveryOtp: async () => ({
        access_token: "recovery-access-token",
      }),
      updatePasswordWithRecoveryToken: async () => undefined,
      isAuthEnvironmentConfigured: () => true,
      issueRecoveryToken: () => ({
        resetToken: "signed-reset-token",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
      verifyRecoveryToken: () => null,
      getResetTokenSecret: () => "secret",
      getResetTokenTtlMinutes: () => 10,
    });

    const forgotPasswordResult = await authService.forgotPasswordService({
      email: "missing@example.com",
    });

    assert.equal(forgotPasswordResult.data, null);
    assert.equal(
      forgotPasswordResult.error?.message,
      "This email ID is not registered. Please use a registered email ID.",
    );
    assert.equal(
      (forgotPasswordResult.error as AuthServiceErrorData | null)?.code,
      "IDENTIFIER_NOT_FOUND",
    );
  });

  it("maps forgot password resend throttling to a rate-limited service error", async () => {
    const authService = createAuthService({
      getUserByLoginIdentifier: async () => null,
      getUserByEmailIdentifier: async () => ({
        email: "sales@example.com",
        full_name: "Sales Person",
        role: "sales",
        is_active: true,
        user_id: "SP001",
      }),
      signInWithPassword: async () => ({
        access_token: "access-token",
      }),
      sendRecoveryOtp: async () => {
        throw new Error(
          "For security purposes, you can only request this after 30 seconds.",
        );
      },
      verifyRecoveryOtp: async () => ({
        access_token: "recovery-access-token",
      }),
      updatePasswordWithRecoveryToken: async () => undefined,
      isAuthEnvironmentConfigured: () => true,
      issueRecoveryToken: () => ({
        resetToken: "signed-reset-token",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
      verifyRecoveryToken: () => null,
      getResetTokenSecret: () => "secret",
      getResetTokenTtlMinutes: () => 10,
    });

    const forgotPasswordResult = await authService.forgotPasswordService({
      email: "sales@example.com",
    });

    assert.equal(forgotPasswordResult.data, null);
    assert.equal(
      forgotPasswordResult.error?.message,
      "Too many attempts. Please try again later.",
    );
    assert.equal(
      (forgotPasswordResult.error as AuthServiceErrorData | null)?.code,
      "RATE_LIMITED",
    );
  });

  it("returns a reset token after a successful OTP verification", async () => {
    const authService = createAuthService({
      getUserByLoginIdentifier: async () => null,
      getUserByEmailIdentifier: async () => ({
        email: "sales@example.com",
        full_name: "Sales Person",
        role: "sales",
        is_active: true,
        user_id: "SP001",
      }),
      signInWithPassword: async () => ({
        access_token: "access-token",
      }),
      sendRecoveryOtp: async () => undefined,
      verifyRecoveryOtp: async () => ({
        access_token: "recovery-access-token",
      }),
      updatePasswordWithRecoveryToken: async () => undefined,
      isAuthEnvironmentConfigured: () => true,
      issueRecoveryToken: () => ({
        resetToken: "signed-reset-token",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
      verifyRecoveryToken: () => ({
        email: "sales@example.com",
        recoveryAccessToken: "recovery-access-token",
        exp: Date.now() + 300000,
      }),
      getResetTokenSecret: () => "secret",
      getResetTokenTtlMinutes: () => 10,
    });

    const verifyOtpResult = await authService.verifyOtpService({
      email: "sales@example.com",
      otp: "123456",
    });

    assert.equal(verifyOtpResult.error, null);
    assert.equal(verifyOtpResult.data?.resetToken, "signed-reset-token");
  });

  it("rejects a weak password during reset", async () => {
    const authService = createAuthService({
      getUserByLoginIdentifier: async () => null,
      getUserByEmailIdentifier: async () => null,
      signInWithPassword: async () => ({
        access_token: "access-token",
      }),
      sendRecoveryOtp: async () => undefined,
      verifyRecoveryOtp: async () => ({
        access_token: "recovery-access-token",
      }),
      updatePasswordWithRecoveryToken: async () => undefined,
      isAuthEnvironmentConfigured: () => true,
      issueRecoveryToken: () => ({
        resetToken: "signed-reset-token",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
      verifyRecoveryToken: () => ({
        email: "sales@example.com",
        recoveryAccessToken: "recovery-access-token",
        exp: Date.now() + 300000,
      }),
      getResetTokenSecret: () => "secret",
      getResetTokenTtlMinutes: () => 10,
    });

    const resetPasswordResult = await authService.resetPasswordService({
      resetToken: "signed-reset-token",
      newPassword: "weakpass",
    });

    assert.equal(resetPasswordResult.data, null);
    assert.equal(
      resetPasswordResult.error?.message,
      "Password must be at least 8 characters long and include 1 uppercase letter and 1 number.",
    );
  });

  it("rejects an invalid reset token", async () => {
    const authService = createAuthService({
      getUserByLoginIdentifier: async () => null,
      getUserByEmailIdentifier: async () => null,
      signInWithPassword: async () => ({
        access_token: "access-token",
      }),
      sendRecoveryOtp: async () => undefined,
      verifyRecoveryOtp: async () => ({
        access_token: "recovery-access-token",
      }),
      isAuthEnvironmentConfigured: () => true,
      issueRecoveryToken: () => ({
        resetToken: "signed-reset-token",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }),
      verifyRecoveryToken: () => ({
        email: "sales@example.com",
        recoveryAccessToken: "recovery-access-token",
        exp: Date.now() + 300000,
      }),
      updatePasswordWithRecoveryToken: async () => {
        throw new Error("Token has expired");
      },
      getResetTokenSecret: () => "secret",
      getResetTokenTtlMinutes: () => 10,
    });

    const resetPasswordResult = await authService.resetPasswordService({
      resetToken: "signed-reset-token",
      newPassword: "StrongPass1",
    });

    assert.equal(resetPasswordResult.data, null);
    assert.equal(
      resetPasswordResult.error?.message,
      "Reset token is invalid or expired.",
    );
  });
});
