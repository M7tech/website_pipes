import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { offices, whatsappHref } from "@/content/company";
import { Ltr } from "@/components/ui/Ltr";

/** Offices with their direct lines (WhatsApp links), as a rule-separated grid. */
export async function OfficeLines() {
  const locale = (await getLocale()) as Locale;
  const p = await getTranslations("Home.presence");
  const t = await getTranslations("Locations");

  return (
    <ul className="grid border-t border-rule sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
      {offices.map((o) => (
        <li key={o.id} className="grid content-start gap-3 border-b border-rule py-6">
          <p className="flex items-baseline justify-between gap-4">
            <span className="text-xl font-semibold">{o.name[locale]}</span>
            {o.hq ? <span className="text-sm font-medium text-atlas-blue">{p("hq")}</span> : null}
          </p>
          {o.phone ? (
            <a
              href={whatsappHref(o.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline justify-between gap-4 text-steel hover:text-atlas-blue"
            >
              <span className="text-sm">{t("whatsapp")}</span>
              <span className="font-mono tabular text-ink">
                <Ltr>{o.phone}</Ltr>
              </span>
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
