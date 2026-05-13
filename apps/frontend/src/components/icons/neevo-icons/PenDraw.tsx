// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const PenDraw: IconComponentData = ({
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
        id="Vector 2472"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 16.338047142857143C3.8953385714285718 2.2722328571428574 13.218121428571429 -0.5172644285714286 15.964 1.5255462857142856 21.223428571428574 5.438327142857143 5.865841428571429 18.247840000000004 10.00168 21.142085714285713c3.378755714285714 2.364328571428571 8.0587 -9.754512857142858 11.604505714285715 -7.034355714285714 2.9073571428571428 2.230317142857143 -5.035457142857143 8.865870000000001 -1.2088142857142858 10.76777 1.8695857142857142 0.9291285714285714 3.518914285714286 -1.6870285714285715 4.6740571428571425 -2.8208142857142855"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default PenDraw;
