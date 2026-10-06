import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { company, offices, socialNames } from "@/content/company";
import { primaryNav, contactHref } from "@/lib/nav";
import { Logo } from "./Logo";
import { Ltr } from "@/components/ui/Ltr";
import { SocialIcon } from "@/components/ui/SocialIcon";

export async function SiteFooter() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const brand = (await getTranslations("Common"))("brandName");
  const year = new Date().getFullYear();

  const social = (Object.keys(company.social) as (keyof typeof company.social)[]).map((key) => ({
    key,
    label: socialNames[key],
    href: company.social[key],
  }));

  return (
    <footer id="site-footer" className="on-dark bg-atlas-navy-deep text-on-dark">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="grid content-start gap-6 md:col-span-4">
          <Logo tone="white" label={brand} className="w-40" />
          <p className="max-w-[36ch] text-on-dark-muted">{t("tagline")}</p>
        </div>

        <nav aria-label={t("explore")} className="md:col-span-2">
          <h2 className="eyebrow mb-4 text-on-dark-muted">{t("explore")}</h2>
          <ul className="grid gap-2.5">
            {[...primaryNav, { key: "contact", href: contactHref } as const].map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="hover:underline hover:underline-offset-4">
                  {nav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow mb-4 text-on-dark-muted">{t("offices")}</h2>
          <ul className="grid gap-2.5">
            {offices.map((o) => (
              <li key={o.id}>{o.name[locale]}</li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-8 md:col-span-3">
          <div>
            <h2 className="eyebrow mb-4 text-on-dark-muted">{t("contact")}</h2>
            <ul className="grid gap-2.5">
              <li className="flex flex-wrap gap-x-3">
                <span className="text-on-dark-muted">{t("mainLine")}</span>
                <a href={`tel:${company.mainPhone}`} className="tabular font-mono hover:underline">
                  <Ltr>{company.mainPhone}</Ltr>
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="hover:underline">
                  <Ltr>{company.email}</Ltr>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow mb-4 text-on-dark-muted">{t("follow")}</h2>
            <ul className="flex flex-wrap gap-2">
              {social.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="pressable inline-flex size-11 items-center justify-center rounded-full bg-white/8 text-on-dark hover:bg-white hover:text-atlas-navy"
                  >
                    <SocialIcon name={s.key} />
                    <span className="sr-only" lang="en">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-rule-dark">
        <p className="container-page py-6 text-sm text-on-dark-muted">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
