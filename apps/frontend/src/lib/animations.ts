// LIBRARIES //
import type { Variants } from "motion/react";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.35 },
  },
};

export const slideIndown: Variants = {
  hidden: { opacity: 0, y: -100 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const shrinkIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "backOut" },
  },
};

/** Stagger wrapper that reveals its children one after another. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

/** Shared tap press feedback applied via whileTap on interactive elements. */
export const pressTap = { scale: 0.95 } as const;

/** Dashboard greeting row — slides down from a small offset. */
export const greetingEnter: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/** Dashboard summary card — slides up with a short delay after the greeting. */
export const summaryCardEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", delay: 0.1 },
  },
};

/** Subtle entrance for lead cards — fades up from a small offset. */
export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/**
 * Directional slide variants for tab panel transitions.
 * Pass `custom={direction}` where direction is 1 (forward) or -1 (back).
 */
export const tabSlideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 24 : -24,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction >= 0 ? -24 : 24,
    opacity: 0,
  }),
};
