// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HierarchyLine4: IconComponentData = ({
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
        d="m0.9285714285714286 13 12.834045714285715 0"
        strokeWidth={2}
      />
      <path
        id="Union"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 2.7857142857142856c-0.5669857142857143 0.022434285714285716 -1.1321142857142859 0.04629857142857143 -1.6950142857142856 0.07161142857142856 -6.1637828571428575 0.27697428571428573 -9.613797142857143 3.8978642857142862 -9.613797142857143 10.142692857142858 0 6.24481 3.4500142857142855 9.86568142857143 9.613797142857143 10.142581428571429 0.5629 0.025442857142857146 1.1280285714285716 0.04921428571428572 1.6950142857142856 0.0716857142857143"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HierarchyLine4;
