// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HelpQuestion1: IconComponentData = ({
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
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.001132857142858 13.843551428571429c0 -0.6705214285714286 0.5453500000000001 -1.0818228571428572 1.5074985714285714 -1.7247100000000002 0.89245 -0.5963285714285714 1.3631985714285715 -1.3698657142857145 1.1538057142857143 -2.4225685714285716 -0.20939285714285716 -1.0527214285714286 -1.079222857142857 -1.922532857142857 -2.131944285714286 -2.131944285714286 -1.652467142857143 -0.3286957142857143 -3.242757142857143 0.9764114285714286 -3.242757142857143 2.661248571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13 18.486185714285714 0 -0.4642857142857143"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HelpQuestion1;
