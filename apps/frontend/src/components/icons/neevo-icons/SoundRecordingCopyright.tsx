// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const SoundRecordingCopyright: IconComponentData = ({
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
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.809855714285716 18.31451142857143V12.796865714285715"
        strokeWidth={2}
      />
      <path
        id="Vector_3"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.809855714285716 8.614227142857143v4.955711428571429c1.616772857142857 0.43416285714285713 3.362282857142857 0.5917971428571429 4.735435714285715 0.47286571428571433 1.5975885714285716 -0.13835714285714285 2.4836314285714285 -1.39061 2.569152857142857 -2.991894285714286 0.10992428571428571 -2.0579742857142858 -1.4344014285714286 -3.3652542857142858 -3.4952914285714285 -3.3652542857142858H10.738427142857143c-0.51285 0 -0.9285714285714286 0.4157214285714286 -0.9285714285714286 0.9285714285714286Z"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default SoundRecordingCopyright;
