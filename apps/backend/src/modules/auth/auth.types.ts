// CONSTANTS //
import {
  AUTH_MIN_PASSWORD_LENGTH,
  AUTH_OTP_LENGTH,
  AUTH_OTP_REGEX,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_UPPERCASE_REGEX,
} from "../../common/constants/auth.constants.js";
// LIBRARIES //
import { z as zod } from "zod";

// Represents the authenticated user shape returned to the client after login.
export interface AuthenticatedUserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Client payload for signing in with the business User ID and password.
export interface LoginRequestData {
  userId: string;
  password: string;
}

// Safe session payload returned after successful authentication.
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthenticatedUserData;
}

// Client payload for exchanging a refresh token for a fresh authenticated session.
export interface RefreshTokenRequestData {
  refreshToken: string;
}

// Safe session payload returned after a successful refresh.
export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthenticatedUserData;
}

// Client payload for starting the password recovery flow.
export interface ForgotPasswordRequestData {
  email: string;
}

// Minimal success payload returned after recovery is initiated.
export interface ForgotPasswordResponseData {
  email: string;
}

// Client payload for verifying the OTP sent during password recovery.
export interface VerifyOtpRequestData {
  email: string;
  otp: string;
}

// Temporary backend-issued reset token used for the final password reset step.
export interface VerifyOtpResponseData {
  resetToken: string;
  expiresAt: string;
}

// Client payload for requesting a fresh recovery OTP.
export interface ResendOtpRequestData {
  email: string;
}

// Minimal success payload for OTP resend requests.
export interface ResendOtpResponseData {
  email: string;
}

// Client payload for completing password reset with a trusted reset token.
export interface ResetPasswordRequestData {
  resetToken: string;
  newPassword: string;
}

// Success payload returned once the password has been updated.
export interface ResetPasswordResponseData {
  email: string;
}

// Shared auth error codes used by the service and controller layers.
export type AuthServiceErrorCodeData =
  | "CONFIGURATION"
  | "INVALID_CREDENTIALS"
  | "INVALID_REFRESH_TOKEN"
  | "IDENTIFIER_NOT_FOUND"
  | "INVALID_OTP"
  | "INVALID_RESET_TOKEN"
  | "WEAK_PASSWORD"
  | "RATE_LIMITED"
  | "INACTIVE_USER"
  | "INTERNAL";

// Extends the native Error object with an auth-specific code for status mapping.
export interface AuthServiceErrorData extends Error {
  code: AuthServiceErrorCodeData;
}

// Validates login input before the request reaches service logic.
export const loginRequestSchema = zod
  .object({
    userId: zod.string().trim().min(1),
    password: zod.string().min(1),
  })
  .strict();

// Accepts email-only recovery initiation in the current backend phase.
export const forgotPasswordRequestSchema = zod
  .object({
    email: zod.string().trim().email(),
  })
  .strict();

// Validates refresh requests before they reach the service layer.
export const refreshTokenRequestSchema = zod
  .object({
    refreshToken: zod.string().trim().min(1),
  })
  .strict();

// Enforces exact OTP shape so invalid codes are rejected before provider calls.
export const verifyOtpRequestSchema = zod
  .object({
    email: zod.string().trim().email(),
    otp: zod
      .string()
      .trim()
      .length(AUTH_OTP_LENGTH)
      .regex(AUTH_OTP_REGEX),
  })
  .strict();

// Reuses the same email validation rules for OTP resend requests.
export const resendOtpRequestSchema = zod
  .object({
    email: zod.string().trim().email(),
  })
  .strict();

// Applies the project password policy at the API boundary as an early safeguard.
export const resetPasswordRequestSchema = zod
  .object({
    resetToken: zod.string().trim().min(1),
    newPassword: zod
      .string()
      .min(AUTH_MIN_PASSWORD_LENGTH)
      .refine((passwordValue) => PASSWORD_UPPERCASE_REGEX.test(passwordValue))
      .refine((passwordValue) => PASSWORD_NUMBER_REGEX.test(passwordValue)),
  })
  .strict();
