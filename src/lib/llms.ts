import type { Locale } from "@/i18n/routing";
import { locales } from "@/i18n/routing";
import { brands, type Country } from "@/content/brands";
import { company, offices, regionalOffices, warehouses } from "@/content/company";
import { faqAnswer, faqTopics, faqs } from "@/content/faq";
import { chairman, boardMembers } from "@/content/leadership";
import { featuredProjects } from "@/content/projects";
import { brandSolutions, solutionKey, solutions } from "@/content/solutions";
import { SITE_URL, localeUrl } from "@/lib/site";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";
import ckb from "../../messages/ckb.json";

/**
 * llms.txt (https://llmstxt.org): a plain Markdown map of the site for AI assistants and answer
 * engines, built from the same content modules and messages as the pages, so it never drifts.
 */

const messages = { en, ar, ckb } as const;

type Lines = Record<string, { name?: string; text: string }>;

function lineName(id: string, fallback: string) {
  return (en.Solutions.lines as Lines)[id]?.name ?? fallback;
}

function solutionName(slug: string) {
  return (en.Solutions as unknown as Record<string, { name: string; text: string }>)[solutionKey(slug)];
}

function country(code?: Country) {
  return code ? en.Countries[code] : undefined;
}

/** Key facts, in English, as one list. */
function facts() {
  const hq = offices.find((o) => o.hq);
  return [
    `- Legal name: ${company.legalName} (UFUQ ALATLAS LTD. – Commercial Agencies). Brand: AtlasPlast; Arabic أطلس بلاست; Kurdish ئەتلەس پلاست.`,
    `- Business: distributor and commercial agent for international manufacturers of pipe systems, drainage, sanitaryware, tiles, water heaters, pumps, faucets, valves and installation tools, many under exclusive agencies in Iraq.`,
    `- In business since ${company.foundingYear}; first showroom ${company.firstShowroomYear} in Al-Shaab, Baghdad. Ufuq Al-Atlas established 2009.`,
    `- Headquarters: ${hq?.name.en}, Iraq.`,
    `- Offices and showrooms: ${offices.map((o) => `${o.name.en}${o.street ? `, ${o.street.en}` : ""} (${o.phone})`).join("; ")}.`,
    `- Warehouses (open 24/7, nine months of national demand in stock): ${warehouses.map((w) => w.name.en).join(", ")}.`,
    `- Regional offices: ${regionalOffices.map((r) => r.en).join(", ")}.`,
    `- Main line: ${company.mainPhone} (short number, from Iraq). WhatsApp: ${company.whatsapp} (Al-Shaab branch). Projects division: ${company.projectsPhone}. Sales department: ${company.salesPhone}. Email: ${company.email}.`,
    `- Hours: Saturday to Thursday, 07:00–15:00 (Iraq time). Friday: goods pickup and shipping only.`,
    `- Reach: 600+ agents and dealers in every governorate; 6,000+ engineers and plumbers trained; hundreds of projects supplied.`,
    `- Leadership: ${chairman.name.en}, ${chairman.role.en}. Board members: ${boardMembers.map((m) => m.name.en).join(", ")}.`,
    `- Website languages: English (${localeUrl("en")}), Arabic (${localeUrl("ar")}), Kurdish Sorani (${localeUrl("ckb")}).`,
    `- Social: ${Object.values(company.social).join(", ")}.`,
  ].join("\n");
}

function solutionList() {
  return solutions
    .map((s) => {
      const copy = solutionName(s.slug);
      const brandNames = [...new Set(s.lines.map((l) => brands.find((b) => b.slug === l.brand)?.name))].join(", ");
      return `- [${copy.name}](${localeUrl("en", `/solutions/${s.slug}`)}): ${copy.text} Brands: ${brandNames}.`;
    })
    .join("\n");
}

