// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AlertPriorityMedium: IconComponentData = ({
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
        d="m9.711910000000001 0.9285714285714286 0 18.466314285714287"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.215085714285713 0.9285714285714286 0 18.466314285714287"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.711910000000001 24.095685714285715 0 0.9285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.215085714285713 24.095685714285715 0 0.9285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AlertPriorityMedium;
