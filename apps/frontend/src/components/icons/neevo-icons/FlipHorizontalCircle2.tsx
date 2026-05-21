// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FlipHorizontalCircle2: IconComponentData = ({
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
        d="M25.071614285714286 12.999944285714287c0 7.7255842857142865 -4.345714285714285 12.071298571428573 -12.071410000000002 12.071298571428573 -0.5298428571428572 -8.068988571428571 -0.5298428571428572 -16.073608571428572 0 -24.14267142857143 7.725695714285714 0 12.071410000000002 4.345695714285714 12.071410000000002 12.071372857142858Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.1027602857142857 10.67313C0.987727 11.415838571428571 0.9285714285714286 12.192477142857143 0.9285714285714286 13.000018571428571c0 0.8075228571428571 0.05915557142857143 1.5841800000000001 0.17418885714285715 2.3268885714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.492335714285715 21.995628571428572c1.2325857142857142 1.1382428571428571 2.7151614285714287 1.9472142857142858 4.312025714285714 2.4488285714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.492335714285715 4.018188571428571C5.7226 2.884922857142857 7.202984285714286 2.069358571428572 8.80436142857143 1.5615228571428572"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FlipHorizontalCircle2;
