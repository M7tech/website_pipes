type ArrowProps = { className?: string };

/** Forward arrow that points along the reading direction (mirrors in RTL). */
export function Arrow({ className = "" }: ArrowProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-[1em] shrink-0 rtl:-scale-x-100 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}
