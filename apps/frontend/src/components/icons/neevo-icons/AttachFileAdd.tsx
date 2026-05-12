// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AttachFileAdd: IconComponentData = ({
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
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.714285714285715 12.876221428571428C16.714285714285715 5.229732857142857 14.759122857142858 0.9285695714285715 8.574855714285714 0.9285695714285715 2.390607142857143 0.9285695714285715 0.9285714285714286 5.229732857142857 0.9285714285714286 12.876221428571428c0 7.646507142857144 1.5903085714285714 13.486292857142857 7.653564285714286 11.94802142857143 2.6261485714285717 -0.6663428571428571 2.9796557142857143 -3.2498142857142858 2.9796557142857143 -9.026494285714287 0 -5.776772857142857 -0.00001857142857142858 -9.026197142857143 -2.9796557142857143 -9.026197142857143 -2.9796557142857143 0 -2.9796557142857143 3.249424285714286 -2.9796557142857143 9.026197142857143V16.983571428571427"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.42857142857143 15.785714285714286v9.285714285714286M15.785714285714286 20.42857142857143h9.285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.42857142857143 15.785714285714286v9.285714285714286M15.785714285714286 20.42857142857143h9.285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AttachFileAdd;
