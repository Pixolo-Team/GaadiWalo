// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Block2: IconComponentData = ({
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
        id="Vector 1180"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.05357142857143 21.748628571428572C15.696014285714288 16.20385 9.796094285714286 10.30393 4.251297142857143 3.946372857142857"
        strokeWidth={2}
      />
      <path
        id="Vector 1182"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.9464285714285716 21.748628571428572c6.357557142857143 -5.544778571428572 12.257477142857143 -11.444698571428573 17.802200000000003 -17.802255714285714"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Block2;
