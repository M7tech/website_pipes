import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { milestones, type Milestone } from "@/content/timeline";
import { brandBySlug } from "@/content/brands";
import { chairman } from "@/content/leadership";
import { Arrow } from "@/components/ui/Arrow";
import { Icon } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import { HistoryTrack } from "./HistoryTrack";

/**
 * The full company history on About: a sticky water gauge that fills and counts
 * the years as the milestones scroll past it, beside a vertical timeline of cards.
 * Every fact comes from `src/content/timeline.ts`.
 */
export async function HistoryTimeline() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home.timeline");
  const slides = await getTranslations("Home.hero.slides.history");
  const about = await getTranslations("About");

  const items = milestones.map((m) => ({
    key: `${m.year}-${m.text.en}`,
    year: m.year,
    until: m.until,
    detail: Boolean(m.detail),
    card: <MilestoneCard milestone={m} locale={locale} />,
  }));

  return (
    <section aria-labelledby="timeline-title" className="section-space">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead id="timeline-title" eyebrow={t("eyebrow")} title={t("title")} intro={slides("lead")} />
        <HistoryTrack items={items} label={about("historyTitle")} />
      </div>
    </section>
  );
}

function MilestoneCard({ milestone: m, locale }: { milestone: Milestone; locale: Locale }) {
  return (
    <div className="flex items-start gap-4 rounded-card bg-surface p-5 md:gap-5 md:p-7">
      <span className="hidden size-11 shrink-0 place-items-center rounded-tile sm:grid bg-paper text-atlas-blue md:size-12">
        <Icon name={m.icon} />
      </span>
      <div className="grid min-w-0 flex-1 gap-4 sm:pt-1.5 md:pt-2">
        <p
          className={m.detail ? "max-w-[52ch] text-ink/80" : "max-w-[44ch] text-lg font-medium leading-snug text-ink md:text-xl"}
        >
          {m.text[locale]}
        </p>
        {m.media?.kind === "brand" ? <BrandChip slug={m.media.slug} /> : null}
        {m.media?.kind === "chairman" ? (
          <Link
            href="/about/board"
            className="group pressable flex items-center gap-4 justify-self-start rounded-tile bg-paper p-2.5 pe-5"
          >
            <Image
              src={chairman.photo.src}
              width={chairman.photo.width}
              height={chairman.photo.height}
              alt=""
              sizes="4rem"
              className="size-16 rounded-[0.75rem] object-cover object-top"
            />
            <span className="grid gap-0.5">
              <span className="font-semibold">{chairman.name[locale]}</span>
              <span className="text-sm text-steel">{chairman.role[locale]}</span>
            </span>
            <Arrow className="text-atlas-blue transition-[translate] duration-(--duration-base) group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function BrandChip({ slug }: { slug: string }) {
  const brand = brandBySlug(slug);
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group pressable flex items-center gap-4 justify-self-start rounded-tile bg-paper px-4 py-3"
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt=""
          width={240}
          height={80}
          unoptimized
          className="h-8 w-auto max-w-36 object-contain grayscale transition-[filter] duration-(--duration-base) group-hover:grayscale-0"
        />
      ) : null}
      <span lang="en" className="text-sm font-medium">
        {brand.name}
      </span>
      <Arrow className="text-atlas-blue transition-[translate] duration-(--duration-base) group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}
