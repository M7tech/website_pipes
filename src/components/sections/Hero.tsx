import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LineRise } from "@/components/motion/LineRise";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Ltr } from "@/components/ui/Ltr";
import { brandBySlug } from "@/content/brands";
import { cityNames, facts, offices, warehouses } from "@/content/company";
import { keyMilestones } from "@/content/timeline";
import { PipeSection } from "./PipeSection";
import { IraqMap } from "./IraqMap";
import { HeroCarousel } from "./HeroCarousel";
import { Waves } from "@/components/water/Waves";

const factIcons = { agents: "users", brands: "award", trained: "graduation", stock: "warehouse" } as const;

/** Partner marks shown on the brands slide (all with approved artwork). */
const heroBrands = [
  "georg-fischer",
  "polymelt",
  "pimtas",
  "poloplast",
  "turan-borfit",
  "wisa",
  "aquapa",
  "saudi-ceramics",
];

const slideTitle =
  "font-display-latin text-[clamp(2.25rem,4.8vw,4.5rem)] font-semibold leading-[1] [:lang(ar)_&]:leading-[1.28] [:lang(ckb)_&]:leading-[1.28]";

function SlideFrame({ text, visual }: { text: ReactNode; visual: ReactNode }) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="grid content-start gap-8 lg:col-span-7">{text}</div>
      <div className="hidden items-center justify-center md:flex lg:col-span-5 lg:justify-end">{visual}</div>
    </div>
  );
}

