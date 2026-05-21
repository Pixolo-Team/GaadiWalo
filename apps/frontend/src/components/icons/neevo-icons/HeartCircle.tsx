// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const HeartCircle: IconComponentData = ({
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
        d="M13.00013 9.726042857142858c-2.9414357142857144 -3.609097142857143 -6.047117142857143 -1.04468 -6.087992857142858 1.7197142857142858 0 4.115410000000001 4.924047142857143 7.493385714285715 6.087992857142858 7.493385714285715 1.1639457142857144 0 6.087955714285714 -3.3779757142857143 6.087955714285714 -7.493385714285715 -0.040857142857142856 -2.764394285714286 -3.14652 -5.328811428571429 -6.087955714285714 -1.7197142857142858Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default HeartCircle;
