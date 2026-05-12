// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Watermark: IconComponentData = ({
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
        d="M22.591214285714287 16.714285714285715c0 -9.508571428571429 -9.591957142857144 -15.785714285714286 -9.591957142857144 -15.785714285714286S3.4073371428571426 7.2057142857142855 3.4073371428571426 16.714285714285715c0 2.2165 1.0105642857142858 4.342185714285714 2.809411428571429 5.909428571428571 1.7988285714285714 1.5672428571428572 4.238575714285714 2.447714285714286 6.782508571428572 2.447714285714286 2.543932857142857 0 4.9836800000000006 -0.8804714285714287 6.782471428571428 -2.447714285714286 1.7988285714285714 -1.5672428571428572 2.809485714285714 -3.6929285714285713 2.809485714285714 -5.909428571428571Z"
        strokeWidth={2}
      />
      <path
        id="Vector 185"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9276651428571429 6.35492H25.0705"
        strokeWidth={2}
      />
      <path
        id="Vector 186"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9276651428571429 13H25.0705"
        strokeWidth={2}
      />
      <path
        id="Vector 187"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9276651428571429 19.645042857142855H25.0705"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Watermark;
