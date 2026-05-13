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
    identifier: string;
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
    identifier: string;
    recoveryAccessToken: string;
    exp: number;
  } | null;
  getResetTokenSecret: () => string;
  getResetTokenTtlMinutes: () => number;
}

const createAuthServiceError = (
  code: AuthServiceErrorCodeData,
  message: string,
): AuthServiceErrorData => {
  const authError = new Error(message) as AuthServiceErrorData;
  authError.code = code;
  return authError;
};

const normalizeIdentifier = (identifier: string): string => {
  return identifier.trim().toLowerCase();
};

const createIdentifierResponse = (
  identifier: string,
): { identifier: string } => {
  return {
    identifier: normalizeIdentifier(identifier),
  };
};

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

  if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
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
 */
export const createAuthService = (
  dependencies: AuthServiceDependenciesData = createDefaultAuthServiceDependencies(),
): AuthServiceData => {
  const ensureConfigured = (): AuthServiceErrorData | null => {
    if (!dependencies.isAuthEnvironmentConfigured()) {
      return createAuthServiceError(
        "CONFIGURATION",
        AUTH_CONFIGURATION_ERROR_MESSAGE,
      );
    }

    return null;
  };

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

  const shouldHideIdentifierError = (
    error: AuthServiceErrorData,
  ): boolean => {
    return (
      error.code === "IDENTIFIER_NOT_FOUND" || error.code === "INACTIVE_USER"
    );
  };

  return {
    loginService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

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
        return {
          data: null,
          error:
            error instanceof Error
              ? mapSupabaseError(error)
              : createAuthServiceError("INTERNAL", "Login failed."),
        };
      }
    },
    forgotPasswordService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const normalizedIdentifier = normalizeIdentifier(payload.identifier);
        await resolveActiveUserByEmail(normalizedIdentifier);
        await dependencies.sendRecoveryOtp(normalizedIdentifier);

        return {
          data: {
            identifier: normalizedIdentifier,
          },
          error: null,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          shouldHideIdentifierError(error as AuthServiceErrorData)
        ) {
          return {
            data: createIdentifierResponse(payload.identifier),
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
                : createAuthServiceError(
                    "INTERNAL",
                    "Forgot password failed.",
                  ),
        };
      }
    },
    verifyOtpService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const normalizedIdentifier = normalizeIdentifier(payload.identifier);
        await resolveActiveUserByEmail(normalizedIdentifier);

        const verifiedRecoverySession = await dependencies.verifyRecoveryOtp({
          email: normalizedIdentifier,
          otp: payload.otp,
        });
        const issuedRecoveryToken = dependencies.issueRecoveryToken({
          identifier: normalizedIdentifier,
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
    resendOtpService: async (payload) => {
      try {
        const configurationError = ensureConfigured();

        if (configurationError) {
          return { data: null, error: configurationError };
        }

        const normalizedIdentifier = normalizeIdentifier(payload.identifier);
        await resolveActiveUserByEmail(normalizedIdentifier);
        await dependencies.sendRecoveryOtp(normalizedIdentifier);

        return {
          data: {
            identifier: normalizedIdentifier,
          },
          error: null,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          shouldHideIdentifierError(error as AuthServiceErrorData)
        ) {
          return {
            data: createIdentifierResponse(payload.identifier),
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

        await dependencies.updatePasswordWithRecoveryToken({
          accessToken: verifiedRecoveryToken.recoveryAccessToken,
          newPassword: payload.newPassword,
        });

        return {
          data: {
            identifier: verifiedRecoveryToken.identifier,
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

export let authService = createAuthService();

export const setAuthService = (service: AuthServiceData): void => {
  authService = service;
};
