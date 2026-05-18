import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Bed, Bath, MapPin, BadgeCheck, Clock } from "lucide-react";
import PhotoCarousel from "./PhotoCarousel";
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
  available_from: string | null;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

const timeAgo = (iso?: string) => {
  if (!iso) return "";
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 86400 * 7) return `${Math.floor(d / 86400)}d ago`;
  if (d < 86400 * 30) return `${Math.floor(d / (86400 * 7))}w ago`;
  return new Date(iso).toLocaleDateString();
};

const LeaseListingCard: React.FC<{ l: Listing }> = ({ l }) => {
  const type = findByValue(l.property_type);
  const updated = l.updated_at || l.created_at;
  return (
    <Link to={`/stays/lease/${l.id}`} className="block group">
      <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-mansagold/60 hover:shadow-[0_0_20px_rgba(255,179,0,0.15)] transition h-full flex flex-col">
        <div className="relative">
          <PhotoCarousel photos={l.photos || []} alt={l.title} className="aspect-[4/3]" />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-mansablue text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md border border-white/10">
            🔑 Yearly Lease
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <p className="text-mansagold font-bold text-xl">
              ${Number(l.monthly_rent).toLocaleString()}
              <span className="text-sm text-white/50 font-normal">/mo</span>
            </p>
            {l.is_verified && (
              <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded">
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-white/80">
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{l.bedrooms}bd</span>
            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{l.bathrooms}ba</span>
            {type && <span className="text-white/60">· {type.label}</span>}
          </div>
          <h3 className="font-semibold text-white mt-2 line-clamp-1 group-hover:text-mansagold transition">{l.title}</h3>
          <p className="text-white/60 text-sm flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />{l.city}, {l.state}
          </p>
          <div className="flex flex-wrap gap-1 mt-2 text-xs">
            {l.pets_allowed && <span className="bg-green-500/15 text-green-300 px-2 py-0.5 rounded">Pets OK</span>}
            {l.section_8_accepted && <span className="bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded">Section 8</span>}
            {l.furnished && <span className="bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded">Furnished</span>}
          </div>
          <div className="mt-auto pt-3 flex items-center gap-1 text-[11px] text-white/40">
            <Clock className="w-3 h-3" /> Updated {timeAgo(updated)}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default LeaseListingCard;
