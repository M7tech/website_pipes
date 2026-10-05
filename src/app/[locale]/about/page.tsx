import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { facts } from "@/content/company";
import { chairman } from "@/content/leadership";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { Statement } from "@/components/sections/Statement";
import { Purpose } from "@/components/sections/Purpose";
import { Timeline } from "@/components/sections/Timeline";
import { ServiceModel } from "@/components/sections/ServiceModel";
import { ContactBand } from "@/components/sections/ContactBand";
import { ButtonLink } from "@/components/ui/ButtonLink";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/about",
    title: meta("aboutTitle"),
    description: meta("aboutDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const board = await getTranslations("Board");
  const f = await getTranslations("Home.facts");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/about",
          type: "AboutPage",
          name: meta("aboutTitle"),
          description: meta("aboutDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("about"), path: "/about" },
          ],
        })}
      />
      <PageHeader
        image={{ src: "/images/hero/warehouse-racks.jpg", alt: common("warehousePhoto") }}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("about") }]}
      >
        <dl aria-label={f("label")} className="mt-4 grid grid-cols-2 border-t border-rule-dark lg:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              key={fact.key}
              className={`flex flex-col-reverse justify-end gap-2 border-rule-dark py-6 pe-4 ${i % 2 === 1 ? "border-s ps-4" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-s lg:ps-4" : ""}`}
            >
              <dt className="max-w-[22ch] text-sm text-on-dark-muted">{f(fact.key)}</dt>
              <dd className="font-display-latin text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none tabular">
                <Ltr>{fact.value}</Ltr>
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>
      <Statement />
      <Purpose />
      <section aria-labelledby="chairman-title" className="section-space">
        <div className="container-page grid items-center gap-10 md:grid-cols-12 md:gap-8">
          <Image
            src={chairman.photo.src}
            width={chairman.photo.width}
            height={chairman.photo.height}
            alt={chairman.name[locale as Locale]}
            sizes="(min-width: 768px) 20vw, 14rem"
            className="aspect-[4/5] w-full max-w-56 bg-surface object-cover object-top md:col-span-3 md:max-w-none"
          />
          <div className="grid content-start gap-6 md:col-span-8 md:col-start-5">
            <h2 id="chairman-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
              {board("title")}
            </h2>
            <blockquote className="font-display-latin max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.2] [:lang(ar)_&]:leading-[1.55] [:lang(ckb)_&]:leading-[1.55]">
              <p>{board("quote")}</p>
            </blockquote>
            <p className="grid gap-1">
              <span className="font-semibold">{chairman.name[locale as Locale]}</span>
              <span className="text-steel">{chairman.role[locale as Locale]}</span>
            </p>
            <ButtonLink href="/about/board" variant="secondary" className="justify-self-start">
              {board("read")}
            </ButtonLink>
          </div>
        </div>
      </section>
      <Timeline cta={false} full />
      <ServiceModel />
      <ContactBand />
    </>
  );
}
