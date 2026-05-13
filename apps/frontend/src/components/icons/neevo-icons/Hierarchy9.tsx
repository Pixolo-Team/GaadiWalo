// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Hierarchy9: IconComponentData = ({
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
        d="M9.285714285714286 13H0.9285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.714285714285715 13 8.357142857142858 0"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16.714285714285715c2.3771428571428572 0 3.7142857142857144 -1.3371428571428572 3.7142857142857144 -3.7142857142857144s-1.3371428571428572 -3.7142857142857144 -3.7142857142857144 -3.7142857142857144 -3.7142857142857144 1.3371428571428572 -3.7142857142857144 3.7142857142857144 1.3371428571428572 3.7142857142857144 3.7142857142857144 3.7142857142857144Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Hierarchy9;
