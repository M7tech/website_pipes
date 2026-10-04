import { getTranslations } from "next-intl/server";
import { LineRise } from "@/components/motion/LineRise";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { facts } from "@/content/company";
import { PipeSection } from "./PipeSection";
import { Ltr } from "@/components/ui/Ltr";

export async function Hero() {
  const t = await getTranslations("Home.hero");
  const f = await getTranslations("Home.facts");

  return (
    <section aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-atlas-navy text-on-dark">
      <div className="container-page grid gap-12 pb-12 pt-12 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pb-16 lg:pt-28">
        <div className="grid content-start gap-8 lg:col-span-7">
          <p className="eyebrow text-on-dark-muted">{t("eyebrow")}</p>
          <LineRise
            text={t("title")}
            className="font-display-latin text-[clamp(2.4rem,6.2vw,5.6rem)] font-semibold leading-[0.98] [:lang(ar)_&]:leading-[1.28] [:lang(ckb)_&]:leading-[1.28]"
          />
          <p className="max-w-[46ch] text-lg text-on-dark-muted md:text-xl">{t("lead")}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/products" variant="inverse">
              {t("primary")}
            </ButtonLink>
            <ButtonLink href="/contact" variant="inverseOutline">
              {t("secondary")}
            </ButtonLink>
          </div>
        </div>
        <div className="flex items-center justify-center text-on-dark lg:col-span-5 lg:justify-end">
          <PipeSection label={t("diagramLabel")} />
        </div>
      </div>

      <div className="container-page">
        <dl aria-label={f("label")} className="grid grid-cols-2 border-t border-rule-dark lg:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              key={fact.key}
              className={`flex flex-col-reverse gap-2 border-rule-dark py-6 pe-4 md:py-8 ${i % 2 === 1 ? "border-s ps-4 lg:ps-6" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-s lg:ps-6" : ""}`}
            >
              <dt className="max-w-[24ch] text-sm text-on-dark-muted">{f(fact.key)}</dt>
              <dd className="font-display-latin text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tabular">
                <Ltr>{fact.value}</Ltr>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
