export interface QueryResponseData<T> {
  data: T | null;
  error: Error | null;
}

export interface ApiResponseData<T> {
  data: T | null;
  status: "success" | "error";
  status_code: number;
  message: string;
  error: string | null;
}
