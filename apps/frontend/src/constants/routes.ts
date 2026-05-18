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
    leadDetails: (leadId: string): string => `/leads/${leadId}`,
    addLead: "/leads/add",
    alerts: "/profile/notifications",
    profile: "/profile",
  },
} as const;
