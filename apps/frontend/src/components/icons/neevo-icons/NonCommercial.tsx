// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const NonCommercial: IconComponentData = ({
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
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.494381428571426 17.236607142857142C13.478047142857143 14.299628571428572 11.965998571428571 12.393345714285713 9.5303 8.550527142857142"
        strokeWidth={2}
      />
      <path
        id="Vector_2_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.49761 12.999814285714287c0 -3.929714285714286 -1.6359757142857143 -6.140178571428572 -4.544391428571428 -6.140178571428572 -2.9084157142857143 0 -4.544391428571428 2.210464285714286 -4.544391428571428 6.140178571428572 0 3.929714285714286 1.6359757142857143 6.140271428571428 4.544391428571428 6.140271428571428 2.9084157142857143 0 4.544391428571428 -2.2105571428571427 4.544391428571428 -6.140271428571428Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default NonCommercial;
