/**
 * Defines frontend API constants and endpoint paths.
 */
export const CONSTANTS = {
  API_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://previgilant-dixie-disposingly.ngrok-free.dev",
} as const;

/**
 * Defines session storage keys used by auth flow.
 */
export const AUTH_STORAGE_KEYS = {
  accessToken: "auth.accessToken",
  expiresIn: "auth.expiresIn",
  recoveryEmail: "auth.recoveryEmail",
  refreshToken: "auth.refreshToken",
  resetToken: "auth.resetToken",
  user: "auth.user",
} as const;
