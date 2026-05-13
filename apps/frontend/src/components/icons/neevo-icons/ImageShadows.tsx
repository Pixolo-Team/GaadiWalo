// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ImageShadows: IconComponentData = ({
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
        d="M13 25.071428571428573C5.274285714285714 25.071428571428573 0.9285714285714286 20.725714285714286 0.9285714285714286 13S5.274285714285714 0.9285714285714286 13 0.9285714285714286s12.071428571428571 4.345714285714285 12.071428571428571 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
      <path
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.628605714285714 5.168577142857143c4.628501428571429 0.22876285714285716 7.218194285714286 3.022834285714286 7.218194285714286 7.831181428571428 0 4.815627142857143 -2.5975485714285713 7.610812857142858 -7.239235714285715 7.832184285714285 0.7537400000000001 -5.757347142857143 0.7587357142857144 -10.10855857142857 0.021041428571428572 -15.663365714285716Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ImageShadows;
