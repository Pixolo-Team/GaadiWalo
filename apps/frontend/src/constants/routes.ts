/**
 * Defines centralized route paths used across the frontend app.
 */
export const ROUTES = {
  home: "/",
  auth: {
    login: "/login",
    resetPassword: "/reset-password",
    verifyOtp: "/verify-otp",
    changePassword: "/change-password",
    newPassword: "/change-password",
  },
  sales: {
    leads: "/leads",
  },
} as const;
