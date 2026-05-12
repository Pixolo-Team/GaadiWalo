// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ListChecklistTaskDone: IconComponentData = ({
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
        d="m17.439722857142858 5.698382857142858 2.7750914285714288 2.861894285714286C21.520757142857146 4.809015714285715 22.6083 3.1629185714285715 25.071428571428573 0.9285714285714286"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.439722857142858 22.20957142857143 20.214814285714287 25.071428571428573c1.3059428571428573 -3.751242857142857 2.393485714285714 -5.3974142857142855 4.8566142857142856 -7.631705714285714"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9285714285714286 20.239885714285716h9.113408571428572"
        strokeWidth={2}
      />
      <path
        id="Vector_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0.9847927142857144 5.76004H10.098214285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ListChecklistTaskDone;
