// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  ChangeSalesPasswordRequestData,
  SalesPerformanceResponseData,
  SalesProfileData,
  UpdateSalesProfileRequestData,
} from "@/types/profile";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";

/**
 * Builds authorization header from stored access token.
 */
const getAuthHeadersService = (): Record<string, string> => {
  const accessToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem(CONSTANTS.ACCESS_TOKEN)
      : "";

  return {
    Authorization: `Bearer ${accessToken ?? ""}`,
    "Content-Type": "application/json",
  };
};

/**
 * Fetches profile details for one sales user code.
 */
export const getSalesProfileRequest = async (
  userCode: string,
): Promise<ApiResponseData<SalesProfileData>> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/profile/${userCode}`,
  };

  const response = await axios.request<ApiResponseData<SalesProfileData>>(config);
  return response.data;
};

/**
 * Updates profile details for one sales user code.
 */
export const updateSalesProfileRequest = async (
  userCode: string,
  payload: UpdateSalesProfileRequestData,
): Promise<ApiResponseData<SalesProfileData>> => {
  const config: AxiosRequestConfig = {
    data: payload,
    headers: getAuthHeadersService(),
    method: "patch",
    url: `${CONSTANTS.API_URL}/sales/profile/${userCode}`,
  };

  const response = await axios.request<ApiResponseData<SalesProfileData>>(config);
  return response.data;
};

/**
 * Changes password for one sales user code.
 */
export const changeSalesPasswordRequest = async (
  userCode: string,
  payload: ChangeSalesPasswordRequestData,
): Promise<ApiResponseData<{ success: boolean }>> => {
  const config: AxiosRequestConfig = {
    data: payload,
    headers: getAuthHeadersService(),
    method: "post",
    url: `${CONSTANTS.API_URL}/sales/profile/${userCode}/change-password`,
  };

  const response =
    await axios.request<ApiResponseData<{ success: boolean }>>(config);
  return response.data;
};

/**
 * Fetches performance details for one sales user code and period.
 */
export const getSalesPerformanceRequest = async (
  userCode: string,
  period: string,
): Promise<ApiResponseData<SalesPerformanceResponseData>> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    params: { period },
    url: `${CONSTANTS.API_URL}/sales/profile/${userCode}/performance`,
  };

  const response =
    await axios.request<ApiResponseData<SalesPerformanceResponseData>>(config);
  return response.data;
};
