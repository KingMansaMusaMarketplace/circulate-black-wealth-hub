import React from "react";

export type PriceTier = "all" | "$" | "$$" | "$$$" | "$$$$";

interface Props {
  active: PriceTier;
  onChange: (tier: PriceTier) => void;
  counts?: Partial<Record<PriceTier, number>>;
}

/**
 * Price-tier jump rail — analogue of the Directory's A–Z rail.
 * $ = under $1,000 · $$ = $1,000–1,999 · $$$ = $2,000–3,499 · $$$$ = $3,500+
 */
export const PRICE_TIERS: { value: PriceTier; label: string; range: [number, number | null] }[] = [
  { value: "all", label: "All", range: [0, null] },
  { value: "$", label: "$", range: [0, 999] },
  { value: "$$", label: "$$", range: [1000, 1999] },
  { value: "$$$", label: "$$$", range: [2000, 3499] },
  { value: "$$$$", label: "$$$$", range: [3500, null] },
];

const LeasePriceRail: React.FC<Props> = ({ active, onChange, counts }) => (
  <div className="flex items-center gap-1.5 flex-wrap text-sm">
    <span className="text-white/50 mr-1">Budget:</span>
    {PRICE_TIERS.map((t) => {
      const isActive = active === t.value;
      const count = counts?.[t.value];
      return (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-2.5 py-1 rounded-md border transition font-medium ${
            isActive
              ? "bg-mansagold text-black border-mansagold"
              : "bg-white/5 text-white/80 border-white/15 hover:bg-white/10"
          }`}
          aria-pressed={isActive}
        >
          {t.label}
          {typeof count === "number" && (
            <span className={`ml-1 text-xs ${isActive ? "text-black/70" : "text-white/50"}`}>
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default LeasePriceRail;
