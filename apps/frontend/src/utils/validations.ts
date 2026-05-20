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
