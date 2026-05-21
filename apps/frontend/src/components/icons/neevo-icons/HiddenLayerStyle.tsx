// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HiddenLayerStyle: IconComponentData = ({
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
        d="M0.9282965714285715 0.9285714285714286C9.220547142857143 11.550685714285715 14.221628571428571 16.494047142857145 25.071428571428573 25.071428571428573"
        strokeWidth={2}
      />
      <path
        id="Vector 797"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.357142857142858 4.239782857142857C21.00187142857143 3.4455757142857144 19.790642857142856 1.8571428571428572 17.78752857142857 1.8571428571428572c-2.00317 0 -3.2658042857142857 0.9105385714285714 -4.17326 2.7849157142857144 -0.8097142857142857 1.6724685714285716 -1.9271942857142856 4.489661428571429 -3.1485257142857144 7.424114285714285M1.8571428571428572 24.142857142857142c1.8571428571428572 0 3.0023685714285717 -1.374842857142857 3.410605714285714 -1.862342857142857 1.0377157142857143 -1.1542142857142859 2.235034285714286 -3.466914285714286 3.4255 -6.099581428571429"
        strokeWidth={2}
      />
      <path
        id="Vector 798"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.388392857142858 12.071428571428571H13.928571428571429"
        strokeWidth={2}
      />
      <path
        id="Vector 800"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m24.142857142857142 15.785714285714286 -5.395 4.046342857142857M13 24.142857142857142l2.1821428571428574 -1.6365142857142858"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HiddenLayerStyle;
