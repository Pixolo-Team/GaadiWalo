// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Bomb: IconComponentData = ({
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
        d="M15.490874285714288 15.756538571428571c-0.2581428571428572 2.8980900000000003 -2.030655714285714 4.38269 -4.923675714285714 4.124175714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.608647142857144 25.071428571428573c6.8352514285714285 0 10.680038571428572 -3.8515285714285716 10.680038571428572 -10.698684285714286 0 -6.847174285714286 -3.8447871428571427 -10.698702857142857 -10.680038571428572 -10.698702857142857C4.773395714285714 3.6740414285714285 0.9285714285714286 7.52557 0.9285714285714286 14.372744285714285 0.9285714285714286 21.2199 4.773395714285714 25.071428571428573 11.608647142857144 25.071428571428573Z"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m17.231165714285716 4.83288 1.9651914285714285 -2.452877142857143c1.3336142857142856 -1.664739142857143 3.7592285714285714 -1.9374234285714287 5.428057142857143 -0.61022l0.4477571428571429 0.3560142857142857"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Bomb;
