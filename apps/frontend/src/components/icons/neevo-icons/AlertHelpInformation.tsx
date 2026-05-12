// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AlertHelpInformation: IconComponentData = ({
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
        id="Vector 1299"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.920197142857143 8.473214285714286c7.357387142857143 0 5.959534285714286 2.730817142857143 5.959534285714286 15.635657142857143"
        strokeWidth={2}
      />
      <path
        id="Vector 1300"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.080657142857145 25.07087142857143c-4.176658571428572 -1.2034285714285715 -7.983782857142858 -1.2034285714285715 -12.16046 0"
        strokeWidth={2}
      />
      <path
        id="Vector 1301"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.338095714285714 0.9285714285714286v2.3214285714285716"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AlertHelpInformation;
