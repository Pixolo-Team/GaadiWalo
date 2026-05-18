"use client";

// COMPONENTS //
import BlankCalendar from "@/components/icons/neevo-icons/BlankCalendar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// OTHERS //
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// LIBRARIES //

interface DatePickerPropsData {
  className?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  value: string;
}

/** Date Picker Component */
export function DatePicker({
  className,
  onChange,
  placeholder = "Pick a date",
  value,
}: DatePickerPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const dateValue = value ? new Date(value) : undefined;

  // Use Effects

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className={cn(
            "border-n-200 bg-n-50 font-secondary text-n-800 hover:bg-n-50 active:bg-n-50 h-12 justify-between rounded-lg px-3 text-sm font-normal shadow-none",
            className,
          )}
        >
          {/* Selected date */}
          {dateValue ? (
            format(dateValue, "dd/MM/yyyy")
          ) : (
            <span>{placeholder}</span>
          )}

          {/* Calendar icon */}
          <BlankCalendar primaryColor="var(--color-n-500)" className="size-4" />
        </Button>
      </PopoverTrigger>

      {/* Calendar popover */}
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

