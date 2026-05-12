// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const RemoveLikeFavoriteLove: IconComponentData = ({
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
        d="M19.69054285714286 13.069512857142858c1.2860714285714285 -1.8455728571428573 2.1888285714285716 -3.9785942857142853 2.1888285714285716 -6.24416 -0.0702 -4.661781428571429 -5.414110000000001 -8.986342857142857 -10.475362857142857 -2.900077142857143C6.342774285714286 -2.16099 0.9988847142857143 2.163292857142857 0.9285714285714286 6.825074285714286c0 6.940087142857143 8.472694285714287 12.636854285714286 10.475455714285713 12.636854285714286 0.27311142857142856 0 0.66651 -0.10604285714285715 1.1423100000000002 -0.30661428571428573"
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
    </g>
  </svg>
);

export default RemoveLikeFavoriteLove;
