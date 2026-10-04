"use client";

import { m, useReducedMotion } from "motion/react";

/**
 * Hero drawing: cross-section of a PE100 SDR 11 pressure pipe, Ø 110 mm,
 * wall 10.0 mm (110 / 11), rated PN 16. Drawn like a technical sheet.
 * Geometry is never mirrored: it is a drawing, not a direction.
 */
export function PipeSection({ label }: { label: string }) {
  // Reduced motion: render the finished drawing with no draw-on.
  const still = useReducedMotion();
  const draw = (delay: number) => ({
    initial: still ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] as const, delay },
  });
  const fade = (delay: number) => ({
    initial: still ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay },
  });

  return (
    <svg viewBox="0 0 420 420" role="img" aria-label={label} className="h-auto w-full max-w-[26rem]" style={{ direction: "ltr" }}>
      <g fill="none" stroke="currentColor">
        {/* Construction grid */}
        <m.path d="M210 10V410M10 210H410" strokeWidth="0.75" strokeDasharray="2 6" className="text-on-dark-muted/50" {...fade(0.2)} />
        {/* Outer and inner wall */}
        <m.circle cx="210" cy="210" r="150" strokeWidth="1.25" {...draw(0.3)} />
        <m.circle cx="210" cy="210" r="122.7" strokeWidth="1.25" {...draw(0.5)} />
        {/* Wall fill as hatching */}
        <m.circle cx="210" cy="210" r="136.4" strokeWidth="27" className="text-atlas-sky/25" {...draw(0.45)} />
        {/* Diameter dimension */}
        <m.path d="M60 392H360M60 222V404M360 222V404" strokeWidth="1" {...draw(0.9)} />
        {/* Wall thickness leader */}
        <m.path d="M316 104L346 74H398" strokeWidth="1" {...draw(1.1)} />
      </g>
      <m.g {...fade(1.2)} className="fill-current font-mono" fontSize="13">
        <rect x="178" y="382" width="64" height="20" className="fill-atlas-navy" />
        <text x="210" y="397" textAnchor="middle">Ø 110</text>
        <text x="352" y="68">e 10.0</text>
        <text x="16" y="28" className="fill-on-dark-muted">PE100</text>
        <text x="16" y="46" className="fill-on-dark-muted">SDR 11 · PN 16</text>
      </m.g>
    </svg>
  );
}
