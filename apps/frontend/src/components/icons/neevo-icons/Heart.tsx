// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const Heart: IconComponentData = ({
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
        d="M0.9285714285714286 9.116844285714286C1.0095967142857143 3.7448357142857143 7.167642857142858 -1.2386102857142858 13 5.774934285714285c5.832357142857143 -7.0135445714285725 11.990457142857144 -2.0304328571428574 12.071428571428571 3.3415942857142857 0 7.997432857142857 -9.763538571428573 14.562042857142858 -12.071447142857142 14.562042857142858C10.692072857142858 23.67857142857143 0.9285714285714286 17.114295714285714 0.9285714285714286 9.116844285714286Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default Heart;
