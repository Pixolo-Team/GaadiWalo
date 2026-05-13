// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const GalleryView: IconComponentData = ({
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
        d="M1.8299375714285715 15.836191428571428c0.2082952857142857 1.4008614285714287 1.3537810000000001 2.4876057142857144 2.756035285714286 2.608654285714286 5.681668571428571 0.4903971428571429 11.146385714285715 0.4903971428571429 16.827998571428573 0 1.4023285714285714 -0.12104857142857144 2.547814285714286 -1.2077928571428571 2.7560000000000002 -2.608654285714286 0.582957142857143 -3.919425714285714 0.582957142857143 -7.547391428571428 0 -11.466817142857142 -0.2081857142857143 -1.4008614285714287 -1.3536714285714286 -2.4876057142857144 -2.7560000000000002 -2.608658 -5.6816128571428575 -0.49047885714285716 -11.14633 -0.49047885714285716 -16.827998571428573 0 -1.4022542857142857 0.12105228571428572 -2.54774 1.2077965714285714 -2.7560371428571426 2.608658 -0.5827714285714286 3.919425714285714 -0.5827714285714286 7.547391428571428 0.00000185714285714286 11.466817142857142Z"
        strokeWidth={2}
      />
      <path
        id="Vector 621"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.7088442857142856 24.606957142857144H1.7622837142857144"
        strokeWidth={2}
      />
      <path
        id="Vector 621_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.549797142857143 24.607142857142858H8.60325142857143"
        strokeWidth={2}
      />
      <path
        id="Vector 621_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.38894857142857 24.607142857142858H15.442384285714287"
        strokeWidth={2}
      />
      <path
        id="Vector 621_4"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.2281 24.606957142857144h-1.9466571428571429"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default GalleryView;
