"use client";

// REACT //
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import LineArrowLeft1 from "@/components/icons/neevo-icons/LineArrowLeft1";
import { Button } from "@/components/ui/button";

// Interface
interface HeaderPropsData {
  onRightIconClick?: () => void;
  rightIcon?: ReactNode;
  rightLabel?: string;
  showBack?: boolean;
  title: string;
}

/**
 * Renders the shared app header with optional back and right-side actions.
 */
export function Header({
  onRightIconClick,
  rightIcon,
  rightLabel = "Open filters",
  showBack = true,
  title,
}: HeaderPropsData) {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  /** Function to handle back navigation */
  const handleBackNavigation = (): void => {
    router.back();
  };

  // Use Effects

  return (
    <header className="border-n-200 bg-n-50 flex shrink-0 items-center justify-between gap-3.5 border-b px-5 py-4">
      {/* Left header content */}
      <div className="flex items-center gap-3.5">
        {/* Back Button  */}
        {showBack ? (
          <Button
            type="button"
            aria-label="Go back"
            onClick={handleBackNavigation}
            className="border-n-200 bg-n-50 flex size-9 items-center justify-center rounded-full border"
          >
            <LineArrowLeft1
              primaryColor="var(--color-n-700)"
              className="size-4"
            />
          </Button>
        ) : null}

        {/* Title */}
        <p className="text-n-900 text-base font-normal">{title}</p>
      </div>

      {/* Right header action */}
      {rightIcon ? (
        <Button
          type="button"
          aria-label={rightLabel}
          onClick={onRightIconClick}
          className="text-n-700 h-auto w-auto border-0 bg-transparent p-2 shadow-none hover:bg-transparent active:bg-transparent"
        >
          {rightIcon}
        </Button>
      ) : null}
    </header>
  );
}

