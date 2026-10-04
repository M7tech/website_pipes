import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { Presence } from "@/components/sections/Presence";
import { ContactBand } from "@/components/sections/ContactBand";
import { OfficeLines } from "@/components/company/OfficeLines";

export async function generateMetadata({ params }: PageProps<"/[locale]/locations">): Promise<Metadata> {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "Nav" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/locations",
    title: nav("locations"),
    description: meta("locationsDescription"),
    siteName: meta("siteName"),
  });
}

export default async function LocationsPage({ params }: PageProps<"/[locale]/locations">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Locations");
  const c = await getTranslations("Contact");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("locations") }]}
      />
      <Presence cta={false} />
      <section aria-labelledby="branches-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <h2 id="branches-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {c("branches")}
          </h2>
          <OfficeLines />
        </div>
      </section>
      <ContactBand />
    </>
  );
}
