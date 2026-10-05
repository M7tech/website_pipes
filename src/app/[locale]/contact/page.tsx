import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cityNames, company, mapsHref, offices, socialNames, warehouses, whatsappHref } from "@/content/company";
import { pageLd, pageMetadata } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPointLd } from "@/lib/structured-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHead } from "@/components/ui/SectionHead";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Arrow } from "@/components/ui/Arrow";
import { Ltr } from "@/components/ui/Ltr";
import { OfficeLines } from "@/components/company/OfficeLines";
import { IraqMap } from "@/components/sections/IraqMap";
import { SectionWipe } from "@/components/motion/SectionWipe";

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

type Channel = { label: string; value: string; href: string; action: string; icon: IconName };

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale: param } = await params;
  setRequestLocale(param);
  const locale = param as Locale;
  const t = await getTranslations("Contact");
  const h = await getTranslations("Home.contact");
  const p = await getTranslations("Home.presence");
  const loc = await getTranslations("Locations");
  const nav = await getTranslations("Nav");
  const meta = await getTranslations("Meta");
  const common = await getTranslations("Common");

  const channels: Channel[] = [
    { label: h("whatsapp"), value: company.whatsapp, href: whatsappHref(company.whatsapp), action: t("chat"), icon: "whatsapp" },
    { label: h("projects"), value: company.projectsPhone, href: whatsappHref(company.projectsPhone), action: t("chat"), icon: "helmet" },
    { label: h("sales"), value: company.salesPhone, href: whatsappHref(company.salesPhone), action: t("chat"), icon: "tag" },
    { label: h("email"), value: company.email, href: `mailto:${company.email}`, action: t("write"), icon: "mail" },
  ];
  const hours: { icon: IconName; text: string }[] = [
    { icon: "clock", text: h("hours") },
    { icon: "truck", text: h("friday") },
    { icon: "warehouse", text: h("warehouses") },
  ];
  // Each office city on the map opens its first-listed office (Baghdad: the HQ) in Google Maps.
  const cityLinks = Object.fromEntries(
    [...offices].reverse().map((o) => [o.city, { href: mapsHref(o), label: loc("openMapFor", { place: o.name[locale] }) }]),
  );

  return (
    <>
      <JsonLd
        data={pageLd({
          locale,
          path: "/contact",
          type: "ContactPage",
          name: meta("contactTitle", { phone: company.mainPhone }),
          description: meta("contactDescription", { phone: company.mainPhone }),
          crumbs: [
            { name: nav("home"), path: "/" },
            { name: nav("contact"), path: "/contact" },
          ],
          extra: [contactPointLd()],
        })}
      />
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        breadcrumbLabel={common("breadcrumb")}
        crumbs={[{ label: nav("home"), href: "/" }, { label: nav("contact") }]}
        image={{ src: "/images/hero/warehouse-aerial.jpg", alt: common("warehousePhoto") }}
        waveFill="fill-surface"
      >
        <div className="mt-4 flex flex-wrap items-end gap-x-12 gap-y-8">
          <a href={`tel:${company.mainPhone}`} className="group grid gap-2">
            <span className="eyebrow flex items-center gap-2 text-on-dark-muted">
              <Icon name="phone" className="size-5 text-atlas-sky" />
              {t("callLabel")}
            </span>
            <span className="font-display-latin text-[clamp(4rem,10vw,7.5rem)] font-semibold leading-[0.9] tabular transition-colors duration-(--duration-base) group-hover:text-atlas-sky">
              <Ltr>{company.mainPhone}</Ltr>
            </span>
          </a>
          <a
            href={whatsappHref(company.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate mb-2 inline-flex min-h-12 items-center gap-3 overflow-hidden bg-paper px-6 text-[0.9375rem] font-medium text-atlas-navy transition-[scale] duration-(--duration-base) ease-(--ease-out-expo) active:scale-[0.97] active:duration-(--duration-fast)"
          >
            <span aria-hidden="true" className="liquid-box -z-10">
              <span className="liquid bg-white" />
            </span>
            <Icon name="whatsapp" className="size-5 text-atlas-blue" />
            <span>{t("chat")}</span>
            <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="channels-title" className="section-space bg-surface">
        <div className="container-page grid gap-12">
          <SectionHead id="channels-title" eyebrow={t("channels")} title={t("channelsTitle")} />
          <ul className="grid border-s border-t border-rule sm:grid-cols-2 xl:grid-cols-4">
            {channels.map((c) => (
              <li key={c.label} className="border-e border-b border-rule">
                <a
                  href={c.href}
                  {...(c.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group grid h-full min-h-44 content-between gap-8 p-6 sm:min-h-60 transition-colors duration-(--duration-base) hover:bg-paper md:p-8"
                >
                  <span className="grid gap-5">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-atlas-blue/8 text-atlas-blue transition-colors duration-(--duration-base) group-hover:bg-atlas-blue group-hover:text-white">
                      <Icon name={c.icon} />
                    </span>
                    <span className="grid gap-2">
                      <span className="text-steel">{c.label}</span>
                      <span className="font-mono text-lg tabular text-ink">
                        <Ltr>{c.value}</Ltr>
                      </span>
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium text-atlas-blue">
                    {c.action}
                    <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <h3 className="eyebrow text-steel md:col-span-3">{t("hoursTitle")}</h3>
            <ul className="grid gap-6 sm:grid-cols-3 md:col-span-9">
              {hours.map((item) => (
                <li key={item.icon} className="flex items-start gap-3 text-steel">
                  <Icon name={item.icon} className="size-5 text-atlas-blue" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="branches-title" className="section-space">
        <div className="container-page grid gap-12">
          <SectionHead id="branches-title" eyebrow={t("branches")} title={t("branchesTitle")} />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <figure className="lg:col-span-5">
              <SectionWipe>
                <IraqMap
                  locale={locale}
                  label={p("mapLabel")}
                  officeCities={[...new Set(offices.map((o) => o.city))]}
                  warehouseCities={warehouses.map((w) => w.id)}
                  cityNames={cityNames}
                  cityLinks={cityLinks}
                />
              </SectionWipe>
            </figure>
            <div className="lg:col-span-7">
              <OfficeLines narrow />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="follow-title" className="on-dark section-space relative isolate overflow-hidden bg-atlas-navy text-on-dark">
        <div aria-hidden="true" className="caustics absolute -inset-[10%] -z-10 mix-blend-screen" />
        <div className="container-page grid gap-10 md:grid-cols-12 md:gap-8">
          <h2 id="follow-title" className="eyebrow border-t-2 border-on-dark pt-5 text-on-dark-muted md:col-span-3">
            {t("follow")}
          </h2>
          <ul className="grid grid-cols-2 border-t border-rule-dark md:col-span-9 lg:grid-cols-4">
            {(Object.keys(company.social) as (keyof typeof company.social)[]).map((key) => (
              <li key={key} className="border-b border-rule-dark">
                <a
                  href={company.social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  lang="en"
                  className="group flex min-h-28 items-end justify-between gap-4 py-6 pe-6 font-display-latin text-2xl font-semibold transition-colors duration-(--duration-base) hover:text-atlas-sky"
                >
                  {socialNames[key]}
                  <Arrow className="-rotate-45 transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:-translate-y-1" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
