import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { company } from "@/content/company";
import { faqTopics, faqs } from "@/content/faq";
import { pageLd, pageMetadata } from "@/lib/site";
import { faqLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { FaqList } from "@/components/faq/FaqList";
import { ContactBand } from "@/components/sections/ContactBand";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/faq",
    title: meta("faqTitle"),
    description: meta("faqDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale: param } = await params;
  setRequestLocale(param);
  const locale = param as Locale;
  const t = await getTranslations("Faq");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");
  const groups = faqTopics.map((topic) => ({ topic, items: faqs.filter((f) => f.topic === topic) }));

  return (
    <>
      <JsonLd
        data={pageLd({
          locale,
          path: "/faq",
          type: "FAQPage",
          name: meta("faqTitle"),
          description: meta("faqDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("faq"), path: "/faq" },
          ],
          props: { mainEntity: faqLd(locale, faqs) },
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        icon="headset"
        title={t("title")}
        intro={t("intro", { phone: company.mainPhone })}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("faq") }]}
      >
        <nav aria-label={t("topicsLabel")} className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ topic, items }) => (
              <li key={topic}>
                <a
                  href={`#topic-${topic}`}
                  className="glass-on-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-white/15"
                >
                  {t(`topics.${topic}`)}
                  <span className="text-on-dark-muted tabular">
                    <Ltr>{items.length}</Ltr>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="section-space">
        <div className="container-page grid gap-16 md:gap-24">
          {groups.map(({ topic, items }) => (
            <section key={topic} id={`topic-${topic}`} aria-labelledby={`topic-${topic}-title`} className="grid gap-x-8 gap-y-6 md:grid-cols-12">
              <div className="grid content-start gap-2 self-start md:sticky md:top-[calc(var(--header-h)+2rem)] md:col-span-4">
                <h2 id={`topic-${topic}-title`} className="section-title">
                  {t(`topics.${topic}`)}
                </h2>
                <p className="text-steel">{t("count", { count: items.length })}</p>
              </div>
              <div className="md:col-span-8">
                <FaqList items={items} />
              </div>
            </section>
          ))}
        </div>
      </div>

      <ContactBand />
    </>
  );
}
