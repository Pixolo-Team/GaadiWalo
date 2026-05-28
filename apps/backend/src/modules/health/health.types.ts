// LIBRARIES //
import { z as zod } from "zod";

export interface HealthStatusData {
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptime_seconds: number;
}

export const healthQuerySchema = zod.object({}).strict();
