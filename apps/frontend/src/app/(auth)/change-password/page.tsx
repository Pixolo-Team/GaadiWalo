"use client";

// REACT //
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { ApiResponseData } from "@/types/api";
import type {
  ChangePasswordInputData,
  ResetPasswordResponseData,
} from "@/types/auth";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import CheckCircle from "@/components/icons/neevo-icons/CheckCircle";
import Circle from "@/components/icons/neevo-icons/Circle";
import { Button } from "@/components/ui/button";

// API SERVICES //
import { resetPasswordRequest } from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { toast } from "sonner";

interface PasswordValidationStateData {
  hasMinimumLength: boolean;
  hasUppercaseCharacter: boolean;
  hasNumberCharacter: boolean;
}

/** Change Password Page Component */
export default function ChangePasswordPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs

  // Define States
  const [passwordInputField, setPasswordInputField] =
    useState<ChangePasswordInputData>({
      newPassword: "",
      confirmPassword: "",
    });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  /** Returns the password rule validation state. */
  const passwordValidationState = useMemo<PasswordValidationStateData>(() => {
    return {
      hasMinimumLength: passwordInputField.newPassword.length >= 8,
      hasUppercaseCharacter: /[A-Z]/.test(passwordInputField.newPassword),
      hasNumberCharacter: /[0-9]/.test(passwordInputField.newPassword),
    };
  }, [passwordInputField.newPassword]);

  const isPasswordValid =
    passwordValidationState.hasMinimumLength &&
    passwordValidationState.hasUppercaseCharacter &&
    passwordValidationState.hasNumberCharacter;

  const isPasswordMatch =
    passwordInputField.confirmPassword.length > 0 &&
    passwordInputField.confirmPassword === passwordInputField.newPassword;

  /** Handles change password submission. */
  const handleChangePassword = (): void => {
    if (!isPasswordValid || !isPasswordMatch) {
      return;
    }
    // Get reset token from local storage
    const resetToken = window.localStorage.getItem(CONSTANTS.RESET_TOKEN) ?? "";

    if (!resetToken) {
      toast.error("Reset token is missing. Please verify OTP again.");
      return;
    }

    setIsSubmitting(true);

    /** Call reset password API */
    resetPasswordRequest({
      newPassword: passwordInputField.newPassword,
      resetToken,
    })
      .then((response: ApiResponseData<ResetPasswordResponseData>) => {
        if (response.status_code === 200) {
          // Clear recovery state after successful password reset.
          window.localStorage.removeItem(CONSTANTS.RESET_TOKEN);
          window.localStorage.removeItem(CONSTANTS.RECOVERY_EMAIL);

          // Show success toast
          toast.success(response.message);

          // Navigate to login screen for Relogin with the Changed Password.
          router.push(ROUTES.auth.login);
        } else {
          // Show error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Show error toast
        toast.error("Unable to change password. Please try again.");
      })
      .finally(() => {
        // Reset submitting state
        setIsSubmitting(false);
      });
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
      <Header title="Change Password" />

      {/* Content */}
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          {/* New Password Input */}
          <InputBox
            id="new-password"
            label="NEW PASSWORD"
            type="password"
            placeholder="At least 8 characters"
            value={passwordInputField.newPassword}
            onChange={(value) =>
              setPasswordInputField((previousFieldInputItem) => ({
                ...previousFieldInputItem,
                newPassword: value,
              }))
            }
          />

          {/* Confirm Password Input */}
          <InputBox
            id="confirm-password"
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Re-enter new password"
            value={passwordInputField.confirmPassword}
            onChange={(value) =>
              setPasswordInputField((previousFieldInputItem) => ({
                ...previousFieldInputItem,
                confirmPassword: value,
              }))
            }
          />
        </div>

        {/* Password rules */}
        <div className="flex flex-col gap-2">
          <p className="font-secondary text-n-700 text-xs font-medium">
            Password must have:
          </p>

          <div className="flex flex-col gap-1 text-xs font-normal">
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

        {/* Submit */}
        <Button
          type="button"
          variant="primary"
          onClick={handleChangePassword}
          disabled={!isPasswordValid || !isPasswordMatch || isSubmitting}
        >
          Change Password
        </Button>
      </div>
    </section>
  );
}
