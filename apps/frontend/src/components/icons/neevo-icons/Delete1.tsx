// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Delete1: IconComponentData = ({
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
      <g>
        <path
          id="Vector 1180"
          stroke={primaryColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M25.071428571428573 24.664900000000003C16.594704285714286 17.271874285714286 8.728125714285715 9.405314285714287 1.3350535714285716 0.928577"
          strokeWidth={2}
        />
        <path
          id="Vector 1182"
          stroke={primaryColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M0.9285714285714286 24.664900000000003C9.405295714285716 17.271874285714286 17.271874285714286 9.405314285714287 24.664900000000003 0.928577"
          strokeWidth={2}
        />
      </g>
    </g>
  </svg>
);

export default Delete1;
