// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FeatherPen: IconComponentData = ({
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
        d="M24.909299999999998 2.900337142857143c-1.4316714285714287 -0.15282428571428572 -2.875785714285714 -0.15282428571428572 -4.307457142857142 0L16.75609 8.92994142857143 14.388957142857143 4.589761428571429C5.812690000000001 8.738432857142858 0.29389657142857145 14.946434285714288 6.4914757142857145 21.0574c6.197564285714286 6.110928571428572 20.242652857142858 -2.313257142857143 18.417824285714286 -18.157062857142858Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 23.214285714285715c4.813547142857143 -1.9721000000000002 11.0617 -6.28134 12.98869 -9.229721428571429"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FeatherPen;
