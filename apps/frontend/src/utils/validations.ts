/**
 * Validates recovery email value used in forgot-password flow.
 */
export const validateRecoveryEmail = (
  emailValue: string,
): string | null => {
  const normalizedEmailValue = emailValue.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!normalizedEmailValue) {
    return "Email is required.";
  }

  if (!emailRegex.test(normalizedEmailValue)) {
    return "Please enter a valid email address.";
  }

  return null;
};

/**
 * Validates OTP value for verify-otp flow.
 */
export const validateOtpValue = (otpValue: string): string | null => {
  const otpRegex = /^[0-9]{6}$/;

  if (!otpRegex.test(otpValue)) {
    return "Please enter a valid 6-digit OTP.";
  }

  return null;
};

/**
 * Validates a phone number as an exact 10-digit value.
 */
export const validatePhoneNumberValue = (
  phoneNumberValue: string,
): string | null => {
  const normalizedPhoneNumberValue = phoneNumberValue.trim();
  const phoneNumberRegex = /^[0-9]{10}$/;

  if (!normalizedPhoneNumberValue) {
    return "Phone number is required.";
  }

  if (!phoneNumberRegex.test(normalizedPhoneNumberValue)) {
    return "Please enter a valid 10-digit phone number.";
  }

  return null;
};
