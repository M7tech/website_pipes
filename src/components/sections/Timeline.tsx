import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { milestones } from "@/content/timeline";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { ScrollRule } from "@/components/motion/ScrollRule";

export async function Timeline() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home.timeline");

  return (
    <section aria-labelledby="timeline-title" className="section-space">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="timeline-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          action={<TextLink href="/about">{t("cta")}</TextLink>}
        />
        <ScrollRule>
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <li key={m.year} className="relative grid content-start gap-3 border-b border-rule py-8 lg:border-b-0 lg:pb-12 lg:nth-[n+5]:border-t">
                <span aria-hidden="true" className="absolute start-0 top-0 h-3 w-px -translate-y-1/2 bg-ink" />
                <span className="font-display-latin text-[clamp(2.25rem,3.6vw,3.25rem)] font-semibold leading-none tabular text-atlas-blue">
                  {m.year}
                </span>
                <p className="max-w-[30ch] text-ink/85">{m.text[locale]}</p>
              </li>
            ))}
          </ol>
        </ScrollRule>
      </div>
    </section>
  );
}
