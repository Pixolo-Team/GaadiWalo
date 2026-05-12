// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const CursorCrosshair: IconComponentData = ({
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
        d="M13 6.5v-5.571428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 25.071428571428573v-5.571428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13h5.571428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 13h5.571428571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_5"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 15.611607142857144C14.671428571428573 15.611607142857144 15.611607142857144 14.671428571428573 15.611607142857144 13S14.671428571428573 10.388392857142858 13 10.388392857142858 10.388392857142858 11.32857142857143 10.388392857142858 13 11.32857142857143 15.611607142857144 13 15.611607142857144Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default CursorCrosshair;
