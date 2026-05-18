"use client";

// REACT //
import type { ReactNode } from "react";

// COMPONENTS //
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// UTILS //
import { cn } from "@/lib/utils";

interface FilterDropdownPropsData {
  className?: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<string>;
  prefix?: ReactNode;
  selectedOption: string;
  title: string;
}

/** Filter Dropdown Component */
export default function FilterDropdown({
  className,
  onChange,
  options,
  prefix,
  selectedOption,
  title,
}: FilterDropdownPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const optionItemsData = options.map((optionItem) => ({
    label: optionItem,
    value: optionItem,
  }));

  // Use Effects

  return (
    <Select
      value={selectedOption}
      items={optionItemsData}
      onValueChange={(value) => {
        if (value) {
          onChange(value);
        }
      }}
    >
      {/* Select trigger */}
      <SelectTrigger
        className={cn(
          "border-n-400 bg-n-50 font-secondary text-n-600 h-9 w-auto rounded-[20px] border px-4 py-2 text-sm",
          className,
        )}
      >
        {prefix ? (
          <span className="flex flex-1 items-center gap-1 text-left">
            {/* Prefix content */}
            {typeof prefix === "string" ? <span>{prefix}</span> : prefix}

            {/* Selected value */}
            <span className="[&_[data-slot=select-value]]:font-bold">
              <SelectValue placeholder={title} />
            </span>
          </span>
        ) : (
          <SelectValue placeholder={title} />
        )}
      </SelectTrigger>

      {/* Select content */}
      <SelectContent className="border-n-200 bg-n-50 rounded-lg border p-1 shadow-sm">
        {options.map((optionItem) => (
          <SelectItem
            key={optionItem}
            value={optionItem}
            className="font-secondary text-n-950 focus:bg-n-100 min-h-9 rounded-md px-3 py-2 text-sm"
          >
            {optionItem}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

