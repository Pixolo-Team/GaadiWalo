/**
 * Defines the standardized API response envelope.
 */
export interface ApiResponseData<T> {
  data: T | null;
  error: string | null;
  message: string;
  status: "error" | "success";
  status_code: number;
}

/**
 * Defines a safe service response shape used by UI.
 */
export interface ServiceResponseData<T> {
  data: T | null;
  message: string;
  statusCode: number;
}
