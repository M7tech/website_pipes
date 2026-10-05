import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Arrow } from "./Arrow";

type Variant = "primary" | "secondary" | "inverse" | "inverseOutline";

/** Resting look, and the colour of the "water" that rises into the button on hover. */
const variants: Record<Variant, { base: string; liquid: string }> = {
  primary: { base: "bg-atlas-blue text-white", liquid: "bg-atlas-navy" },
  secondary: { base: "border border-ink text-ink hover:text-paper", liquid: "bg-ink" },
  inverse: { base: "bg-paper text-atlas-navy", liquid: "bg-white" },
  inverseOutline: { base: "border border-on-dark/60 text-on-dark hover:border-on-dark", liquid: "bg-on-dark/15" },
};

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", children, ...props }: ButtonLinkProps) {
  const v = variants[variant];
  return (
    <Link
      {...props}
      className={`group relative isolate inline-flex min-h-12 items-center gap-3 overflow-hidden px-6 text-[0.9375rem] font-medium transition-[color,background-color,border-color,scale] duration-(--duration-base) ease-(--ease-out-expo) active:scale-[0.97] active:duration-(--duration-fast) ${v.base} ${className}`}
    >
      <span aria-hidden="true" className={`liquid -z-10 ${v.liquid}`} />
      <span>{children}</span>
      <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}
