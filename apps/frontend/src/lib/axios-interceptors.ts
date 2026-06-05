// LIBRARIES //
import axios from "axios";

// MODULES //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

/**
 * Registers a global Axios response interceptor.
 * On 401 — clears all auth data and redirects to login.
 */
export const setupAxiosInterceptorsService = (): void => {
  axios.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const status = (error as { response?: { status: number } }).response?.status;

      if (status === 401) {
        window.localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
        window.localStorage.removeItem(CONSTANTS.AUTH_USER);
        window.localStorage.removeItem(CONSTANTS.REFRESH_TOKEN);
        window.localStorage.removeItem(CONSTANTS.EXPIRES_IN);
        document.cookie = `${CONSTANTS.ACCESS_TOKEN}=; Path=/; Max-Age=0; SameSite=Lax`;
        window.location.href = ROUTES.auth.login;
      }

      return Promise.reject(error);
    },
  );
};
