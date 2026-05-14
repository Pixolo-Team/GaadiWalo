"use client";

// REACT //
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import CheckCircle from "@/components/icons/neevo-icons/CheckCircle";
import Circle from "@/components/icons/neevo-icons/Circle";
import { Button } from "@/components/ui/button";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { resetPasswordRequest } from "@/services/api/auth.api.service";

interface PasswordValidationStateData {
  hasMinimumLength: boolean;
  hasUppercaseCharacter: boolean;
  hasNumberCharacter: boolean;
}

/**
 * Renders the new password setup screen UI with live password rule checks.
 */
export default function NewPasswordPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [newPasswordValue, setNewPasswordValue] = useState<string>("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  // Password rule validation state
  const passwordValidationState = useMemo<PasswordValidationStateData>(() => {
    return {
      hasMinimumLength: newPasswordValue.length >= 8,
      hasUppercaseCharacter: /[A-Z]/.test(newPasswordValue),
      hasNumberCharacter: /[0-9]/.test(newPasswordValue),
    };
  }, [newPasswordValue]);

  // Aggregate password validity flags
  const isPasswordValid =
    passwordValidationState.hasMinimumLength &&
    passwordValidationState.hasUppercaseCharacter &&
    passwordValidationState.hasNumberCharacter;

  const isPasswordMatch =
    confirmPasswordValue.length > 0 &&
    confirmPasswordValue === newPasswordValue;

  /** Validates password fields before reset API call. */
  const validatePasswordFields = (): string | null => {
    if (!newPasswordValue.trim()) {
      return "New password is required.";
    }

    if (!confirmPasswordValue.trim()) {
      return "Confirm password is required.";
    }

    if (!isPasswordValid) {
      return "Password does not meet required rules.";
    }

    if (!isPasswordMatch) {
      return "Passwords do not match.";
    }

    return null;
  };

  /** Handles setting a new password */
  const handleNewPassword = async (): Promise<void> => {
    const validationMessage = validatePasswordFields();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      toast.error(validationMessage);
      return;
    }

    const resetToken = window.localStorage.getItem(CONSTANTS.RESET_TOKEN) ?? "";

    if (!resetToken) {
      setErrorMessage("Reset token is missing. Please verify OTP again.");
      toast.error("Reset token is missing. Please verify OTP again.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const response = await resetPasswordRequest({
      newPassword: newPasswordValue,
      resetToken,
    });

    if (!response.data || response.status_code !== 200) {
      setErrorMessage(response.message);
      toast.error(response.error ?? response.message);
      setIsSubmitting(false);
      return;
    }

    window.localStorage.removeItem(CONSTANTS.RESET_TOKEN);
    window.localStorage.removeItem(CONSTANTS.RECOVERY_EMAIL);

    setIsSubmitting(false);
    toast.success(response.message);

    // Redirect to login after password is successfully updated
    router.push(ROUTES.auth.login);
  };

  /** Returns the icon based on whether a password rule is satisfied. */
  const getRuleIcon = (isRulePassed: boolean) => {
    if (isRulePassed) {
      return (
        <CheckCircle primaryColor="var(--color-green-600)" className="size-4" />
      );
    }

    return <Circle primaryColor="var(--color-n-500)" className="size-4" />;
  };

  // Use Effects

  return (
    <section className="bg-n-100 flex flex-1 flex-col">
      {/* Header */}
      <Header title="New Password" />

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* Password form content */}
        <div className="flex flex-col gap-4">
          {/* New password input */}
          <InputBox
            id="new-password"
            label="NEW PASSWORD"
            type="password"
            placeholder="At least 8 characters"
            value={newPasswordValue}
            onChange={setNewPasswordValue}
          />

          {/* Confirm password input */}
          <InputBox
            id="confirm-password"
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPasswordValue}
            onChange={setConfirmPasswordValue}
          />
        </div>

        {/* Password rules */}
        <div className="flex flex-col gap-2">
          {/* Password rules title */}
          <p className="font-secondary text-n-700 text-xs font-medium">
            Password must have:
          </p>

          {/* Password rules list */}
          <div className="flex flex-col gap-1 text-xs font-normal">
            {/* Rule: minimum length */}
            <div
              className={`flex items-center gap-2 ${
                passwordValidationState.hasMinimumLength
                  ? "text-green-600"
                  : "text-n-500"
              }`}
            >
              {getRuleIcon(passwordValidationState.hasMinimumLength)}
              <span className="font-secondary">Minimum 8 characters</span>
            </div>

            {/* Rule: uppercase letter */}
            <div
              className={`flex items-center gap-2 ${
                passwordValidationState.hasUppercaseCharacter
                  ? "text-green-600"
                  : "text-n-500"
              }`}
            >
              {getRuleIcon(passwordValidationState.hasUppercaseCharacter)}
              <span className="font-secondary">One uppercase letter</span>
            </div>

            {/* Rule: number */}
            <div
              className={`flex items-center gap-2 ${
                passwordValidationState.hasNumberCharacter
                  ? "text-green-600"
                  : "text-n-500"
              }`}
            >
              {getRuleIcon(passwordValidationState.hasNumberCharacter)}
              <span className="font-secondary">One number</span>
            </div>
          </div>
        </div>

        {/* API error message */}
        {errorMessage ? (
          <p className="font-secondary text-sm text-red-600">{errorMessage}</p>
        ) : null}

        {/* Set password button */}
        <Button
          type="button"
          variant="primary"
          onClick={handleNewPassword}
          disabled={isSubmitting}
        >
          Set New Password
        </Button>
      </div>
    </section>
  );
}
