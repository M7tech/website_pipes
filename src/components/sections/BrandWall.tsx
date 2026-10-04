import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { BrandGrid } from "@/components/brands/BrandGrid";

export async function BrandWall() {
  const t = await getTranslations("Home.brands");

  return (
    <section aria-labelledby="brands-title" className="section-space">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="brands-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
          action={<TextLink href="/brands">{t("cta")}</TextLink>}
        />
        <BrandGrid />
      </div>
    </section>
  );
}
