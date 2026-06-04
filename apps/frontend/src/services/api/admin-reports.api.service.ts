// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  AdminFunnelReportData,
  AdminReportOverviewData,
  AdminSourcePerformanceResponseData,
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
 * Fetches report overview metrics for the given date range.
 */
export const getAdminReportOverviewRequest = async (
  from: string,
  to: string,
): Promise<ApiResponseData<AdminReportOverviewData>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/reports/overview`,
    headers: getAuthHeadersService(),
    params: { from, to },
  };

  const response =
    await axios.request<ApiResponseData<AdminReportOverviewData>>(config);
  return response.data;
};

/**
 * Fetches source performance breakdown for the given date range.
 */
export const getAdminSourcePerformanceRequest = async (
  from: string,
  to: string,
): Promise<ApiResponseData<AdminSourcePerformanceResponseData>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/reports/sources`,
    headers: getAuthHeadersService(),
    params: { from, to },
  };

  const response =
    await axios.request<ApiResponseData<AdminSourcePerformanceResponseData>>(
      config,
    );
  return response.data;
};

/**
 * Fetches conversion funnel report for the given date range.
 */
export const getAdminFunnelReportRequest = async (
  from: string,
  to: string,
): Promise<ApiResponseData<AdminFunnelReportData>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/reports/funnel`,
    headers: getAuthHeadersService(),
    params: { from, to },
  };

  const response =
    await axios.request<ApiResponseData<AdminFunnelReportData>>(config);
  return response.data;
};
