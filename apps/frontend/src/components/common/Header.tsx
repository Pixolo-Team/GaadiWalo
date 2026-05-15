"use client";

// REACT //
import { useRouter } from "next/navigation";

// COMPONENTS //
import LineArrowLeft1 from "@/components/icons/neevo-icons/LineArrowLeft1";
import { Button } from "@/components/ui/button";

// Interface
interface HeaderPropsData {
  showBack?: boolean;
  title: string;
}

/** Header Component */
export function Header({ showBack = true, title }: HeaderPropsData) {
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
    <header className="border-n-200 bg-n-50 flex items-center gap-3.5 border-b px-5 py-4">
      {/* Back Button  */}
      {showBack ? (
        <Button
          type="button"
          aria-label="Go back"
          onClick={handleBackNavigation}
          className="border-n-200 bg-n-50 flex size-9 items-center justify-center rounded-full border"
        >
          {/* Left Arrow Icon */}
          <LineArrowLeft1
            primaryColor="var(--color-n-700)"
            className="size-4"
          />
        </Button>
      ) : null}

      {/* Title */}
      <p className="text-n-900 text-base font-normal">{title}</p>
    </header>
  );
}
