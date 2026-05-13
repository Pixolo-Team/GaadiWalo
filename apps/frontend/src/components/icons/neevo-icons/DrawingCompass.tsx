// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const DrawingCompass: IconComponentData = ({
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
        id="Vector 21"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 0.9285714285714286v3.7142857142857144"
        strokeWidth={2}
      />
      <path
        id="Vector 22"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.286825714285715 8.139504285714287 4.642857142857143 25.071428571428573"
        strokeWidth={2}
      />
      <path
        id="Vector 23"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.713174285714288 8.139504285714287 21.357142857142858 25.071428571428573"
        strokeWidth={2}
      />
      <path
        id="Vector 24"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.571428571428571 16.714285714285715c2.9126685714285716 0.6656742857142857 5.190342857142857 1.0037857142857143 7.428571428571429 1.0121985714285715C15.238228571428571 17.718071428571427 17.51590285714286 17.37996 20.42857142857143 16.714285714285715"
        strokeWidth={2}
      />
      <path
        id="Vector 25"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 15.785714285714286v3.7142857142857144"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.845287142857142 9.34232c0.9900428571428572 1.1626271428571429 3.319884285714286 1.1626271428571429 4.309908571428572 0 0.9118942857142858 -1.0708285714285715 0.8426785714285714 -3.1668185714285713 -0.2548742857142857 -4.083578571428572 -0.9830785714285715 -0.8211728571428571 -2.817062857142857 -0.8211728571428571 -3.8001600000000004 0 -1.0975528571428572 0.91676 -1.16675 3.01275 -0.2548742857142857 4.083578571428572Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default DrawingCompass;
