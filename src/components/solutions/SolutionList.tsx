import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brandBySlug } from "@/content/brands";
import { solutionKey, solutions, type Solution } from "@/content/solutions";
import { Arrow } from "@/components/ui/Arrow";
import { Ltr } from "@/components/ui/Ltr";
import { Icon } from "@/components/ui/Icon";

/** Unique brand slugs of a solution, in the order its lines list them. */
export function solutionBrands(solution: Solution) {
  return [...new Set(solution.lines.map((l) => l.brand))];
}

/**
 * Which cards run two columns wide so the grid closes without gaps: on three
 * columns the first (and, for 3n+1 cards, the last) card widens; on two columns
 * an odd card out at the end widens. Wide cards lay out side by side.
 */
function layout(count: number) {
  const wide = new Set<number>();
  if (count % 3 === 1 && count > 1) wide.add(0).add(count - 1);
  if (count % 3 === 2) wide.add(0);
  const lastAloneOnTwo = (count - wide.size) % 2 === 1 && !wide.has(count - 1);
  return (i: number): "wide" | "wideOnTwo" | "single" =>
    wide.has(i) ? "wide" : lastAloneOnTwo && i === count - 1 ? "wideOnTwo" : "single";
}

/**
 * Solutions as photo cards: a product photo, the glyph and name, a one-line
 * description, then the technical summary and brands.
 */
export async function SolutionList({
  only,
  headingLevel = "h3",
  tone = "paper",
}: {
  only?: string[];
  headingLevel?: "h2" | "h3";
  /** Card colour: paper on white sections, white on paper sections. */
  tone?: "paper" | "surface";
}) {
  const t = await getTranslations("Solutions");
  const Heading = headingLevel;
  const list = only ? solutions.filter((s) => only.includes(s.slug)) : solutions;
  const shape = layout(list.length);

  return (
    <ul className="shelf gap-4 sm:grid sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {list.map((solution, i) => {
        const key = solutionKey(solution.slug);
        const photo = solution.photos[0];
        const s = shape(i);
        // Side by side: always for wide cards, and on two columns for the odd card out.
        const row = s === "wide" ? "sm:grid-cols-2" : s === "wideOnTwo" ? "sm:grid-cols-2 lg:grid-cols-1" : "";
        return (
          <li key={solution.slug} className={s === "wide" ? "sm:col-span-2" : s === "wideOnTwo" ? "sm:col-span-2 lg:col-span-1" : ""}>
            <Link
              href={`/solutions/${solution.slug}`}
              className={`group pressable lift grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-card ${row ? `sm:grid-rows-1 ${row}` : ""} ${s === "wideOnTwo" ? "lg:grid-rows-[auto_1fr]" : ""} ${tone === "paper" ? "bg-paper" : "bg-surface"}`}
            >
              {/* Most photos are cut-outs on white: multiply lets them sit on the card's own colour. */}
              <span className={`relative block aspect-[1.62] overflow-hidden ${row ? "sm:aspect-auto sm:min-h-64" : ""} ${s === "wideOnTwo" ? "lg:aspect-[1.62] lg:min-h-0" : ""}`}>
                {photo ? (
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes={s === "single" ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                    className={`mix-blend-multiply transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04] ${row ? "object-cover sm:object-contain" : "object-cover"} ${s === "wideOnTwo" ? "lg:object-cover" : ""}`}
                  />
                ) : null}
              </span>
              <span className={`flex flex-col gap-3 p-6 md:p-7 ${row ? "sm:justify-center" : ""} ${s === "wideOnTwo" ? "lg:justify-start" : ""}`}>
                <span className="flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-atlas-blue/8 text-atlas-blue transition-colors duration-(--duration-base) group-hover:bg-atlas-blue group-hover:text-white">
                    <Icon name={solution.icon} className="size-5" />
                  </span>
                  <Heading className="font-display-latin text-[1.625rem] font-semibold leading-tight [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal">
                    {t(`${key}.name`)}
                  </Heading>
                </span>
                <span className="text-steel">{t(`${key}.text`)}</span>
                <span className={`grid gap-1.5 pt-3 ${row ? "" : "mt-auto"} ${s === "wideOnTwo" ? "lg:mt-auto" : ""}`}>
                  <span className="font-mono text-sm text-ink">
                    <Ltr>{solution.spec}</Ltr>
                  </span>
                  <span className="flex items-center justify-between gap-3 text-sm text-steel">
                    <Ltr>{solutionBrands(solution).map((b) => brandBySlug(b).name).join(" · ")}</Ltr>
                    <Arrow className="shrink-0 text-atlas-blue transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
