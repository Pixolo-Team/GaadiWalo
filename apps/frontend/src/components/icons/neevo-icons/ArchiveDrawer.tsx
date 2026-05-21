// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ArchiveDrawer: IconComponentData = ({
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
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.0785114285714283 22.21532857142857c0.08372 1.3401142857142858 1.129867142857143 2.419857142857143 2.4679014285714285 2.5329571428571427 5.095832857142858 0.4308571428571429 9.81134142857143 0.4308571428571429 14.907230000000002 0 1.3380714285714286 -0.1131 2.3842000000000003 -1.192842857142857 2.4677714285714285 -2.5329571428571427 0.3744 -5.9908085714285715 0.3898142857142857 -11.692664285714287 0.04642857142857143 -17.659645714285716 -0.10288571428571429 -1.7874628571428572 -1.4985285714285714 -3.2293597142857142 -3.2838000000000003 -3.3660064285714286 -4.548124285714286 -0.34814 -8.819961428571428 -0.34814 -13.368104285714287 0 -1.7851785714285715 0.1366467142857143 -3.1808400000000003 1.5785435714285714 -3.283707142857143 3.3660064285714286 -0.3434414285714286 5.966981428571429 -0.3280271428571429 11.668837142857143 0.04628 17.659645714285716Z"
        strokeWidth={2}
      />
      <path
        id="Vector 123"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.7857142857142856 12.995691428571428c6.831797142857143 0.4929042857142857 13.596774285714286 0.4929042857142857 20.42857142857143 0"
        strokeWidth={2}
      />
      <path
        id="Vector 124"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.433035714285715 7.373024285714286h3.1338728571428573"
        strokeWidth={2}
      />
      <path
        id="Vector 126"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.433035714285715 18.801714285714286h3.1338728571428573"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ArchiveDrawer;
