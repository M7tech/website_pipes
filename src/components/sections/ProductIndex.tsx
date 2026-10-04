import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brandBySlug, productFamilies } from "@/content/brands";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";
import { Arrow } from "@/components/ui/Arrow";
import { Ltr } from "@/components/ui/Ltr";
import { SectionGlyph } from "./SectionGlyph";

const walls = [2.5, 4, 6, 3, 8, 5, 10];

export async function ProductIndex() {
  const t = await getTranslations("Home.products");
  const p = await getTranslations("Products.families");

  return (
    <section aria-labelledby="products-title" className="section-space bg-surface">
      <div className="container-page grid gap-12 md:gap-16">
        <SectionHead
          id="products-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
          action={<TextLink href="/products">{t("cta")}</TextLink>}
        />
        <ul className="border-t border-rule">
          {productFamilies.map((family, i) => (
            <li key={family.key} className="border-b border-rule">
              <Link
                href="/products"
                className="group -mx-3 grid gap-x-8 gap-y-3 px-3 py-7 transition-colors duration-(--duration-base) hover:bg-paper md:grid-cols-12 md:items-baseline md:py-9"
              >
                <span className="flex items-center gap-4 md:col-span-5">
                  <SectionGlyph wall={walls[i]} className="text-atlas-blue transition-transform duration-(--duration-reveal) ease-(--ease-out-expo) group-hover:rotate-90" />
                  <span className="font-display-latin text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal">
                    {p(`${family.key}.name`)}
                  </span>
                </span>
                <span className="text-steel md:col-span-4">{p(`${family.key}.text`)}</span>
                <span className="grid gap-1.5 md:col-span-3">
                  <span className="font-mono text-sm text-ink">
                    <Ltr>{family.spec}</Ltr>
                  </span>
                  <span className="flex items-center justify-between gap-3 text-sm text-steel">
                    <Ltr>{family.brands.map((b) => brandBySlug(b).name).join(" · ")}</Ltr>
                    <Arrow className="text-atlas-blue opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
