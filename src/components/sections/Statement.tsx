import { getTranslations } from "next-intl/server";

export async function Statement() {
  const t = await getTranslations("Home.statement");
  return (
    <section aria-labelledby="statement-title" className="section-space">
      <div className="container-page grid gap-y-10 md:grid-cols-12 md:gap-x-8">
        <p className="eyebrow text-steel md:col-span-3 md:pt-3">{t("eyebrow")}</p>
        <div className="grid gap-12 md:col-span-9">
          <h2
            id="statement-title"
            className="font-display-latin max-w-[20ch] text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[1.02] [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]"
          >
            {t("title")}
          </h2>
          <div className="grid gap-8 text-lg text-ink/85 md:grid-cols-2 md:gap-10">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
          </div>
          <p className="border-s-2 border-atlas-blue ps-5 text-xl font-medium text-atlas-blue md:text-2xl">
            {t("projects")}
          </p>
        </div>
      </div>
    </section>
  );
}
