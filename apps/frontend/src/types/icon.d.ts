// REACT //
import type { ComponentType, SVGProps } from "react";

export type IconComponentPropsData = SVGProps<SVGSVGElement> & {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
};

export type IconComponentData = ComponentType<IconComponentPropsData>;
