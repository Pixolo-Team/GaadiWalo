// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ShieldPrivacyTipInfo: IconComponentData = ({
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
        id="Vector 1299"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.330802857142857 9.956755714285714c3.230054285714286 0 2.61638 1.0684514285714286 2.61638 6.117558571428572"
        strokeWidth={2}
      />
      <path
        id="Vector 1300"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.66953142857143 16.497557142857143c-1.83365 -0.5283571428571429 -3.5050600000000003 -0.5283571428571429 -5.338728571428571 0"
        strokeWidth={2}
      />
      <path
        id="Vector 1301"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.709375714285715 5.897877142857143v0.6010457142857143"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ShieldPrivacyTipInfo;
