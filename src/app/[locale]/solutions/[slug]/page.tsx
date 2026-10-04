import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { brandBySlug } from "@/content/brands";
import { solutionBySlug, solutionKey, solutions } from "@/content/solutions";
import { localeUrl, pageLd, pageMetadata } from "@/lib/site";
import { productLinesLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { Link } from "@/i18n/navigation";
import { EnquiryBand } from "@/components/solutions/EnquiryBand";
import { ProductLineRow } from "@/components/solutions/ProductLineRow";
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
    title: meta("solutionTitle", { name: t(`${key}.name`) }),
    description: meta("solutionDescription", { text: t(`${key}.text`) }),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
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
  const key = solutionKey(slug);
  const name = t(`${key}.name`);
  const position = solutions.indexOf(solution) + 1;
  const brands = solutionBrands(solution);

  const meta = await getTranslations("Meta");
  const path = `/solutions/${slug}`;
  const lineName = (id: string, fallback: string) => (t.has(`lines.${id}.name`) ? t(`lines.${id}.name`) : fallback);
  const ld = pageLd({
    locale: locale as Locale,
    path,
    type: "CollectionPage",
    name: meta("solutionTitle", { name }),
    description: meta("solutionDescription", { text: t(`${key}.text`) }),
    crumbs: [
      { name: nav("home"), path: "/" },
      { name: nav("solutions"), path: "/solutions" },
      { name, path },
    ],
    extra: [
      productLinesLd(
        `${localeUrl(locale as Locale, path)}#lines`,
        solution.lines.map((l) => ({ name: lineName(l.id, l.name), brand: brandBySlug(l.brand).name })),
      ),
    ],
  });

  return (
    <>
      <JsonLd data={ld} />
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
        icon={solution.icon}
        slides={{
          label: t("labels.photos", { name }),
          photos: solution.photos.map((photo) => ({
            src: photo.src,
            alt: photo.brand ? t("photoAlt", { name, brand: brandBySlug(photo.brand).name }) : name,
          })),
          photoOf: solution.photos.map((_, i) => t("labels.photoOf", { current: i + 1, total: solution.photos.length })),
        }}
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
            <dd lang="en" className="flex flex-wrap gap-x-2">
              {brands.map((b, i) => (
                <span key={b}>
                  {i > 0 ? <span aria-hidden="true" className="me-2 text-on-dark-muted">·</span> : null}
                  <Link href={`/brands/${b}`} className="underline-offset-4 hover:underline">
                    {brandBySlug(b).name}
                  </Link>
                </span>
              ))}
            </dd>
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
              return (
                <ProductLineRow
                  key={line.id}
                  line={line}
                  lead={
                    <>
                      <div className="flex h-12 w-28 items-center md:h-14 md:w-36">
                        {logo ? (
                          <Image
                            src={logo}
                            alt=""
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
                      <Link
                        href={`/brands/${brand.slug}`}
                        lang="en"
                        className="text-sm text-steel underline-offset-4 hover:text-atlas-blue hover:underline"
                      >
                        {brand.name}
                      </Link>
                    </>
                  }
                />
              );
            })}
          </ul>
        </div>
      </section>

      <EnquiryBand title={t("labels.enquireTitle")} text={t("labels.enquireText")} />

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
