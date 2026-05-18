"use client";

// REACT //
import type React from "react";

// COMPONENTS //
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpInputPropsData {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

/** OTP Input Component */
export function OtpInput({ value, onChange, length = 6 }: OtpInputPropsData) {
  // Define Navigation

  // Define Context

  // Define Refs

  // Define States

  // Helper Functions
  /** Function to handle OTP value change */
  const handleOtpChange = (updatedOtpValue: string): void => {
    onChange(updatedOtpValue.replace(/\D/g, ""));
  };

  // Use Effects

  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={handleOtpChange}
      inputMode="numeric"
      pattern="[0-9]*"
      containerClassName="mx-auto w-full max-w-[22rem] justify-center"
    >
      <InputOTPGroup className="w-full justify-between gap-2 rounded-none">
        {Array.from({ length }).map((_, otpSlotItem) => (
          <InputOTPSlot
            key={`otp-slot-${otpSlotItem}`}
            index={otpSlotItem}
            className="border-n-200 bg-n-50 text-n-500 size-12 h-[62px] rounded-lg border-2 text-3xl font-semibold first:rounded-lg first:border-2 last:rounded-lg"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
