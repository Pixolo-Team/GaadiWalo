// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const InformationCircle: IconComponentData = ({
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
        id="Vector 1187"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.67131 11.142857142857142h0.92196c1.0257 0 1.8571799999999998 0.8314985714285715 1.8571428571428572 1.8571985714285715v4.613792857142857"
        strokeWidth={2}
      />
      <path
        id="Vector 1188"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.698517142857144 18.079471428571427c1.89761 -0.5274471428571429 3.633444285714286 -0.5274471428571429 5.531054285714286 0"
        strokeWidth={2}
      />
      <path
        id="Vector 1189"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.47788 6.9082928571428575v0.5994485714285714"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default InformationCircle;
