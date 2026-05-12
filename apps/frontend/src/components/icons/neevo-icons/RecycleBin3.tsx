// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const RecycleBin3: IconComponentData = ({
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
        d="M3.1171585714285714 1.4736577142857143C3.150252857142857 8.011082857142856 3.6138142857142856 16.42223142857143 5.442115714285714 22.419428571428572c0.3691071428571429 1.2106714285714286 1.4171485714285714 2.0761 2.6688257142857146 2.2646 3.428898571428572 0.5159142857142858 6.347472857142858 0.5166571428571429 9.776427142857145 0.0009285714285714287 1.2517885714285715 -0.18812857142857145 2.2997742857142858 -1.0537428571428573 2.6687885714285717 -2.264414285714286 1.8285428571428572 -5.997587142857143 2.2920857142857143 -14.409422857142857 2.325142857142857 -20.947028142857143C16.250167142857144 0.7468760000000001 9.748235714285716 0.7469242857142857 3.1171585714285714 1.4736577142857143Z"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12.999554285714286 0.9285714285714286 0 24.060214285714288"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.285714285714285 12.496992857142857c-6.23714 0.5092657142857143 -12.400347142857143 0.5092657142857143 -18.637487142857143 0"
        strokeWidth={2}
      />
      <path
        id="Vector 195"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 1.7392551428571428c8.125705714285715 -1.0809110000000002 16.01715142857143 -1.0809110000000002 24.142857142857142 0"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default RecycleBin3;
