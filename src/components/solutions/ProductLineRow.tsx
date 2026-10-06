import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { ProductLine } from "@/content/solutions";
import { Ltr } from "@/components/ui/Ltr";

/**
 * One product line: name, description and spec table. The optional lead
 * column (brand mark, or the solution it belongs to) sits on the start side.
 */
export async function ProductLineRow({
  line,
  lead,
  headingLevel = "h3",
}: {
  line: ProductLine;
  lead?: ReactNode;
  headingLevel?: "h3" | "h4";
}) {
  const Heading = headingLevel;
  const t = await getTranslations("Solutions");
  const countries = await getTranslations("Countries");
  const translated = t.has(`lines.${line.id}.name`);
  const name = translated ? t(`lines.${line.id}.name`) : line.name;

  return (
    <li
      className={`grid gap-x-8 gap-y-5 rounded-card bg-surface p-6 md:p-8 ${lead ? "md:grid-cols-12" : "md:grid-cols-9"}`}
    >
      {lead ? <div className="flex items-start gap-4 md:col-span-3 md:flex-col md:gap-3">{lead}</div> : null}
      <div className="grid content-start gap-3 md:col-span-4">
        <Heading
          lang={translated ? undefined : "en"}
          className="font-display-latin text-[clamp(1.375rem,2.2vw,1.875rem)] font-semibold leading-tight [:lang(ar)_&]:leading-normal [:lang(ckb)_&]:leading-normal"
        >
          {name}
        </Heading>
        <p className="text-steel">{t(`lines.${line.id}.text`)}</p>
      </div>
      {line.specs.length || line.madeIn ? (
        <dl aria-label={t("labels.specs")} className="grid content-start divide-y divide-rule/70 self-start rounded-tile bg-paper px-4 md:col-span-5">
          {line.specs.map((spec) => (
            <div
              key={spec.key}
              className="grid grid-cols-[minmax(7rem,2fr)_3fr] gap-4 py-2.5 text-sm"
            >
              <dt className="text-steel">{t(`specs.${spec.key}`)}</dt>
              <dd className="font-mono text-ink">
                <Ltr>{spec.value}</Ltr>
              </dd>
            </div>
          ))}
          {line.madeIn ? (
            <div className="grid grid-cols-[minmax(7rem,2fr)_3fr] gap-4 py-2.5 text-sm">
              <dt className="text-steel">{t("specs.madeIn")}</dt>
              <dd className="text-ink">{countries(line.madeIn)}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </li>
  );
}
