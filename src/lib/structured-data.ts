import type { Locale } from "@/i18n/routing";
import { cityNames, company, offices, regionalOffices } from "@/content/company";
import { ORG_ID, SITE_URL, localeUrl } from "@/lib/site";

const logo = `${SITE_URL}/brand/atlasplast.svg`;

/** The AtlasPlast Organization and WebSite nodes (Home page). Only confirmed company facts. */
export function organizationLd(locale: Locale, { name, description }: { name: string; description: string }) {
  const hq = offices.find((o) => o.hq);
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: company.name,
      alternateName: name,
      legalName: company.legalName,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: logo },
      image: logo,
      description,
      foundingDate: String(company.foundingYear),
      email: company.email,
      telephone: company.mainPhone,
      address: {
        "@type": "PostalAddress",
        streetAddress: hq?.name.en,
        addressLocality: "Baghdad",
        addressCountry: "IQ",
      },
      areaServed: { "@type": "Country", name: "Iraq" },
      sameAs: Object.values(company.social),
      contactPoint: contactPointLd().contactPoint,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: localeUrl(locale),
      name: company.name,
      inLanguage: ["en", "ar", "ckb"],
      publisher: { "@id": ORG_ID },
    },
  ];
}

/** Contact points of the Organization: main line for sales, the projects line and WhatsApp. */
export function contactPointLd() {
  const languages = ["English", "Arabic", "Kurdish"];
  return {
    "@id": ORG_ID,
    contactPoint: [
      { "@type": "ContactPoint", telephone: company.mainPhone, contactType: "sales", areaServed: "IQ", availableLanguage: languages },
      { "@type": "ContactPoint", telephone: company.projectsPhone, contactType: "sales", name: "Projects division", areaServed: "IQ", availableLanguage: languages },
      { "@type": "ContactPoint", telephone: company.whatsapp, contactType: "customer service", areaServed: "IQ", availableLanguage: languages },
    ],
  };
}

/** One LocalBusiness node per Iraqi office, linked to the Organization. */
export function officesLd(locale: Locale) {
  return [
    ...offices.map((o) => ({
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#office-${o.id}`,
      name: `${company.name} · ${o.name[locale]}`,
      image: logo,
      url: localeUrl(locale, "/locations"),
      ...(o.phone ? { telephone: o.phone } : {}),
      address: { "@type": "PostalAddress", addressLocality: cityNames[o.city][locale], addressCountry: "IQ" },
      parentOrganization: { "@id": ORG_ID },
    })),
    {
      "@id": ORG_ID,
      areaServed: [
        { "@type": "Country", name: "Iraq" },
        ...regionalOffices.map((r) => ({ "@type": "Country", name: r.en })),
      ],
    },
  ];
}

/** ItemList of product lines (names only: no prices or reviews, so no Product rich-result claims). */
export function productLinesLd(id: string, lines: { name: string; brand: string }[]) {
  return {
    "@type": "ItemList",
    "@id": id,
    numberOfItems: lines.length,
    itemListElement: lines.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: `${l.name} (${l.brand})` })),
  };
}
