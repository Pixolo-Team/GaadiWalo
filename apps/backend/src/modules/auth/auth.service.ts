// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type {
  AuthServiceErrorCodeData,
  AuthServiceErrorData,
  ForgotPasswordRequestData,
  ForgotPasswordResponseData,
  LoginRequestData,
  LoginResponseData,
  ResetPasswordRequestData,
  ResetPasswordResponseData,
  ResendOtpRequestData,
  ResendOtpResponseData,
  VerifyOtpRequestData,
  VerifyOtpResponseData,
} from "./auth.types.js";
import type { SupabaseUserRecordData } from "../../config/supabase.js";
// CONFIG //
import { environmentConfig, isAuthEnvironmentConfigured } from "../../config/environment.js";
import {
  getUserByEmailIdentifier,
  getUserByLoginIdentifier,
  sendRecoveryOtp,
  signInWithPassword,
  updatePasswordWithRecoveryToken,
  verifyRecoveryOtp,
} from "../../config/supabase.js";
// CONSTANTS //
import {
  AUTH_CONFIGURATION_ERROR_MESSAGE,
  AUTH_IDENTIFIER_NOT_FOUND_MESSAGE,
  AUTH_INACTIVE_USER_MESSAGE,
  AUTH_INVALID_OTP_MESSAGE,
  AUTH_INVALID_RESET_TOKEN_MESSAGE,
  AUTH_RATE_LIMIT_MESSAGE,
  AUTH_WEAK_PASSWORD_MESSAGE,
  INVALID_CREDENTIALS_MESSAGE,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_UPPERCASE_REGEX,
} from "../../common/constants/auth.constants.js";
// UTILS //
import {
  issueRecoveryToken,
  verifyRecoveryToken,
} from "../../common/utils/recovery-token.js";

// These dependencies are injectable so the auth service can be tested without real Supabase calls.
interface AuthServiceDependenciesData {
  getUserByLoginIdentifier: (
    userId: string,
  ) => Promise<SupabaseUserRecordData | null>;
  getUserByEmailIdentifier: (
    email: string,
  ) => Promise<SupabaseUserRecordData | null>;
  signInWithPassword: (payload: {
    email: string;
    password: string;
  }) => Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }>;
  sendRecoveryOtp: (email: string) => Promise<void>;
  verifyRecoveryOtp: (payload: {
    email: string;
    otp: string;
  }) => Promise<{
    access_token: string;
  }>;
  updatePasswordWithRecoveryToken: (payload: {
    accessToken: string;
    newPassword: string;
  }) => Promise<void>;
  isAuthEnvironmentConfigured: () => boolean;
  issueRecoveryToken: (payload: {
    email: string;
    recoveryAccessToken: string;
    secret: string;
    ttlMinutes: number;
  }) => {
    resetToken: string;
    expiresAt: string;
  };
  verifyRecoveryToken: (payload: {
    resetToken: string;
    secret: string;
  }) => {
    email: string;
    recoveryAccessToken: string;
    exp: number;
  } | null;
  getResetTokenSecret: () => string;
  getResetTokenTtlMinutes: () => number;
}

/**
 * Creates a typed auth error that controllers can translate into a consistent API response.
 */
const createAuthServiceError = (
  code: AuthServiceErrorCodeData,
  message: string,
): AuthServiceErrorData => {
  const authError = new Error(message) as AuthServiceErrorData;
  authError.code = code;
  return authError;
};

/**
 * Normalizes email input so lookups and recovery flows use a consistent value.
 */
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Builds the minimal email-only payload used by recovery success responses.
 */
const createEmailResponse = (
  email: string,
): { email: string } => {
  return {
    email: normalizeEmail(email),
  };
};

/**
 * Maps Supabase auth failures to the project-specific auth errors used across the module.
 */
const mapSupabaseError = (error: Error): AuthServiceErrorData => {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("invalid login credentials") ||
    errorMessage.includes("invalid credentials")
  ) {
    return createAuthServiceError(
      "INVALID_CREDENTIALS",
      INVALID_CREDENTIALS_MESSAGE,
    );
  }

  if (
    errorMessage.includes("rate limit") ||
    errorMessage.includes("too many") ||
    errorMessage.includes("for security purposes") ||
    errorMessage.includes("only request this after")
  ) {
    return createAuthServiceError("RATE_LIMITED", AUTH_RATE_LIMIT_MESSAGE);
  }

  if (
    errorMessage.includes("otp") ||
    errorMessage.includes("token has expired") ||
    errorMessage.includes("expired")
  ) {
    return createAuthServiceError("INVALID_OTP", AUTH_INVALID_OTP_MESSAGE);
  }

  return createAuthServiceError("INTERNAL", error.message);
};

/**
 * Converts reset-password failures into clearer token-aware auth errors when possible.
 */
const mapResetPasswordError = (error: Error): AuthServiceErrorData => {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("expired") ||
    errorMessage.includes("invalid token") ||
    errorMessage.includes("invalid jwt")
  ) {
    return createAuthServiceError(
      "INVALID_RESET_TOKEN",
      AUTH_INVALID_RESET_TOKEN_MESSAGE,
    );
  }

  return mapSupabaseError(error);
};

