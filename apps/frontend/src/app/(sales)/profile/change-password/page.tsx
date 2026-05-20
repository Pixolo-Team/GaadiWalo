"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import { Button } from "@/components/ui/button";

// SERVICES //
import { changeSalesPasswordRequest } from "@/services/api/sales-profile.api.service";

// TYPES //
import type { ApiResponseData } from "@/types/api";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

interface ChangePasswordInputFiledData {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

/** Change Password Page Component */
export default function ChangePasswordPage() {
  // Define Navigation

  // Define Context
  const { user } = useAuthContext();

  // Define Refs

  // Define States
  const [changePasswordInputFiled, setChangePasswordInputField] =
    useState<ChangePasswordInputFiledData>({
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  /**
   * Updates one change-password input field while keeping other field values unchanged.
   */
  const updateChangePasswordInputFiled = (
    inputFieldKey: keyof ChangePasswordInputFiledData,
    inputFieldValue: string,
  ): void => {
    setChangePasswordInputField((previousStateItem) => ({
      ...previousStateItem,
      [inputFieldKey]: inputFieldValue,
    }));
  };

  // Enable submit only when required fields are filled and password length is valid.
  const canSubmit =
    changePasswordInputFiled.currentPassword.trim().length > 0 &&
    changePasswordInputFiled.newPassword.trim().length >= 8 &&
    changePasswordInputFiled.confirmPassword.trim().length > 0 &&
    !isSubmitting;

  const userCode = user?.userCode ?? user?.userId ?? user?.id ?? "";

  /**
   * Handles the change password action when input validation passes.
   */
  const handleChangePassword = (): void => {
    if (!canSubmit) {
      return;
    }

    if (
      changePasswordInputFiled.newPassword.trim() !==
      changePasswordInputFiled.confirmPassword.trim()
    ) {
      toast.error("New password and confirm password must match.");
      return;
    }

    if (!userCode) {
      toast.error("User code is missing. Please login again.");
      return;
    }

    setIsSubmitting(true);

    /**
     * Call change sales password API.
     */
    changeSalesPasswordRequest(userCode, {
      currentPassword: changePasswordInputFiled.currentPassword.trim(),
      newPassword: changePasswordInputFiled.newPassword.trim(),
    })
      .then((response: ApiResponseData<{ success: boolean }>) => {
        if (response.status_code === 200) {
          // Clear form state
          setChangePasswordInputField({
            confirmPassword: "",
            currentPassword: "",
            newPassword: "",
          });

          // Success toast
          toast.success(response.message);
        } else {
          // Error toast
          toast.error(response.error ?? response.message);
        }
      })
      .catch(() => {
        // Error toast
        toast.error("Unable to change password. Please try again.");
      })
      .finally(() => {
        // Reset submitting state
        setIsSubmitting(false);
      });
  };

  // Use Effects

  return (
    <section className="bg-n-100 h-full">
      {/* Change password page shell */}
      <div className="flex h-full flex-col">
        {/* Header */}
        <Header title="Change Password" />

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {/* Form stack */}
          <div className="flex flex-col gap-6">
            {/* Input fields */}
            <div className="flex flex-col gap-4">
              {/* Current password input */}
              <InputBox
                label="CURRENT PASSWORD"
                placeholder="Enter current password"
                type="password"
                value={changePasswordInputFiled.currentPassword}
                onChange={(currentPasswordValue: string) =>
                  updateChangePasswordInputFiled(
                    "currentPassword",
                    currentPasswordValue,
                  )
                }
              />

              {/* New password input */}
              <InputBox
                label="NEW PASSWORD"
                placeholder="Min. 8 characters"
                type="password"
                value={changePasswordInputFiled.newPassword}
                onChange={(newPasswordValue: string) =>
                  updateChangePasswordInputFiled(
                    "newPassword",
                    newPasswordValue,
                  )
                }
              />

              {/* Confirm new password input */}
              <InputBox
                label="CONFIRM NEW PASSWORD"
                placeholder="Re-enter new password"
                type="password"
                value={changePasswordInputFiled.confirmPassword}
                onChange={(confirmPasswordValue: string) =>
                  updateChangePasswordInputFiled(
                    "confirmPassword",
                    confirmPasswordValue,
                  )
                }
              />
            </div>

            {/* Submit button */}
            <Button
              type="button"
              variant="primary"
              disabled={!canSubmit}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
