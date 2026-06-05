// LIBRARIES //
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// MODULES //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

interface PendingRequestData {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

interface RefreshResponseData {
  data: {
    accessToken: string;
    refreshToken: string | null;
    expiresIn: number | null;
  };
}

let isRefreshing = false;
let pendingQueue: PendingRequestData[] = [];

/** Clears all auth keys from localStorage and the access token cookie. */
const clearSessionService = (): void => {
  [
    CONSTANTS.ACCESS_TOKEN,
    CONSTANTS.AUTH_USER,
    CONSTANTS.REFRESH_TOKEN,
    CONSTANTS.EXPIRES_IN,
  ].forEach((key) => window.localStorage.removeItem(key));

  document.cookie = `${CONSTANTS.ACCESS_TOKEN}=; Path=/; Max-Age=0; SameSite=Lax`;
};

/** Resolves or rejects all queued requests after a refresh attempt completes. */
const flushQueueService = (error: unknown, token: string | null): void => {
  pendingQueue.forEach((item) => {
    if (error || !token) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });
  pendingQueue = [];
};

/**
 * Registers a global Axios response interceptor.
 * On 401 — attempts a silent token refresh once, replays queued requests,
 * and only clears the session if the refresh itself also fails.
 */
export const setupAxiosInterceptorsService = (): void => {
  axios.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      const axiosError = error as {
        response?: { status: number };
        config?: AxiosRequestConfig & { _retried?: boolean };
      };

      const status = axiosError.response?.status;
      const originalRequest = axiosError.config;

      const requestUrl = originalRequest?.url ?? "";
      const isAuthEndpoint =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/verify-otp") ||
        requestUrl.includes("/auth/reset-password") ||
        requestUrl.includes("/auth/resend-otp") ||
        requestUrl.includes("/auth/refresh");

      if (status !== 401 || isAuthEndpoint || !originalRequest) {
        return Promise.reject(error);
      }

      // Prevent infinite retry loops on already-retried requests.
      if (originalRequest._retried) {
        clearSessionService();
        window.location.href = ROUTES.auth.login;
        return Promise.reject(error);
      }

      const storedRefreshToken = window.localStorage.getItem(
        CONSTANTS.REFRESH_TOKEN,
      );

      if (!storedRefreshToken) {
        clearSessionService();
        window.location.href = ROUTES.auth.login;
        return Promise.reject(error);
      }

      // Queue subsequent 401s while a refresh is already in flight.
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }
          return axios(originalRequest);
        });
      }

      originalRequest._retried = true;
      isRefreshing = true;

      try {
        const refreshResult = await axios.post<RefreshResponseData>(
          `${CONSTANTS.API_URL}/auth/refresh`,
          { refreshToken: storedRefreshToken },
        );

        const newAccessToken = refreshResult.data.data.accessToken;
        const newRefreshToken = refreshResult.data.data.refreshToken;
        const newExpiresIn = refreshResult.data.data.expiresIn;

        window.localStorage.setItem(CONSTANTS.ACCESS_TOKEN, newAccessToken);

        if (newRefreshToken) {
          window.localStorage.setItem(CONSTANTS.REFRESH_TOKEN, newRefreshToken);
        }

        if (newExpiresIn !== null) {
          window.localStorage.setItem(
            CONSTANTS.EXPIRES_IN,
            String(newExpiresIn),
          );
        }

        if (originalRequest.headers) {
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
        }

        flushQueueService(null, newAccessToken);
        return axios(originalRequest);
      } catch (refreshError) {
        flushQueueService(refreshError, null);
        clearSessionService();
        window.location.href = ROUTES.auth.login;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};
