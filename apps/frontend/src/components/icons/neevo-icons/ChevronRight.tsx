// REACT //
import React from "react";

// TYPES //
import { IconComponentPropsData } from "@/types/icon";

const ChevronRight = ({
  primaryColor = "currentColor",
  ...props
}: IconComponentPropsData) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="7"
    height="11"
    viewBox="0 0 7 11"
    fill="none"
    {...props}
  >
    <path
      d="M1 10L5 5.5L1 1"
      stroke={primaryColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default ChevronRight;
