"use client";

// REACT //
import type React from "react";

// LIBRARIES //
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// COMPONENTS //
import CheckCircle2 from "../icons/neevo-icons/CheckCircle2";
import DeleteCircle from "../icons/neevo-icons/DeleteCircle";

/**
 * Renders the shared toast container with project icon and theme mapping.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  // Define Navigation

  // Define Context
  const { theme = "system" } = useTheme();

  // Define Refs

  // Define States

  // Helper Functions

  // Use Effects

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle2
            primaryColor="var(--color-green-600)"
            className="size-4"
          />
        ),
        info: null,
        warning: null,
        error: (
          <DeleteCircle
            primaryColor="var(--color-red-600)"
            className="size-4"
          />
        ),
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
