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
    addLead: "/leads/add",
    leadAdd: "/leads/add",
    leadImport: "/leads/import",
    alerts: "/alerts",
    profile: "/profile",
    profileEdit: "/profile/edit",
    profileChangePassword: "/profile/change-password",
    profileNotifications: "/profile/notifications",
    profilePerformance: "/profile/performance",
    leadDetails: (leadId: string): string => `/leads/${leadId}`,
  },
} as const;
