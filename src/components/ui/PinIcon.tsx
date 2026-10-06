/** Map pin, used on links that open a location in Google Maps. */
export function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`size-[1em] shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 18s5.5-5.2 5.5-9.5a5.5 5.5 0 0 0-11 0C4.5 12.8 10 18 10 18z" />
      <circle cx="10" cy="8.5" r="2" />
    </svg>
  );
}
