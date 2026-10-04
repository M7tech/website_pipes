import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { brands } from "@/content/brands";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { BrandGrid } from "@/components/brands/BrandGrid";
import { ContactBand } from "@/components/sections/ContactBand";

const countryCount = new Set(brands.map((b) => b.country).filter(Boolean)).size;

export async function generateMetadata({ params }: PageProps<"/[locale]/brands">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/brands",
    title: meta("brandsTitle"),
    description: meta("brandsDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function BrandsPage({ params }: PageProps<"/[locale]/brands">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Brands.index");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/brands",
          type: "CollectionPage",
          name: meta("brandsTitle"),
          description: meta("brandsDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("brands"), path: "/brands" },
          ],
        })}
      />
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
