// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ElipseFrame: IconComponentData = ({
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
        id="Vector 805"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 2.7857142857142856C3.342857142857143 2.7857142857142856 0.9285714285714286 8.914285714285715 0.9285714285714286 13s2.4142857142857146 10.214285714285715 12.071428571428571 10.214285714285715 12.071428571428571 -6.128571428571428 12.071428571428571 -10.214285714285715S22.65714285714286 2.7857142857142856 13 2.7857142857142856Z"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.624152857142858 21.53097142857143C11.238017142857144 14.229205714285715 14.214942857142859 11.245984285714286 21.560314285714288 5.349760000000001"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.379728571428572 21.501814285714286C14.75682 14.213197142857144 11.775102857142858 11.235380000000001 4.417975714285714 5.3498342857142855"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ElipseFrame;