/**
 * Validates password strength before the reset flow reaches Supabase.
 */
const ensurePasswordStrength = (newPassword: string): AuthServiceErrorData | null => {
  const isValidPassword =
    newPassword.length >= 8 &&
    PASSWORD_UPPERCASE_REGEX.test(newPassword) &&
    PASSWORD_NUMBER_REGEX.test(newPassword);

  if (!isValidPassword) {
    return createAuthServiceError("WEAK_PASSWORD", AUTH_WEAK_PASSWORD_MESSAGE);
  }

  return null;
};

/**
 * Provides the default production dependencies used by the live auth service.
 */
const createDefaultAuthServiceDependencies = (): AuthServiceDependenciesData => {
  return {
    getUserByLoginIdentifier,
    getUserByEmailIdentifier,
    signInWithPassword,
    sendRecoveryOtp,
    verifyRecoveryOtp,
    updatePasswordWithRecoveryToken,
    isAuthEnvironmentConfigured,
    issueRecoveryToken,
    verifyRecoveryToken,
    getResetTokenSecret: () => environmentConfig.authResetTokenSecret,
    getResetTokenTtlMinutes: () => environmentConfig.authResetTokenTtlMinutes,
  };
};

export interface AuthServiceData {
  loginService: (
    payload: LoginRequestData,
  ) => Promise<QueryResponseData<LoginResponseData>>;
  forgotPasswordService: (
    payload: ForgotPasswordRequestData,
  ) => Promise<QueryResponseData<ForgotPasswordResponseData>>;
  verifyOtpService: (
    payload: VerifyOtpRequestData,
  ) => Promise<QueryResponseData<VerifyOtpResponseData>>;
  resendOtpService: (
    payload: ResendOtpRequestData,
  ) => Promise<QueryResponseData<ResendOtpResponseData>>;
  resetPasswordService: (
    payload: ResetPasswordRequestData,
  ) => Promise<QueryResponseData<ResetPasswordResponseData>>;
}

/**
 * Creates the authentication service with injectable dependencies for testing.
 *
 * This keeps the business flow in one place while allowing tests to stub
 * Supabase behavior and environment-dependent helpers.
 */
