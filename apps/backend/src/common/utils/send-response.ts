// TYPES //
import type { ApiResponseData } from "../types/api.types.js";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

interface SendResponseOptionsData<T> {
  context: Context;
  statusCode: ContentfulStatusCode;
  status: "success" | "error";
  message: string;
  data?: T | null;
  error?: string | null;
}

/**
 * Sends the standardized project API response envelope.
 */
export const sendResponse = <T>({
  context,
  statusCode,
  status,
  message,
  data = null,
  error = null,
}: SendResponseOptionsData<T>): Response => {
  const responseBody: ApiResponseData<T> = {
    data,
    status,
    status_code: statusCode,
    message,
    error,
  };

  return context.json(responseBody, statusCode);
};
