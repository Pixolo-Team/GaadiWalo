// STYLES //
import "./globals.css";

// LIBRARIES //
import { DM_Sans, Sora } from "next/font/google";

// COMPONENTS //
import { Toaster } from "@/components/ui/sonner";

// OTHERS //
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";

// DATA //
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GaadiWalo",
  description: "GaadiWalo Sales CRM",
};

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              duration={2000}
              toastOptions={{
                classNames: {
                  toast: "rounded-2xl text-sm! font-bold! px-5! py-4!",
                  success: "bg-green-100! border-green-500! text-green-600!",
                  info: "bg-n-100! border-n-800! text-n-800!",
                  error: "bg-red-100! border-red-500! text-red-600!",
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
