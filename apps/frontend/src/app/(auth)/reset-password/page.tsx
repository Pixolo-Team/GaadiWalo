"use client";

// REACT //
import { useState } from "react";

// LIBRARIES //
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// COMPONENTS //
import InputBox from "@/components/common/InputBox";
import { Header } from "@/components/common/Header";
import InformationCircle from "@/components/icons/neevo-icons/InformationCircle";
import { Button } from "@/components/ui/button";

// SERVICES //
import { forgotPasswordRequest } from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

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

  /** Handles reset-password submission. */
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
      const response = await forgotPasswordRequest({ email: emailValue });

      if (!response.data || response.status_code !== 200) {
        setErrorMessage(response.message);
        toast.error(response.error ?? response.message);
        return;
      }

      window.localStorage.setItem(CONSTANTS.RECOVERY_EMAIL, response.data.email);
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
      {/* Header */}
      <Header title="Reset Password" />

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* Info banner */}
        <div className="flex gap-4 rounded-[14px] border border-blue-200 bg-blue-100 px-4.5 py-4">
          <InformationCircle
            primaryColor="#155dfc"
            className="mt-0.5 size-5 shrink-0"
          />
          <p className="font-secondary text-sm leading-normal font-medium text-blue-800">
            Enter your registered email or phone number. We&apos;ll send a reset
            link or OTP to verify your identity.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4.5">
          <InputBox
            id="identifier"
            label="EMAIL OR PHONE"
            type="text"
            placeholder="e.g. rahul@company.com"
            value={inputValue}
            onChange={setInputValue}
          />

          {errorMessage ? (
            <p className="font-secondary text-sm text-red-600">{errorMessage}</p>
          ) : null}

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
