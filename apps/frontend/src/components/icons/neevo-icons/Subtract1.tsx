// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Subtract1: IconComponentData = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="-1 -1 28 28"
    height={28}
    width={28}
    {...props}
  >
    <g>
      <path
        id="Vector 1180"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 13 0.9285714285714286 13"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Subtract1;
