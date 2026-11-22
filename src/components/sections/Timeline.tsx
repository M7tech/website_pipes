import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { keyMilestones } from "@/content/timeline";
import { Ltr } from "@/components/ui/Ltr";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { ScrollRule } from "@/components/motion/ScrollRule";

/** The key milestones on Home; About tells the full story in `HistoryTimeline`. */
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
          <ol className="shelf gap-3 sm:grid sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {keyMilestones.map((m) => (
              <li key={`${m.year}-${m.text.en}`} className="grid content-start gap-3 rounded-card bg-surface p-6 md:p-7">
                <span className="font-display-latin text-[clamp(2.25rem,3.6vw,3.25rem)] font-semibold leading-none tabular text-atlas-blue">
                  <Ltr>
                    {m.year}
                    {m.until ? <span className="text-[0.6em]">–{m.until}</span> : null}
                  </Ltr>
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
