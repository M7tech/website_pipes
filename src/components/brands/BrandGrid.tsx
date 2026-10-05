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
export async function BrandGrid({
  brands = allBrands,
  detailed = false,
  tone = "surface",
}: {
  brands?: Brand[];
  detailed?: boolean;
  /** Tile colour: white on paper sections, paper on white sections. */
  tone?: "paper" | "surface";
}) {
  const countries = await getTranslations("Countries");
  const notes = await getTranslations("Brands.notes");
  const labels = await getTranslations("Brands.labels");
  const solutionsT = await getTranslations("Solutions");

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
      {brands.map((brand) => {
        const lineCount = brandSolutions(brand.slug).reduce((n, g) => n + g.lines.length, 0);
        return (
          <li key={brand.slug} className="grid max-sm:odd:last:col-span-2">
            <Link
              href={`/brands/${brand.slug}`}
              className={`group pressable lift flex flex-col justify-between gap-4 rounded-card p-4 sm:gap-6 sm:p-5 md:p-7 ${tone === "surface" ? "bg-surface" : "bg-paper"}`}
            >
              <span className="flex h-12 items-center sm:h-16 md:h-20">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt=""
                    width={240}
                    height={80}
                    unoptimized
                    className="max-h-10 w-auto max-w-[80%] object-contain grayscale sm:max-h-12 transition-[filter] duration-(--duration-base) group-hover:grayscale-0 md:max-h-14"
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
                  <Arrow className="text-atlas-blue opacity-0 transition-[opacity,translate] duration-(--duration-base) group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 rtl:group-hover:-translate-x-0.5" />
                </span>
                {brand.country ? (
                  <span className="text-sm text-steel">
                    {countries(brand.country)}
                  </span>
                ) : null}
                {brand.note ? <span className="text-xs font-medium text-atlas-blue">{notes(brand.note)}</span> : null}
                {detailed ? (
                  <span className="mt-2 inline-flex justify-self-start rounded-full bg-atlas-blue/8 px-2.5 py-1 text-xs font-medium text-atlas-blue">
                    {lineCount
                      ? solutionsT("labels.count", { count: lineCount })
                      : labels(brand.note === "directOrder" ? "directShort" : "onRequestShort")}
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
