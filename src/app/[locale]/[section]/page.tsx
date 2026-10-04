import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { placeholderSections } from "@/lib/nav";
import { company } from "@/content/company";
import { languageAlternates, localeUrl } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Ltr } from "@/components/ui/Ltr";

/**
 * Interim page for sections that will be built after the Home page benchmark.
 * Keeps navigation working in all three languages without inventing content.
 */
const sections: readonly string[] = placeholderSections;
type Section = (typeof placeholderSections)[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => sections.map((section) => ({ locale, section })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[section]">): Promise<Metadata> {
  const { locale, section } = await params;
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: nav(section as Section),
    description: meta("placeholderDescription"),
    alternates: { canonical: localeUrl(locale as Locale, `/${section}`), languages: languageAlternates(`/${section}`) },
    robots: { index: false },
  };
}

export default async function SectionPlaceholder({ params }: PageProps<"/[locale]/[section]">) {
  const { locale, section } = await params;
  if (!sections.includes(section as Section)) notFound();
  setRequestLocale(locale);
  const nav = await getTranslations("Nav");
  const t = await getTranslations("Placeholder");
  const footer = await getTranslations("Footer");

  return (
    <section className="section-space">
      <div className="container-page grid gap-8 md:grid-cols-12 md:gap-x-8">
        <p className="eyebrow text-steel md:col-span-3 md:pt-4">{t("eyebrow")}</p>
        <div className="grid gap-8 md:col-span-9">
          <h1 className="font-display-latin text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-none [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]">
            {nav(section as Section)}
          </h1>
          <p className="max-w-(--container-text) text-lg text-steel">{t("body")}</p>
          <p className="flex items-baseline gap-4">
            <span className="text-steel">{footer("mainLine")}</span>
            <a href={`tel:${company.mainPhone}`} className="font-display-latin text-4xl font-semibold tabular">
              <Ltr>{company.mainPhone}</Ltr>
            </a>
          </p>
          <div>
            <ButtonLink href="/" variant="secondary">{t("back")}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
