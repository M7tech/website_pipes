"use client";

import { m, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

type LineRiseProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
};

/**
 * Headline reveal: each word rises out of its own mask, once, on page load.
 * Used for page-opening headings only. Words keep their shaping because the
 * split happens on spaces, never inside an Arabic or Kurdish word.
 */
export function LineRise({ text, as: Tag = "h1", className = "", delay = 0.1 }: LineRiseProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
          <m.span
            className="inline-block"
            initial={{ transform: "translateY(105%)" }}
            animate={{ transform: "translateY(0%)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.045 }}
          >
            {word}
          </m.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
