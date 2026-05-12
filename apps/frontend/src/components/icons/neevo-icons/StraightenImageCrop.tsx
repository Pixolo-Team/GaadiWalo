// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const StraightenImageCrop: IconComponentData = ({
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
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.2753685714285714 9.293384285714286c0.4272914285714286 -1.4204357142857145 0.93301 -2.794387142857143 1.4493142857142858 -4.133684285714287 0.8655214285714287 -2.245211428571429 3.21971 -3.606172142857143 5.595961428571429 -3.2446328571428573 1.76501 0.2685242857142857 3.5686485714285716 0.5763642857142858 5.362722857142858 1.057717142857143 1.7940742857142857 0.48133428571428577 3.5098328571428574 1.11774 5.172347142857143 1.7688357142857143 1.903942857142857 0.7455685714285715 3.171814285714286 2.5623185714285714 3.2795285714285716 4.551764285714286m-1.4264714285714286 7.466494285714285c-0.4239857142857143 1.4020128571428572 -0.9237428571428572 2.7588785714285713 -1.4337142857142857 4.081721428571428 -0.8654285714285715 2.2452857142857146 -3.2196728571428572 3.6062 -5.595924285714285 3.2448 -1.76501 -0.26854285714285714 -3.56863 -0.5764571428571429 -5.362704285714286 -1.0578285714285716 -1.7940928571428572 -0.48137142857142856 -3.5097957142857146 -1.1176285714285714 -5.172421428571428 -1.7687428571428572 -1.88734 -0.7391428571428572 -3.149621428571429 -2.5309142857142857 -3.276427142857143 -4.49995"
        strokeWidth={2}
      />
      <path
        id="Vector 3315"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 13h3.2813857142857144"
        strokeWidth={2}
      />
      <path
        id="Vector 3316"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.881974285714286 13h3.2813857142857144"
        strokeWidth={2}
      />
      <path
        id="Vector 3317"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.070128571428572 13h-3.2813857142857144"
        strokeWidth={2}
      />
      <path
        id="Vector 3318"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.11667 13H14.835265714285715"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default StraightenImageCrop;
