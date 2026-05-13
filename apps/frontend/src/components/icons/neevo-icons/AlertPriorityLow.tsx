// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AlertPriorityLow: IconComponentData = ({
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
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12.963507142857143 0.9285714285714286 0 18.466314285714287"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12.963507142857143 24.095685714285715 0 0.9285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AlertPriorityLow;
