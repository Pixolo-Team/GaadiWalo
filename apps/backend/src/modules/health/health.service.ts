// TYPES //
import type { QueryResponseData } from "../../common/types/api.types.js";
import type { HealthStatusData } from "./health.types.js";

// CONFIG //
import { environmentConfig } from "../../config/environment.js";

// CONSTANTS //
import {
  SERVICE_NAME,
  SERVICE_VERSION,
} from "../../common/constants/http.constants.js";

/**
 * Builds the health payload for runtime status checks.
 */
export const getHealthStatusService = async (): Promise<
  QueryResponseData<HealthStatusData>
> => {
  try {
    const healthStatus: HealthStatusData = {
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
      environment: environmentConfig.nodeEnvironment,
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
    };

    return {
      data: healthStatus,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("Health service failed."),
    };
  }
};
