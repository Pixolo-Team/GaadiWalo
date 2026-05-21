"use client";

// REACT //
import type { HTMLInputTypeAttribute, ReactNode } from "react";

// COMPONENTS //
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// OTHERS //
import { cn } from "@/lib/utils";

interface InputBoxPropsData {
  caption?: string;
  className?: string;
  iconRight?: ReactNode;
  id?: string;
  inputClassName?: string;
  label: string;
  labelClassName?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
}

/** Input Box Component */
export default function InputBox({
  caption,
  className,
  iconRight,
  id,
  inputClassName,
  label,
  labelClassName,
  onChange,
  placeholder,
  type = "text",
  value,
}: InputBoxPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {/* Label */}
      {label !== "" && (
        <FieldLabel
          htmlFor={id}
          className={cn(
            "font-secondary text-n-600 text-xs leading-normal font-medium tracking-wide uppercase",
            labelClassName,
          )}
        >
          {label}
        </FieldLabel>
      )}

      {/* Input container with optional right icon */}
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          className={cn(
            "border-n-200 bg-n-50 font-secondary text-n-800 placeholder:font-secondary placeholder:text-n-400 focus-visible:border-n-300 h-[50px] rounded-lg border p-3.5 text-base font-normal placeholder:text-base placeholder:font-normal focus-visible:ring-0 focus-visible:ring-offset-0",
            iconRight ? "pr-12" : "",
            inputClassName,
          )}
          onChange={(event) => onChange?.(event.target.value)}
        />
        {/* Right icon */}
        {iconRight ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-3 flex items-center justify-center",
            )}
          >
            <div className="pointer-events-auto">{iconRight}</div>
          </div>
        ) : null}
      </div>

      {/* Caption */}
      {caption ? (
        <FieldDescription className="font-secondary text-n-500 text-xs leading-[1.35]">
          {caption}
        </FieldDescription>
      ) : null}
    </div>
  );
}