/** Year ruler for the history slide: a technical scale from 1975 to 2025 with the milestones ticked. */
function YearScale() {
  const first = 1975;
  const last = 2025;
  const span = last - first;
  const labelled = new Set([1975, 1990, 2004, 2025]);
  return (
    <div aria-hidden="true" className="w-full max-w-[28rem] select-none" style={{ direction: "ltr" }}>
      <p className="font-display-latin text-[clamp(5rem,13vw,10rem)] font-semibold leading-none tabular">1975</p>
      <div className="relative mt-10 h-16">
        <div className="absolute inset-x-0 top-0 h-px bg-on-dark-muted/60" />
        {Array.from({ length: span / 5 + 1 }, (_, i) => first + i * 5).map((y) => (
          <span
            key={y}
            className="absolute top-0 h-2 w-px bg-on-dark-muted/50"
            style={{ left: `${((y - first) / span) * 100}%` }}
          />
        ))}
        {keyMilestones.map((m) => (
          <span
            key={m.year}
            className={`absolute top-0 grid gap-2 ${
              m.year === first
                ? "justify-items-start"
                : m.year === last
                  ? "-translate-x-full justify-items-end"
                  : "-translate-x-1/2 justify-items-center"
            }`}
            style={{ left: `${((m.year - first) / span) * 100}%` }}
          >
            <span className="h-5 w-[2px] bg-on-dark" />
            {labelled.has(m.year) ? <span className="font-mono text-xs text-on-dark-muted">{m.year}</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export async function Hero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home.hero");
  const f = await getTranslations("Home.facts");
  const p = await getTranslations("Home.presence");
  const s = (key: string) => t(`slides.${key}`);

  const slides = [
    {
      id: "systems",
      image: "/images/brands/turan-borfit.jpg",
      tab: s("systems.tab"),
      content: (
        <SlideFrame
          text={
            <>
              <p className="eyebrow text-on-dark-muted">{s("systems.eyebrow")}</p>
              <LineRise text={s("systems.title")} className={slideTitle} />
              <p className="max-w-[46ch] text-lg text-on-dark-muted md:text-xl">{s("systems.lead")}</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/solutions" variant="inverse">
                  {s("systems.primary")}
                </ButtonLink>
                <ButtonLink href="/contact" variant="inverseOutline">
                  {s("systems.secondary")}
                </ButtonLink>
              </div>
            </>
          }
          visual={<PipeSection label={t("diagramLabel")} />}
        />
      ),
    },
    {
      id: "history",
      image: "/images/hero/landmark.jpg",
      tab: s("history.tab"),
      content: (
        <SlideFrame
          text={
            <>
              <p className="eyebrow text-on-dark-muted">{s("history.eyebrow")}</p>
              <h2 className={slideTitle}>{s("history.title")}</h2>
              <p className="max-w-[46ch] text-lg text-on-dark-muted md:text-xl">{s("history.lead")}</p>
              <div>
                <ButtonLink href="/about" variant="inverse">
                  {s("history.cta")}
                </ButtonLink>
              </div>
            </>
          }
          visual={<YearScale />}
        />
      ),
    },
    {
      id: "brands",
      image: "/images/brands/polymelt.jpg",
      tab: s("brands.tab"),
      content: (
        <SlideFrame
          text={
            <>
              <p className="eyebrow text-on-dark-muted">{s("brands.eyebrow")}</p>
              <h2 className={slideTitle}>{s("brands.title")}</h2>
              <p className="max-w-[46ch] text-lg text-on-dark-muted md:text-xl">{s("brands.lead")}</p>
              <div>
                <ButtonLink href="/brands" variant="inverse">
                  {s("brands.cta")}
                </ButtonLink>
              </div>
            </>
          }
          visual={
            <ul className="grid w-full max-w-[30rem] grid-cols-3 gap-2">
              {heroBrands.map((slug) => {
                const brand = brandBySlug(slug);
                return (
                  <li key={slug} className="glass-on-dark flex aspect-[4/3] items-center justify-center rounded-tile p-4">
                    <Image
                      src={brand.logo!}
                      alt={brand.name}
                      width={160}
                      height={64}
                      unoptimized
                      className="max-h-10 w-auto max-w-full object-contain opacity-85 brightness-0 invert md:max-h-12"
                    />
                  </li>
                );
              })}
            </ul>
          }
        />
      ),
    },
    {
      id: "reach",
      image: "/images/hero/warehouse-aerial.jpg",
      tab: s("reach.tab"),
      content: (
        <SlideFrame
          text={
            <>
              <p className="eyebrow text-on-dark-muted">{s("reach.eyebrow")}</p>
              <h2 className={slideTitle}>{s("reach.title")}</h2>
              <p className="max-w-[46ch] text-lg text-on-dark-muted md:text-xl">{s("reach.lead")}</p>
              <div>
                <ButtonLink href="/locations" variant="inverse">
                  {s("reach.cta")}
                </ButtonLink>
              </div>
            </>
          }
          visual={
            <IraqMap
              tone="dark"
              className="max-w-[24rem]"
              locale={locale}
              label={p("mapLabel")}
              officeCities={[...new Set(offices.map((o) => o.city))]}
              warehouseCities={warehouses.map((w) => w.id)}
              cityNames={cityNames}
            />
          }
        />
      ),
    },
  ];

  return (
    <div className="on-dark relative isolate overflow-hidden bg-atlas-navy pb-10 text-on-dark md:pb-16">
      <div className="container-page pb-4 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)] lg:pt-[calc(var(--header-h)+6rem)]">
        <HeroCarousel
          slides={slides}
          labels={{
            label: t("label"),
            prev: t("prev"),
            next: t("next"),
            pause: t("pause"),
            play: t("play"),
            slideOf: slides.map((_, i) => t("slideOf", { current: i + 1, total: slides.length })),
          }}
        />
      </div>

      <div className="container-page">
        <dl aria-label={f("label")} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.key} className="glass-on-dark flex flex-col-reverse justify-end gap-2 rounded-card p-5 md:p-6">
              <dt className="flex max-w-[26ch] items-start gap-2 text-sm text-on-dark-muted">
                <Icon name={factIcons[fact.key]} className="size-5 shrink-0 text-atlas-mist" />
                {f(fact.key)}
              </dt>
              <dd className="font-display-latin text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tabular">
                <Ltr>{fact.value}</Ltr>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <Waves />
    </div>
  );
}
