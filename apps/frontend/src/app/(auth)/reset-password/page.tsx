"use client";

// REACT //
import { useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type { ForgotPasswordResponseData } from "@/types/auth";

// COMPONENTS //
import InputBox from "@/components/common/InputBox";
import { Header } from "@/components/common/Header";
import InformationCircle from "@/components/icons/neevo-icons/InformationCircle";
import { Button } from "@/components/ui/button";

// API SERVICES //
import { forgotPasswordRequest } from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// UTILS //
import { validateRecoveryEmail } from "@/utils/validations";

// OTHERS //
import { toast } from "sonner";

/** Forgot Password Page Component */
export default function ForgotPasswordPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [inputValue, setInputValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  /** Resolves whether send OTP button should be disabled. */
  const isValidEmail = validateRecoveryEmail(inputValue) === null;
  const isSendOtpDisabled = isSubmitting || !isValidEmail;

  /** Handles reset-password submission. */
  const handleResetPassword = (): void => {
    const emailValue = inputValue.trim();
    const isValid = validateRecoveryEmail(emailValue);

    if (!isValid) {
      toast.error("Please enter a valid email address or phone number.");
      return;
    }

    setIsSubmitting(true);

    // Call forgot password API
    forgotPasswordRequest({ email: emailValue })
      .then((response: ApiResponseData<ForgotPasswordResponseData>) => {
        if (response.status_code === 200) {
          // Set recovery email for next step.
          window.localStorage.setItem(
            CONSTANTS.RECOVERY_EMAIL,
            response.data?.email ?? "",
          );

          // Show success toast
          toast.success(response.message);

          // Navigate to OTP verification screen
          router.push(ROUTES.auth.verifyOtp);
        } else {
          // Show error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Show error toast
        toast.error("Unable to process request. Please try again.");
      })
      .finally(() => {
        // Set submitting state to false
        setIsSubmitting(false);
      });
  };

  // Use Effects

  return (
    <section className="bg-n-100 flex flex-1 flex-col">
      {/* Header */}
      <Header title="Reset Password" />

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* Info banner */}
        <div className="flex gap-4 rounded-[14px] border border-blue-200 bg-blue-100 px-4.5 py-4">
          {/* Icon */}
          <InformationCircle
            primaryColor="#155dfc"
            className="mt-0.5 size-5 shrink-0"
          />

          {/* Descriptive text */}
          <p className="font-secondary text-sm leading-normal font-medium text-blue-800">
            Enter your registered email or phone number. We&apos;ll send a reset
            link or OTP to verify your identity.
          </p>
        </div>

        {/* Email/Phone Input */}
        <div className="flex flex-col gap-4.5">
          <InputBox
            id="identifier"
            label="EMAIL OR PHONE"
            type="text"
            placeholder="e.g. rahul@company.com"
            value={inputValue}
            onChange={setInputValue}
          />

          {/* Send OTP Button */}
          <Button
            type="button"
            variant="primary"
            onClick={handleResetPassword}
            disabled={isSendOtpDisabled}
          >
            Send OTP
          </Button>
        </div>
      </div>
    </section>
  );
}
