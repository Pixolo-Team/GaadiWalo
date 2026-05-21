// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HierarchyLine6: IconComponentData = ({
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
        id="Vector 2257"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 2.7857142857142856c-6.602142857142858 0 -7.7400328571428565 1.1420314285714286 -9.467825714285715 7.477302857142857C15.162884285714288 11.878954285714286 13.695147142857143 13 12.020190000000001 13H0.9285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector 2258"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 23.214285714285715c-6.602142857142858 0 -7.7400328571428565 -1.141957142857143 -9.467825714285715 -7.477302857142857C15.162884285714288 14.121045714285716 13.695147142857143 13 12.020190000000001 13H0.9285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HierarchyLine6;
