// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HierarchyLine2: IconComponentData = ({
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
        id="Vector 2256"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m0.9285714285714286 13 12.59375 0"
        strokeWidth={2}
      />
      <path
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071428571428573 23.214285714285715c-2.8562857142857143 0 -5.636614285714286 -0.3222142857142857 -8.305978571428572 -0.5929857142857142 -1.3371614285714286 -0.13557142857142856 -2.411797142857143 -1.1852285714285715 -2.5796457142857143 -2.518657142857143C13.897984285714287 17.81620285714286 13.580357142857144 15.439375714285717 13.580357142857144 13s0.31762714285714283 -4.816202857142858 0.6054285714285714 -7.102624285714286c0.16786714285714285 -1.333502857142857 1.2425028571428571 -2.383067142857143 2.5796642857142857 -2.5186942857142856C19.434814285714285 3.10791 22.215142857142858 2.7857142857142856 25.071428571428573 2.7857142857142856"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HierarchyLine2;
