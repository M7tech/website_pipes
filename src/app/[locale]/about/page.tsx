import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { facts } from "@/content/company";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { Statement } from "@/components/sections/Statement";
import { Timeline } from "@/components/sections/Timeline";
import { ServiceModel } from "@/components/sections/ServiceModel";
import { ContactBand } from "@/components/sections/ContactBand";

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
      <Timeline cta={false} />
      <ServiceModel />
      <ContactBand />
    </>
  );
}
