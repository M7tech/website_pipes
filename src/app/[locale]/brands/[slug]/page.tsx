import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { brands, type Brand } from "@/content/brands";
import { company } from "@/content/company";
import { brandSolutions, solutionKey } from "@/content/solutions";
import { localeUrl, pageLd, pageMetadata } from "@/lib/site";
import { productLinesLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { TextLink } from "@/components/ui/TextLink";
import { SectionGlyph } from "@/components/sections/SectionGlyph";
import { BrandGrid } from "@/components/brands/BrandGrid";
import { BrandDocuments } from "@/components/brands/BrandDocuments";
import { EnquiryBand } from "@/components/solutions/EnquiryBand";
import { ProductLineRow } from "@/components/solutions/ProductLineRow";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => brands.map((b) => ({ locale, slug: b.slug })));
}

/** Search title and description for a brand page, naming the lines AtlasPlast supplies. */
async function brandMeta(locale: Locale, brand: Brand) {
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const s = await getTranslations({ locale, namespace: "Solutions" });
  const lines = brandSolutions(brand.slug).flatMap((g) => g.lines);
  const names = lines.map((l) => (s.has(`lines.${l.id}.name`) ? s(`lines.${l.id}.name`) : l.name));
  const separator = locale === "en" ? ", " : "، ";
  return {
    title: meta("brandTitle", { brand: brand.name }),
    description: names.length
      ? meta("brandDescription", { brand: brand.name, lines: names.slice(0, 5).join(separator) })
      : meta("brandDescriptionOnRequest", { brand: brand.name, phone: company.mainPhone }),
    names,
  };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/brands/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return {};
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const { title, description } = await brandMeta(locale as Locale, brand);
  return pageMetadata({
    locale: locale as Locale,
    path: `/brands/${slug}`,
    title,
    description,
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function BrandPage({ params }: PageProps<"/[locale]/brands/[slug]">) {
  const { locale, slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Brands");
  const s = await getTranslations("Solutions");
  const countries = await getTranslations("Countries");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");
  const groups = brandSolutions(slug);
  const lineCount = groups.reduce((n, g) => n + g.lines.length, 0);
  const others = brands.filter((b) => b.slug !== slug);

  const path = `/brands/${slug}`;
  const { title, description, names } = await brandMeta(locale as Locale, brand);
  const ld = pageLd({
    locale: locale as Locale,
    path,
    name: title,
    description,
    crumbs: [
      { name: nav("home"), path: "/" },
      { name: nav("brands"), path: "/brands" },
      { name: brand.name, path },
    ],
    extra: names.length
      ? [productLinesLd(`${localeUrl(locale as Locale, path)}#lines`, names.map((name) => ({ name, brand: brand.name })))]
      : [],
  });

  return (
    <>
      <JsonLd data={ld} />
      <PageHeader
        eyebrow={nav("brands")}
        title={brand.name}
        titleLang="en"
        intro={t("detail.intro", { brand: brand.name })}
        image={
          brand.photo
            ? { src: brand.photo.src, alt: t("photoAlt", { subject: brand.photo.subject ?? brand.name }) }
            : undefined
        }
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("brands"), href: "/brands" },
          { label: brand.name },
        ]}
        aside={
          brand.logo ? (
            <div className="flex aspect-[4/3] w-56 items-center justify-center bg-surface p-8 md:w-72">
              <Image
                src={brand.logo}
                alt=""
                width={240}
                height={120}
                unoptimized
                className="max-h-24 w-auto max-w-full object-contain"
              />
            </div>
          ) : undefined
        }
      >
        <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule-dark pt-5 text-sm">
          {brand.country ? (
            <div className="grid gap-1">
              <dt className="text-on-dark-muted">{t("labels.country")}</dt>
              <dd>{countries(brand.country)}</dd>
            </div>
          ) : null}
          {lineCount ? (
            <div className="grid gap-1">
              <dt className="text-on-dark-muted">{s("labels.lines")}</dt>
              <dd className="font-mono tabular">
                <Ltr>{lineCount}</Ltr>
              </dd>
            </div>
          ) : null}
          {groups.length ? (
            <div className="grid gap-1">
              <dt className="text-on-dark-muted">{t("labels.solutions")}</dt>
              <dd className="flex flex-wrap gap-x-2">
                {groups.map(({ solution }, i) => (
                  <span key={solution.slug}>
                    {i > 0 ? <span aria-hidden="true" className="me-2 text-on-dark-muted">·</span> : null}
                    <Link href={`/solutions/${solution.slug}`} className="underline-offset-4 hover:underline">
                      {s(`${solutionKey(solution.slug)}.name`)}
                    </Link>
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
        {brand.note ? <p className="font-medium text-on-dark">{t(`notes.${brand.note}`)}</p> : null}
      </PageHeader>

      <section aria-labelledby="supplied-title" className="section-space">
        <div className="container-page grid gap-10">
          <h2 id="supplied-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {groups.length ? t("labels.supplied") : t("labels.onRequestTitle")}
          </h2>
          {groups.length ? (
            <div className="grid gap-14 md:gap-20">
              {groups.map(({ solution, lines }) => (
                <div key={solution.slug} className="grid gap-x-8 gap-y-6 md:grid-cols-12">
                  <div className="grid content-start gap-4 md:col-span-3">
                    <SectionGlyph wall={solution.wall} className="text-atlas-blue" />
                    <h3 className="font-display-latin text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal">
                      {s(`${solutionKey(solution.slug)}.name`)}
                    </h3>
                    <TextLink href={`/solutions/${solution.slug}`}>{t("labels.viewSolution")}</TextLink>
                  </div>
                  <ul className="grid md:col-span-9">
                    {lines.map((line) => (
                      <ProductLineRow key={line.id} line={line} headingLevel="h4" />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="max-w-[52ch] text-lg text-steel">{t("labels.onRequest", { brand: brand.name })}</p>
          )}
        </div>
      </section>

      {brand.documents?.length ? <BrandDocuments documents={brand.documents} /> : null}

      <EnquiryBand title={t("labels.enquireTitle", { brand: brand.name })} text={s("labels.enquireText")} />

      <section aria-labelledby="others-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <div className="flex items-baseline justify-between gap-6 border-t-2 border-ink pt-5">
            <h2 id="others-title" className="eyebrow text-steel">
              {t("labels.others")}
            </h2>
            <TextLink href="/brands">{t("labels.all")}</TextLink>
          </div>
          <BrandGrid brands={others} />
        </div>
      </section>
    </>
  );
}
