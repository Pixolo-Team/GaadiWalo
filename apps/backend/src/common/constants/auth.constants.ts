import { HTTP_STATUS_CODES } from "./http.constants.js";

export const AUTH_OTP_LENGTH = 6;
export const AUTH_MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_NUMBER_REGEX = /[0-9]/;
export const AUTH_OTP_REGEX = new RegExp(`^[0-9]{${AUTH_OTP_LENGTH}}$`);

export const INVALID_LOGIN_REQUEST_MESSAGE = "Invalid login request.";
export const INVALID_FORGOT_PASSWORD_REQUEST_MESSAGE =
  "Invalid forgot password request.";
export const INVALID_REQUEST_BODY_MESSAGE = "Invalid request body.";
export const INVALID_VERIFY_OTP_REQUEST_MESSAGE = "Invalid verify OTP request.";
export const INVALID_RESEND_OTP_REQUEST_MESSAGE =
  "Invalid resend OTP request.";
export const INVALID_RESET_PASSWORD_REQUEST_MESSAGE =
  "Invalid reset password request.";

export const LOGIN_SUCCESS_MESSAGE = "User authenticated successfully.";
export const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  "If the account exists, password recovery instructions have been sent.";
export const VERIFY_OTP_SUCCESS_MESSAGE = "OTP verified successfully.";
export const RESEND_OTP_SUCCESS_MESSAGE =
  "If the account exists, a new OTP has been sent.";
export const RESET_PASSWORD_SUCCESS_MESSAGE =
  "Password updated successfully.";

export const INVALID_CREDENTIALS_MESSAGE = "Invalid User ID or password.";
export const AUTH_CONFIGURATION_ERROR_MESSAGE =
  "Authentication service is not configured.";
export const AUTH_IDENTIFIER_NOT_FOUND_MESSAGE =
  "No account found with this email address.";
export const AUTH_INVALID_OTP_MESSAGE = "Invalid or expired OTP.";
export const AUTH_INVALID_RESET_TOKEN_MESSAGE =
  "Reset token is invalid or expired.";
export const AUTH_WEAK_PASSWORD_MESSAGE =
  "Password must be at least 8 characters long and include 1 uppercase letter and 1 number.";
export const AUTH_RATE_LIMIT_MESSAGE =
  "Too many attempts. Please try again later.";
export const AUTH_INACTIVE_USER_MESSAGE = "This account is inactive.";

export const AUTH_ERROR_STATUS_CODE_MAP = {
  CONFIGURATION: HTTP_STATUS_CODES.internalServerError,
  INVALID_CREDENTIALS: HTTP_STATUS_CODES.unauthorized,
  IDENTIFIER_NOT_FOUND: HTTP_STATUS_CODES.notFound,
  INVALID_OTP: HTTP_STATUS_CODES.badRequest,
  INVALID_RESET_TOKEN: HTTP_STATUS_CODES.unauthorized,
  WEAK_PASSWORD: HTTP_STATUS_CODES.badRequest,
  RATE_LIMITED: HTTP_STATUS_CODES.tooManyRequests,
  INACTIVE_USER: HTTP_STATUS_CODES.forbidden,
  INTERNAL: HTTP_STATUS_CODES.internalServerError,
} as const;
