import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brandBySlug } from "@/content/brands";
import { solutionKey, solutions, type Solution } from "@/content/solutions";
import { Arrow } from "@/components/ui/Arrow";
import { Ltr } from "@/components/ui/Ltr";
import { SectionGlyph } from "@/components/sections/SectionGlyph";

/** Unique brand slugs of a solution, in the order its lines list them. */
export function solutionBrands(solution: Solution) {
  return [...new Set(solution.lines.map((l) => l.brand))];
}

/**
 * Index of solutions as rule-separated rows: glyph and name, a one-line
 * description, then the technical summary and brands in mono.
 */
export async function SolutionList({ only, headingLevel = "h3" }: { only?: string[]; headingLevel?: "h2" | "h3" }) {
  const t = await getTranslations("Solutions");
  const Heading = headingLevel;
  const list = only ? solutions.filter((s) => only.includes(s.slug)) : solutions;

  return (
    <ul className="border-t border-rule">
      {list.map((solution) => {
        const key = solutionKey(solution.slug);
        return (
          <li key={solution.slug} className="border-b border-rule">
            <Link
              href={`/solutions/${solution.slug}`}
              className="group -mx-3 grid gap-x-8 gap-y-3 px-3 py-7 transition-colors duration-(--duration-base) hover:bg-paper md:grid-cols-12 md:items-baseline md:py-9"
            >
              <span className="flex items-center gap-4 md:col-span-5">
                <SectionGlyph
                  wall={solution.wall}
                  className="text-atlas-blue transition-transform duration-(--duration-reveal) ease-(--ease-out-expo) group-hover:rotate-90"
                />
                <Heading className="font-display-latin text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal">
                  {t(`${key}.name`)}
                </Heading>
              </span>
              <span className="text-steel md:col-span-4">{t(`${key}.text`)}</span>
              <span className="grid gap-1.5 md:col-span-3">
                <span className="font-mono text-sm text-ink">
                  <Ltr>{solution.spec}</Ltr>
                </span>
                <span className="flex items-center justify-between gap-3 text-sm text-steel">
                  <Ltr>{solutionBrands(solution).map((b) => brandBySlug(b).name).join(" · ")}</Ltr>
                  <Arrow className="text-atlas-blue opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
