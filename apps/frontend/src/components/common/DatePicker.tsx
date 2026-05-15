"use client";

// REACT //
import { useRef, useState } from "react";

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
  const popoverContainerReference = useRef<HTMLDivElement | null>(null);

  // Define States
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  // Helper Functions
  const dateValue = value ? new Date(value) : undefined;

  // Use Effects

  return (
    <div ref={popoverContainerReference}>
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            className={cn(
              "border-n-200 bg-n-50 font-secondary text-n-800 hover:bg-n-50 active:bg-n-50 h-12 justify-between rounded-lg px-3 text-sm font-normal shadow-none",
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
      <PopoverContent
        container={popoverContainerReference}
        className="z-[60] w-auto p-2"
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "");
            setIsDatePickerOpen(false);
          }}
        />
      </PopoverContent>
      </Popover>
    </div>
  );
}
