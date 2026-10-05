import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Arrow } from "./Arrow";

export function TextLink({ className = "", children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`group inline-flex items-center gap-1.5 font-medium text-atlas-blue underline-offset-[5px] hover:underline ${className}`}
    >
      {children}
      <Arrow className="transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}
