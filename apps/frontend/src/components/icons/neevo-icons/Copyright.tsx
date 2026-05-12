// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Copyright: IconComponentData = ({
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
        id="Union"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.8064 9.500734285714286c-0.6246128571428572 -1.3067042857142857 -1.8470214285714288 -2.0118614285714287 -3.5716757142857145 -2.0118614285714287 -2.4883485714285714 0 -3.9311442857142853 1.4690742857142858 -4.041495714285714 4.0937v2.8345571428571428c0.11035142857142857 2.624625714285714 1.5531471428571428 4.0937 4.041495714285714 4.0937 1.724654285714286 0 2.9470628571428574 -0.70629 3.5716757142857145 -2.0137"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Copyright;
