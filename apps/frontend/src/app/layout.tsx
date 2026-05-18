// STYLES //
import "./globals.css";

// COMPONENTS //
import { DM_Sans, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

// OTHERS //
import { AuthProvider } from "@/context/AuthContext";

// DATA //
import type { Metadata } from "next";

const soraFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const dmSansFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GaadiWalo",
  description: "GaadiWalo Sales CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${soraFont.variable} ${dmSansFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
      </body>
    </html>
  );
}
