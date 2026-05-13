// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Paintbrush3: IconComponentData = ({
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
        id="Vector 97"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.075908571428571 8.541241428571428c4.196455714285714 -4.1964371428571425 9.442011428571428 -3.147337142857143 12.589348571428571 0 3.1473000000000004 3.147337142857143 4.1964 8.392911428571429 0 12.58933C12.468801428571428 25.32697142857143 6.30344 25.801285714285715 0.9285714285714286 24.277871428571427c4.131195714285714 -4.131214285714286 -1.4228722857142857 -11.166405714285714 3.147337142857143 -15.736630000000002Z"
        strokeWidth={2}
      />
      <path
        id="Subtract"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m25.07217142857143 8.052552857142857 -5.884728571428571 4.872938571428572c-0.4106142857142857 -1.6524857142857143 -1.3108642857142858 -3.1736528571428573 -2.521554285714286 -4.384342857142857 -0.9252285714285714 -0.9252285714285714 -2.0317700000000003 -1.6691257142857143 -3.2396928571428574 -2.151741428571429L17.948134285714286 0.9285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Paintbrush3;
