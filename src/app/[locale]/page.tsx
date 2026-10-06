import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ORG_ID, SITE_URL, localeUrl, pageMetadata } from "@/lib/site";
import { organizationLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { SolutionIndex } from "@/components/sections/SolutionIndex";
import { BrandWall } from "@/components/sections/BrandWall";
import { ProjectIndex } from "@/components/sections/ProjectIndex";
import { Timeline } from "@/components/sections/Timeline";
import { ServiceModel } from "@/components/sections/ServiceModel";
import { Presence } from "@/components/sections/Presence";
import { ContactBand } from "@/components/sections/ContactBand";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "",
    title: t("homeTitle"),
    description: t("homeDescription"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const meta = await getTranslations("Meta");
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      ...organizationLd(locale as Locale, { name: meta("siteName"), description: meta("homeDescription") }),
      {
        "@type": "WebPage",
        "@id": `${localeUrl(locale as Locale)}#webpage`,
        url: localeUrl(locale as Locale),
        name: meta("homeTitle"),
        description: meta("homeDescription"),
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": ORG_ID },
      },
    ],
  };

  return (
    <>
      <JsonLd data={ld} />
      <Hero />
      <Statement />
      <SolutionIndex />
      <BrandWall />
      <ProjectIndex />
      <Timeline />
      <ServiceModel />
      <Presence />
      <ContactBand />
    </>
  );
}
