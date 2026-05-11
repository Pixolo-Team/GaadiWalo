// LIBRARIES //
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
});

const environmentParseResult = environmentSchema.safeParse(process.env);

if (!environmentParseResult.success) {
  throw new Error("Environment configuration is invalid.");
}

export const environmentConfig = {
  nodeEnvironment: environmentParseResult.data.NODE_ENV,
  port: environmentParseResult.data.PORT,
};
