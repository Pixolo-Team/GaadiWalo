// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const FactCheck: IconComponentData = ({
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
        d="M16.714285714285715 21.9375 19.753314285714286 25.071428571428573c1.4300000000000002 -4.107814285714285 2.6209857142857143 -5.910357142857143 5.318114285714286 -8.357142857142858"
        strokeWidth={2}
      />
      <path
        id="Vector 1187"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.943962857142857 9.662937142857144h0.92196c1.0256814285714284 0 1.8571614285714289 0.831517142857143 1.8571428571428572 1.857217142857143V16.133928571428573"
        strokeWidth={2}
      />
      <path
        id="Vector 1188"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.97117 16.59841857142857c1.89761 -0.5274285714285714 3.633444285714286 -0.5274285714285714 5.531054285714286 0"
        strokeWidth={2}
      />
      <path
        id="Vector 1189"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.750532857142858 5.429970000000001v0.5994485714285714"
        strokeWidth={2}
      />
      <path
        id="Subtract"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.674647142857143 22.492414285714286c-0.31044 0.016900000000000002 -0.6276214285714286 0.025442857142857146 -0.9514328571428573 0.025442857142857146C4.814642857142857 22.517857142857142 0.9285714285714286 18.631785714285716 0.9285714285714286 11.723214285714286S4.814642857142857 0.9285714285714286 11.723214285714286 0.9285714285714286s10.794642857142858 3.8860714285714284 10.794642857142858 10.794642857142858c0 0.7194571428571429 -0.04215714285714286 1.4061357142857143 -0.12554285714285712 2.05907"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default FactCheck;