export const createAuthService = (
  dependencies: AuthServiceDependenciesData = createDefaultAuthServiceDependencies(),
): AuthServiceData => {
  /**
   * Verifies the auth module has the required environment configuration before service work starts.
   */
  const ensureConfigured = (): AuthServiceErrorData | null => {
    if (!dependencies.isAuthEnvironmentConfigured()) {
      return createAuthServiceError(
        "CONFIGURATION",
        AUTH_CONFIGURATION_ERROR_MESSAGE,
      );
    }

    return null;
  };

  /**
   * Loads a user by email and ensures the account is active before recovery actions continue.
   */
  const resolveActiveUserByEmail = async (
    email: string,
  ): Promise<SupabaseUserRecordData> => {
    const userRecord = await dependencies.getUserByEmailIdentifier(email);

    if (!userRecord) {
      throw createAuthServiceError(
        "IDENTIFIER_NOT_FOUND",
        AUTH_IDENTIFIER_NOT_FOUND_MESSAGE,
      );
    }

    if (userRecord.is_active === false) {
      throw createAuthServiceError("INACTIVE_USER", AUTH_INACTIVE_USER_MESSAGE);
    }

    return userRecord;
  };

  /**
   * Identifies lookup errors that should be hidden to avoid exposing account existence.
   */
  const shouldHideEmailLookupError = (
    error: AuthServiceErrorData,
  ): boolean => {
    return (
      error.code === "IDENTIFIER_NOT_FOUND" || error.code === "INACTIVE_USER"
    );
  };

  return {
    /**
     * Authenticates a User ID and password, then returns the session details needed by the client.
     */
    loginService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        // The app logs in with a business User ID, but Supabase signs in with email.
        const userRecord = await dependencies.getUserByLoginIdentifier(
          payload.userId.trim(),
        );

        if (!userRecord) {
          return {
            data: null,
            error: createAuthServiceError(
              "INVALID_CREDENTIALS",
              INVALID_CREDENTIALS_MESSAGE,
            ),
          };
        }

        // Inactive users are blocked before hitting Supabase to keep responses predictable.
        if (userRecord.is_active === false) {
          return {
            data: null,
            error: createAuthServiceError(
              "INACTIVE_USER",
              AUTH_INACTIVE_USER_MESSAGE,
            ),
          };
        }

        const authSession = await dependencies.signInWithPassword({
          email: userRecord.email,
          password: payload.password,
        });

        // The response exposes only the session fields the frontend needs for authenticated requests.
        return {
          data: {
            accessToken: authSession.access_token,
            refreshToken: authSession.refresh_token ?? null,
            expiresIn: authSession.expires_in ?? null,
            user: {
              id: userRecord.user_id ?? payload.userId.trim(),
              name: userRecord.full_name ?? userRecord.email,
              email: userRecord.email,
              role: userRecord.role ?? "sales",
            },
          },
          error: null,
        };
      } catch (error) {
        // Unexpected provider failures are converted into service-level auth errors instead of thrown.
        return {
          data: null,
          error:
            error instanceof Error
              ? mapSupabaseError(error)
              : createAuthServiceError("INTERNAL", "Login failed."),
        };
      }
    },
    /**
     * Starts the password recovery flow by validating the email and requesting an OTP.
     */
    forgotPasswordService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const normalizedEmail = normalizeEmail(payload.email);
        await resolveActiveUserByEmail(normalizedEmail);
        await dependencies.sendRecoveryOtp(normalizedEmail);

        // The success payload is intentionally minimal because the next action happens on the client.
        return {
          data: {
            email: normalizedEmail,
          },
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error:
            error instanceof Error && "code" in error
              ? (error as AuthServiceErrorData)
              : error instanceof Error
                ? mapSupabaseError(error)
                : createAuthServiceError(
                    "INTERNAL",
                    "Forgot password failed.",
                  ),
        };
      }
    },
    /**
     * Verifies the recovery OTP and exchanges it for a backend-issued reset token.
     */
    verifyOtpService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const normalizedEmail = normalizeEmail(payload.email);
        await resolveActiveUserByEmail(normalizedEmail);

        const verifiedRecoverySession = await dependencies.verifyRecoveryOtp({
          email: normalizedEmail,
          otp: payload.otp,
        });

        // The backend wraps the recovery access token in its own signed token
        // so the raw recovery credential is not sent back to the client directly.
        const issuedRecoveryToken = dependencies.issueRecoveryToken({
          email: normalizedEmail,
          recoveryAccessToken: verifiedRecoverySession.access_token,
          secret: dependencies.getResetTokenSecret(),
          ttlMinutes: dependencies.getResetTokenTtlMinutes(),
        });

        return {
          data: issuedRecoveryToken,
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error:
            error instanceof Error && "code" in error
              ? (error as AuthServiceErrorData)
              : error instanceof Error
                ? mapSupabaseError(error)
                : createAuthServiceError(
                    "INTERNAL",
                    "OTP verification failed.",
                  ),
        };
      }
    },
    /**
     * Sends a fresh recovery OTP while keeping account existence hidden where required.
     */
    resendOtpService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const normalizedEmail = normalizeEmail(payload.email);
        await resolveActiveUserByEmail(normalizedEmail);
        await dependencies.sendRecoveryOtp(normalizedEmail);

        // The response matches forgot-password to keep the client flow simple and consistent.
        return {
          data: {
            email: normalizedEmail,
          },
          error: null,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          shouldHideEmailLookupError(error as AuthServiceErrorData)
        ) {
          // Resend requests also avoid revealing whether the email exists in the system.
          return {
            data: createEmailResponse(payload.email),
            error: null,
          };
        }

        return {
          data: null,
          error:
            error instanceof Error && "code" in error
              ? (error as AuthServiceErrorData)
              : error instanceof Error
                ? mapSupabaseError(error)
                : createAuthServiceError("INTERNAL", "Resend OTP failed."),
        };
      }
    },
    /**
     * Validates the reset token and updates the user's password through Supabase.
     */
    resetPasswordService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const passwordError = ensurePasswordStrength(payload.newPassword);

        if (passwordError) {
          return {
            data: null,
            error: passwordError,
          };
        }

        // Only backend-issued reset tokens are trusted for password updates.
        const verifiedRecoveryToken = dependencies.verifyRecoveryToken({
          resetToken: payload.resetToken,
          secret: dependencies.getResetTokenSecret(),
        });

        if (!verifiedRecoveryToken) {
          return {
            data: null,
            error: createAuthServiceError(
              "INVALID_RESET_TOKEN",
              AUTH_INVALID_RESET_TOKEN_MESSAGE,
            ),
          };
        }

        // The signed reset token carries the short-lived recovery access token needed by Supabase.
        await dependencies.updatePasswordWithRecoveryToken({
          accessToken: verifiedRecoveryToken.recoveryAccessToken,
          newPassword: payload.newPassword,
        });

        return {
          data: {
            email: verifiedRecoveryToken.email,
          },
          error: null,
        };
      } catch (error) {
        return {
          data: null,
          error:
            error instanceof Error && "code" in error
              ? (error as AuthServiceErrorData)
              : error instanceof Error
                ? mapResetPasswordError(error)
                : createAuthServiceError(
                    "INTERNAL",
                    "Password reset failed.",
                  ),
        };
      }
    },
  };
};

// Default singleton used by route handlers in the running application.
export let authService = createAuthService();

/**
 * Replaces the default auth service instance.
 *
 * This is mainly useful in tests where the module needs mocked behavior.
 */
export const setAuthService = (service: AuthServiceData): void => {
  authService = service;
};
