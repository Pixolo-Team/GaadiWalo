// TYPES //
import type { LeadTemperatureData } from "@/types/leads";

/** Maps temperature values to their display icon. */
export const TEMPERATURE_ICON: Record<LeadTemperatureData, string> = {
  HOT: "🔴",
  WARM: "🟡",
  COLD: "🔵",
};

/** Maps temperature values to their display label. */
export const TEMPERATURE_LABEL: Record<LeadTemperatureData, string> = {
  HOT: "Hot",
  WARM: "Warm",
  COLD: "Cold",
};
