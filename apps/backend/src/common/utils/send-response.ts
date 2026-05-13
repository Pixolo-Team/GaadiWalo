// TYPES //
import type { SendResponseOptionsData } from "../types/api.types.js";

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
  return context.json(
    {
      data,
      status,
      status_code: statusCode,
      message,
      error,
    },
    statusCode,
  );
};
