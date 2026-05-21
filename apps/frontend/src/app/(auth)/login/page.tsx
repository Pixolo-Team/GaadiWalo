"use client";

// REACT //
import { useState } from "react";
import { useRouter } from "next/navigation";

// TYPES //
import type { LoginUserFieldInputData, LoginResponseData } from "@/types/auth";
import type { ApiResponseData } from "@/types/api";

// COMPONENTS //
import Image from "next/image";
import Link from "next/link";
import EyeOptic from "@/components/icons/neevo-icons/EyeOptic";
import NoEyes from "@/components/icons/neevo-icons/NoEyes";
import InputBox from "@/components/common/InputBox";
import { Button } from "@/components/ui/button";

// API SERVICES //
import { loginRequest } from "@/services/api/auth.api.service";

// CONSTANTS //
import { CONSTANTS } from "@/constants/constants";
import { ROUTES } from "@/constants/routes";

// OTHERS //
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

/** Login Page Component */
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
  /** Handles login action. */
  const handleLogin = (): void => {
    if (isSubmitting) {
      return;
    }

    if (!userFieldInput.userId.trim() || !userFieldInput.password.trim()) {
      toast.error("Please enter User ID and Password.");
      return;
    }

    // Set submitting state to true
    setIsSubmitting(true);

    /** Make login API request */
    loginRequest(userFieldInput.userId.trim(), userFieldInput.password)
      .then((response: ApiResponseData<LoginResponseData>) => {
        if (response.status_code === 200) {
          setAuthSessionService(
            { token: response.data?.accessToken ?? "" },
            response.data?.user ?? null,
          );

          // Set auth session in local storage for persistence
          window.localStorage.setItem(
            CONSTANTS.REFRESH_TOKEN,
            response.data?.refreshToken ?? "",
          );
          window.localStorage.setItem(
            CONSTANTS.EXPIRES_IN,
            String(response.data?.expiresIn ?? ""),
          );

          // Reset login fields
          setUserFieldInput({ userId: "", password: "" });

          // Show success toast
          toast.success(response.message);

          // Set submitting state to false
          setIsSubmitting(false);

          // Route to Home page
          router.push(ROUTES.home);
        } else {
          // Show error toast
          toast.error(response.error ?? response.message);

          // Reset submitting state
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        // Show error toast
        toast.error("Unable to login. Please try again.");

        // Reset submitting state
        setIsSubmitting(false);
      });
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
                    <NoEyes
                      primaryColor="var(--color-n-400)"
                      className="size-5"
                    />
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
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
