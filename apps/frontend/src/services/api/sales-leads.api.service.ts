// MODULES //
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  CreateLeadNoteRequestData,
  CreateLeadRequestData,
  CreateLeadResponseData,
  LeadActivityData,
  LeadCarBrandData,
  LeadDetailsData,
  LeadListItemData,
  LeadNoteData,
  LeadSourceData,
  LeadStatusOptionData,
  UpdateLeadDetailsRequestData,
  UpdateLeadStatusRequestData,
} from "@/types/leads";

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
 * Fetches all car brand options.
 */
export const getCarBrandsRequest = async (): Promise<
  ApiResponseData<LeadCarBrandData[]>
> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads/car-brands`,
  };

  const response =
    await axios.request<ApiResponseData<LeadCarBrandData[]>>(config);
  return response.data;
};

/**
 * Fetches all lead source options.
 */
export const getLeadSourcesRequest = async (): Promise<
  ApiResponseData<LeadSourceData[]>
> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads/lead-sources`,
  };

  const response = await axios.request<ApiResponseData<LeadSourceData[]>>(config);
  return response.data;
};

/**
 * Fetches all lead statuses and reason options.
 */
export const getLeadStatusesRequest = async (): Promise<
  ApiResponseData<LeadStatusOptionData[]>
> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads/statuses`,
  };

  const response =
    await axios.request<ApiResponseData<LeadStatusOptionData[]>>(config);
  return response.data;
};

/**
 * Fetches all sales leads for the authenticated user.
 */
export const getSalesLeadsRequest = async (): Promise<
  ApiResponseData<LeadListItemData[]>
> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads`,
  };

  const response =
    await axios.request<ApiResponseData<LeadListItemData[]>>(config);
  return response.data;
};

/**
 * Fetches lead details for one lead id.
 */
export const getLeadDetailsRequest = async (
  leadId: string,
): Promise<ApiResponseData<LeadDetailsData>> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads/${leadId}`,
  };

  const response =
    await axios.request<ApiResponseData<LeadDetailsData>>(config);
  return response.data;
};

/**
 * Fetches lead activities for one lead id.
 */
export const getLeadActivitiesRequest = async (
  leadId: string,
): Promise<ApiResponseData<LeadActivityData[]>> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads/${leadId}/activities`,
  };

  const response =
    await axios.request<ApiResponseData<LeadActivityData[]>>(config);
  return response.data;
};

/**
 * Fetches lead notes for one lead id.
 */
export const getLeadNotesRequest = async (
  leadId: string,
): Promise<ApiResponseData<LeadNoteData[]>> => {
  const config: AxiosRequestConfig = {
    headers: getAuthHeadersService(),
    method: "get",
    url: `${CONSTANTS.API_URL}/sales/leads/${leadId}/notes`,
  };

  const response = await axios.request<ApiResponseData<LeadNoteData[]>>(config);
  return response.data;
};

/**
 * Updates lead status for one lead id.
 */
export const updateLeadStatusRequest = async (
  leadId: string,
  payload: UpdateLeadStatusRequestData,
): Promise<ApiResponseData<LeadDetailsData>> => {
  const config: AxiosRequestConfig = {
    data: payload,
    headers: getAuthHeadersService(),
    method: "patch",
    url: `${CONSTANTS.API_URL}/sales/leads/${leadId}/status`,
  };

  const response =
    await axios.request<ApiResponseData<LeadDetailsData>>(config);
  return response.data;
};

/**
 * Updates editable lead details for one lead id.
 */
export const updateLeadDetailsRequest = async (
  leadId: string,
  payload: UpdateLeadDetailsRequestData,
): Promise<ApiResponseData<LeadDetailsData>> => {
  const config: AxiosRequestConfig = {
    data: payload,
    headers: getAuthHeadersService(),
    method: "patch",
    url: `${CONSTANTS.API_URL}/sales/leads/${leadId}`,
  };

  const response =
    await axios.request<ApiResponseData<LeadDetailsData>>(config);
  return response.data;
};

/**
 * Creates a note for one lead id.
 */
export const createLeadNoteRequest = async (
  leadId: string,
  payload: CreateLeadNoteRequestData,
): Promise<ApiResponseData<LeadNoteData>> => {
  const config: AxiosRequestConfig = {
    data: payload,
    headers: getAuthHeadersService(),
    method: "post",
    url: `${CONSTANTS.API_URL}/sales/leads/${leadId}/notes`,
  };

  const response = await axios.request<ApiResponseData<LeadNoteData>>(config);
  return response.data;
};

/**
 * Creates a new lead.
 */
export const createLeadRequest = async (
  payload: CreateLeadRequestData,
): Promise<ApiResponseData<CreateLeadResponseData>> => {
  const config: AxiosRequestConfig = {
    data: payload,
    headers: getAuthHeadersService(),
    method: "post",
    url: `${CONSTANTS.API_URL}/sales/leads`,
  };

  const response =
    await axios.request<ApiResponseData<CreateLeadResponseData>>(config);
  return response.data;
};
