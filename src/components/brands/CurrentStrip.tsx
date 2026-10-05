"use client";

import { useState, type ReactNode } from "react";

/**
 * Frame for a `current` photo strip with a visible pause button. Hover and
 * keyboard focus already hold the strip, but touch screens have neither, and
 * moving content must be stoppable (WCAG 2.2.2). The button is hidden with
 * reduced motion, where the strip does not move.
 */
export function CurrentStrip({
  label,
  pause,
  play,
  children,
}: {
  label: string;
  pause: string;
  play: string;
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-label={label} className="grid gap-2">
      <div className="container-page flex justify-end motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? play : pause}
          className="inline-flex size-11 items-center justify-center border border-transparent text-steel transition-[scale] duration-(--duration-base) ease-(--ease-out-expo) hover:border-rule hover:text-ink active:scale-[0.95] active:duration-(--duration-fast)"
        >
          {paused ? (
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="currentColor">
              <path d="M6 4l10 6-10 6z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="currentColor">
              <rect x="5" y="4" width="3" height="12" />
              <rect x="12" y="4" width="3" height="12" />
            </svg>
          )}
        </button>
      </div>
      <div data-paused={paused ? "" : undefined} className="current overflow-hidden py-2">
        {children}
      </div>
    </section>
  );
}
