"use client";

// REACT //
import { useEffect, useState } from "react";

// LIBRARIES //
import { useRouter } from "next/navigation";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

// COMPONENTS //
import { OtpInput } from "@/components/auth/OtpInput";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";

const RESEND_SECONDS_COUNT = 45;

/**
 * Renders the OTP verification screen UI with countdown and resend state.
 */
export default function VerifyOtpPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [otpValue, setOtpValue] = useState<string>("");
  const [resendSecondsCount, setResendSecondsCount] =
    useState<number>(RESEND_SECONDS_COUNT);

  // Helper Functions
  // Verify action handler
  /** Handles OTP verification and moves user to new password screen. */
  const handleVerifyOtp = (): void => {
    if (otpValue.length < 6) {
      return;
    }

    // Redirect to new password screen after OTP verification
    router.push(ROUTES.auth.newPassword);
  };

  // Resend OTP handler
  /** Handles OTP resend trigger after cooldown period. */
  const handleResendOtp = (): void => {
    if (resendSecondsCount > 0) {
      return;
    }

    setResendSecondsCount(RESEND_SECONDS_COUNT);
  };

  // Use Effects
  useEffect(() => {
    if (resendSecondsCount <= 0) {
      return;
    }

    // Countdown timer for resend action cooldown
    const timerId = window.setTimeout(() => {
      setResendSecondsCount(
        (previousSecondCountItem) => previousSecondCountItem - 1,
      );
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [resendSecondsCount]);

  return (
    <section className="bg-n-100 flex flex-1 flex-col">
      {/* Header */}
      <Header title="Verify OTP" />

      {/* Screen content container */}
      <div className="flex flex-col gap-6 p-6">
        {/* OTP info card */}
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center p-3 text-3xl">
            📱
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* Title */}
            <p className="text-n-800 text-lg font-semibold">OTP Sent!</p>

            {/* Description */}
            <p className="font-secondary text-n-600 font-regular w-[90%] text-sm">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-bold">example@gmail.com</span>
            </p>
          </div>
        </div>

        {/* OTP input */}
        <OtpInput value={otpValue} onChange={setOtpValue} />

        {/* OTP form content */}
        <div className="flex flex-col gap-6">
          {/* Actions */}
          <div className="flex flex-col gap-4">
            {/* Verify OTP button */}
            <Button type="button" variant="primary" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>

            {/* Resend action */}
            <div className="text-center text-sm">
              <span className="font-secondary text-n-600">
                Didn&apos;t receive?{" "}
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-secondary text-blue-600"
              >
                {resendSecondsCount > 0
                  ? `Resend in 0:${String(resendSecondsCount).padStart(2, "0")}`
                  : "Resend now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
