// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const WishlistLoveAddFavorite: IconComponentData = ({
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
        d="M11.404027142857142 19.461928571428572C9.401265714285714 19.461928571428572 0.9285714285714286 13.76516142857143 0.9285714285714286 6.825074285714286c0.07031328571428572 -4.661781428571429 5.4142028571428575 -8.986064285714287 10.475437142857144 -2.8997985714285717C16.465261428571427 -2.16099 21.809171428571428 2.1635714285714287 21.879371428571428 6.825352857142858c0 1.7359271428571428 -0.5300285714285714 3.3940214285714285 -1.3562714285714286 4.9046400000000006"
        strokeWidth={2}
      />
      <path
        id="Vector"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.42857142857143 15.785714285714286v9.285714285714286M15.785714285714286 20.42857142857143h9.285714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default WishlistLoveAddFavorite;
