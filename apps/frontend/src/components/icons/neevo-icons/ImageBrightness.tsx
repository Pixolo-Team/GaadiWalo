// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ImageBrightness: IconComponentData = ({
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
        id="Vector 1325"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.562634285714287 17.748491428571427h4.5065800000000005"
        strokeWidth={2}
      />
      <path
        id="Vector 1326"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.8718 8.091218571428572h4.506654285714286"
        strokeWidth={2}
      />
      <path
        id="Vector 1327"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.124310000000001 5.837352857142857 0 4.506672857142857"
        strokeWidth={2}
      />
      <path
        id="Vector 2012"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.187634285714286 21.880857142857142c7.660807142857143 -5.8019557142857145 11.596278571428572 -9.37467142857143 17.758965714285715 -17.758965714285715"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ImageBrightness;
