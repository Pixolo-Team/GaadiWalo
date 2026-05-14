"use client";

// REACT //
import { useState } from "react";

// COMPONENTS //
import { Header } from "@/components/common/Header";
import InputBox from "@/components/common/InputBox";
import { Button } from "@/components/ui/button";

/**
 * Renders the change password screen.
 */
export default function ChangePasswordPage() {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Helper Functions
  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 8 &&
    confirmPassword.trim().length > 0;

  const handleChangePassword = (): void => {
    if (!canSubmit) {
      return;
    }
  };

  // Use Effects

  return (
    <section className="h-full bg-n-100">
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
              <InputBox
                label="CURRENT PASSWORD"
                placeholder="Enter current password"
                type="password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <InputBox
                label="NEW PASSWORD"
                placeholder="Min. 8 characters"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />

              <InputBox
                label="CONFIRM NEW PASSWORD"
                placeholder="Re-enter new password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
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
