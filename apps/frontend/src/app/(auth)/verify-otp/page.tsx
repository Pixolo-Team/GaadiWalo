"use client";

// REACT //
import { useEffect, useState } from "react";

// LIBRARIES //
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// COMPONENTS //
import { OtpInput } from "@/components/auth/OtpInput";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";

// SERVICES //
import {
  resendOtpRequest,
  verifyOtpRequest,
} from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// UTILS //
import { validateOtpValue } from "@/utils/validations";

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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [recoveryEmail] = useState<string>(() => {
    return window.localStorage.getItem(CONSTANTS.RECOVERY_EMAIL) ?? "";
  });

  // Helper Functions
  /** Handles OTP verification and moves user to change password screen. */
  const handleVerifyOtp = async (): Promise<void> => {
    const validationMessage = validateOtpValue(otpValue);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      toast.error(validationMessage);
      return;
    }

    if (!recoveryEmail) {
      setErrorMessage("Recovery email is missing. Please restart reset flow.");
      toast.error("Recovery email is missing. Please restart reset flow.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await verifyOtpRequest({
        email: recoveryEmail,
        otp: otpValue,
      });

      if (!response.data || response.status_code !== 200) {
        setErrorMessage(response.message);
        toast.error(response.error ?? response.message);
        return;
      }

      window.localStorage.setItem(CONSTANTS.RESET_TOKEN, response.data.resetToken);
      toast.success(response.message);
      router.push(ROUTES.auth.changePassword);
    } catch {
      const fallbackErrorMessage = "Unable to verify OTP. Please try again.";
      setErrorMessage(fallbackErrorMessage);
      toast.error(fallbackErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handles OTP resend trigger after cooldown period. */
  const handleResendOtp = async (): Promise<void> => {
    if (resendSecondsCount > 0) {
      return;
    }

    if (!recoveryEmail) {
      setErrorMessage("Recovery email is missing. Please restart reset flow.");
      toast.error("Recovery email is missing. Please restart reset flow.");
      return;
    }

    setIsResending(true);
    setErrorMessage("");

    try {
      const response = await resendOtpRequest({ email: recoveryEmail });

      if (response.status_code !== 200) {
        setErrorMessage(response.message);
        toast.error(response.error ?? response.message);
        return;
      }

      setResendSecondsCount(RESEND_SECONDS_COUNT);
      toast.success(response.message);
    } catch {
      const fallbackErrorMessage = "Unable to resend OTP. Please try again.";
      setErrorMessage(fallbackErrorMessage);
      toast.error(fallbackErrorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Use Effects
  useEffect(() => {
    if (resendSecondsCount <= 0) {
      return;
    }

    // Countdown timer for resend action cooldown.
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

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* OTP info card */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center p-3 text-3xl">
            📱
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-n-800 text-lg font-semibold">OTP Sent!</p>
            <p className="font-secondary text-n-600 font-regular w-[90%] text-sm">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-bold">
                {recoveryEmail || "example@gmail.com"}
              </span>
            </p>
          </div>
        </div>

        {/* OTP field */}
        <OtpInput value={otpValue} onChange={setOtpValue} />

        {/* Actions */}
        <div className="flex flex-col gap-6">
          {errorMessage ? (
            <p className="font-secondary text-center text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="primary"
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
            >
              Verify OTP
            </Button>

            <div className="text-center text-sm">
              <span className="font-secondary text-n-600">
                Didn&apos;t receive?{" "}
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-secondary text-blue-600 disabled:opacity-50"
              >
                {resendSecondsCount > 0
                  ? `Resend in 0:${String(resendSecondsCount).padStart(2, "0")}`
                  : isResending
                    ? "Sending..."
                    : "Resend now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
