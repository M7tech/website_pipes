"use client";

import { m, useScroll, useSpring } from "motion/react";

/**
 * Reading progress drawn as water filling a pipe along the foot of the header.
 * The flowing highlight is CSS (`water-flow`); both stop with reduced motion,
 * where the bar simply tracks the scroll position.
 */
export function ScrollWater() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="water-flow pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left rtl:origin-right"
    />
  );
}
