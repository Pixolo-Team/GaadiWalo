// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FlipVerticalCircle2: IconComponentData = ({
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
        d="M12.999944285714287 0.9284247142857143c7.7255842857142865 0 12.071298571428573 4.345693857142858 12.071298571428573 12.071371000000001 -8.068988571428571 0.5298428571428572 -16.073608571428572 0.5298428571428572 -24.14267142857143 0C0.9285714285714286 5.274118571428572 5.274267142857143 0.9284265714285714 12.999944285714287 0.9284247142857143Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.67313 24.897228571428574c0.7427085714285715 0.11495714285714285 1.519347142857143 0.1742 2.3268885714285714 0.1742 0.8075228571428571 0 1.5841800000000001 -0.05924285714285714 2.3268885714285714 -0.1742"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.995628571428572 21.50775714285714c1.1382428571428571 -1.2327714285714284 1.9472142857142858 -2.7153285714285715 2.4488285714285714 -4.312118571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.018188571428571 21.50775714285714c-1.1332657142857143 -1.230357142857143 -1.9488299999999998 -2.7106857142857144 -2.4566657142857147 -4.312118571428571"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FlipVerticalCircle2;
