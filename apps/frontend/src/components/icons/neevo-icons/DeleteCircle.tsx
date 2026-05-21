// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const DeleteCircle: IconComponentData = ({
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
      <g>
        <path
          id="Vector 1179"
          stroke={primaryColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m17.701802857142855 8.299107142857142 -9.401785714285715 9.401785714285715"
          strokeWidth={2}
        />
        <path
          id="Vector 1180"
          stroke={primaryColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m17.701802857142855 17.700892857142858 -9.401785714285715 -9.401785714285715"
          strokeWidth={2}
        />
      </g>
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

export default DeleteCircle;
