// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FingerSnapping: IconComponentData = ({
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
        id="Vector 546"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.321361428571429 3.1708857142857143 6.203544285714286 1.857103857142857"
        strokeWidth={2}
      />
      <path
        id="Vector 547"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.121091428571429 3.86685 -0.8682328571428571 0.9930142857142856"
        strokeWidth={2}
      />
      <path
        id="Vector 550"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m1.8571428571428572 4.975434285714286 1.1580957142857142 0.6314285714285715"
        strokeWidth={2}
      />
      <path
        id="Vector 551"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.182828571428573 24.619957142857142c-1.6866571428571429 0.49065714285714285 -3.2605857142857144 0.6670857142857144 -5.417192857142857 0.08932857142857142 -4.313084285714286 -1.1557 -4.280027142857143 -5.618785714285715 -3.7851728571428573 -8.71882142857143l-5.160442857142858 -1.3827357142857144c-1.3895142857142857 -0.37232 -2.2141228571428573 -1.8005928571428573 -1.841802857142857 -3.1901257142857142 0.37232 -1.3895328571428573 1.8005928571428573 -2.2141414285714283 3.1901071428571433 -1.8418214285714287L17.883542857142857 11.911027142857144l-0.6323385714285715 -2.7271957142857146c-0.22870714285714286 -1.6364957142857144 1.2864428571428572 -2.97596 2.8824528571428574 -2.548297142857143 0.5913142857142858 0.1583957142857143 1.095157142857143 0.5451457142857143 1.4012142857142857 1.0751371428571428l3.537114285714286 6.126491428571429"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FingerSnapping;
