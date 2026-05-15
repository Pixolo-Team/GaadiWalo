/**
 * Defines frontend API constants and endpoint paths.
 */
export const CONSTANTS = {
  API_URL:
    process.env.PUBLIC_API_URL ??
    "https://previgilant-dixie-disposingly.ngrok-free.dev",
  ACCESS_TOKEN: "access_token",
  AUTH_USER: "auth_user_data",
  REFRESH_TOKEN: "refresh_token",
  EXPIRES_IN: "expires_in",
  RECOVERY_EMAIL: "recovery_email",
  RESET_TOKEN: "reset_token",
};
