/**
 * Defines user payload.
 */
export interface UserData {
  branch?: string | null;
  email: string;
  id: string;
  joined?: string | null;
  languagePreference?: string | null;
  name: string;
  phoneNumber?: string | null;
  role: string;
  userCode?: string | null;
  userId?: string | null;
}

/**
 * Defines login response payload.
 */
export interface LoginResponseData {
  accessToken: string;
  expiresIn: number | null;
  refreshToken: string | null;
  user: UserData;
}

/**
 * Defines forgot-password response payload.
 */
export interface ForgotPasswordResponseData {
  email: string;
}

/**
 * Defines verify-otp response payload.
 */
export interface VerifyOtpResponseData {
  expiresAt: string;
  resetToken: string;
}

/**
 * Defines resend-otp response payload.
 */
export interface ResendOtpResponseData {
  email: string;
}

/**
 * Defines reset-password response payload.
 */
export interface ResetPasswordResponseData {
  email: string;
}

/**
 * Defines login request payload.
 */
export interface LoginRequestData {
  password: string;
  userId: string;
}

/**
 * Defines forgot-password request payload.
 */
export interface ForgotPasswordRequestData {
  email: string;
}

/**
 * Defines verify-otp request payload.
 */
export interface VerifyOtpRequestData {
  email: string;
  otp: string;
}

/**
 * Defines reset-password request payload.
 */
export interface ResetPasswordRequestData {
  newPassword: string;
  resetToken: string;
}

/**
 * Defines login input field shape for UI state.
 */
export type LoginUserFieldInputData = {
  password: string;
  userId: string;
};

/**
 * Defines change-password input field shape for UI state.
 */
export type ChangePasswordInputData = {
  confirmPassword: string;
  newPassword: string;
};
