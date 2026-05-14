"use client";

// LIBRARIES //
import { format } from "date-fns";

// COMPONENTS //
import BlankCalendar from "@/components/icons/neevo-icons/BlankCalendar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// UTILS //
import { cn } from "@/lib/utils";

interface DatePickerPropsData {
  className?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  value?: string;
}

/**
 * Renders a reusable date picker field with calendar popover.
 */
export function DatePicker({
  className,
  onChange,
  placeholder = "Pick a date",
  value,
}: Readonly<DatePickerPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  const dateValue = value ? new Date(value) : undefined;

  // Use Effects

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            className={cn(
              "h-12 justify-between rounded-lg border-n-200 bg-n-50 px-3 font-secondary text-sm font-normal text-n-800 shadow-none hover:bg-n-50 active:bg-n-50",
              className,
            )}
          >
            {/* Selected date */}
            {dateValue ? format(dateValue, "dd/MM/yyyy") : placeholder}

            {/* Calendar icon */}
            <BlankCalendar
              primaryColor="var(--color-n-500)"
              className="size-4"
            />
          </Button>
        }
      />

      {/* Calendar popover */}
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
        />
      </PopoverContent>
    </Popover>
  );
}
