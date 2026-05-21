// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const BlockDoNotDisturbOff: IconComponentData = ({
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
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.590585714285716 22.258042857142858C23.863914285714287 20.20552857142857 25.071428571428573 17.072287142857142 25.071428571428573 13 25.071428571428573 5.274285714285714 20.725714285714286 0.9285714285714286 13 0.9285714285714286c-3.9715000000000003 0 -7.049807142857143 1.1484014285714286 -9.103714285714286 3.3140157142857145M17.053734285714285 24.60157142857143C15.830527142857143 24.91264285714286 14.477041428571429 25.071428571428573 13 25.071428571428573 5.274285714285714 25.071428571428573 0.9285714285714286 20.725714285714286 0.9285714285714286 13c0 -1.4770414285714286 0.15884142857142858 -2.830527142857143 0.4697791428571429 -4.053734285714286"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.375 13 17.642857142857142 13"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285695714285715 0.9285714285714286C9.433431428571428 11.823054285714285 13.943428571428571 16.27408714285714 25.071428571428573 25.071428571428573"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default BlockDoNotDisturbOff;
