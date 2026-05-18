import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, DollarSign } from "lucide-react";

interface Props {
  city?: string;
  maxRent?: number;
  onSuggestion: (patch: { city?: string; maxRent?: string }) => void;
}

// Nearby-city suggestions per supported metro
const NEARBY: Record<string, string[]> = {
  chicago: ["Bronzeville", "Hyde Park", "Evanston", "Oak Park"],
  atlanta: ["Decatur", "East Point", "Marietta", "Smyrna"],
};

const SmartEmptyState: React.FC<Props> = ({ city, maxRent, onSuggestion }) => {
  const key = (city || "").toLowerCase().trim();
  const nearby = NEARBY[key] || [];
  const widerBudget = maxRent ? Math.round(maxRent * 1.5) : null;

  return (
    <Card className="p-8 bg-white/5 border-white/15 max-w-2xl mx-auto">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-mansagold/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-mansagold" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Kayla has a few ideas</h3>
          <p className="text-white/70 text-sm mt-1">
            No matches{city && <> in <span className="text-white">{city}</span></>}
            {maxRent && <> under <span className="text-white">${maxRent.toLocaleString()}</span></>}
            {" "}— try one of these tweaks:
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {nearby.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50 mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Nearby neighborhoods
            </p>
            <div className="flex flex-wrap gap-2">
              {nearby.map((n) => (
                <button
                  key={n}
                  onClick={() => onSuggestion({ city: n })}
                  className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-mansagold/15 hover:text-mansagold border border-white/15 text-sm text-white/85 transition"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {widerBudget && (
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50 mb-2 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Expand budget
            </p>
            <button
              onClick={() => onSuggestion({ maxRent: String(widerBudget) })}
              className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-mansagold/15 hover:text-mansagold border border-white/15 text-sm text-white/85 transition"
            >
              Up to ${widerBudget.toLocaleString()}/mo
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2">
        <Button asChild size="sm" className="bg-mansagold text-black hover:bg-mansagold/90 font-semibold">
          <Link to="/stays/host/lease/new">List Your Property — Free</Link>
        </Button>
        <p className="text-xs text-white/50 self-center">
          Are you a landlord? Add your property and reach 1325.AI's tenant network.
        </p>
      </div>
    </Card>
  );
};

export default SmartEmptyState;
