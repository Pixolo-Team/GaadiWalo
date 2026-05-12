// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AddTaskReminder: IconComponentData = ({
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
        d="M11.951160000000002 21.811957142857143c-0.18957714285714286 0.006314285714285714 -0.38162428571428575 0.009471428571428572 -0.57616 0.009471428571428572C4.689285714285714 21.821428571428573 0.9285714285714286 18.060714285714287 0.9285714285714286 11.375S4.689285714285714 0.9285714285714286 11.375 0.9285714285714286s10.446428571428571 3.7607142857142857 10.446428571428571 10.446428571428571c0 0.17667000000000002 -0.0026 0.35127857142857144 -0.0078 0.5238442857142858"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.441964285714286 12.312634285714287 3.37662 3.482142857142857c1.5889157142857144 -4.564262857142857 2.9121857142857146 -6.5671171428571435 5.9090942857142865 -9.285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.42857142857143 15.785714285714286v9.285714285714286M15.785714285714286 20.42857142857143h9.285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AddTaskReminder;
