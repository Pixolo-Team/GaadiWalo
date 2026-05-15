// REACT //
import type React from "react";

/** Auth Layout Component */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-n-100 min-h-screen">
      <div className="bg-n-50 mx-auto flex min-h-screen w-full flex-col">
        {children}
      </div>
    </div>
  );
}
