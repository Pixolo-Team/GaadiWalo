// TYPES //
import type { AuthServiceErrorData } from "./auth.types.js";
import {
  forgotPasswordRequestSchema,
  loginRequestSchema,
  resendOtpRequestSchema,
  resetPasswordRequestSchema,
  verifyOtpRequestSchema,
} from "./auth.types.js";
// CONSTANTS //
import {
  AUTH_ERROR_STATUS_CODE_MAP,
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  INVALID_FORGOT_PASSWORD_REQUEST_MESSAGE,
  INVALID_LOGIN_REQUEST_MESSAGE,
  INVALID_REQUEST_BODY_MESSAGE,
  INVALID_RESET_PASSWORD_REQUEST_MESSAGE,
  INVALID_RESEND_OTP_REQUEST_MESSAGE,
  INVALID_VERIFY_OTP_REQUEST_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  RESEND_OTP_SUCCESS_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
  VERIFY_OTP_SUCCESS_MESSAGE,
} from "../../common/constants/auth.constants.js";
import { INTERNAL_SERVER_ERROR_MESSAGE, HTTP_STATUS_CODES } from "../../common/constants/http.constants.js";
// UTILS //
import { sendResponse } from "../../common/utils/send-response.js";
// SERVICES //
import { authService } from "./auth.service.js";
// LIBRARIES //
import type { Context } from "hono";

/**
 * Maps service-layer auth errors to safe HTTP responses.
 *
 * This keeps controller actions small and ensures every auth endpoint
 * uses the same status-code and message rules.
 */
const mapAuthError = (
  error: Error | null,
): { statusCode: number; message: string; errorDetail: string } => {
  if (!error) {
    return {
      statusCode: HTTP_STATUS_CODES.internalServerError,
      message: INTERNAL_SERVER_ERROR_MESSAGE,
      errorDetail: INTERNAL_SERVER_ERROR_MESSAGE,
    };
  }

  // Services attach a custom auth code so controllers can translate it into HTTP status codes.
  const authError = error as Partial<AuthServiceErrorData>;
  const statusCode =
    authError.code && authError.code in AUTH_ERROR_STATUS_CODE_MAP
      ? AUTH_ERROR_STATUS_CODE_MAP[authError.code]
      : HTTP_STATUS_CODES.internalServerError;

  return {
    statusCode,
    // Internal failures are intentionally hidden to avoid leaking backend or Supabase details.
    message:
      statusCode === HTTP_STATUS_CODES.internalServerError
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : error.message,
    errorDetail:
      statusCode === HTTP_STATUS_CODES.internalServerError
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : error.message,
  };
};

/**
 * Reads the request body once and converts malformed JSON into a standard API response.
 *
 * Hono throws when `.json()` receives invalid JSON, so centralizing this logic avoids
 * repeating the same try/catch block in every auth controller.
 */
const parseRequestBody = async (
  context: Context,
): Promise<{ requestBody: unknown; errorResponse: Response | null }> => {
  try {
    return {
      requestBody: await context.req.json(),
      errorResponse: null,
    };
  } catch {
    return {
      requestBody: null,
      errorResponse: sendResponse({
        context,
        statusCode: HTTP_STATUS_CODES.badRequest,
        status: "error",
        message: INVALID_REQUEST_BODY_MESSAGE,
        error: "Request body must be valid JSON.",
      }),
    };
  }
};

/**
 * Handles POST /auth/login and authenticates a user with User ID and password.
 */
export const loginController = async (context: Context): Promise<Response> => {
  const { requestBody, errorResponse } = await parseRequestBody(context);

  if (errorResponse) {
    return errorResponse;
  }

  // Validation happens before the service layer so downstream logic receives typed input only.
  const requestParseResult = loginRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_LOGIN_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const loginResult = await authService.loginService(requestParseResult.data);

  if (loginResult.error || !loginResult.data) {
    // The service decides the auth outcome; the controller only translates it into HTTP.
    const mappedError = mapAuthError(loginResult.error);
    const authError = loginResult.error as Partial<AuthServiceErrorData> | null;

    console.log("[auth/login] Returning error response", {
      userId: requestParseResult.data.userId.trim(),
      authErrorCode: authError?.code ?? null,
      serviceErrorMessage: loginResult.error?.message ?? null,
      responseStatusCode: mappedError.statusCode,
      responseMessage: mappedError.message,
    });

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: LOGIN_SUCCESS_MESSAGE,
    data: loginResult.data,
  });
};

