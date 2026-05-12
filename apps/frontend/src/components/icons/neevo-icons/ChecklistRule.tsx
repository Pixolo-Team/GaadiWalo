// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ChecklistRule: IconComponentData = ({
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
        d="M16.714285714285715 6.151785714285714 19.753314285714286 9.285714285714286c1.4300000000000002 -4.107832857142857 2.6209857142857143 -5.910394285714285 5.318114285714286 -8.357142857142858"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071614285714286 16.714582857142858 16.714768571428575 25.071428571428573M16.71473142857143 16.714285714285715l8.356882857142857 8.356771428571427"
        strokeWidth={2}
      />
      <path
        id="Vector 185"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 5.919642857142858h10.446428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector 187"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 20.892857142857142h10.446428571428571"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ChecklistRule;
