// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const MediaLibraryMusicContent: IconComponentData = ({
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
        d="M1.7610208571428572 24.607142857142858c-0.4908224285714286 -7.757248571428573 -0.4908224285714286 -15.457037142857143 0 -23.214285714285715"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.07216142857143 24.607142857142858c-0.49082428571428577 -7.757248571428573 -0.49082428571428577 -15.457037142857143 0 -23.214285714285715"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.607142857142858 24.46432857142857C19.93512857142857 17.10658857142857 17.19276 9.75468 15.482962857142859 1.4345704285714285"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default MediaLibraryMusicContent;
