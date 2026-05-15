// REACT //
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

// OTHERS //
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Variants
const buttonVariants = cva(
  "inline-flex w-full h-[50px] cursor-pointer items-center text-n-50 font-semibold font-secondary text-base justify-center gap-3 whitespace-nowrap rounded-lg text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-n-400 focus-visible:ring-offset-2 focus-visible:ring-offset-n-50 disabled:pointer-events-none disabled:bg-n-200 disabled:text-n-400 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-n-50 shadow-sm hover:bg-blue-700 active:bg-blue-700",
        secondary:
          "border border-n-200 bg-n-100 text-n-800 hover:bg-n-200 active:bg-n-200",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

/**
 * Renders a reusable button with project-wide variants and sizes
 */
function Button({
  className,
  variant,
  onClick,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  const Component = asChild ? Slot : "button";

  // Use Effects

  return (
    <Component
      data-slot="button"
      data-variant={variant}
      onClick={onClick}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
