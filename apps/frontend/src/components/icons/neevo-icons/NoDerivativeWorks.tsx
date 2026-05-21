// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const NoDerivativeWorks: IconComponentData = ({
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
        id="Vector 308"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.961085714285714 10.326048571428572h8.076807142857144"
        strokeWidth={2}
      />
      <path
        id="Vector 309"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.961085714285714 15.673951428571428h8.076807142857144"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default NoDerivativeWorks;
