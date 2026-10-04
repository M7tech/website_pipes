import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { brands } from "@/content/brands";
import { pageMetadata } from "@/lib/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { BrandGrid } from "@/components/brands/BrandGrid";
import { ContactBand } from "@/components/sections/ContactBand";

const countryCount = new Set(brands.map((b) => b.country).filter(Boolean)).size;

export async function generateMetadata({ params }: PageProps<"/[locale]/brands">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brands.index" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/brands",
    title: t("eyebrow"),
    description: meta("brandsDescription"),
    siteName: meta("siteName"),
  });
}

export default async function BrandsPage({ params }: PageProps<"/[locale]/brands">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Brands.index");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro", { count: countryCount })}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("brands") }]}
      />
      <section aria-label={t("eyebrow")} className="section-space">
        <div className="container-page">
          <BrandGrid detailed />
        </div>
      </section>
      <ContactBand />
    </>
  );
}
