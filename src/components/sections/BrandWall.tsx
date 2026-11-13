import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { BrandGrid } from "@/components/brands/BrandGrid";
import { BrandPhotoStrip } from "@/components/brands/BrandPhotoStrip";

export async function BrandWall() {
  const t = await getTranslations("Home.brands");
  const b = await getTranslations("Brands");

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
      </div>
      <div className="mt-12 md:mt-16">
        <BrandPhotoStrip label={b("photoStrip")} />
      </div>
      <div className="container-page mt-12 md:mt-16">
        <BrandGrid />
      </div>
    </section>
  );
}
