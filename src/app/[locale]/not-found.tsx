import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <section className="section-space">
      <div className="container-page grid max-w-3xl gap-6">
        <p className="eyebrow font-mono text-steel">404</p>
        <h1 className="font-display-latin text-5xl font-semibold">{t("title")}</h1>
        <p className="text-lg text-steel">{t("body")}</p>
        <div>
          <ButtonLink href="/" variant="secondary">{t("back")}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
