// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const ImageHighlights: IconComponentData = ({
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
        d="M13 25.071428571428573c7.725714285714286 0 12.071428571428571 -4.345714285714285 12.071428571428571 -12.071428571428571S20.725714285714286 0.9285714285714286 13 0.9285714285714286 0.9285714285714286 5.274285714285714 0.9285714285714286 13s4.345714285714285 12.071428571428571 12.071428571428571 12.071428571428571Z"
        strokeWidth={2}
      />
      <path
        id="Intersect"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.39602 5.469861428571429C7.945525714285715 5.689821428571429 5.455357142857143 8.376438571428572 5.455357142857143 12.99985142857143c0 4.630414285714286 2.4977085714285714 7.31822 6.9608871428571435 7.530862857142858 -0.7247685714285714 -5.535827142857143 -0.7295600000000001 -9.719691428571428 -0.020224285714285715 -15.060852857142859Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default ImageHighlights;
