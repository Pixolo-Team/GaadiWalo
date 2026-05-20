"use client";

// COMPONENTS //
import CustomDownArrow from "@/components/icons/neevo-icons/CustomDownArrow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// OTHERS //
import { cn } from "@/lib/utils";

// TYPES //
import type { DropdownOptionData } from "@/types/dropdown";

interface DropdownPropsData {
  className?: string;
  error?: string;
  label?: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<DropdownOptionData>;
  placeholder?: string;
  required?: boolean;
  selectedOption: string;
  title?: string;
}

/** Dropdown Component */
export default function Dropdown({
  className,
  error,
  label,
  onChange,
  options,
  placeholder,
  required,
  selectedOption,
  title,
}: DropdownPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      {/* Dropdown label */}
      {label ? (
        <div className="relative flex">
          <label className="font-secondary text-n-600 text-xs font-semibold uppercase">
            {label}
            {required ? (
              <span className="absolute top-0 ml-0.5 text-red-500">*</span>
            ) : null}
          </label>
        </div>
      ) : null}

      {/* Dropdown field */}
      <div className="flex flex-col gap-0.5">
        <Select value={selectedOption} onValueChange={onChange}>
          <SelectTrigger
            className={cn(
              "border-n-200 bg-n-50 font-secondary text-n-800 data-placeholder:text-n-400 h-[50px] w-full min-w-0 rounded-lg border px-3 text-sm font-normal",
              error ? "border-red-500" : "",
              className,
            )}
            icon={
              <CustomDownArrow
                primaryColor="var(--color-n-600)"
                className="pointer-events-none size-3.5"
              />
            }
          >
            <SelectValue placeholder={placeholder ?? title} />
          </SelectTrigger>

          {/* Dropdown options */}
          <SelectContent className="border-n-200 bg-n-50 rounded-lg border p-1 shadow-sm">
            {options.map((optionItem) => (
              <SelectItem
                key={optionItem.value}
                value={optionItem.value}
                className="font-secondary text-n-950 focus:bg-n-100 min-h-10 rounded-md px-3 py-2 text-base"
              >
                {optionItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Field error */}
        {error ? <span className="text-xs text-red-500">{error}</span> : null}
      </div>
    </div>
  );
}

