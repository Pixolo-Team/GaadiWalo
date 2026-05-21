// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Sphere: IconComponentData = ({
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
        id="vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 17.828385714285716c6.666957142857143 0 12.071428571428571 -2.1618257142857145 12.071428571428571 -4.828571428571429s-5.404471428571428 -4.828571428571429 -12.071428571428571 -4.828571428571429c-6.666864285714286 0 -12.071428571428571 2.1618257142857145 -12.071428571428571 4.828571428571429s5.404564285714286 4.828571428571429 12.071428571428571 4.828571428571429Z"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Sphere;
