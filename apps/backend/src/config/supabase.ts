// CONFIG //
import {
  environmentConfig,
  isAuthEnvironmentConfigured,
} from "./environment.js";
// CONSTANTS //
import {
  DEFAULT_SUPABASE_AUTH,
  SUPABASE_AUTH,
} from "../common/constants/supabase.constants.js";
import type { SupabaseAuthConfigurationData } from "../common/constants/supabase.constants.js";

interface SupabaseSessionData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  user?: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
}

interface SupabaseErrorResponseData {
  error?: string;
  code?: string;
  msg?: string;
  message?: string;
  error_description?: string;
}

export interface SupabaseUserRecordData {
  id?: string;
  email: string;
  full_name?: string;
  role?: string;
  is_active?: boolean;
  user_id?: string;
  auth_id?: string;
  [key: string]: unknown;
}

const buildSupabaseHeaders = ({
  apiKey,
  accessToken,
}: {
  apiKey: string;
  accessToken?: string;
}): HeadersInit => {
  return {
    "Content-Type": "application/json",
    apikey: apiKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

const getErrorMessage = async (response: Response): Promise<string> => {
  let parsedBody: SupabaseErrorResponseData | null = null;

  try {
    parsedBody = (await response.json()) as SupabaseErrorResponseData;
  } catch {
    parsedBody = null;
  }

  return (
    parsedBody?.msg ??
    parsedBody?.message ??
    parsedBody?.error_description ??
    parsedBody?.error ??
    "Supabase request failed."
  );
};

const assertSupabaseConfiguration = (): void => {
  if (!isAuthEnvironmentConfigured()) {
    throw new Error("Supabase auth environment variables are missing.");
  }
};

const getSupabaseAuthConfigurations =
  (): SupabaseAuthConfigurationData[] => {
    const configurations = [SUPABASE_AUTH, DEFAULT_SUPABASE_AUTH];
    const uniqueConfigurations = new Map<string, SupabaseAuthConfigurationData>();

    for (const configurationItem of configurations) {
      const configurationKey = JSON.stringify(configurationItem);

      if (!uniqueConfigurations.has(configurationKey)) {
        uniqueConfigurations.set(configurationKey, configurationItem);
      }
    }

    return Array.from(uniqueConfigurations.values());
  };

const isRetryableAuthLookupError = (errorMessage: string): boolean => {
  const normalizedErrorMessage = errorMessage.toLowerCase();

  return (
    normalizedErrorMessage.includes("could not find the table") ||
    normalizedErrorMessage.includes("does not exist")
  );
};

const mapUserRecord = ({
  userRecord,
  configuration,
  fallbackUserId,
  fallbackEmail,
}: {
  userRecord: Record<string, unknown>;
  configuration: SupabaseAuthConfigurationData;
  fallbackUserId?: string;
  fallbackEmail?: string;
}): SupabaseUserRecordData => {
  return {
    ...userRecord,
    email: String(userRecord[configuration.emailColumn] ?? fallbackEmail ?? ""),
    full_name:
      typeof userRecord[configuration.nameColumn] === "string"
        ? String(userRecord[configuration.nameColumn])
        : undefined,
    role:
      typeof userRecord[configuration.roleColumn] === "string"
        ? String(userRecord[configuration.roleColumn])
        : undefined,
    is_active:
      typeof userRecord[configuration.activeColumn] === "boolean"
        ? Boolean(userRecord[configuration.activeColumn])
        : undefined,
    user_id:
      typeof userRecord[configuration.loginUserIdColumn] === "string"
        ? String(userRecord[configuration.loginUserIdColumn])
        : fallbackUserId,
  };
};

/**
 * Fetches a user record by the configured login identifier column.
 */
export const getUserByLoginIdentifier = async (
  userId: string,
): Promise<SupabaseUserRecordData | null> => {
  assertSupabaseConfiguration();

  let lastLookupError: Error | null = null;

  for (const configurationItem of getSupabaseAuthConfigurations()) {
    const requestUrl = new URL(
      `${environmentConfig.supabaseUrl}/rest/v1/${configurationItem.usersTable}`,
    );

    requestUrl.searchParams.set(
      "select",
      [
        configurationItem.loginUserIdColumn,
        configurationItem.emailColumn,
        configurationItem.nameColumn,
        configurationItem.roleColumn,
        configurationItem.activeColumn,
        "id",
        "auth_id",
      ].join(","),
    );
    requestUrl.searchParams.set(
      configurationItem.loginUserIdColumn,
      `eq.${userId}`,
    );
    requestUrl.searchParams.set("limit", "1");

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: buildSupabaseHeaders({
        apiKey: environmentConfig.supabaseServiceRoleKey,
      }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);

      if (isRetryableAuthLookupError(errorMessage)) {
        lastLookupError = new Error(errorMessage);
        continue;
      }

      throw new Error(errorMessage);
    }

    const responseBody = (await response.json()) as Record<string, unknown>[];
    const userRecord = responseBody[0];

    if (!userRecord) {
      return null;
    }

    return mapUserRecord({
      userRecord,
      configuration: configurationItem,
      fallbackUserId: userId,
    });
  }

  if (lastLookupError) {
    throw lastLookupError;
  }

  return null;
};

/**
 * Fetches a user record by the configured email column.
 */
export const getUserByEmailIdentifier = async (
  email: string,
): Promise<SupabaseUserRecordData | null> => {
  assertSupabaseConfiguration();

  let lastLookupError: Error | null = null;

  for (const configurationItem of getSupabaseAuthConfigurations()) {
    const requestUrl = new URL(
      `${environmentConfig.supabaseUrl}/rest/v1/${configurationItem.usersTable}`,
    );

    requestUrl.searchParams.set(
      "select",
      [
        configurationItem.loginUserIdColumn,
        configurationItem.emailColumn,
        configurationItem.nameColumn,
        configurationItem.roleColumn,
        configurationItem.activeColumn,
        "id",
        "auth_id",
      ].join(","),
    );
    requestUrl.searchParams.set(configurationItem.emailColumn, `eq.${email}`);
    requestUrl.searchParams.set("limit", "1");

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: buildSupabaseHeaders({
        apiKey: environmentConfig.supabaseServiceRoleKey,
      }),
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);

      if (isRetryableAuthLookupError(errorMessage)) {
        lastLookupError = new Error(errorMessage);
        continue;
      }

      throw new Error(errorMessage);
    }

    const responseBody = (await response.json()) as Record<string, unknown>[];
    const userRecord = responseBody[0];

    if (!userRecord) {
      return null;
    }

    return mapUserRecord({
      userRecord,
      configuration: configurationItem,
      fallbackEmail: email,
    });
  }

  if (lastLookupError) {
    throw lastLookupError;
  }

  return null;
};

