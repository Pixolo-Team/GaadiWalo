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

/**
 * Renders the OTP input component with six slots and grouped focus styling.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputPropsData) {
  const handleOtpChange = (updatedOtpValue: string): void => {
    onChange(updatedOtpValue.replace(/\D/g, ""));
  };

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
            className="size-12 h-[62px] rounded-lg border-2 border-n-200 bg-n-50 text-3xl font-semibold text-n-500 first:rounded-lg first:border-2 last:rounded-lg"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
