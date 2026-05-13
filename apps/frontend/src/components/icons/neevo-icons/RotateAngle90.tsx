// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const RotateAngle90: IconComponentData = ({
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
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.607142857142858 24.607142857142858H5.107142857142858c-2.051344285714286 0 -3.7142857142857144 -1.6628857142857143 -3.7142857142857144 -3.7142857142857144V1.3928571428571428"
        strokeWidth={2}
      />
      <path
        id="Intersect_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.3928571428571428 12.587398571428572v8.202015714285714c0 2.0657 1.6468585714285713 3.7477142857142853 3.7037928571428576 3.7681428571428572l9.715178571428572 0.04921428571428572C13.966828571428572 17.885678571428574 8.294538571428571 12.674851428571428 1.3928571428571428 12.587398571428572Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default RotateAngle90;
