// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Pin2: IconComponentData = ({
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
        d="M10.839511428571429 15.159745714285716c3.672574285714286 3.672611428571429 7.8041599999999995 3.672611428571429 11.476845714285716 0 3.6725000000000003 -3.6725557142857146 3.6725000000000003 -7.804197142857143 0 -11.476752857142857 -3.6726857142857146 -3.672561322857143 -7.804271428571429 -3.672561322857143 -11.476845714285716 0 -3.6725557142857146 3.6725557142857146 -3.6725557142857146 7.804197142857143 0 11.476752857142857Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.979457142857143 6.96566c1.5715328571428573 -1.6637585714285716 3.391384285714286 -1.71561 5.055142857142857 -0.14407714285714285"
        strokeWidth={2}
      />
      <path
        id="Vector 164"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.816408571428573 15.183814285714288 0.9287460000000001 25.071428571428573"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Pin2;
