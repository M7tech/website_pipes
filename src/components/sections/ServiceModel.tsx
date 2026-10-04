import { getTranslations } from "next-intl/server";

const services = ["distribution", "projects", "technical", "afterSales", "training", "privateLabel"] as const;
const community = ["sponsorship", "vocational", "entrepreneurs", "schools"] as const;

export async function ServiceModel() {
  const t = await getTranslations("Home.services");

  return (
    <section aria-labelledby="services-title" className="section-space bg-surface">
      <div className="container-page grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <div className="grid gap-6 border-t-2 border-ink pt-5 md:sticky md:top-32">
            <p className="eyebrow text-steel">{t("eyebrow")}</p>
            <h2
              id="services-title"
              className="font-display-latin text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] [:lang(ar)_&]:leading-[1.25] [:lang(ckb)_&]:leading-[1.25]"
            >
              {t("title")}
            </h2>
            <p className="max-w-[34ch] text-lg text-steel">{t("intro")}</p>
          </div>
        </div>

        <div className="grid gap-16 md:col-span-7">
          <dl className="grid border-t border-rule sm:grid-cols-2 sm:gap-x-8">
            {services.map((key) => (
              <div key={key} className="grid content-start gap-2 border-b border-rule py-7">
                <dt className="text-xl font-semibold">{t(`items.${key}.title`)}</dt>
                <dd className="text-steel">{t(`items.${key}.text`)}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-5 bg-paper p-6 md:p-8">
            <h3 className="eyebrow text-steel">{t("communityTitle")}</h3>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
              {community.map((key) => (
                <li key={key} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-atlas-blue" />
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
