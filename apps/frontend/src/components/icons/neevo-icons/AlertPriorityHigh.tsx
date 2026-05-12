// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AlertPriorityHigh: IconComponentData = ({
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
        d="m6.460331428571429 0.9285714285714286 0 18.466314285714287"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12.963507142857143 0.9285714285714286 0 18.466314285714287"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.466757142857144 0.9285714285714286 0 18.466314285714287"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.460331428571429 24.095685714285715 0 0.9285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_5"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12.963507142857143 24.095685714285715 0 0.9285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_6"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.466757142857144 24.095685714285715 0 0.9285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AlertPriorityHigh;
