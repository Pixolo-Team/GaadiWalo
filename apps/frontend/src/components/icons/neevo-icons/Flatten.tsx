// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Flatten: IconComponentData = ({
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
        id="rectangle 643"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.3928571428571428 19.525628571428573c4.573344285714286 -0.5840714285714286 8.048002857142858 -0.8609714285714286 11.607142857142858 -0.8438857142857144 3.55914 -0.017085714285714287 7.033742857142857 0.2598142857142857 11.607142857142858 0.8438857142857144"
        strokeWidth={2}
      />
      <path
        id="rectangle 644"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.363982857142857 24.607142857142858c2.5114328571428572 -0.49511428571428573 4.643767142857143 -0.5768285714285715 6.636295714285715 -0.6022714285714286 1.9925285714285714 0.025442857142857146 4.124862857142857 0.10715714285714287 6.636221428571429 0.6022714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector 628"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13 1.3928571428571428 0 12.809438571428572"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.263814285714286 9.93785c-0.8529114285714287 1.7058414285714285 -2.5587528571428573 3.411664285714286 -4.264501428571428 4.264575714285715 -1.705897142857143 -0.8529114285714287 -3.4117200000000003 -2.558734285714286 -4.26465 -4.264575714285715"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Flatten;
