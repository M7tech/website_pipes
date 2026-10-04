import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brands as allBrands, type Brand } from "@/content/brands";
import { brandSolutions } from "@/content/solutions";
import { Arrow } from "@/components/ui/Arrow";

/**
 * Logo grid of partner brands, each card linking to the brand page.
 * With `detailed`, cards also list how many product lines and solutions the brand covers.
 */
export async function BrandGrid({ brands = allBrands, detailed = false }: { brands?: Brand[]; detailed?: boolean }) {
  const countries = await getTranslations("Countries");
  const notes = await getTranslations("Brands.notes");
  const labels = await getTranslations("Brands.labels");
  const solutionsT = await getTranslations("Solutions");

  return (
    <ul className="grid grid-cols-2 border-s border-t border-rule sm:grid-cols-3">
      {brands.map((brand) => {
        const lineCount = brandSolutions(brand.slug).reduce((n, g) => n + g.lines.length, 0);
        return (
          <li key={brand.slug} className="grid border-b border-e border-rule max-sm:odd:last:col-span-2">
            <Link
              href={`/brands/${brand.slug}`}
              className="group flex flex-col justify-between gap-6 bg-paper p-5 transition-colors duration-(--duration-base) hover:bg-surface md:p-7"
            >
              <span className="flex h-16 items-center md:h-20">
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
                  <span lang="en" className="font-display-latin text-2xl font-semibold text-steel">
                    {brand.name}
                  </span>
                )}
              </span>
              <span className="grid gap-1">
                <span className="flex items-center justify-between gap-3">
                  <span lang="en" className="text-sm font-medium">
                    {brand.name}
                  </span>
                  <Arrow className="text-atlas-blue opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                </span>
                {brand.country ? (
                  <span className="font-mono text-xs text-steel [:lang(ar)_&]:font-arabic [:lang(ckb)_&]:font-arabic">
                    {countries(brand.country)}
                  </span>
                ) : null}
                {brand.note ? <span className="text-xs font-medium text-atlas-blue">{notes(brand.note)}</span> : null}
                {detailed ? (
                  <span className="mt-2 border-t border-rule pt-2 text-xs text-steel">
                    {lineCount ? solutionsT("labels.count", { count: lineCount }) : labels("onRequestShort")}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
