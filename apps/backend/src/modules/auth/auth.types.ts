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

export interface AuthenticatedUserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequestData {
  userId: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  user: AuthenticatedUserData;
}

export interface ForgotPasswordRequestData {
  identifier: string;
}

export interface ForgotPasswordResponseData {
  identifier: string;
}

export interface VerifyOtpRequestData {
  identifier: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  resetToken: string;
  expiresAt: string;
}

export interface ResendOtpRequestData {
  identifier: string;
}

export interface ResendOtpResponseData {
  identifier: string;
}

export interface ResetPasswordRequestData {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponseData {
  identifier: string;
}

export type AuthServiceErrorCodeData =
  | "CONFIGURATION"
  | "INVALID_CREDENTIALS"
  | "IDENTIFIER_NOT_FOUND"
  | "INVALID_OTP"
  | "INVALID_RESET_TOKEN"
  | "WEAK_PASSWORD"
  | "RATE_LIMITED"
  | "INACTIVE_USER"
  | "INTERNAL";

export interface AuthServiceErrorData extends Error {
  code: AuthServiceErrorCodeData;
}

export const loginRequestSchema = zod
  .object({
    userId: zod.string().trim().min(1),
    password: zod.string().min(1),
  })
  .strict();

export const forgotPasswordRequestSchema = zod
  .object({
    identifier: zod.string().trim().email(),
  })
  .strict();

export const verifyOtpRequestSchema = zod
  .object({
    identifier: zod.string().trim().email(),
    otp: zod
      .string()
      .trim()
      .length(AUTH_OTP_LENGTH)
      .regex(AUTH_OTP_REGEX),
  })
  .strict();

export const resendOtpRequestSchema = zod
  .object({
    identifier: zod.string().trim().email(),
  })
  .strict();

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
