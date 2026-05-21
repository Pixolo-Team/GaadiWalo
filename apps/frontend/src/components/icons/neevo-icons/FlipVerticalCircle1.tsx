// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FlipVerticalCircle1: IconComponentData = ({
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
        d="M12.999944285714287 25.071428571428573c7.7255842857142865 0 12.071298571428573 -4.345714285714285 12.071298571428573 -12.071447142857142 -8.068988571428571 -0.5298428571428572 -16.073608571428572 -0.5298428571428572 -24.14267142857143 0C0.9285714285714286 20.725714285714286 5.274267142857143 25.071428571428573 12.999944285714287 25.071428571428573Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.67313 1.1027602857142857C11.415838571428571 0.987727 12.192477142857143 0.9285714285714286 13.000018571428571 0.9285714285714286c0.8075228571428571 0 1.5841800000000001 0.05915557142857143 2.3268885714285714 0.17418885714285715"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.995628571428572 4.491425714285715c1.1382428571428571 1.2325857142857142 1.9472142857142858 2.7151614285714287 2.4488285714285714 4.312025714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.018188571428571 4.491425714285715c-1.1332657142857143 1.2302642857142858 -1.9488299999999998 2.7106485714285715 -2.4566657142857147 4.312025714285714"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FlipVerticalCircle1;
