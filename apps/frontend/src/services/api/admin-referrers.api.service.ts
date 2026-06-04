// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  AdminReferredLeadData,
  AdminReferrerData,
  AdminReferrerDetailData,
  PaginatedResponseData,
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
 * Fetches paginated list of referrers with optional search and sort.
 */
export const getAdminReferrersRequest = async (params?: {
  limit?: number;
  page?: number;
  search?: string;
  sort?: "most-referrals" | "best-conversion";
}): Promise<ApiResponseData<PaginatedResponseData<AdminReferrerData>>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/referrers`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<
      ApiResponseData<PaginatedResponseData<AdminReferrerData>>
    >(config);
  return response.data;
};

/**
 * Fetches a single referrer by ID.
 */
export const getAdminReferrerByIdRequest = async (
  referrerId: string,
): Promise<ApiResponseData<AdminReferrerDetailData>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/referrers/${referrerId}`,
    headers: getAuthHeadersService(),
  };

  const response =
    await axios.request<ApiResponseData<AdminReferrerDetailData>>(config);
  return response.data;
};

/**
 * Fetches paginated leads referred by a specific referrer.
 */
export const getAdminReferredLeadsRequest = async (
  referrerId: string,
  params?: { limit?: number; page?: number },
): Promise<ApiResponseData<PaginatedResponseData<AdminReferredLeadData>>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/referrers/${referrerId}/leads`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<
      ApiResponseData<PaginatedResponseData<AdminReferredLeadData>>
    >(config);
  return response.data;
};
