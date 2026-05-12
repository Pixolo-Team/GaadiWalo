// REACT //
import type React from "react";

/**
 * Renders the shared authentication layout for all auth screens.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-n-100">
      <div className="mx-auto flex min-h-screen w-full flex-col bg-n-50">
        {children}
      </div>
    </div>
  );
}
