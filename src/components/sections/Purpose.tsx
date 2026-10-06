import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

const statements = [
  { key: "vision", icon: "eye" },
  { key: "mission", icon: "target" },
] as const;

const values = [
  { key: "quality", icon: "award" },
  { key: "integrity", icon: "shieldCheck" },
  { key: "respect", icon: "heart" },
  { key: "innovation", icon: "bulb" },
  { key: "consistency", icon: "layers" },
  { key: "teamwork", icon: "users" },
] as const;

/**
 * About: vision, mission and values. The statements combine the old site's
 * (water and sewage networks) with the company profile's (sanitaryware, p6);
 * the values are the profile's.
 */
export async function Purpose() {
  const t = await getTranslations("About.purpose");

  return (
    <section
      aria-labelledby="purpose-title"
      className="on-dark section-space relative isolate overflow-hidden bg-atlas-navy text-on-dark"
    >
      <div aria-hidden="true" className="caustics absolute -inset-[10%] -z-10 mix-blend-screen" />
      <div className="container-page grid gap-12 md:gap-16">
        <h2 id="purpose-title" className="eyebrow text-atlas-mist">
          {t("eyebrow")}
        </h2>
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {statements.map(({ key, icon }) => (
            <div key={key} className="glass-on-dark grid content-start gap-5 rounded-panel p-7 md:p-10">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-atlas-mist">
                  <Icon name={icon} />
                </span>
                {t(`${key}Title`)}
              </h3>
              <p className="font-display-latin max-w-[30ch] text-[clamp(1.5rem,2.3vw,2rem)] font-semibold leading-[1.15] [:lang(ar)_&]:leading-[1.5] [:lang(ckb)_&]:leading-[1.5]">
                {t(key)}
              </p>
            </div>
          ))}
        </div>
        <div className="grid gap-5 pt-4">
          <h3 className="eyebrow text-atlas-mist">{t("valuesTitle")}</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ key, icon }) => (
              <li key={key} className="glass-on-dark flex items-center gap-3 rounded-card px-5 py-4 text-lg">
                <Icon name={icon} className="text-atlas-mist" />
                {t(`values.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
