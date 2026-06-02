"use client";

// REACT //
import type { ReactNode } from "react";

// COMPONENTS //
import Link from "next/link";

// LIBRARIES //
import { motion } from "motion/react";

// UTILS //
import { pressTap } from "@/lib/animations";

// Motion-enabled Next.js link so each tab gets tactile press feedback.
const MotionLink = motion.create(Link);

interface TabPropsData {
  className?: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  isFloating?: boolean;
  label: string;
}

/** Tab Component */
export function Tab({
  className,
  href,
  icon,
  isActive = false,
  isFloating = false,
  label,
}: TabPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <MotionLink
      href={href}
      whileTap={pressTap}
      className={`${isFloating ? "text-n-500 relative z-50 -mt-12 flex w-14 shrink-0 flex-col items-center gap-1" : `flex min-w-0 flex-1 flex-col items-center gap-1 ${isActive ? "text-blue-600" : "text-n-500"}`} ${className ?? ""}`}
    >
      {icon}
      <span
        className={`font-secondary text-[10px] ${isActive ? "font-bold" : "font-semibold"}`}
      >
        {label}
      </span>
    </MotionLink>
  );
}
