// REACT //
import React from "react";

// TYPES //
import { IconComponentData } from "@/types/icon";

const AlertHelpQuestion: IconComponentData = ({
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
        d="M6.50091 7.4387114285714295c0 -4.041904285714287 3.81082 -7.172813142857143 7.770657142857143 -6.384275857142857C16.79418 1.5567760000000002 18.878600000000002 3.643472857142857 19.3804 6.168908571428572c0.5018 2.5254357142857145 -0.6264142857142857 4.381148571428572 -2.7649142857142857 5.811687142857143 -2.305605714285714 1.542282857142857 -3.6124400000000003 2.528982857142857 -3.6124400000000003 4.137584285714286v2.6261485714285717"
        strokeWidth={2}
      />
      <path
        id="Vector_2"
        stroke={primaryColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13.000445714285714 25.0666 0 -1.2756714285714286"
        strokeWidth={2}
      />
    </g>
  </svg>
);

export default AlertHelpQuestion;
