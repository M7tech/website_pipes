"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useDirectionSign } from "./useDirection";

/**
 * Opens a block from the reading-start edge as it enters the viewport.
 * Reserved for large visual blocks (maps, project imagery), never body text.
 * The observer watches an unclipped wrapper: Chrome treats a fully clipped
 * element as not intersecting, so watching the clipped block itself never fires.
 */
export function SectionWipe({ children, className = "" }: { children: ReactNode; className?: string }) {
  const sign = useDirectionSign();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = sign === 1 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";
  return (
    <div ref={ref} className={className}>
      <div
        style={
          reduce
            ? undefined
            : {
                clipPath: shown ? "inset(0 0 0 0)" : hidden,
                transition: "clip-path 1.1s var(--ease-out-expo)",
              }
        }
      >
        {children}
      </div>
    </div>
  );
}
