// TYPES //
import type { z } from "zod";

// LIBRARIES //
import { z as zod } from "zod";

export const healthQuerySchema = zod.object({}).strict();

export interface HealthStatusData {
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptime_seconds: number;
}

export type HealthQueryInputData = z.infer<typeof healthQuerySchema>;
