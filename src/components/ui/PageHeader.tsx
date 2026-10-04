import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Waves } from "@/components/water/Waves";
import { Icon, type IconName } from "./Icon";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  eyebrow: string;
  /** Line icon shown with the eyebrow. */
  icon?: IconName;
  title: string;
  /** Set when the title is a Latin name shown on an Arabic-script page, e.g. "en". */
  titleLang?: string;
  intro?: string;
  crumbs: Crumb[];
  breadcrumbLabel: string;
  /** Optional drawing or figure on the end side. */
  aside?: ReactNode;
  /** Backdrop photo under a navy wash. */
  image?: { src: string; alt: string };
  /** Fill of the wave edge: the background of the section that follows. */
  waveFill?: string;
  children?: ReactNode;
};

/**
 * Opening band for inner pages: continues the navy header, carries the
 * breadcrumb, the page h1 and an optional technical drawing.
 */
export function PageHeader({ eyebrow, icon, title, titleLang, intro, crumbs, breadcrumbLabel, aside, image, waveFill, children }: PageHeaderProps) {
  return (
    <header className="on-dark relative isolate overflow-hidden bg-atlas-navy text-on-dark">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {image ? (
          <>
            <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="ken-burns object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-atlas-navy/95 via-atlas-navy/75 to-atlas-navy/25 rtl:bg-linear-to-l" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-atlas-navy/80 via-transparent to-atlas-navy/40" />
          </>
        ) : null}
        <div aria-hidden="true" className="caustics absolute -inset-[10%] mix-blend-screen" />
      </div>
      <div className="container-page grid gap-10 pb-20 pt-8 md:pb-28 lg:grid-cols-12 lg:gap-8">
        <nav aria-label={breadcrumbLabel} className="lg:col-span-12">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-on-dark-muted">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {c.href ? (
                  <Link href={c.href} className="hover:text-white hover:underline hover:underline-offset-4">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-on-dark">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className={`grid content-start gap-6 ${aside ? "lg:col-span-8" : "lg:col-span-10"}`}>
          <p className="eyebrow flex items-center gap-3 text-on-dark-muted">
            {icon ? <Icon name={icon} className="size-8 text-atlas-sky" /> : null}
            {eyebrow}
          </p>
          <h1 lang={titleLang} className="font-display-latin max-w-[20ch] text-[clamp(2.4rem,6vw,5.25rem)] font-semibold leading-[1] [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]">
            {title}
          </h1>
          {intro ? <p className="max-w-[52ch] text-lg text-on-dark-muted md:text-xl">{intro}</p> : null}
          {children}
        </div>
        {aside ? <div className="flex items-end justify-start lg:col-span-4 lg:justify-end">{aside}</div> : null}
      </div>
      <Waves fillClass={waveFill} />
    </header>
  );
}
