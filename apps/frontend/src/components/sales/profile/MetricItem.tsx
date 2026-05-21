"use client";

// TYPES //
interface MetricItemPropsData {
  className?: string;
  helper: string;
  label: string;
  tone: "blue" | "green" | "neutral" | "red";
  value: string;
}

/** Renders one metric card in profile summary metrics. */
export default function MetricItem({
  className,
  helper,
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
        className={`font-primary text-3xl leading-none font-bold ${tone === "blue" ? "text-blue-600" : tone === "green" ? "text-green-600" : tone === "red" ? "text-red-500" : "text-n-800"}`}
      >
        {value}
      </p>
      <p className="font-secondary text-n-600 text-xs">{helper}</p>
    </div>
  );
}
