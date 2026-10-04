"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useDirectionSign } from "./useDirection";

/**
 * Opens a block from the reading-start edge as it enters the viewport.
 * Reserved for large visual blocks (maps, project imagery), never body text.
 */
export function SectionWipe({ children, className = "" }: { children: ReactNode; className?: string }) {
  const sign = useDirectionSign();
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const hidden = sign === 1 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  return (
    <m.div
      className={className}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
