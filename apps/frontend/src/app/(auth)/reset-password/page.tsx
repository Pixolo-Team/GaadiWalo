"use client";

// REACT //
import { useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import InputBox from "@/components/common/InputBox";
import { Header } from "@/components/common/Header";
import InformationCircle from "@/components/icons/neevo-icons/InformationCircle";
import { Button } from "@/components/ui/button";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// LIBRARIES //

/** Reset Password Page Component */
export default function ForgotPasswordPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [emailInput, setEmailInput] = useState<string>("");

  // Helper Functions
  /** Handles the reset password action */
  const handleResetPassword = (): void => {
    router.push(ROUTES.auth.verifyOtp);
  };

  // Use Effects

  return (
    <section className="bg-n-100 flex flex-1 flex-col">
      {/* Header  */}
      <Header title="Reset Password" />

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* Information banner */}
        <div className="flex gap-4 rounded-[14px] border border-blue-200 bg-blue-100 px-4.5 py-4">
          {/* Icon */}
          <InformationCircle
            primaryColor="#155dfc"
            className="mt-0.5 size-5 shrink-0"
          />

          {/* Text */}
          <p className="font-secondary text-sm leading-normal font-medium text-blue-800">
            Enter your registered email or phone number. We&apos;ll send a reset
            link or OTP to verify your identity.
          </p>
        </div>

        {/* Reset form content */}
        <div className="flex flex-col gap-4.5">
          {/* Email or phone input */}
          <InputBox
            id="identifier"
            label="EMAIL OR PHONE"
            type="text"
            placeholder="e.g. rahul@company.com"
            value={emailInput}
            onChange={setEmailInput}
          />

          {/* Send OTP button */}
          <Button type="button" variant="primary" onClick={handleResetPassword}>
            Send OTP
          </Button>
        </div>
      </div>
    </section>
  );
}
