// REACT //
import * as React from "react";

// OTHERS //
import { cn } from "@/lib/utils";

interface TextareaPropsData extends React.ComponentProps<"textarea"> {
  label?: string;
}

function Textarea({ className, label, ...props }: TextareaPropsData) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {label !== "" && (
        <div className="relative flex">
          <label className="font-secondary text-n-600 text-xs leading-normal font-medium tracking-wide uppercase">
            {label}
          </label>
        </div>
      )}

      {/* Textarea Input */}
      <textarea
        data-slot="textarea"
        className={cn(
          "border-n-200 bg-n-50 font-secondary text-n-800 placeholder:font-secondary placeholder:text-n-400 focus-visible:border-n-300 rounded-lg border p-3.5 text-base leading-normal transition-colors outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Textarea };
