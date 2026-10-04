import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { SolutionList } from "@/components/solutions/SolutionList";
import { ContactBand } from "@/components/sections/ContactBand";
import { PipeSection } from "@/components/sections/PipeSection";

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/solutions",
    title: meta("solutionsTitle"),
    description: meta("solutionsDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function SolutionsPage({ params }: PageProps<"/[locale]/solutions">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Solutions.index");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");
  const hero = await getTranslations("Home.hero");

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/solutions",
          type: "CollectionPage",
          name: meta("solutionsTitle"),
          description: meta("solutionsDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("solutions"), path: "/solutions" },
          ],
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("solutions") }]}
        aside={<PipeSection label={hero("diagramLabel")} />}
      />
      <section aria-label={t("eyebrow")} className="section-space bg-surface">
        <div className="container-page">
          <SolutionList headingLevel="h2" />
        </div>
      </section>
      <ContactBand />
    </>
  );
}
