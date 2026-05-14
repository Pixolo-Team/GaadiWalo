"use client";

// REACT //
import { useState } from "react";

// LIBRARIES //
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";
import { AUTH_STORAGE_KEYS } from "@/constants/constants";

// COMPONENTS //
import InputBox from "@/components/common/InputBox";
import { Header } from "@/components/common/Header";
import InformationCircle from "@/components/icons/neevo-icons/InformationCircle";
import { Button } from "@/components/ui/button";

// SERVICES //
import { forgotPasswordRequest } from "@/services/api/auth.api.service";

// UTILS //
import { validateRecoveryEmail } from "@/utils/validations";

/**
 * Renders the reset password request screen UI.
 */
export default function ForgotPasswordPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  /** Resolves whether send OTP button should be disabled. */
  const isValidEmail = validateRecoveryEmail(inputValue) === null;
  const isSendOtpDisabled = isSubmitting || !isValidEmail;

  /** Handles the reset password action */
  const handleResetPassword = async (): Promise<void> => {
    const emailValue = inputValue.trim();
    const validationMessage = validateRecoveryEmail(emailValue);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      toast.error(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await forgotPasswordRequest({
        email: emailValue,
      });

      if (!response.data || response.status_code !== 200) {
        setErrorMessage(response.message);
        toast.error(response.error ?? response.message);
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          AUTH_STORAGE_KEYS.recoveryEmail,
          response.data.email,
        );
      }

      toast.success(response.message);
      router.push(ROUTES.auth.verifyOtp);
    } catch {
      const fallbackErrorMessage = "Unable to process request. Please try again.";
      setErrorMessage(fallbackErrorMessage);
      toast.error(fallbackErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            value={inputValue}
            onChange={setInputValue}
          />

          {/* API error message */}
          {errorMessage ? (
            <p className="font-secondary text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          {/* Send OTP button */}
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
