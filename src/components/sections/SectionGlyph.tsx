/**
 * Small pipe cross-section used as the marker for each product family.
 * The wall ratio differs per family so the markers read as a related set.
 */
export function SectionGlyph({ wall, className = "" }: { wall: number; className?: string }) {
  const r = 15;
  const inner = r - wall;
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className={`size-9 shrink-0 ${className}`}>
      <circle cx="18" cy="18" r={(r + inner) / 2} fill="none" stroke="currentColor" strokeWidth={wall} />
    </svg>
  );
}
