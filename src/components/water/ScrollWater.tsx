"use client";

import { m, useScroll, useSpring } from "motion/react";

/**
 * Reading progress drawn as water filling a pipe along the foot of the header.
 * The pipe scales with the scroll; inside it a CSS strip (`water-flow`) slides
 * the highlight along on the compositor. Both stop with reduced motion, where
 * the bar simply tracks the scroll position.
 */
export function ScrollWater() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left overflow-hidden rtl:origin-right"
    >
      <span className="water-flow absolute inset-y-0 left-0 w-[400%]" />
    </m.div>
  );
}
