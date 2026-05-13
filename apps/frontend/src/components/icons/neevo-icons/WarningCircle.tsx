// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const WarningCircle: IconComponentData = ({
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
        d="M3.6620257142857144 21.292885714285717c4.290167142857143 5.038057142857143 14.386115714285713 5.038057142857143 18.676245714285717 0 3.951628571428572 -4.64022 3.6517 -13.722818571428572 -1.1044428571428573 -17.695525714285715 -4.260044285714286 -3.5583863714285715 -12.207278571428573 -3.5583865571428572 -16.46734142857143 0C0.010420205714285716 7.570067142857144 -0.2894877142857143 16.652665714285714 3.6620257142857144 21.292885714285717Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7.599057142857143v6.387791428571428"
        strokeWidth={2}
      />
      <path
        id="Vector 2494"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 17.248845714285714v1.1525242857142857"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default WarningCircle;
