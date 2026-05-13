// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HierarchyLine1: IconComponentData = ({
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
        id="Vector 2256"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m0.9285714285714286 13 11.391324285714287 0"
        strokeWidth={2}
      />
      <path
        id="Vector 2257"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.07124285714286 23.214285714285715H18.571168571428572c-8.335024285714285 0 -8.335024285714285 -20.42857142857143 0 -20.42857142857143l6.500074285714286 0"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HierarchyLine1;
