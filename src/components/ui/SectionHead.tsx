import type { ReactNode } from "react";

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  id: string;
  action?: ReactNode;
  tone?: "light" | "dark";
};

/**
 * Section opener used across the site: a 2px rule, an eyebrow, and a heading
 * set in the 12-column grid (label in the first three columns, heading after).
 */
export function SectionHead({ eyebrow, title, intro, id, action, tone = "light" }: SectionHeadProps) {
  const dark = tone === "dark";
  return (
    <header
      className={`grid gap-y-6 border-t-2 pt-5 md:grid-cols-12 md:gap-x-8 ${dark ? "border-on-dark" : "border-ink"}`}
    >
      <p className={`eyebrow md:col-span-3 ${dark ? "text-on-dark-muted" : "text-steel"}`}>{eyebrow}</p>
      <div className="md:col-span-9 grid gap-5">
        <h2
          id={id}
          className="font-display-latin max-w-[22ch] text-[clamp(2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]"
        >
          {title}
        </h2>
        {intro ? (
          <p className={`max-w-(--container-text) text-lg ${dark ? "text-on-dark-muted" : "text-steel"}`}>{intro}</p>
        ) : null}
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}
