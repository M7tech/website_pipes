import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { company, offices } from "@/content/company";
import { SITE_URL, languageAlternates, localeUrl } from "@/lib/site";
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
  return {
    title: { absolute: t("homeTitle") },
    description: t("homeDescription"),
    alternates: { canonical: localeUrl(locale as Locale), languages: languageAlternates() },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: localeUrl(locale as Locale),
      locale,
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Organization data uses only confirmed company facts.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/atlasplast.svg`,
    foundingDate: String(company.foundingYear),
    email: company.email,
    telephone: company.mainPhone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Baghdad",
      addressCountry: "IQ",
      streetAddress: offices.find((o) => o.hq)?.name.en,
    },
    sameAs: Object.values(company.social),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
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