/**
 * Handles POST /auth/forgot-password and starts the password recovery flow for a supported email.
 */
export const forgotPasswordController = async (
  context: Context,
): Promise<Response> => {
  const { requestBody, errorResponse } = await parseRequestBody(context);

  if (errorResponse) {
    return errorResponse;
  }

  const requestParseResult = forgotPasswordRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_FORGOT_PASSWORD_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const forgotPasswordResult = await authService.forgotPasswordService(
    requestParseResult.data,
  );

  if (forgotPasswordResult.error || !forgotPasswordResult.data) {
    // This still returns a safe, normalized error response if the service reports a failure.
    const mappedError = mapAuthError(forgotPasswordResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: FORGOT_PASSWORD_SUCCESS_MESSAGE,
    data: forgotPasswordResult.data,
  });
};

/**
 * Handles POST /auth/verify-otp and verifies a recovery OTP before issuing a backend reset token.
 */
export const verifyOtpController = async (
  context: Context,
): Promise<Response> => {
  const { requestBody, errorResponse } = await parseRequestBody(context);

  if (errorResponse) {
    return errorResponse;
  }

  const requestParseResult = verifyOtpRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_VERIFY_OTP_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const verifyOtpResult = await authService.verifyOtpService(
    requestParseResult.data,
  );

  if (verifyOtpResult.error || !verifyOtpResult.data) {
    // OTP failures are mapped centrally so expired, invalid, and internal failures stay consistent.
    const mappedError = mapAuthError(verifyOtpResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: VERIFY_OTP_SUCCESS_MESSAGE,
    data: verifyOtpResult.data,
  });
};

/**
 * Handles POST /auth/resend-otp and resends the recovery OTP for the supplied email.
 */
export const resendOtpController = async (
  context: Context,
): Promise<Response> => {
  const { requestBody, errorResponse } = await parseRequestBody(context);

  if (errorResponse) {
    return errorResponse;
  }

  const requestParseResult = resendOtpRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_RESEND_OTP_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const resendOtpResult = await authService.resendOtpService(
    requestParseResult.data,
  );

  if (resendOtpResult.error || !resendOtpResult.data) {
    // Reuses the same error mapping so resend behavior matches the rest of the auth module.
    const mappedError = mapAuthError(resendOtpResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: RESEND_OTP_SUCCESS_MESSAGE,
    data: resendOtpResult.data,
  });
};

/**
 * Handles POST /auth/reset-password and completes password reset by validating a backend-issued reset token.
 */
export const resetPasswordController = async (
  context: Context,
): Promise<Response> => {
  const { requestBody, errorResponse } = await parseRequestBody(context);

  if (errorResponse) {
    return errorResponse;
  }

  const requestParseResult = resetPasswordRequestSchema.safeParse(requestBody);

  if (!requestParseResult.success) {
    return sendResponse({
      context,
      statusCode: HTTP_STATUS_CODES.badRequest,
      status: "error",
      message: INVALID_RESET_PASSWORD_REQUEST_MESSAGE,
      error: requestParseResult.error.message,
    });
  }

  const resetPasswordResult = await authService.resetPasswordService(
    requestParseResult.data,
  );

  if (resetPasswordResult.error || !resetPasswordResult.data) {
    // Reset token errors and password-strength errors are converted to the shared API envelope here.
    const mappedError = mapAuthError(resetPasswordResult.error);

    return sendResponse({
      context,
      statusCode: mappedError.statusCode,
      status: "error",
      message: mappedError.message,
      error: mappedError.errorDetail,
    });
  }

  return sendResponse({
    context,
    statusCode: HTTP_STATUS_CODES.ok,
    status: "success",
    message: RESET_PASSWORD_SUCCESS_MESSAGE,
    data: resetPasswordResult.data,
  });
};
