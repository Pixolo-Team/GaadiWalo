// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HideObject: IconComponentData = ({
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
        d="M4.045024285714286 4.799005714285714C6.017607142857143 2.5747985714285715 9.04915142857143 1.3928571428571428 13 1.3928571428571428 20.42857142857143 1.3928571428571428 24.607142857142858 5.571428571428571 24.607142857142858 13c0 3.9843328571428573 -1.1636857142857144 6.9464571428571436 -3.4238285714285714 8.916142857142857"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1.8674685714285715 9.013104285714286C1.5533477142857144 10.21252142857143 1.3927847142857144 11.543814285714287 1.3927847142857144 12.999981428571429 1.3927847142857144 20.42857142857143 5.571354285714286 24.607142857142858 12.999925714285714 24.607142857142858c1.5216314285714285 0 2.906892857142857 -0.17531428571428573 4.147817142857143 -0.5179571428571429"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 0.9286847142857143C9.220732857142858 11.550685714285715 14.221758571428571 16.493972857142857 25.071428571428573 25.07124285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HideObject;
