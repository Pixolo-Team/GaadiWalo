// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Pin1Disabled: IconComponentData = ({
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
        id="Vector 103"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.824355714285714 10.854015714285715 -0.833467142857143 0.05684714285714285c1.3884928571428572 5.442542857142858 5.654888571428572 9.72645142857143 11.100978571428572 11.100922857142859l0.05686571428571429 -0.8334857142857143M8.964540000000001 10.571525714285714l0.9832642857142857 -0.06708c0.23127 -1.61889 0.5550442857142858 -6.105542857142857 2.7752399999999997 -8.325738571428571 4.959982857142857 -4.959964285714285 16.060998571428573 6.141014285714286 11.10094142857143 11.100997142857143 -2.220214285714286 2.220195714285714 -6.706792857142857 2.5439700000000003 -8.325682857142857 2.7752399999999997l-0.06327285714285714 0.92742"
        strokeWidth={2}
      />
      <path
        id="Vector 105"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.9944242857142855 18.009215714285713 0.9286197142857142 25.07495714285714"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9282965714285715 0.9285714285714286C9.220547142857143 11.550685714285715 14.221628571428571 16.494047142857145 25.071428571428573 25.071428571428573"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Pin1Disabled;
