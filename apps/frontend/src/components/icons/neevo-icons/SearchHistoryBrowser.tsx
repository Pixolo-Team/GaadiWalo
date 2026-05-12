// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const SearchHistoryBrowser: IconComponentData = ({
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
        d="m24.6077 24.607142857142858 -4.152014285714286 -4.151828571428571"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.303552857142858 23.214285714285715C19.286428571428573 23.214285714285715 23.214285714285715 19.286428571428573 23.214285714285715 12.303552857142858 23.214285714285715 5.320714285714287 19.286428571428573 1.3928571428571428 12.303552857142858 1.3928571428571428 5.320714285714287 1.3928571428571428 1.3928571428571428 5.320714285714287 1.3928571428571428 12.303552857142858 1.3928571428571428 19.286428571428573 5.320714285714287 23.214285714285715 12.303552857142858 23.214285714285715Z"
        strokeWidth={2}
      />
      <path
        id="Vector 2102"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.303571428571429 6.795397142857143v6.204547142857143h5.571428571428571"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default SearchHistoryBrowser;
