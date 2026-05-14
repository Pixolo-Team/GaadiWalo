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

// UTILS //
import { cn } from "@/lib/utils";

interface DropdownOptionData {
  label: string;
  value: string;
}

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

/**
 * Renders a reusable select dropdown field.
 */
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
}: Readonly<DropdownPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const optionItemsData = options.map((optionItem) => ({
    label: optionItem.label,
    value: optionItem.value,
  }));

  // Use Effects

  return (
    <div className="flex h-full w-full flex-col gap-1.5">
      {/* Dropdown label */}
      {label ? (
        <div className="relative flex">
          <label className="text-n-700 text-sm">
            {label}
            {required ? (
              <span className="absolute top-0 ml-0.5 text-red-500">*</span>
            ) : null}
          </label>
        </div>
      ) : null}

      {/* Dropdown field */}
      <div className="flex flex-col gap-0.5">
        <Select
          value={selectedOption}
          items={optionItemsData}
          onValueChange={(value) => {
            if (value) {
              onChange(value);
            }
          }}
        >
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
              /* Dropdown option */
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
