"use client";

// REACT //
import type { ReactNode } from "react";

// LIBRARIES //
import Link from "next/link";

// COMPONENTS //
import CustomDownArrow from "@/components/icons/neevo-icons/CustomDownArrow";

// TYPES //
interface ProfileMenuItemPropsData {
  iconBackgroundColor:
    | "bg-amber-100"
    | "bg-blue-100"
    | "bg-green-100"
    | "bg-purple-100"
    | "bg-red-100";
  href?: string;
  iconNode: ReactNode;
  label: string;
  onClick?: () => void;
}

/** Profile Menu Item Component*/
export default function ProfileMenuItem({
  iconBackgroundColor,
  href,
  iconNode,
  label,
  onClick,
}: ProfileMenuItemPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions

  const contentNode = (
    <>
      {/* Menu icon */}
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${iconBackgroundColor}`}
      >
        {iconNode}
      </span>

      {/* Menu label */}
      <span className="font-secondary text-n-800 flex-1 text-[0.9375rem]">
        {label}
      </span>

      {/* Menu chevron */}
      <span className="flex size-5 items-center justify-center">
        <CustomDownArrow
          primaryColor="var(--color-n-400)"
          className="size-4 -rotate-90"
        />
      </span>
    </>
  );

  // Use Effects

  if (href) {
    return (
      <Link
        href={href}
        className="bg-n-50 flex items-center gap-3.5 rounded-xl px-5 py-[15px]"
      >
        {contentNode}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-n-50 flex w-full items-center gap-3.5 rounded-xl px-5 py-[15px] text-left"
    >
      {contentNode}
    </button>
  );
}
