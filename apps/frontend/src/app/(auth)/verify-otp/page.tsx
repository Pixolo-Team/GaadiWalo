"use client";

// REACT //
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  ResendOtpResponseData,
  VerifyOtpResponseData,
} from "@/types/auth";

// COMPONENTS //
import { OtpInput } from "@/components/auth/OtpInput";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";

// API SERVICES //
import {
  resendOtpRequest,
  verifyOtpRequest,
} from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// UTILS //
import { validateOtpValue } from "@/utils/validations";

// OTHERS //
import { toast } from "sonner";

// LIBRARIES //

const RESEND_SECONDS_COUNT = 45;

/** Verify OTP Page Component */
export default function VerifyOtpPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [otpValue, setOtpValue] = useState<string>("");
  const [resendSecondsCount, setResendSecondsCount] =
    useState<number>(RESEND_SECONDS_COUNT);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");

  // Helper Functions
  /** Handles OTP verification and moves user to change password screen. */
  const handleVerifyOtp = (): void => {
    const validationMessage = validateOtpValue(otpValue);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    if (!recoveryEmail) {
      toast.error("Recovery email is missing. Please restart reset flow.");
      return;
    }

    setIsSubmitting(true);

    /** Call verify OTP API */
    verifyOtpRequest({
      email: recoveryEmail,
      otp: otpValue,
    })
      .then((response: ApiResponseData<VerifyOtpResponseData>) => {
        if (response.status_code === 200) {
          // Set reset token in local storage for next step.
          window.localStorage.setItem(
            CONSTANTS.RESET_TOKEN,
            response.data?.resetToken ?? "",
          );

          // Show success toast
          toast.success(response.message);

          // Navigate to change password screen
          router.push(ROUTES.auth.changePassword);
        } else {
          // Show  error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Show error toast
        toast.error("Unable to verify OTP. Please try again.");
      })
      .finally(() => {
        // Set submitting state to false
        setIsSubmitting(false);
      });
  };

  /** Handles OTP resend trigger after cooldown period. */
  const handleResendOtp = (): void => {
    if (resendSecondsCount > 0) {
      return;
    }

    if (!recoveryEmail) {
      toast.error("Recovery email is not set. Please try again.");
      return;
    }

    setIsResending(true);

    /** Call resend OTP API */
    resendOtpRequest({ email: recoveryEmail })
      .then((response: ApiResponseData<ResendOtpResponseData>) => {
        if (response.status_code === 200) {
          // Reset resend cooldown on success.
          setResendSecondsCount(RESEND_SECONDS_COUNT);

          // Show success toast
          toast.success(response.message);
        } else {
          // Show error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Show error toast
        toast.error("Unable to resend OTP. Please try again.");
      })
      .finally(() => {
        // Set resending state to false
        setIsResending(false);
      });
  };

  // Use Effects
  useEffect(() => {
    // Read recovery email only on client.
    const storedRecoveryEmail =
      window.localStorage.getItem(CONSTANTS.RECOVERY_EMAIL) ?? "";
    setRecoveryEmail(storedRecoveryEmail);
  }, []);

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

          {/* Descriptive text */}
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
          <div className="flex flex-col gap-4">
            {/* Verify OTP Button */}
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

              {/* Resend OTP Button */}
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
