/**
 * Defines centralized route paths used across the frontend app.
 */
export const ROUTES = {
  home: "/",
  auth: {
    login: "/login",
    resetPassword: "/reset-password",
    verifyOtp: "/verify-otp",
    newPassword: "/new-password",
  },
  sales: {
    leads: "/leads",
    leadAdd: "/leads/add",
    leadImport: "/leads/import",
    leadDetails: (leadId: string) => `/leads/${leadId}`,
  },
} as const;
