// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HierarchyLine5: IconComponentData = ({
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
        d="M0.9285714285714286 13 13 13"
        strokeWidth={2}
      />
      <path
        id="Vector 2257"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m25.071428571428573 2.7857142857142856 -4.709528571428571 0c-0.5465571428571429 0 -1.0673 0.2392 -1.4112428571428572 0.66404C16.738670000000003 6.182075714285714 14.78971 9.308835714285715 13 13c1.6844471428571428 3.8762842857142856 3.788608571428572 6.635571428571429 5.941557142857143 9.475885714285715 0.3521142857142857 0.4646571428571428 0.9012714285714286 0.7384000000000001 1.4842285714285715 0.7384000000000001l4.645642857142858 0"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HierarchyLine5;
