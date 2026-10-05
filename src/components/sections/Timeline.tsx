import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { keyMilestones, milestones } from "@/content/timeline";
import { Ltr } from "@/components/ui/Ltr";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { ScrollRule } from "@/components/motion/ScrollRule";

/**
 * Set `cta` to false on the page the section links to, and `full` to list
 * every milestone rather than the key ones.
 */
export async function Timeline({ cta = true, full = false }: { cta?: boolean; full?: boolean } = {}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home.timeline");

  return (
    <section aria-labelledby="timeline-title" className="section-space">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="timeline-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          action={cta ? <TextLink href="/about">{t("cta")}</TextLink> : undefined}
        />
        <ScrollRule>
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {(full ? milestones : keyMilestones).map((m) => (
              <li key={`${m.year}-${m.text.en}`} className="relative grid content-start gap-3 border-b border-rule py-8 lg:border-b-0 lg:pb-12 lg:nth-[n+5]:border-t">
                <span aria-hidden="true" className="absolute start-0 top-0 h-3 w-px -translate-y-1/2 bg-ink" />
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
