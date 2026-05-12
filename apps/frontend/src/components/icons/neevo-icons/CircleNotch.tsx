// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const CircleNotch: IconComponentData = ({
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
        d="M6.8705557142857145 2.128285714285714C3.016427142857143 3.913891428571428 0.9285714285714286 7.644984285714286 0.9285714285714286 12.999981428571429 0.9285714285714286 20.725714285714286 5.274285714285714 25.071428571428573 13 25.071428571428573s12.071428571428571 -4.345714285714285 12.071428571428571 -12.071447142857142c0 -5.354997142857143 -2.0878 -9.08609 -5.941928571428572 -10.871695714285714"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default CircleNotch;