/**
 * Authenticates a user against Supabase password auth.
 */
export const signInWithPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SupabaseSessionData> => {
  assertSupabaseConfiguration();

  const response = await fetch(
    `${environmentConfig.supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: buildSupabaseHeaders({
        apiKey: environmentConfig.supabaseAnonKey,
      }),
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as SupabaseSessionData;
};

/**
 * Starts the Supabase password recovery flow for the supplied email.
 */
export const sendRecoveryOtp = async (email: string): Promise<void> => {
  assertSupabaseConfiguration();

  const response = await fetch(`${environmentConfig.supabaseUrl}/auth/v1/recover`, {
    method: "POST",
    headers: buildSupabaseHeaders({
      apiKey: environmentConfig.supabaseAnonKey,
    }),
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};

/**
 * Verifies a password recovery OTP and returns the trusted recovery session.
 */
export const verifyRecoveryOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}): Promise<SupabaseSessionData> => {
  assertSupabaseConfiguration();

  const response = await fetch(`${environmentConfig.supabaseUrl}/auth/v1/verify`, {
    method: "POST",
    headers: buildSupabaseHeaders({
      apiKey: environmentConfig.supabaseAnonKey,
    }),
    body: JSON.stringify({
      email,
      token: otp,
      type: "recovery",
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as SupabaseSessionData;
};

/**
 * Updates the password by using the verified recovery access token.
 */
export const updatePasswordWithRecoveryToken = async ({
  accessToken,
  newPassword,
}: {
  accessToken: string;
  newPassword: string;
}): Promise<void> => {
  assertSupabaseConfiguration();

  const response = await fetch(`${environmentConfig.supabaseUrl}/auth/v1/user`, {
    method: "PUT",
    headers: buildSupabaseHeaders({
      apiKey: environmentConfig.supabaseAnonKey,
      accessToken,
    }),
    body: JSON.stringify({
      password: newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};
