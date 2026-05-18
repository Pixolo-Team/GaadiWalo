"use client";

// TYPES //
interface MetricItemPropsData {
  helper: string;
  label: string;
  tone: "blue" | "green" | "neutral";
  value: string;
}

/** Renders one metric card in profile summary metrics. */
export default function MetricItem({
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
    <div className="border-n-200 bg-n-50 flex flex-1 flex-col items-center gap-1 rounded-[14px] border px-4 py-3.5">
      <p className="font-secondary text-n-500 text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p
        className={`font-primary text-3xl leading-none font-bold ${tone === "blue" ? "text-blue-600" : tone === "green" ? "text-green-600" : "text-n-800"}`}
      >
        {value}
      </p>
      <p className="font-secondary text-n-600 text-xs">{helper}</p>
    </div>
  );
}
