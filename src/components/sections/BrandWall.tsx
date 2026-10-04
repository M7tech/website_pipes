import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { brands } from "@/content/brands";
import { SectionHead } from "@/components/ui/SectionHead";
import { TextLink } from "@/components/ui/TextLink";

export async function BrandWall() {
  const t = await getTranslations("Home.brands");
  const countries = await getTranslations("Countries");
  const notes = await getTranslations("Brands.notes");

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
        <ul className="grid grid-cols-2 border-s border-t border-rule sm:grid-cols-3">
          {brands.map((brand) => (
            <li key={brand.slug} className="group flex flex-col justify-between gap-6 border-b border-e border-rule bg-paper p-5 max-sm:odd:last:col-span-2 transition-colors duration-(--duration-base) hover:bg-surface md:p-7">
              <div className="flex h-16 items-center md:h-20">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={240}
                    height={80}
                    unoptimized
                    className="max-h-12 w-auto max-w-[80%] object-contain grayscale transition-[filter] duration-(--duration-base) group-hover:grayscale-0 md:max-h-14"
                  />
                ) : (
                  <span lang="en" className="font-display-latin text-2xl font-semibold text-steel">{brand.name}</span>
                )}
              </div>
              <div className="grid gap-1">
                <p lang="en" className="text-sm font-medium">{brand.name}</p>
                {brand.country ? <p className="font-mono text-xs text-steel [:lang(ar)_&]:font-arabic [:lang(ckb)_&]:font-arabic">{countries(brand.country)}</p> : null}
                {brand.note ? <p className="text-xs font-medium text-atlas-blue">{notes(brand.note)}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
