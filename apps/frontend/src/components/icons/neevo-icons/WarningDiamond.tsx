// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const WarningDiamond: IconComponentData = ({
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
        d="M2.39005 10.269907142857145c2.346574285714286 -2.9074314285714284 4.884898571428571 -5.454484285714286 7.781242857142857 -7.8075214285714285 1.76111 -1.430739142857143 3.872588571428572 -1.4213345714285714 5.63537 0 2.9111085714285716 2.3472614285714286 5.443694285714286 4.8871271428571434 7.785737142857142 7.8075214285714285 1.3484714285714285 1.6813457142857144 1.3575714285714287 3.788107142857143 0 5.467855714285714 -2.3710142857142857 2.9341371428571428 -4.938328571428571 5.50108 -7.8728371428571435 7.872465714285714 -1.65061 1.3337999999999999 -3.755217142857143 1.3247000000000002 -5.407387142857143 0 -2.968364285714286 -2.3803 -5.543385714285715 -4.9569 -7.922125714285715 -7.926917142857143 -1.3250862857142858 -1.6544914285714287 -1.3340841428571428 -3.7604542857142857 0 -5.413404285714286Z"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7.599057142857143v6.387791428571428"
        strokeWidth={2}
      />
      <path
        id="Vector 2494"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 17.248845714285714v1.1525242857142857"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default WarningDiamond;
