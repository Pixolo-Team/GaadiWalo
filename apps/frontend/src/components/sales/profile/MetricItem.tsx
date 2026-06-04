"use client";

// TYPES //
interface MetricItemPropsData {
  className?: string;
  helper: string;
  helperTone?: "negative" | "neutral" | "positive";
  label: string;
  tone: "blue" | "green" | "neutral" | "red";
  value: string;
}

const helperToneStyles: Record<string, string> = {
  positive: "text-green-600",
  negative: "text-red-500",
  neutral: "text-n-600",
};

/** Renders one metric card in profile summary metrics. */
export default function MetricItem({
  className,
  helper,
  helperTone = "neutral",
  label,
  tone,
  value,
}: MetricItemPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div
      className={`border-n-200 bg-n-50 flex flex-1 flex-col gap-1 rounded-[14px] border px-4 py-3.5 ${className ?? ""}`}
    >
      <p className="font-secondary text-n-500 text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p
        className={`font-primary text-2xl leading-none font-bold ${tone === "blue" ? "text-blue-600" : tone === "green" ? "text-green-600" : tone === "red" ? "text-red-500" : "text-n-800"}`}
      >
        {value}
      </p>
      <p className={`font-secondary text-xs ${helperToneStyles[helperTone]}`}>{helper}</p>
    </div>
  );
}
