// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Pin2Disabled: IconComponentData = ({
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
        d="M8.294260000000001 9.838158571428572c-0.07424857142857143 -2.0033371428571427 0.8314614285714286 -4.011484285714285 2.71713 -5.897152857142857C14.639857142857144 0.31254042857142855 18.721857142857143 0.31254042857142855 22.35034285714286 3.9410057142857142c3.6284857142857145 3.6284671428571427 3.6284857142857145 7.710485714285714 0 11.338952857142859 -1.8578857142857144 1.8578857142857144 -3.834647142857143 2.7644685714285715 -5.808567142857143 2.719785714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.112317142857142 7.184041428571429c1.5526642857142856 -1.6437757142857143 3.3506757142857144 -1.6950142857142856 4.9945257142857145 -0.14233142857142858"
        strokeWidth={2}
      />
      <path
        id="Vector 164"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.97739142857143 16.73332142857143 0.9294275714285716 24.781342857142857"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9282965714285715 0.9285714285714286C9.220547142857143 11.550685714285715 14.221628571428571 16.494047142857145 25.071428571428573 25.071428571428573"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Pin2Disabled;
