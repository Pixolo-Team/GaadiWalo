// CONFIG //
import {
  environmentConfig,
  isAuthEnvironmentConfigured,
} from "./environment.js";
// CONSTANTS //
import { SUPABASE_AUTH } from "../common/constants/supabase.constants.js";

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

/**
 * Fetches a user record by the configured login identifier column.
 */
export const getUserByLoginIdentifier = async (
  userId: string,
): Promise<SupabaseUserRecordData | null> => {
  assertSupabaseConfiguration();

  const filterColumn = SUPABASE_AUTH.loginUserIdColumn;
  const selectColumns = [
    SUPABASE_AUTH.loginUserIdColumn,
    SUPABASE_AUTH.emailColumn,
    SUPABASE_AUTH.nameColumn,
    SUPABASE_AUTH.roleColumn,
    SUPABASE_AUTH.activeColumn,
    "id",
    "auth_id",
  ].join(",");
  const requestUrl = new URL(
    `${environmentConfig.supabaseUrl}/rest/v1/${SUPABASE_AUTH.usersTable}`,
  );

  requestUrl.searchParams.set("select", selectColumns);
  requestUrl.searchParams.set(filterColumn, `eq.${userId}`);
  requestUrl.searchParams.set("limit", "1");

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: buildSupabaseHeaders({
      apiKey: environmentConfig.supabaseServiceRoleKey,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const responseBody = (await response.json()) as Record<string, unknown>[];
  const userRecord = responseBody[0];

  if (!userRecord) {
    return null;
  }

  return {
    ...userRecord,
    email: String(userRecord[SUPABASE_AUTH.emailColumn] ?? ""),
    full_name:
      typeof userRecord[SUPABASE_AUTH.nameColumn] === "string"
        ? String(userRecord[SUPABASE_AUTH.nameColumn])
        : undefined,
    role:
      typeof userRecord[SUPABASE_AUTH.roleColumn] === "string"
        ? String(userRecord[SUPABASE_AUTH.roleColumn])
        : undefined,
    is_active:
      typeof userRecord[SUPABASE_AUTH.activeColumn] === "boolean"
        ? Boolean(userRecord[SUPABASE_AUTH.activeColumn])
        : undefined,
    user_id:
      typeof userRecord[SUPABASE_AUTH.loginUserIdColumn] === "string"
        ? String(userRecord[SUPABASE_AUTH.loginUserIdColumn])
        : userId,
  };
};

/**
 * Fetches a user record by the configured email column.
 */
export const getUserByEmailIdentifier = async (
  email: string,
): Promise<SupabaseUserRecordData | null> => {
  assertSupabaseConfiguration();

  const requestUrl = new URL(
    `${environmentConfig.supabaseUrl}/rest/v1/${SUPABASE_AUTH.usersTable}`,
  );

  requestUrl.searchParams.set(
    "select",
    [
      SUPABASE_AUTH.loginUserIdColumn,
      SUPABASE_AUTH.emailColumn,
      SUPABASE_AUTH.nameColumn,
      SUPABASE_AUTH.roleColumn,
      SUPABASE_AUTH.activeColumn,
      "id",
      "auth_id",
    ].join(","),
  );
  requestUrl.searchParams.set(SUPABASE_AUTH.emailColumn, `eq.${email}`);
  requestUrl.searchParams.set("limit", "1");

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: buildSupabaseHeaders({
      apiKey: environmentConfig.supabaseServiceRoleKey,
    }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const responseBody = (await response.json()) as Record<string, unknown>[];
  const userRecord = responseBody[0];

  if (!userRecord) {
    return null;
  }

  return {
    ...userRecord,
    email,
    full_name:
      typeof userRecord[SUPABASE_AUTH.nameColumn] === "string"
        ? String(userRecord[SUPABASE_AUTH.nameColumn])
        : undefined,
    role:
      typeof userRecord[SUPABASE_AUTH.roleColumn] === "string"
        ? String(userRecord[SUPABASE_AUTH.roleColumn])
        : undefined,
    is_active:
      typeof userRecord[SUPABASE_AUTH.activeColumn] === "boolean"
        ? Boolean(userRecord[SUPABASE_AUTH.activeColumn])
        : undefined,
    user_id:
      typeof userRecord[SUPABASE_AUTH.loginUserIdColumn] === "string"
        ? String(userRecord[SUPABASE_AUTH.loginUserIdColumn])
        : undefined,
  };
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
