// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  ForgotPasswordRequestData,
  ForgotPasswordResponseData,
  LoginResponseData,
  ResendOtpResponseData,
  ResetPasswordRequestData,
  ResetPasswordResponseData,
  VerifyOtpRequestData,
  VerifyOtpResponseData,
} from "@/types/auth";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";

/**
 * Authenticates a user by user ID and password.
 */
export const loginRequest = async (
  userId: string,
  password: string,
): Promise<ApiResponseData<LoginResponseData>> => {
  // Prepare the API Call
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/auth/login`,
    headers: { "Content-Type": "application/json" },
    data: {
      userId,
      password,
    },
  };

  // Make the API Call and return Data
  const response =
    await axios.request<ApiResponseData<LoginResponseData>>(config);
  return response.data;
};

/**
 * Starts forgot-password flow for a registered email.
 */
export const forgotPasswordRequest = async (
  payload: ForgotPasswordRequestData,
): Promise<ApiResponseData<ForgotPasswordResponseData>> => {
  // Prepare the API Call
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/auth/forgot-password`,
    headers: { "Content-Type": "application/json" },
    data: payload,
  };

  // Make the API Call and return Data
  const response =
    await axios.request<ApiResponseData<ForgotPasswordResponseData>>(config);
  return response.data;
};

/**
 * Verifies OTP for password reset.
 */
export const verifyOtpRequest = async (
  payload: VerifyOtpRequestData,
): Promise<ApiResponseData<VerifyOtpResponseData>> => {
  // Prepare the API Call
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/auth/verify-otp`,
    headers: { "Content-Type": "application/json" },
    data: payload,
  };

  // Make the API Call and return Data
  const response =
    await axios.request<ApiResponseData<VerifyOtpResponseData>>(config);
  return response.data;
};

/**
 * Requests OTP resend.
 */
export const resendOtpRequest = async (
  payload: ForgotPasswordRequestData,
): Promise<ApiResponseData<ResendOtpResponseData>> => {
  // Prepare the API Call
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/auth/resend-otp`,
    headers: { "Content-Type": "application/json" },
    data: payload,
  };

  // Make the API Call and return Data
  const response =
    await axios.request<ApiResponseData<ResendOtpResponseData>>(config);
  return response.data;
};

/**
 * Resets user password with reset token.
 */
export const resetPasswordRequest = async (
  payload: ResetPasswordRequestData,
): Promise<ApiResponseData<ResetPasswordResponseData>> => {
  // Prepare the API Call
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/auth/reset-password`,
    headers: { "Content-Type": "application/json" },
    data: payload,
  };

  // Make the API Call and return Data
  const response =
    await axios.request<ApiResponseData<ResetPasswordResponseData>>(config);
  return response.data;
};
