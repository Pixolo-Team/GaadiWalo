// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ChatBubbleInfoHelp: IconComponentData = ({
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
        id="Vector 1187"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.903452857142858 10.330357142857142h0.92196c1.0257 0 1.8571799999999998 0.8314985714285715 1.8571428571428572 1.8571985714285715v4.613792857142857"
        strokeWidth={2}
      />
      <path
        id="Vector 1188"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.930660000000001 17.26583857142857c1.89761 -0.5274471428571429 3.633444285714286 -0.5274471428571429 5.531054285714286 0"
        strokeWidth={2}
      />
      <path
        id="Vector 1189"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.710022857142858 6.097371428571429v0.5994671428571429"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.415201428571429 24.257814285714286c7.460012857142858 0 11.656227142857144 -4.199371428571429 11.656227142857144 -11.664658571428571C25.071428571428573 5.127812857142858 20.87521428571429 0.9285714285714286 13.415201428571429 0.9285714285714286 5.955225714285715 0.9285714285714286 1.7589798571428572 5.127812857142858 1.7589798571428572 12.593155714285714c0 2.2790485714285715 0.3910901428571429 4.25373 1.1467244285714286 5.897431428571428L0.9889712857142857 23.765485714285713c-0.277693 0.7642142857142857 0.4491592857142857 1.511342857142857 1.2200444285714285 1.2543142857142857l5.488377142857143 -1.8307714285714287c1.6070042857142859 0.7046 3.5208828571428574 1.0687857142857144 5.717808571428572 1.0687857142857144Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ChatBubbleInfoHelp;
