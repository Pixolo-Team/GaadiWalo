// REACT //
import type React from "react";

// COMPONENTS //
import { SalesLayoutShell } from "@/components/sales/SalesLayoutShell";

/**
 * Renders the shared sales layout shell.
 */
export default function SalesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen bg-n-100">
      {/* Sales layout shell */}
      <SalesLayoutShell>{children}</SalesLayoutShell>
    </section>
  );
}
