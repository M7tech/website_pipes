import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { company } from "@/content/company";
import { brands } from "@/content/brands";
import { solutions, solutionKey } from "@/content/solutions";
import { governorates } from "@/content/governorates";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ltr } from "@/components/ui/Ltr";
import { QuoteForm, type QuoteFormLabels } from "@/components/contact/QuoteForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/quote">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/quote",
    title: meta("quoteTitle"),
    description: meta("quoteDescription"),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function QuotePage({ params }: PageProps<"/[locale]/quote">) {
  const { locale: param } = await params;
  setRequestLocale(param);
  const locale = param as Locale;
  const t = await getTranslations("Quote");
  const s = await getTranslations("Solutions");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  const labels = t.raw("form") as QuoteFormLabels;
  const steps: { icon: IconName; key: "fill" | "send" | "reply" }[] = [
    { icon: "layers", key: "fill" },
    { icon: "whatsapp", key: "send" },
    { icon: "headset", key: "reply" },
  ];

  return (
    <>
      <JsonLd
        data={pageLd({
          locale,
          path: "/quote",
          type: "ContactPage",
          name: meta("quoteTitle"),
          description: meta("quoteDescription"),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("quote"), path: "/quote" },
          ],
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        icon="tag"
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("quote") }]}
      />

      <div className="section-space">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <QuoteForm
              labels={labels}
              whatsapp={company.whatsapp.replace(/\D/g, "")}
              email={company.email}
              governorates={governorates.map((g) => ({ value: g.id, label: g.name[locale] }))}
              brands={brands.map((b) => ({ value: b.slug, label: b.name, lang: locale === "en" ? undefined : "en" }))}
              categories={solutions.map((x) => ({ value: x.slug, label: s(`${solutionKey(x.slug)}.name`) }))}
            />
          </div>
          <aside aria-labelledby="quote-how" className="grid content-start gap-6 lg:col-span-4">
            <h2 id="quote-how" className="text-xl font-semibold">
              {t("how.title")}
            </h2>
            <ol className="grid gap-4">
              {steps.map(({ icon, key }) => (
                <li key={key} className="flex gap-4 rounded-card bg-surface p-5">
                  <Icon name={icon} className="size-6 shrink-0 text-atlas-blue" />
                  <span className="text-steel">{t(`how.${key}`)}</span>
                </li>
              ))}
            </ol>
            <p className="text-steel">
              {t("call")}{" "}
              <a href={`tel:${company.mainPhone}`} className="font-medium text-atlas-blue underline-offset-4 hover:underline">
                <Ltr>{company.mainPhone}</Ltr>
              </a>
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
