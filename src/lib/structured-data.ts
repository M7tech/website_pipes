import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { mapsHref, cityNames, company, offices, regionalOffices } from "@/content/company";
import { brandBySlug, type Brand } from "@/content/brands";
import { faqAnswer, type Faq } from "@/content/faq";
import { solutionKey, type ProductLine, type Solution } from "@/content/solutions";
import { ORG_ID, SITE_URL, localeUrl } from "@/lib/site";

const logo = `${SITE_URL}/brand/atlasplast.svg`;

/** Office hours (Home.contact.hours): Saturday to Thursday, 07:00 to 15:00. */
const openingHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  opens: "07:00",
  closes: "15:00",
};

/** What AtlasPlast supplies, in plain terms, for the Organization's knowsAbout. */
const knowsAbout = [
  "PP-R and PP-RCT water supply pipes",
  "Low-noise drainage systems",
  "PVC-U and KG sewer pipes",
  "PE100 and U-PVC pressure pipes",
  "Galvanized malleable iron fittings",
  "Sanitaryware and concealed cisterns",
  "Ceramic and porcelain tiles",
  "Electric water heaters",
  "Water pumps and pressure boosting",
  "Faucets and valves",
  "Pipe welding machines and installation tools",
];

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
      brand: { "@type": "Brand", name: company.name, logo },
      knowsAbout,
      knowsLanguage: ["en", "ar", "ckb"],
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
      { "@type": "ContactPoint", telephone: company.salesPhone, contactType: "sales", name: "Sales department", areaServed: "IQ", availableLanguage: languages },
      { "@type": "ContactPoint", telephone: company.whatsapp, contactType: "customer service", name: "WhatsApp, Al-Shaab branch", areaServed: "IQ", availableLanguage: languages },
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
      email: company.email,
      hasMap: mapsHref(o),
      openingHoursSpecification: openingHours,
      areaServed: { "@type": "Country", name: "Iraq" },
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

/** Brand node for a manufacturer AtlasPlast represents; one stable @id per brand. */
export function brandLd(brand: Brand, locale: Locale) {
  return {
    "@type": "Brand",
    "@id": `${SITE_URL}/#brand-${brand.slug}`,
    name: brand.name,
    url: localeUrl(locale, `/brands/${brand.slug}`),
    ...(brand.logo ? { logo: `${SITE_URL}${brand.logo}` } : {}),
  };
}

/**
 * Product lines as an ItemList of Product nodes, with their Brand nodes. Product data is what the
 * pages show (name, description, brand, specs, photo); there are no prices or reviews, so these
 * describe the range and do not claim price or rating rich results.
 */
export async function productLinesLd(
  locale: Locale,
  id: string,
  groups: { solution: Solution; lines: ProductLine[] }[],
) {
  const t = await getTranslations({ locale, namespace: "Solutions" });
  const countries = await getTranslations({ locale, namespace: "Countries" });
  const lines = groups.flatMap(({ solution, lines }) => lines.map((line) => ({ solution, line })));
  const brands = [...new Set(lines.map(({ line }) => line.brand))].map(brandBySlug);

  const products = lines.map(({ solution, line }) => {
    const brand = brandBySlug(line.brand);
    const photo = solution.photos.find((p) => p.brand === line.brand);
    const image = photo?.src ?? line.logo ?? brand.logo;
    const url = localeUrl(locale, `/solutions/${solution.slug}`);
    return {
      "@type": "Product",
      "@id": `${url}#${line.id}`,
      name: t.has(`lines.${line.id}.name`) ? t(`lines.${line.id}.name`) : line.name,
      description: t(`lines.${line.id}.text`),
      brand: { "@id": `${SITE_URL}/#brand-${brand.slug}` },
      category: t(`${solutionKey(solution.slug)}.name`),
      url,
      ...(image ? { image: `${SITE_URL}${image}` } : {}),
      ...(line.madeIn ? { countryOfOrigin: { "@type": "Country", name: countries(line.madeIn) } } : {}),
      ...(line.specs.length
        ? {
            additionalProperty: line.specs.map((spec) => ({
              "@type": "PropertyValue",
              name: t(`specs.${spec.key}`),
              value: spec.value,
            })),
          }
        : {}),
    };
  });

  return [
    {
      "@type": "ItemList",
      "@id": id,
      numberOfItems: products.length,
      itemListElement: products.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
    },
    ...brands.map((b) => brandLd(b, locale)),
  ];
}

/** Question nodes for a FAQPage's mainEntity; @ids point at the question on the FAQ page. */
export function faqLd(locale: Locale, items: Faq[]) {
  const page = localeUrl(locale, "/faq");
  return items.map((faq) => ({
    "@type": "Question",
    "@id": `${page}#faq-${faq.id}`,
    name: faq.q[locale],
    acceptedAnswer: { "@type": "Answer", text: faqAnswer(faq, locale) },
  }));
}
