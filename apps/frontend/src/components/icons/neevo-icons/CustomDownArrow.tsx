// TYPES //
import type { IconComponentData } from "@/types/icon";

/**
 * Renders the custom dropdown arrow icon.
 */
const CustomDownArrow: IconComponentData = ({
  primaryColor = "var(--color-n-600, #45556C)",
  secondaryColor,
  tertiaryColor,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <path
      d="M11.6199 5.2207L7.81656 9.02407C7.36739 9.47323 6.63239 9.47323 6.18323 9.02407L2.37988 5.2207"
      stroke={primaryColor}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </svg>
);

export default CustomDownArrow;
