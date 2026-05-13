// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AlertCirclePriorityMedium: IconComponentData = ({
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
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.389191428571428 7.892857142857143v5.571428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.389191428571428 17.18219285714286V18.107142857142858"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.612405714285714 7.892857142857143v5.571428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_5"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.612405714285714 17.18219285714286V18.107142857142858"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AlertCirclePriorityMedium;
