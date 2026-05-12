// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const OvalShape: IconComponentData = ({
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
        d="M13 23.214285714285715c7.725714285714286 0 12.071428571428571 -3.677142857142857 12.071428571428571 -10.214285714285715S20.725714285714286 2.7857142857142856 13 2.7857142857142856 0.9285714285714286 6.462857142857143 0.9285714285714286 13s4.345714285714285 10.214285714285715 12.071428571428571 10.214285714285715Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default OvalShape;
