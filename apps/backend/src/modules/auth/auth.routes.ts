// CONSTANTS //
import { AUTH_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  resendOtpController,
  resetPasswordController,
  verifyOtpController,
} from "./auth.controller.js";
// LIBRARIES //
import { Hono } from "hono";

// Defines all authentication endpoints under the shared auth base path.
export const authRoutes = new Hono();

// Keeps route files thin so auth business logic stays inside the controller and service layers.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/login`, loginController);

// Renews an authenticated session without asking the user to log in again.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/refresh`, refreshTokenController);

// Ends all active sessions for the authenticated user.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/logout`, logoutController);

// Starts the password recovery flow without exposing Supabase details to callers.
authRoutes.post(
  `${AUTH_ROUTE_BASE_PATH}/forgot-password`,
  forgotPasswordController,
);

// Verifies the recovery OTP before the backend issues its own reset token.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/verify-otp`, verifyOtpController);

// Allows the client to request a fresh OTP when the previous one is expired or lost.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/resend-otp`, resendOtpController);

// Completes password reset by exchanging a backend-issued token for a password update.
authRoutes.post(
  `${AUTH_ROUTE_BASE_PATH}/reset-password`,
  resetPasswordController,
);
