// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const RemoveTaskReminder: IconComponentData = ({
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
        id="Subtract"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.114208571428572 21.353614285714286c-1.1184085714285714 0.3094 -2.367225714285714 0.46781428571428574 -3.7392085714285717 0.46781428571428574C4.689285714285714 21.821428571428573 0.9285714285714286 18.060714285714287 0.9285714285714286 11.375S4.689285714285714 0.9285714285714286 11.375 0.9285714285714286s10.446428571428571 3.7607142857142857 10.446428571428571 10.446428571428571c0 1.434642857142857 -0.1730857142857143 2.7346057142857143 -0.5112714285714286 3.8916242857142858"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M25.071614285714286 16.714582857142858 16.714768571428575 25.071428571428573M16.71473142857143 16.714285714285715l8.356882857142857 8.356771428571427"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.441964285714286 12.312634285714287 3.37662 3.482142857142857c1.5889157142857144 -4.564262857142857 2.9121857142857146 -6.5671171428571435 5.9090942857142865 -9.285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default RemoveTaskReminder;
