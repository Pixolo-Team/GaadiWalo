"use client";

// COMPONENTS //
import MagnifyingGlass from "@/components/icons/neevo-icons/MagnifyingGlass";
import { Input } from "@/components/ui/input";

// UTILS //
import { cn } from "@/lib/utils";

interface SearchInputPropsData {
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

/**
 * Renders a reusable search input with leading search icon.
 */
export function SearchInput({
  className,
  onChange,
  placeholder = "Search",
  value,
}: SearchInputPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <div
      className={cn(
        "border-n-200 bg-n-50 flex items-center gap-3 rounded-[30px] border-2 px-4 py-3.5",
        className,
      )}
    >
      {/* Search icon */}
      <MagnifyingGlass primaryColor="var(--color-n-400)" className="size-5" />

      {/* Search input */}
      <Input
        type="search"
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="font-secondary text-n-800 placeholder:text-n-400 h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
