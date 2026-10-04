import type { ReactNode } from "react";

/** Keeps phone numbers, codes and Latin model names in left-to-right order inside RTL text. */
export function Ltr({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}
