// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  AdminSalespersonData,
  AdminTeamOptionsData,
  CreateSalespersonRequestData,
  CreateSalespersonResponseData,
  RemoveSalespersonRequestData,
  RemoveSalespersonResponseData,
  ResetSalespersonPasswordResponseData,
  UpdateSalespersonRequestData,
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
 * Fetches the full team list with optional filters.
 */
export const getAdminTeamRequest = async (params?: {
  branchId?: string;
  period?: string;
  search?: string;
  status?: "active" | "inactive";
}): Promise<ApiResponseData<AdminSalespersonData[]>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/team`,
    headers: getAuthHeadersService(),
    params,
  };

  const response =
    await axios.request<ApiResponseData<AdminSalespersonData[]>>(config);
  return response.data;
};

/**
 * Fetches role and branch options for team forms.
 */
export const getAdminTeamOptionsRequest =
  async (): Promise<ApiResponseData<AdminTeamOptionsData>> => {
    const config: AxiosRequestConfig = {
      method: "get",
      url: `${CONSTANTS.API_URL}/admin/team/options`,
      headers: getAuthHeadersService(),
    };

    const response =
      await axios.request<ApiResponseData<AdminTeamOptionsData>>(config);
    return response.data;
  };

/**
 * Fetches a single salesperson by ID.
 */
export const getAdminSalespersonByIdRequest = async (
  salespersonId: string,
  period?: string,
): Promise<ApiResponseData<AdminSalespersonData>> => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: `${CONSTANTS.API_URL}/admin/team/${salespersonId}`,
    headers: getAuthHeadersService(),
    params: period ? { period } : {},
  };

  const response =
    await axios.request<ApiResponseData<AdminSalespersonData>>(config);
  return response.data;
};

/**
 * Creates a new salesperson account.
 */
export const createSalespersonRequest = async (
  payload: CreateSalespersonRequestData,
): Promise<ApiResponseData<CreateSalespersonResponseData>> => {
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/admin/team`,
    headers: getAuthHeadersService(),
    data: payload,
  };

  const response =
    await axios.request<ApiResponseData<CreateSalespersonResponseData>>(config);
  return response.data;
};

/**
 * Updates an existing salesperson's details.
 */
export const updateSalespersonRequest = async (
  salespersonId: string,
  payload: UpdateSalespersonRequestData,
): Promise<ApiResponseData<AdminSalespersonData>> => {
  const config: AxiosRequestConfig = {
    method: "patch",
    url: `${CONSTANTS.API_URL}/admin/team/${salespersonId}`,
    headers: getAuthHeadersService(),
    data: payload,
  };

  const response =
    await axios.request<ApiResponseData<AdminSalespersonData>>(config);
  return response.data;
};

/**
 * Resets a salesperson's password and returns a temporary password.
 */
export const resetSalespersonPasswordRequest = async (
  salespersonId: string,
): Promise<ApiResponseData<ResetSalespersonPasswordResponseData>> => {
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${CONSTANTS.API_URL}/admin/team/${salespersonId}/reset-password`,
    headers: getAuthHeadersService(),
  };

  const response =
    await axios.request<ApiResponseData<ResetSalespersonPasswordResponseData>>(
      config,
    );
  return response.data;
};

/**
 * Removes a salesperson, with optional lead reassignment.
 */
export const removeSalespersonRequest = async (
  salespersonId: string,
  payload: RemoveSalespersonRequestData,
): Promise<ApiResponseData<RemoveSalespersonResponseData>> => {
  const config: AxiosRequestConfig = {
    method: "delete",
    url: `${CONSTANTS.API_URL}/admin/team/${salespersonId}`,
    headers: getAuthHeadersService(),
    data: payload,
  };

  const response =
    await axios.request<ApiResponseData<RemoveSalespersonResponseData>>(config);
  return response.data;
};
