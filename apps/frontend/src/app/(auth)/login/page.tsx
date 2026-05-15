"use client";

// REACT //
import { useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { LoginUserFieldInputData } from "@/types/auth";

// COMPONENTS //
import Image from "next/image";
import Link from "next/link";
import EyeOptic from "@/components/icons/neevo-icons/EyeOptic";
import NoEyes from "@/components/icons/neevo-icons/NoEyes";
import InputBox from "@/components/common/InputBox";
import { Button } from "@/components/ui/button";

// SERVICES //
import { useAuthContext } from "@/context/AuthContext";
import { loginRequest } from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// LIBRARIES //
import { toast } from "sonner";

/**
 * Renders the login screen UI for the auth flow.
 */
export default function LoginPage() {
  // Define Navigation
  const router = useRouter();

  // Define Context
  const { setAuthSessionService } = useAuthContext();

  // Define Refs

  // Define States
  const [userFieldInput, setUserFieldInput] = useState<LoginUserFieldInputData>(
    {
      userId: "",
      password: "",
    },
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper Functions
  /** Resolves whether login button should be disabled. */
  const isLoginDisabled =
    isSubmitting ||
    !userFieldInput.userId.trim() ||
    !userFieldInput.password.trim();

  /** Handles the login action. */
  const handleLogin = async (): Promise<void> => {
    if (isLoginDisabled) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginRequest(
        userFieldInput.userId.trim(),
        userFieldInput.password,
      );

      if (!response.data || response.status_code !== 200) {
        toast.error(response.error ?? response.message);
        return;
      }

      setAuthSessionService(
        { token: response.data.accessToken },
        response.data.user,
      );

      window.localStorage.setItem(
        CONSTANTS.REFRESH_TOKEN,
        response.data.refreshToken ?? "",
      );
      window.localStorage.setItem(
        CONSTANTS.EXPIRES_IN,
        String(response.data.expiresIn ?? ""),
      );

      setUserFieldInput({ userId: "", password: "" });
      toast.success(response.message);
      router.push(ROUTES.home);
    } catch {
      toast.error("Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Toggles the password visibility state. */
  const handlePasswordVisibility = (): void => {
    setIsPasswordVisible(
      (previousVisibilityStateItem) => !previousVisibilityStateItem,
    );
  };

  // Use Effects

  return (
    <section>
      {/* Top hero */}
      <div className="flex items-start justify-center bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-24">
        <Image
          src="/images/brand/brand-logo.png"
          alt="GaadiWalo"
          width={340}
          height={112}
          priority
          className="h-auto w-full max-w-[254px]"
        />
      </div>

      {/* Login content */}
      <div className="flex flex-1 flex-col gap-7 px-6 py-7">
        {/* Top text */}
        <div className="flex flex-col gap-1.5">
          <p className="text-n-800 text-2xl font-bold">Welcome back!</p>
          <p className="font-secondary text-n-600 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Form body */}
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            {/* USER ID */}
            <InputBox
              id="user-identifier"
              label="USER ID"
              type="text"
              placeholder="Enter user ID"
              value={userFieldInput.userId}
              onChange={(value) =>
                setUserFieldInput((previousFieldInputItem) => ({
                  ...previousFieldInputItem,
                  userId: value,
                }))
              }
            />

            {/* PASSWORD */}
            <InputBox
              id="user-password"
              label="PASSWORD"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter password"
              value={userFieldInput.password}
              onChange={(value) =>
                setUserFieldInput((previousFieldInputItem) => ({
                  ...previousFieldInputItem,
                  password: value,
                }))
              }
              iconRight={
                <button
                  type="button"
                  onClick={handlePasswordVisibility}
                  className="flex size-6 items-center justify-center"
                  aria-label="Toggle password visibility"
                >
                  {isPasswordVisible ? (
                    <NoEyes primaryColor="var(--color-n-400)" className="size-5" />
                  ) : (
                    <EyeOptic
                      primaryColor="var(--color-n-400)"
                      className="size-5"
                    />
                  )}
                </button>
              }
            />

            {/* Forgot password link */}
            <Link
              href={ROUTES.auth.resetPassword}
              className="font-secondary self-end text-sm font-medium text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="button"
            variant="primary"
            onClick={handleLogin}
            disabled={isLoginDisabled}
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
