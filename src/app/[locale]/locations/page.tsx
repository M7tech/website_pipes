import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { officesLd } from "@/lib/structured-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Presence } from "@/components/sections/Presence";
import { ContactBand } from "@/components/sections/ContactBand";
import { OfficeLines } from "@/components/company/OfficeLines";

export async function generateMetadata({ params }: PageProps<"/[locale]/locations">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/locations",
    title: meta("locationsTitle"),
    description: meta("locationsDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function LocationsPage({ params }: PageProps<"/[locale]/locations">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Locations");
  const c = await getTranslations("Contact");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/locations",
          type: "WebPage",
          name: meta("locationsTitle"),
          description: meta("locationsDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("locations"), path: "/locations" },
          ], extra: officesLd(locale as Locale),
        })}
      />
      <PageHeader
        image={{ src: "/images/hero/warehouse-aerial.jpg", alt: common("warehousePhoto") }}
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
