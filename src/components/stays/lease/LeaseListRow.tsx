import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Bed, Bath, MapPin, BadgeCheck } from "lucide-react";
import { findByValue } from "@/lib/lease/property-types";

interface Listing {
  id: string;
  title: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  photos: string[];
  property_type: string;
  pets_allowed: boolean;
  section_8_accepted: boolean;
  furnished: boolean;
  is_verified?: boolean;
}

const LeaseListRow: React.FC<{ l: Listing }> = ({ l }) => {
  const type = findByValue(l.property_type);
  const photo = l.photos?.[0];
  return (
    <Link to={`/stays/lease/${l.id}`} className="block group">
      <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-mansagold/60 hover:shadow-[0_0_18px_rgba(255,179,0,0.12)] transition">
        <div className="flex gap-4">
          <div className="w-40 sm:w-56 aspect-[4/3] bg-white/5 shrink-0 overflow-hidden">
            {photo ? (
              <img
                src={photo}
                alt={l.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">No photo</div>
            )}
          </div>
          <div className="flex-1 py-3 pr-4 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-mansagold font-bold text-xl leading-none">
                ${Number(l.monthly_rent).toLocaleString()}
                <span className="text-sm text-white/50 font-normal">/mo</span>
              </p>
              {l.is_verified && (
                <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white mt-2 line-clamp-1 group-hover:text-mansagold transition">{l.title}</h3>
            <p className="text-white/60 text-sm flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{l.city}, {l.state}
            </p>
            <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{l.bedrooms}bd</span>
              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{l.bathrooms}ba</span>
              {type && <span className="text-white/60">· {type.label}</span>}
            </div>
            <div className="flex flex-wrap gap-1 mt-2 text-xs">
              {l.pets_allowed && <span className="bg-green-500/15 text-green-300 px-2 py-0.5 rounded">Pets OK</span>}
              {l.section_8_accepted && <span className="bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded">Section 8</span>}
              {l.furnished && <span className="bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded">Furnished</span>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default LeaseListRow;
