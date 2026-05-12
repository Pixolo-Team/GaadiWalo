// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const DeployRules: IconComponentData = ({
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
        id="Vector 629"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m1.3928571428571428 24.607142857142858 23.214285714285715 0"
        strokeWidth={2}
      />
      <path
        id="Vector 630"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m1.3928571428571428 18.975914285714286 23.214285714285715 0"
        strokeWidth={2}
      />
      <path
        id="Vector 631"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m1.3928571428571428 13.229190000000001 11.221692857142857 0"
        strokeWidth={2}
      />
      <path
        id="Vector 628"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.578 14.240051428571428 0 -12.847069857142857"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23.491742857142857 5.232648571428571C22.70877142857143 3.6967357142857145 21.143014285714287 2.1608228571428576 19.577257142857146 1.3928571428571428c-1.56585 0.7679657142857144 -3.131662857142857 2.3038785714285717 -3.9145785714285717 3.8397914285714285"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default DeployRules;
