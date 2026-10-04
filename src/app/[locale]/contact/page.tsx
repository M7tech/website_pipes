import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { company, whatsappHref } from "@/content/company";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPointLd } from "@/lib/structured-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Ltr } from "@/components/ui/Ltr";
import { OfficeLines } from "@/components/company/OfficeLines";

const socialNames = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn" } as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/contact",
    title: meta("contactTitle", { phone: company.mainPhone }),
    description: meta("contactDescription", { phone: company.mainPhone }),
    siteName: meta("siteName"),
    imageAlt: meta("ogImageAlt"),
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const h = await getTranslations("Home.contact");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  const lines = [
    { label: h("whatsapp"), value: company.whatsapp, href: whatsappHref(company.whatsapp), external: true, icon: "whatsapp" as const },
    { label: h("projects"), value: company.projectsPhone, href: whatsappHref(company.projectsPhone), external: true, icon: "helmet" as const },
    { label: h("sales"), value: company.salesPhone, href: whatsappHref(company.salesPhone), external: true, icon: "tag" as const },
    { label: h("email"), value: company.email, href: `mailto:${company.email}`, icon: "mail" as const },
  ];

  return (
    <>
      <JsonLd
        data={pageLd({
          locale: locale as Locale,
          path: "/contact",
          type: "ContactPage",
          name: meta("contactTitle", { phone: company.mainPhone }),
          description: meta("contactDescription", { phone: company.mainPhone }),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("contact"), path: "/contact" },
          ], extra: [contactPointLd()],
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("contact") }]}
      />

      <section aria-labelledby="channels-title" className="section-space">
        <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="grid content-start gap-4 lg:col-span-4">
            <h2 id="channels-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
              {t("channels")}
            </h2>
            <div className="grid gap-2 text-steel">
              <p className="flex items-center gap-2">
                <Icon name="clock" className="size-5 shrink-0 text-atlas-blue" />
                {h("hours")}
              </p>
              <p className="ps-7">{h("friday")}</p>
              <p className="flex items-center gap-2">
                <Icon name="warehouse" className="size-5 shrink-0 text-atlas-blue" />
                {h("warehouses")}
              </p>
            </div>
          </div>
          <div className="grid content-start lg:col-span-7 lg:col-start-6">
            <a href={`tel:${company.mainPhone}`} className="group grid gap-2 border-t border-rule py-6">
              <span className="eyebrow flex items-center gap-2 text-steel">
                <Icon name="phone" className="size-5 text-atlas-blue" />
                {h("mainLine")}
              </span>
              <span className="font-display-latin text-[clamp(3.5rem,9vw,7rem)] font-semibold leading-none tabular text-atlas-blue group-hover:text-atlas-navy">
                <Ltr>{company.mainPhone}</Ltr>
              </span>
            </a>
            {lines.map((line) => (
              <a
                key={line.label}
                href={line.href}
                {...(line.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule py-5 text-lg hover:text-atlas-blue"
              >
                <span className="flex items-center gap-3 text-steel">
                  <Icon name={line.icon} className="size-5 text-atlas-blue" />
                  {line.label}
                </span>
                <span className="font-mono tabular">
                  <Ltr>{line.value}</Ltr>
                </span>
              </a>
            ))}
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-y border-rule py-5">
              <span className="text-steel">{t("follow")}</span>
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {(Object.keys(company.social) as (keyof typeof company.social)[]).map((key) => (
                  <li key={key}>
                    <a
                      href={company.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      lang="en"
                      className="underline-offset-4 hover:text-atlas-blue hover:underline"
                    >
                      {socialNames[key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="branches-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <h2 id="branches-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("branches")}
          </h2>
          <OfficeLines />
        </div>
      </section>
    </>
  );
}
