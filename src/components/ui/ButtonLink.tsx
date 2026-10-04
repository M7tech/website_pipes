import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Arrow } from "./Arrow";

type Variant = "primary" | "secondary" | "inverse" | "inverseOutline";

const variants: Record<Variant, string> = {
  primary: "bg-atlas-blue text-white hover:bg-atlas-navy",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
  inverse: "bg-paper text-atlas-navy hover:bg-white",
  inverseOutline: "border border-on-dark/60 text-on-dark hover:border-on-dark hover:bg-on-dark/10",
};

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "primary", className = "", children, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`group inline-flex min-h-12 items-center gap-3 px-6 text-[0.9375rem] font-medium transition-colors duration-(--duration-fast) ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}
