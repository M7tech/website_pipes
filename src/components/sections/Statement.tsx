import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

export async function Statement() {
  const t = await getTranslations("Home.statement");
  return (
    <section aria-labelledby="statement-title" className="section-space">
      <div className="container-page grid gap-12">
        <div className="grid max-w-5xl gap-5">
          <p className="eyebrow text-atlas-blue">{t("eyebrow")}</p>
          <h2
            id="statement-title"
            className="font-display-latin max-w-[20ch] text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.04] [:lang(ar)_&]:leading-[1.3] [:lang(ckb)_&]:leading-[1.3]"
          >
            {t("title")}
          </h2>
        </div>
        <div className="grid max-w-5xl gap-8 text-lg text-ink/80 md:grid-cols-2 md:gap-10 md:text-xl">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
        </div>
        <p className="flex max-w-5xl items-center gap-4 rounded-card bg-surface p-5 text-lg font-semibold text-atlas-blue md:p-6 md:text-xl">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-atlas-blue text-white">
            <Icon name="award" />
          </span>
          {t("projects")}
        </p>
      </div>
    </section>
  );
}
