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
    <div ref={ref} className={`relative min-w-0 pt-8 ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-full bg-rule">
        <m.div
          style={{ scaleX }}
          className="absolute inset-0 bg-atlas-blue origin-left rtl:origin-right motion-reduce:!scale-x-100"
        />
      </div>
      {children}
    </div>
  );
}