function brandList() {
  return brands
    .map((b) => {
      const groups = brandSolutions(b.slug);
      const supplied = groups.flatMap((g) => g.lines.map((l) => lineName(l.id, l.name)));
      const origin = country(b.country);
      const sister = b.sisterOf ? brands.find((s) => s.slug === b.sisterOf)?.name : undefined;
      const range = supplied.length
        ? `${supplied.join(", ")}.`
        : `Range on request.${b.note === "directOrder" ? " Ordered direct from the manufacturer through AtlasPlast." : ""}`;
      return `- [${b.name}](${localeUrl("en", `/brands/${b.slug}`)}):${origin ? ` ${origin}.` : ""}${
        sister ? ` A ${sister} brand with the same range.` : ""
      } ${range}`;
    })
    .join("\n");
}

const pages = [
  ["About AtlasPlast", "/about", "History since 1975, vision, mission, values, services and community work."],
  ["Message from the Chairman", "/about/board", "Jaafar Almusawi, Chairman of the Board, and the board members."],
  ["Projects", "/projects", "Airports, stadiums, hotels, hospitals and housing supplied, and the contractors AtlasPlast works with."],
  ["Locations", "/locations", "Offices, showrooms, warehouses and regional offices, with phone numbers and Google Maps places."],
  ["Contact", "/contact", "Main line, WhatsApp, projects division, sales department, email and hours."],
  ["Media", "/media", "Videos from the AtlasPlast YouTube channel."],
  ["Frequently asked questions", "/faq", "100 questions and answers about the company, products, brands, projects, delivery and contact."],
] as const;

/** /llms.txt: summary, key facts and links. */
export function llmsTxt() {
  return `# AtlasPlast

> AtlasPlast (Ufuq Al-Atlas Ltd.) is an Iraqi distributor and commercial agent for international manufacturers of pipe systems, drainage, sanitaryware, tiles, water heaters, pumps, faucets and installation tools. It has supplied contractors, installers and national projects across Iraq since 1975.

${facts()}

## Solutions

${solutionList()}

## Brands

${brandList()}

## Company

${pages.map(([name, path, text]) => `- [${name}](${localeUrl("en", path)}): ${text}`).join("\n")}

## Selected projects

${featuredProjects.map((p) => `- ${p.name.en}`).join("\n")}

## Optional

- [Full text: every FAQ answer in English, Arabic and Kurdish](${SITE_URL}/llms-full.txt)
- [Arabic site](${localeUrl("ar")}) · [Arabic FAQ](${localeUrl("ar", "/faq")})
- [Kurdish (Sorani) site](${localeUrl("ckb")}) · [Kurdish FAQ](${localeUrl("ckb", "/faq")})
- [Sitemap](${SITE_URL}/sitemap.xml)
`;
}

function faqSection(locale: Locale) {
  const m = messages[locale];
  const topics = m.Faq.topics as Record<string, string>;
  const heading = { en: "Frequently asked questions (English)", ar: "الأسئلة الشائعة (العربية)", ckb: "پرسیارە باوەکان (کوردی)" }[locale];
  return [
    `## ${heading}`,
    `Source: ${localeUrl(locale, "/faq")}`,
    ...faqTopics.map((topic) =>
      [
        `### ${topics[topic]}`,
        ...faqs
          .filter((f) => f.topic === topic)
          .map((f) => `**${f.q[locale]}**\n${faqAnswer(f, locale)}`),
      ].join("\n\n"),
    ),
  ].join("\n\n");
}

function productDetails() {
  const specs = en.Solutions.specs as Record<string, string>;
  return solutions
    .map((s) =>
      [
        `### ${solutionName(s.slug).name}`,
        ...s.lines.map((l) => {
          const brand = brands.find((b) => b.slug === l.brand)?.name;
          const text = (en.Solutions.lines as Lines)[l.id]?.text ?? "";
          const spec = l.specs.map((x) => `${specs[x.key]}: ${x.value}`).join("; ");
          return `- ${lineName(l.id, l.name)} (${brand}): ${text}${spec ? ` ${spec}.` : ""}`;
        }),
      ].join("\n"),
    )
    .join("\n\n");
}

/** /llms-full.txt: everything in /llms.txt, plus product specifications and every FAQ answer in all three languages. */
export function llmsFullTxt() {
  return `${llmsTxt()}
## Product lines and specifications

${productDetails()}

${locales.map(faqSection).join("\n\n")}
`;
}
