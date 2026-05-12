// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const SpacingVertical: IconComponentData = ({
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
        d="M1.5939615714285715 0.9285714285714286C1.7626774285714286 3.6138885714285713 3.906184285714286 5.75978 6.582215714285715 6.03941c2.0867042857142857 0.21802857142857143 4.230812857142857 0.40530285714285713 6.417784285714286 0.40530285714285713s4.331098571428571 -0.18727428571428573 6.417728571428572 -0.40530285714285713c2.676142857142857 -0.27963000000000005 4.819657142857143 -2.4255214285714284 4.988285714285714 -5.110838571428572"
        strokeWidth={2}
      />
      <path
        id="Intersect_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.5939615714285715 25.071428571428573c0.16871585714285714 -2.6852428571428573 2.3122227142857144 -4.8311714285714285 4.9882541428571425 -5.110857142857142C8.66892 19.74254285714286 10.813028571428571 19.555342857142858 13 19.555342857142858s4.331098571428571 0.1872 6.417728571428572 0.40522857142857144c2.676142857142857 0.2796857142857143 4.819657142857143 2.425614285714286 4.988285714285714 5.110857142857142"
        strokeWidth={2}
      />
      <path
        id="Vector 3887"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.15197142857143 13 6.848437142857143 13"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default SpacingVertical;
