import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { company, craftsmenApp, socialNames, whatsappHref } from "@/content/company";
import { pageMetadata } from "@/lib/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Arrow } from "@/components/ui/Arrow";
import { Ltr } from "@/components/ui/Ltr";
import { OfficeLines } from "@/components/company/OfficeLines";

/**
 * روابط: every AtlasPlast link on one page, kept from the old site's /روابط/ page.
 * Not in any menu or the sitemap; the old address redirects here (next.config.ts).
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/links">): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "Meta" });
  return {
    ...pageMetadata({
      locale: locale as Locale,
      path: "/links",
      title: meta("linksTitle"),
      description: meta("linksDescription", { phone: company.mainPhone }),
      siteName: meta("siteName"),
      imageAlt: meta("ogImageAlt"),
    }),
    // A page of links for social bios and print, not a search result.
    robots: { index: false, follow: true },
  };
}

type Row = { label: string; value?: string; href: string; icon?: IconName; lang?: string };

function LinkRows({ rows }: { rows: Row[] }) {
  return (
    <ul className="grid border-b border-rule">
      {rows.map((row) => {
        const external = row.href.startsWith("https://");
        return (
          <li key={row.href}>
            <a
              href={row.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex min-h-16 items-center justify-between gap-x-6 border-t border-rule py-4 text-lg hover:text-atlas-blue"
            >
              <span className="flex items-center gap-3">
                {row.icon ? <Icon name={row.icon} className="size-5 shrink-0 text-atlas-blue" /> : null}
                <span lang={row.lang}>{row.label}</span>
              </span>
              <span className="flex items-center gap-3 text-steel group-hover:text-atlas-blue">
                {row.value ? (
                  <span className="font-mono tabular text-ink group-hover:text-atlas-blue">
                    <Ltr>{row.value}</Ltr>
                  </span>
                ) : null}
                <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Group({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-8">
      <h2 id={id} className="eyebrow border-t-2 border-ink pt-5 text-steel lg:col-span-4">
        {title}
      </h2>
      <div className="lg:col-span-7 lg:col-start-6">{children}</div>
    </section>
  );
}

export default async function LinksPage({ params }: PageProps<"/[locale]/links">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Links");
  const h = await getTranslations("Home.contact");
  const contact = await getTranslations("Contact");
  const nav = await getTranslations("Nav");
  const common = await getTranslations("Common");

  const service: Row[] = [
    { label: h("mainLine"), value: company.mainPhone, href: `tel:${company.mainPhone}`, icon: "phone" },
    { label: h("whatsapp"), value: company.whatsapp, href: whatsappHref(company.whatsapp), icon: "whatsapp" },
    { label: h("email"), value: company.email, href: `mailto:${company.email}`, icon: "mail" },
  ];
  const social: Row[] = (["instagram", "facebook", "linkedin", "youtube"] as const).map((key) => ({
    label: socialNames[key],
    href: company.social[key],
    lang: "en",
  }));
  const app: Row[] = [
    { label: "Google Play", href: craftsmenApp.googlePlay, icon: "download", lang: "en" },
    { label: "App Store", href: craftsmenApp.appStore, icon: "download", lang: "en" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={common("brandName")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: t("title") }]}
      />

      <div className="section-space">
        <div className="container-page grid gap-16">
          <Group id="service-title" title={t("service")}>
            <LinkRows rows={service} />
          </Group>
          <Group id="follow-title" title={contact("follow")}>
            <LinkRows rows={social} />
          </Group>
        </div>
      </div>

      <section aria-labelledby="branches-title" className="section-space bg-surface">
        <div className="container-page grid gap-10">
          <h2 id="branches-title" className="eyebrow border-t-2 border-ink pt-5 text-steel">
            {t("branches")}
          </h2>
          <OfficeLines />
        </div>
      </section>

      <div className="section-space">
        <div className="container-page">
          <Group id="app-title" title={t("app")}>
            <LinkRows rows={app} />
          </Group>
        </div>
      </div>
    </>
  );
}
