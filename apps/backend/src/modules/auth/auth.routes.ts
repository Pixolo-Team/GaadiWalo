// CONSTANTS //
import { AUTH_ROUTE_BASE_PATH } from "../../common/constants/http.constants.js";
// SERVICES //
import {
  forgotPasswordController,
  loginController,
  resendOtpController,
  resetPasswordController,
  verifyOtpController,
} from "./auth.controller.js";
// LIBRARIES //
import { Hono } from "hono";

export const authRoutes = new Hono();

// Maps POST /auth/login to loginController.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/login`, loginController);

// Maps POST /auth/forgot-password to forgotPasswordController.
authRoutes.post(
  `${AUTH_ROUTE_BASE_PATH}/forgot-password`,
  forgotPasswordController,
);

// Maps POST /auth/verify-otp to verifyOtpController.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/verify-otp`, verifyOtpController);

// Maps POST /auth/resend-otp to resendOtpController.
authRoutes.post(`${AUTH_ROUTE_BASE_PATH}/resend-otp`, resendOtpController);

// Maps POST /auth/reset-password to resetPasswordController.
authRoutes.post(
  `${AUTH_ROUTE_BASE_PATH}/reset-password`,
  resetPasswordController,
);
