// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const RotateAngle45: IconComponentData = ({
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
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.7246 2.559012857142857 2.1835357142857146 21.100485714285718c-1.1699164285714287 1.1700000000000002 -0.3413205714285715 3.1703285714285716 1.3132042857142858 3.1703285714285716H24.142857142857142"
        strokeWidth={2}
      />
      <path
        id="Intersect_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.069205714285713 13.213998571428572c2.4484200000000005 3.1975357142857144 3.8164471428571427 7.080487142857143 3.944255714285714 11.056258571428572"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default RotateAngle45;
