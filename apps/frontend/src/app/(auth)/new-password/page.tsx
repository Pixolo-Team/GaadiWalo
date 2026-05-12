"use client";

// REACT //
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import CheckCircle from "@/components/icons/neevo-icons/CheckCircle";
import Circle from "@/components/icons/neevo-icons/Circle";
import { Button } from "@/components/ui/button";

// CONSTANTS //
import { ROUTES } from "@/constants/routes";

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

  /** Handles setting a new password */
  const handleNewPassword = (): void => {
    if (!isPasswordValid || !isPasswordMatch) {
      return;
    }

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
    <section className="flex flex-1 flex-col bg-n-100">
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
          <p className="font-secondary text-xs font-medium text-n-700">
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

        {/* Set password button */}
        <Button type="button" variant="primary" onClick={handleNewPassword}>
          Set New Password
        </Button>
      </div>
    </section>
  );
}
