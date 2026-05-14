export interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}

export type ApiStatusData = "success" | "error";

export interface SendResponseOptionsData<T> {
  context: {
    json: (body: unknown, statusCode: number) => Response;
  };
  statusCode: number;
  status: ApiStatusData;
  message: string;
  data?: T | null;
  error?: string | null;
}
