// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  AdminLeadsBySourceData,
  AdminSummaryData,
  AdminTopPerformerData,
  AdminTopReferrerData,
} from "@/types/admin";

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
 * Fetches admin dashboard summary metrics.
 */
export const getAdminSummaryRequest = async (
  period?: string,
): Promise<ApiResponseData<AdminSummaryData>> => {
  const params = period ? { period } : {};

  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/dashboard/summary`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<ApiResponseData<AdminSummaryData>>(config);
  return response.data;
};

/**
 * Fetches leads broken down by source for the admin dashboard.
 */
export const getAdminLeadsBySourceRequest = async (
  period?: string,
): Promise<ApiResponseData<AdminLeadsBySourceData[]>> => {
  const params = period ? { period } : {};

  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/dashboard/sources`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<ApiResponseData<AdminLeadsBySourceData[]>>(config);
  return response.data;
};

/**
 * Fetches top performing salespeople for the admin dashboard.
 */
export const getAdminTopPerformersRequest = async (
  period?: string,
  limit?: number,
): Promise<ApiResponseData<AdminTopPerformerData[]>> => {
  const params: Record<string, string | number> = {};
  if (period) params.period = period;
  if (limit) params.limit = limit;

  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/dashboard/top-performers`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<ApiResponseData<AdminTopPerformerData[]>>(config);
  return response.data;
};

/**
 * Fetches top referrers for the admin dashboard.
 */
export const getAdminTopReferrersRequest = async (
  period?: string,
  limit?: number,
): Promise<ApiResponseData<AdminTopReferrerData[]>> => {
  const params: Record<string, string | number> = {};
  if (period) params.period = period;
  if (limit) params.limit = limit;

  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/dashboard/top-referrers`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<ApiResponseData<AdminTopReferrerData[]>>(config);
  return response.data;
};
