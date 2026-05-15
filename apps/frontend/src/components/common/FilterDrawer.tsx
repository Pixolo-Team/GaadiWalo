"use client";

// REACT //
import type { ReactNode } from "react";

// COMPONENTS //
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface FilterDrawerPropsData {
  children?: ReactNode;
  description?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
}

/**
 * Renders a reusable bottom drawer shell for filter screens.
 */
export default function FilterDrawer({
  children,
  description,
  isOpen,
  onOpenChange,
  title = "Filters",
}: Readonly<FilterDrawerPropsData>) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      {/* Drawer content */}
      <DrawerContent className="bg-n-50 mx-auto max-h-[85vh] w-full max-w-md rounded-t-[28px] border-0">
        {/* Drawer header */}
        <DrawerHeader className="px-5 pt-5 pb-0 text-left">
          {/* Drawer title */}
          <DrawerTitle className="text-n-800 text-left text-base font-semibold">
            {title}
          </DrawerTitle>

          {/* Drawer description */}
          <DrawerDescription
            className={description ? "text-n-500 text-left text-xs" : "sr-only"}
          >
            {description ?? "Filter options panel"}
          </DrawerDescription>
        </DrawerHeader>

        {/* Drawer body */}
        <div className="overflow-y-auto px-5 pt-4 pb-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
