// CONFIG //
import "./load-env.js";
// LIBRARIES //
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  AUTH_RESET_TOKEN_SECRET: z.string().min(1).optional(),
  AUTH_RESET_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  SUPABASE_USERS_TABLE: z.string().min(1).default("users"),
  SUPABASE_LOGIN_USER_ID_COLUMN: z.string().min(1).default("user_code"),
  SUPABASE_USER_EMAIL_COLUMN: z.string().min(1).default("email"),
  SUPABASE_USER_NAME_COLUMN: z.string().min(1).default("full_name"),
  SUPABASE_USER_ROLE_COLUMN: z.string().min(1).default("role_id"),
  SUPABASE_USER_ACTIVE_COLUMN: z.string().min(1).default("is_active"),
  SUPABASE_ROLES_TABLE: z.string().min(1).default("roles"),
  SUPABASE_ROLE_ID_COLUMN: z.string().min(1).default("id"),
  SUPABASE_ROLE_NAME_COLUMN: z.string().min(1).default("name"),
});

const environmentParseResult = environmentSchema.safeParse(process.env);

if (!environmentParseResult.success) {
  throw new Error("Environment configuration is invalid.");
}

export const environmentConfig = {
  nodeEnvironment: environmentParseResult.data.NODE_ENV,
  port: environmentParseResult.data.PORT,
  supabaseUrl: environmentParseResult.data.SUPABASE_URL ?? "",
  supabaseAnonKey: environmentParseResult.data.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey:
    environmentParseResult.data.SUPABASE_SERVICE_ROLE_KEY ?? "",
  authResetTokenSecret:
    environmentParseResult.data.AUTH_RESET_TOKEN_SECRET ?? "",
  authResetTokenTtlMinutes:
    environmentParseResult.data.AUTH_RESET_TOKEN_TTL_MINUTES,
  supabaseUsersTable: environmentParseResult.data.SUPABASE_USERS_TABLE,
  supabaseLoginUserIdColumn:
    environmentParseResult.data.SUPABASE_LOGIN_USER_ID_COLUMN,
  supabaseUserEmailColumn:
    environmentParseResult.data.SUPABASE_USER_EMAIL_COLUMN,
  supabaseUserNameColumn:
    environmentParseResult.data.SUPABASE_USER_NAME_COLUMN,
  supabaseUserRoleColumn:
    environmentParseResult.data.SUPABASE_USER_ROLE_COLUMN,
  supabaseUserActiveColumn:
    environmentParseResult.data.SUPABASE_USER_ACTIVE_COLUMN,
  supabaseRolesTable: environmentParseResult.data.SUPABASE_ROLES_TABLE,
  supabaseRoleIdColumn: environmentParseResult.data.SUPABASE_ROLE_ID_COLUMN,
  supabaseRoleNameColumn: environmentParseResult.data.SUPABASE_ROLE_NAME_COLUMN,
};

export const isAuthEnvironmentConfigured = (): boolean => {
  return Boolean(
    environmentConfig.supabaseUrl &&
      environmentConfig.supabaseAnonKey &&
      environmentConfig.supabaseServiceRoleKey &&
      environmentConfig.authResetTokenSecret,
  );
};
