"use client";

// REACT //
import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";

// COMPONENTS //
import TaillessLineArrowDown1 from "@/components/icons/neevo-icons/TaillessLineArrowDown1";

// OTHERS //
import { cn } from "@/lib/utils";

// LIBRARIES //

/** Calendar Component */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("bg-background p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          "flex size-8 items-center justify-center rounded-md text-n-700 hover:bg-n-100",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          "flex size-8 items-center justify-center rounded-md text-n-700 hover:bg-n-100",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center px-8",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "select-none text-sm font-medium text-n-900",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-md text-xs font-normal text-n-500",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        day: cn(
          "relative aspect-square h-8 w-8 p-0 text-center",
          defaultClassNames.day,
        ),
        today: cn("rounded-md bg-n-100 text-n-900", defaultClassNames.today),
        outside: cn("text-n-400", defaultClassNames.outside),
        disabled: cn("text-n-300 opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, ...iconProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", iconClassName)}
                {...iconProps}
              />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", iconClassName)}
                {...iconProps}
              />
            );
          }

          return (
            <TaillessLineArrowDown1
              primaryColor="var(--color-n-500)"
              className={cn("size-4", iconClassName)}
              {...iconProps}
            />
          );
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * Renders an individual calendar day button.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected}
      className={cn(
        "text-n-800 hover:bg-n-100 data-[selected-single=true]:text-n-50 flex size-8 items-center justify-center rounded-md text-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none data-[selected-single=true]:bg-blue-600",
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
