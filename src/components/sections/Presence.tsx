import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cityNames, mapsHref, offices, regionalOffices, warehouses } from "@/content/company";
import { PinIcon } from "@/components/ui/PinIcon";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { SectionWipe } from "@/components/motion/SectionWipe";
import { IraqMap } from "./IraqMap";


/** Set `cta` to false on the page the section links to. */
export async function Presence({ cta = true }: { cta?: boolean } = {}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home.presence");
  const loc = await getTranslations("Locations");
  // Each office city on the map opens its first-listed office (Baghdad: the HQ) in Google Maps.
  const cityLinks = Object.fromEntries(
    [...offices].reverse().map((o) => [o.city, { href: mapsHref(o), label: loc("openMapFor", { place: o.name[locale] }) }]),
  );

  return (
    <section aria-labelledby="presence-title" className="section-space">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="presence-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
          action={cta ? <TextLink href="/locations">{t("cta")}</TextLink> : undefined}
        />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <figure className="grid gap-4 lg:col-span-6">
            <SectionWipe>
              <IraqMap
                locale={locale}
                label={t("mapLabel")}
                officeCities={[...new Set(offices.map((o) => o.city))]}
                warehouseCities={warehouses.map((w) => w.id)}
                cityNames={cityNames}
                cityLinks={cityLinks}
              />
            </SectionWipe>
            <figcaption className="flex flex-wrap gap-6 text-sm text-steel">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-atlas-blue" />
                {t("legendOffice")}
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3.5 border-[1.5px] border-atlas-blue" />
                {t("legendWarehouse")}
              </span>
            </figcaption>
          </figure>

          <div className="grid content-start gap-10 lg:col-span-5 lg:col-start-8">
            <div>
              <h3 className="eyebrow mb-3 text-steel">{t("offices")}</h3>
              <ul className="border-t border-rule">
                {offices.map((o) => (
                  <li key={o.id} className="border-b border-rule text-lg">
                    <a
                      href={mapsHref(o)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={loc("openMapFor", { place: o.name[locale] })}
                      className="group flex items-baseline justify-between gap-4 py-3.5 hover:text-atlas-blue"
                    >
                      <span className="flex items-baseline gap-2">
                        <PinIcon className="translate-y-0.5 text-atlas-blue opacity-60 transition-opacity group-hover:opacity-100" />
                        {o.name[locale]}
                      </span>
                      {o.hq ? <span className="text-sm font-medium text-atlas-blue">{t("hq")}</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
              <div>
                <h3 className="eyebrow mb-3 text-steel">{t("warehouses")}</h3>
                <ul className="border-t border-rule">
                  {warehouses.map((w) => (
                    <li key={w.id} className="border-b border-rule py-2.5">{w.name[locale]}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow mb-3 text-steel">{t("regional")}</h3>
                <ul className="border-t border-rule">
                  {regionalOffices.map((r) => (
                    <li key={r.en} className="border-b border-rule py-2.5">{r[locale]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
