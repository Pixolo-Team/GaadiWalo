// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const SpacingHorizontal: IconComponentData = ({
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
        d="M0.9285732857142858 24.406200000000002c2.685315285714286 -0.16862857142857143 4.831206714285714 -2.3121428571428573 5.110836714285714 -4.9881 0.21802857142857143 -2.0867971428571432 0.40530285714285713 -4.230905714285714 0.40530285714285713 -6.417877142857143s-0.18727428571428573 -4.331098571428571 -0.40530285714285713 -6.417802857142857C5.75978 3.9063885714285713 3.6138885714285713 1.7628835714285715 0.9285714285714286 1.5941677142857142"
        strokeWidth={2}
      />
      <path
        id="Intersect_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 24.406200000000002c-2.6852428571428573 -0.16862857142857143 -4.8311714285714285 -2.3121428571428573 -5.110857142857142 -4.9881 -0.21802857142857143 -2.0867971428571432 -0.40522857142857144 -4.230905714285714 -0.40522857142857144 -6.417877142857143s0.1872 -4.331098571428571 0.40522857142857144 -6.417802857142857C20.240257142857143 3.9063885714285713 22.386185714285716 1.7628835714285715 25.071428571428573 1.5941677142857142"
        strokeWidth={2}
      />
      <path
        id="Vector 3887"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13 6.848214285714286 0 12.303571428571429"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default SpacingHorizontal;
