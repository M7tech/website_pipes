import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

const services = ["distribution", "projects", "technical", "afterSales", "training", "privateLabel"] as const;
const serviceIcons = {
  distribution: "truck",
  projects: "helmet",
  technical: "headset",
  afterSales: "shieldCheck",
  training: "graduation",
  privateLabel: "tag",
} as const;
const community = ["sponsorship", "vocational", "entrepreneurs", "schools"] as const;

export async function ServiceModel() {
  const t = await getTranslations("Home.services");

  return (
    <section aria-labelledby="services-title" className="section-space bg-surface">
      <div className="container-page grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <div className="grid gap-5 md:sticky md:top-32">
            <p className="eyebrow text-atlas-blue">{t("eyebrow")}</p>
            <h2
              id="services-title"
              className="font-display-latin text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] [:lang(ar)_&]:leading-[1.25] [:lang(ckb)_&]:leading-[1.25]"
            >
              {t("title")}
            </h2>
            <p className="max-w-[34ch] text-lg text-steel">{t("intro")}</p>
          </div>
        </div>

        <div className="grid gap-4 md:col-span-7">
          <dl className="shelf gap-3 sm:grid sm:grid-cols-2 md:gap-4">
            {services.map((key) => (
              <div key={key} className="grid content-start gap-2 rounded-card bg-paper p-6 md:p-7">
                <dt className="grid gap-4 text-xl font-semibold">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface text-atlas-blue">
                    <Icon name={serviceIcons[key]} />
                  </span>
                  {t(`items.${key}.title`)}
                </dt>
                <dd className="text-steel">{t(`items.${key}.text`)}</dd>
              </div>
            ))}
          </dl>

          <div className="on-dark relative isolate grid gap-5 overflow-hidden rounded-card bg-atlas-navy p-6 text-on-dark md:p-8">
            <div aria-hidden="true" className="caustics absolute -inset-[10%] -z-10 mix-blend-screen" />
            <h3 className="eyebrow flex items-center gap-2 text-atlas-mist">
              <Icon name="heart" className="size-5" />
              {t("communityTitle")}
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
              {community.map((key) => (
                <li key={key} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-atlas-mist" />
                  <span>{t(`community.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
