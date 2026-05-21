// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ShieldPrivacyHelp: IconComponentData = ({
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
        id="Vector 107"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 12.499982857142857C0.9285714285714286 5.136355714285714 3.9464285714285716 1.9805128571428572 4.952387142857143 0.9285714285714286h16.09517C22.05357142857143 1.9805128571428572 25.071428571428573 5.136355714285714 25.071428571428573 12.499982857142857c0 8.415531428571429 -7.92623 11.51956 -11.950045714285714 12.571445714285714C9.097585714285714 24.01954285714286 0.9285714285714286 20.915514285714288 0.9285714285714286 12.499982857142857Z"
        strokeWidth={2}
      />
      <path
        id="Vector 1227"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.016592857142857 10.46682c0.03937142857142857 -0.9946114285714287 0.67938 -2.983834285714286 2.924517142857143 -2.983834285714286 2.806421428571429 0 3.0172628571428572 2.4596557142857143 3.042742857142857 2.983834285714286 0 1.9765385714285715 -3.061667142857143 2.1464485714285715 -2.9147857142857143 4.032191428571429v0.4573214285714286"
        strokeWidth={2}
      />
      <path
        id="Vector 589"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.93878857142857 18.118025714285714v0.40157000000000004"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ShieldPrivacyHelp;
