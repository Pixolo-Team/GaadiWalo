// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HierarchyLine3: IconComponentData = ({
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
        d="M25.071428571428573 23.214285714285715C20.716614285714286 20.103757142857145 16.398367142857143 17.210997142857142 13 13c3.59619 -3.99373 7.538514285714285 -7.326725714285715 12.071428571428571 -10.214285714285715"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HierarchyLine3;
