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
        <h2 id="purpose-title" className="eyebrow border-t-2 border-on-dark pt-5 text-on-dark-muted">
          {t("eyebrow")}
        </h2>
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          {statements.map(({ key, icon }) => (
            <div key={key} className="grid content-start gap-5">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-atlas-sky">
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
        <div className="grid gap-6 border-t border-rule-dark pt-8">
          <h3 className="eyebrow text-on-dark-muted">{t("valuesTitle")}</h3>
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ key, icon }) => (
              <li key={key} className="flex items-center gap-3 text-lg">
                <Icon name={icon} className="text-atlas-sky" />
                {t(`values.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
