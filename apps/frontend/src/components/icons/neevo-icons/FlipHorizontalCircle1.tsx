// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FlipHorizontalCircle1: IconComponentData = ({
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
        d="M0.9284265714285714 12.999944285714287C0.9284247142857143 20.725528571428573 5.274118571428572 25.07124285714286 12.999795714285714 25.07124285714286c0.5298428571428572 -8.068988571428571 0.5298428571428572 -16.073608571428572 0 -24.14267142857143C5.274118571428572 0.9285714285714286 0.9284265714285714 5.274267142857143 0.9284265714285714 12.999944285714287Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.897228571428574 10.67313c0.11495714285714285 0.7427085714285715 0.1742 1.519347142857143 0.1742 2.3268885714285714 0 0.8075228571428571 -0.05924285714285714 1.5841800000000001 -0.1742 2.3268885714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.50775714285714 21.995628571428572c-1.2327714285714284 1.1382428571428571 -2.7153285714285715 1.9472142857142858 -4.312118571428571 2.4488285714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.50775714285714 4.018188571428571c-1.230357142857143 -1.1332657142857143 -2.7106857142857144 -1.9488299999999998 -4.312118571428571 -2.4566657142857147"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FlipHorizontalCircle1;
