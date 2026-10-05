import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { mapsHref, offices, whatsappHref } from "@/content/company";
import { Ltr } from "@/components/ui/Ltr";
import { PinIcon } from "@/components/ui/PinIcon";

/**
 * Offices with their direct lines (WhatsApp links) and a Google Maps link, as a grid of cards.
 * `narrow` keeps it to two columns when it shares the row with something else.
 */
export async function OfficeLines({ narrow = false, tone = "surface" }: { narrow?: boolean; tone?: "paper" | "surface" } = {}) {
  const locale = (await getLocale()) as Locale;
  const p = await getTranslations("Home.presence");
  const t = await getTranslations("Locations");

  return (
    <ul className={`grid gap-3 sm:grid-cols-2 md:gap-4 ${narrow ? "" : "lg:grid-cols-3"}`}>
      {offices.map((o) => (
        <li key={o.id} className={`grid content-start gap-3 rounded-card p-6 ${tone === "surface" ? "bg-surface" : "bg-paper"}`}>
          <p className="flex items-baseline justify-between gap-4">
            <span className="text-xl font-semibold">{o.name[locale]}</span>
            {o.hq ? <span className="rounded-full bg-atlas-blue/8 px-2.5 py-0.5 text-xs font-medium text-atlas-blue">{p("hq")}</span> : null}
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
          <a
            href={mapsHref(o)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("openMapFor", { place: o.name[locale] })}
            className="pressable mt-1 inline-flex min-h-10 items-center gap-2 justify-self-start rounded-full bg-atlas-blue/8 px-4 text-sm font-medium text-atlas-blue hover:bg-atlas-blue/14"
          >
            <PinIcon />
            {t("openMap")}
          </a>
        </li>
      ))}
    </ul>
  );
}
