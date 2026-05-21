// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const EaseIn: IconComponentData = ({
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
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.75 25.0718c1.4857142857142858 0 2.3214285714285716 -0.8338571428571429 2.3214285714285716 -2.3162285714285717s-0.8357142857142857 -2.3160428571428575 -2.3214285714285716 -2.3160428571428575S20.42857142857143 21.273200000000003 20.42857142857143 22.75557142857143s0.8357142857142857 2.3162285714285717 2.3214285714285716 2.3162285714285717Z"
        strokeWidth={2}
      />
      <path
        id="Vector 3888"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.370628571428572 22.900614285714287H17.58482142857143"
        strokeWidth={2}
      />
      <path
        id="Vector 3889"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.928571428571429 22.900614285714287H11.142857142857142"
        strokeWidth={2}
      />
      <path
        id="Vector 3891"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9286215714285715 23.13832857142857c5.377585571428572 0.3610285714285714 8.94907557142857 -2.8908285714285715 13.557817 -10.831822857142857L20.718657142857143 0.9278917142857144"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default EaseIn;
