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
 * Section opener used across the site: a coloured eyebrow stacked over a large,
 * tightly tracked heading, with an optional intro and link beneath.
 */
export function SectionHead({ eyebrow, title, intro, id, action, tone = "light" }: SectionHeadProps) {
  const dark = tone === "dark";
  return (
    <header className="grid max-w-4xl gap-5">
      <p className={`eyebrow ${dark ? "text-atlas-mist" : "text-atlas-blue"}`}>{eyebrow}</p>
      <h2
        id={id}
        className="font-display-latin max-w-[22ch] text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.04] [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]"
      >
        {title}
      </h2>
      {intro ? (
        <p className={`max-w-[46ch] text-lg md:text-xl ${dark ? "text-on-dark-muted" : "text-steel"}`}>{intro}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </header>
  );
}
