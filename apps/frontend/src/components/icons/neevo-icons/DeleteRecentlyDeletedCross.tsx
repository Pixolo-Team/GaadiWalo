// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const DeleteRecentlyDeletedCross: IconComponentData = ({
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
        d="M0.9285714285714286 13c0 7.725714285714286 4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571s12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286c-4.045692857142858 0 -7.164504285714286 1.19171 -9.217742857142857 3.436457142857143"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.649831428571429 4.734228571428571c-1.1411585714285715 0.38038 -2.6626971428571427 0.38038 -3.8038185714285717 0.00003714285714285715 -0.38041714285714284 -1.1411957142857143 -0.38041714285714284 -2.662734285714286 -0.00001857142857142858 -3.803879857142857"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.178422857142856 8.821725714285716 8.821577142857143 17.17857142857143m-0.00003714285714285715 -8.357142857142858 8.356864285714286 8.356845714285715"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default DeleteRecentlyDeletedCross;
