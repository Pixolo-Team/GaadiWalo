"use client";

// REACT //
import { useRef } from "react";
import type { ElementType, ReactNode } from "react";

// LIBRARIES //
import { motion, type MotionProps, type Variants } from "motion/react";

type MotionWrapperProps = MotionProps & {
  as?: string;
  variants?: Variants;
  delay?: number;
  children?: ReactNode;
  isFixed?: boolean;
  className?: string;
  type?: string;
  "aria-pressed"?: boolean | "true" | "false" | "mixed";
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: React.CSSProperties;
};

/**
 * Reusable motion wrapper. Pass variants from lib/animations.
 * Use isFixed=true for elements already on screen, false for scroll-triggered.
 */
export default function Motion({
  as = "div",
  variants,
  delay = 0,
  children,
  isFixed = true,
  ...props
}: MotionWrapperProps) {
  const ref = useRef<HTMLElement | null>(null);

  // Patch variants with delay so each instance can stagger independently.
  const patchedVariants: Variants | undefined = variants
    ? {
        ...variants,
        show: {
          ...(variants.show as object),
          transition: {
            ...(variants.show as { transition?: object })?.transition,
            delay,
          },
        },
      }
    : undefined;

  const motionMap = motion as unknown as Record<string, ElementType>;
  const Component = motionMap[as] ?? motion.div;

  return (
    <Component
      ref={ref as never}
      variants={patchedVariants}
      initial="hidden"
      {...(isFixed
        ? { animate: "show" }
        : {
            whileInView: "show",
            viewport: { once: true, amount: 0.2 },
          })}
      {...props}
    >
      {children}
    </Component>
  );
}
