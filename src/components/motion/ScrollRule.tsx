"use client";

import { m, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * A timeline rule that fills along the reading direction as the section scrolls past.
 * With reduced motion the rule is simply drawn in full.
 */
export function ScrollRule({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-rule" />
      <m.div
        aria-hidden="true"
        style={{ scaleX }}
        className="absolute inset-x-0 top-0 h-[3px] -translate-y-px bg-atlas-blue origin-left rtl:origin-right motion-reduce:!scale-x-100"
      />
      {children}
    </div>
  );
}
