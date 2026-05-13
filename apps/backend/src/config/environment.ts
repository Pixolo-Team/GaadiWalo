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
};

export const isAuthEnvironmentConfigured = (): boolean => {
  return Boolean(
    environmentConfig.supabaseUrl &&
      environmentConfig.supabaseAnonKey &&
      environmentConfig.supabaseServiceRoleKey &&
      environmentConfig.authResetTokenSecret,
  );
};
