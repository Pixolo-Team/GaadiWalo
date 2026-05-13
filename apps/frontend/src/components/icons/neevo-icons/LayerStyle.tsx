// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const LayerStyle: IconComponentData = ({
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
        id="Vector 797"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.988200000000003 3.5097585714285713C21.604514285714288 2.649362857142857 20.29634285714286 0.9285714285714286 18.13301285714286 0.9285714285714286c-2.163367142857143 0 -3.526974285714286 0.986402857142857 -4.507007142857143 3.0170028571428573C11.522717142857143 8.303452857142858 7.49645 19.835585714285713 4.611954285714286 23.053828571428575 4.171068571428572 23.582 2.9342485714285713 25.071428571428573 0.9285714285714286 25.071428571428573"
        strokeWidth={2}
      />
      <path
        id="Vector 798"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.9432285714285715 11.994115714285716h8.022671428571428"
        strokeWidth={2}
      />
      <path
        id="Vector 799"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.973635714285713 16.017857142857142 4.575721428571429 8.032328571428572c0.6793428571428571 1.3115142857142859 2.7524714285714285 1.4381714285714287 3.5217000000000005 -0.6344000000000001"
        strokeWidth={2}
      />
      <path
        id="Vector 800"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.996028571428575 16.017857142857142 12.961910000000001 25.071428571428573"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default LayerStyle;
