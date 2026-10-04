import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { brandBySlug } from "@/content/brands";
import { company } from "@/content/company";
import { solutionBySlug, solutionKey, solutions } from "@/content/solutions";
import { localeUrl, pageMetadata } from "@/lib/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionGlyph } from "@/components/sections/SectionGlyph";
import { SolutionList, solutionBrands } from "@/components/solutions/SolutionList";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => solutions.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = solutionBySlug(slug);
  if (!solution) return {};
  const t = await getTranslations({ locale, namespace: "Solutions" });
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const key = solutionKey(slug);
  return pageMetadata({
    locale: locale as Locale,
    path: `/solutions/${slug}`,
    title: t(`${key}.name`),
    description: t(`${key}.intro`),
    siteName: meta("siteName"),
  });
}

export default async function SolutionPage({ params }: PageProps<"/[locale]/solutions/[slug]">) {
  const { locale, slug } = await params;
  const solution = solutionBySlug(slug);
  if (!solution) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Solutions");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");
  const contact = await getTranslations("Home.contact");
  const key = solutionKey(slug);
  const name = t(`${key}.name`);
  const position = solutions.indexOf(solution) + 1;
  const brands = solutionBrands(solution);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: nav("home"), item: localeUrl(locale as Locale) },
      { "@type": "ListItem", position: 2, name: nav("solutions"), item: localeUrl(locale as Locale, "/solutions") },
      { "@type": "ListItem", position: 3, name, item: localeUrl(locale as Locale, `/solutions/${slug}`) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }}
      />
      <PageHeader
        eyebrow={`${String(position).padStart(2, "0")} / ${String(solutions.length).padStart(2, "0")} · ${nav("solutions")}`}
        title={name}
        intro={t(`${key}.intro`)}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("solutions"), href: "/solutions" },
          { label: name },
        ]}
        aside={<SectionGlyph wall={solution.wall} className="!size-40 text-atlas-sky md:!size-56" />}
      >
        <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule-dark pt-5 text-sm">
          <div className="grid gap-1">
            <dt className="text-on-dark-muted">{t("labels.lines")}</dt>
            <dd className="font-mono tabular">
              <Ltr>{solution.lines.length}</Ltr>
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-on-dark-muted">{t("labels.brands")}</dt>
            <dd lang="en">{brands.map((b) => brandBySlug(b).name).join(" · ")}</dd>
          </div>
        </dl>
      </PageHeader>

      <section aria-labelledby="lines-title" className="section-space">
        <div className="container-page grid gap-10">
          <h2 id="lines-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("labels.count", { count: solution.lines.length })}
          </h2>
          <ul className="grid">
            {solution.lines.map((line) => {
              const brand = brandBySlug(line.brand);
              const logo = line.logo ?? brand.logo;
              const lineName = t.has(`lines.${line.id}.name`) ? t(`lines.${line.id}.name`) : line.name;
              const latinName = !t.has(`lines.${line.id}.name`);
              return (
                <li
                  key={line.id}
                  className="grid gap-x-8 gap-y-5 border-b border-rule py-8 first:pt-2 md:grid-cols-12 md:py-10"
                >
                  <div className="flex items-start gap-4 md:col-span-3 md:flex-col md:gap-3">
                    <div className="flex h-12 w-28 items-center md:h-14 md:w-36">
                      {logo ? (
                        <Image
                          src={logo}
                          alt={brand.name}
                          width={160}
                          height={64}
                          unoptimized
                          className="max-h-full w-auto max-w-full object-contain"
                        />
                      ) : (
                        <span lang="en" className="font-display-latin text-xl font-semibold text-steel">
                          {brand.name}
                        </span>
                      )}
                    </div>
                    {logo ? <p lang="en" className="text-sm text-steel">{brand.name}</p> : null}
                  </div>
                  <div className="grid content-start gap-3 md:col-span-4">
                    <h3
                      lang={latinName ? "en" : undefined}
                      className="font-display-latin text-[clamp(1.375rem,2.2vw,1.875rem)] font-semibold leading-tight [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal"
                    >
                      {lineName}
                    </h3>
                    <p className="text-steel">{t(`lines.${line.id}.text`)}</p>
                  </div>
                  {line.specs.length ? (
                    <dl aria-label={t("labels.specs")} className="grid content-start md:col-span-5">
                      {line.specs.map((spec) => (
                        <div
                          key={spec.key}
                          className="grid grid-cols-[minmax(7rem,2fr)_3fr] gap-4 border-t border-rule py-2.5 text-sm last:border-b"
                        >
                          <dt className="text-steel">{t(`specs.${spec.key}`)}</dt>
                          <dd className="font-mono text-ink">
                            <Ltr>{spec.value}</Ltr>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="enquire-title" className="on-dark bg-atlas-navy text-on-dark">
        <div className="container-page grid gap-8 py-14 md:grid-cols-12 md:items-end md:gap-8 md:py-20">
          <div className="grid gap-4 md:col-span-7">
            <h2
              id="enquire-title"
              className="font-display-latin text-[clamp(1.875rem,3.6vw,3rem)] font-semibold leading-[1.05] [:lang(ar)_&]:leading-[1.35] [:lang(ckb)_&]:leading-[1.35]"
            >
              {t("labels.enquireTitle")}
            </h2>
            <p className="max-w-[48ch] text-on-dark-muted">{t("labels.enquireText")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-5 md:justify-end">
            <ButtonLink href="/contact" variant="inverse">
              {t("labels.enquireCta")}
            </ButtonLink>
            <a href={`tel:${company.mainPhone}`} className="grid">
              <span className="text-sm text-on-dark-muted">{contact("mainLine")}</span>
              <span className="font-display-latin text-3xl font-semibold tabular">
                <Ltr>{company.mainPhone}</Ltr>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="others-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <h2 id="others-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("labels.others")}
          </h2>
          <SolutionList only={solutions.filter((s) => s.slug !== slug).map((s) => s.slug)} />
        </div>
      </section>
    </>
  );
}
