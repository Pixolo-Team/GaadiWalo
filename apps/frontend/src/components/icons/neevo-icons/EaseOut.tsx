// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const EaseOut: IconComponentData = ({
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
        d="M3.25 0.9281628571428572C1.7642857142857142 0.9281628571428572 0.9285714285714286 1.7619921428571428 0.9285714285714286 3.244354285714286c0 1.4823714285714287 0.8357142857142857 2.3161914285714285 2.3214285714285716 2.3161914285714285S5.571428571428571 4.726725714285714 5.571428571428571 3.244354285714286C5.571428571428571 1.7619921428571428 4.735714285714286 0.9281628571428572 3.25 0.9281628571428572Z"
        strokeWidth={2}
      />
      <path
        id="Vector 3888"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.629464285714286 3.0994785714285715h2.7857142857142856"
        strokeWidth={2}
      />
      <path
        id="Vector 3889"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.071428571428571 3.0994785714285715H14.857142857142858"
        strokeWidth={2}
      />
      <path
        id="Vector 3891"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 2.8615971428571427c-5.377728571428572 -0.3609914285714286 -8.949125714285715 2.89094 -13.557867142857143 10.831897142857143L5.28125 25.07217142857143"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default EaseOut;
