import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Bed, Bath, MapPin, DollarSign } from "lucide-react";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import PropertyTypeFilter from "@/components/stays/lease/PropertyTypeFilter";
import { findByValue, PropertyTypeValue, PROPERTY_TYPES } from "@/lib/lease/property-types";

interface LeaseListing {
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
}

const LeaseSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as PropertyTypeValue | null) || null;
  const validInitial = initialType && PROPERTY_TYPES.some((p) => p.value === initialType) ? initialType : null;

  const [listings, setListings] = useState<LeaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyType, setPropertyType] = useState<PropertyTypeValue | null>(validInitial);
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    minRent: "",
    maxRent: "",
    bedrooms: "",
    pets: false,
    section8: false,
    furnished: false,
  });

  const fetchListings = async (typeOverride?: PropertyTypeValue | null) => {
    setLoading(true);
    const activeType = typeOverride !== undefined ? typeOverride : propertyType;
    const { data, error } = await supabase.rpc("search_lease_listings", {
      p_city: filters.city || null,
      p_min_rent: filters.minRent ? Number(filters.minRent) : null,
      p_max_rent: filters.maxRent ? Number(filters.maxRent) : null,
      p_bedrooms: filters.bedrooms ? Number(filters.bedrooms) : null,
      p_pets: filters.pets || null,
      p_section_8: filters.section8 || null,
      p_furnished: filters.furnished || null,
      p_property_type: activeType || null,
      p_limit: 50,
      p_offset: 0,
    } as any);
    if (!error && data) setListings(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); /* eslint-disable-next-line */ }, []);

  const handleTypeChange = (v: PropertyTypeValue | null) => {
    setPropertyType(v);
    const next = new URLSearchParams(searchParams);
    if (v) next.set("type", v); else next.delete("type");
    setSearchParams(next, { replace: true });
    fetchListings(v);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Lease an Apartment, House, Condo, Loft or Townhouse | Mansa Stays</title>
        <meta name="description" content="Find yearly lease apartments, houses, condos, lofts and townhouses on Mansa Stays. Black-owned properties nationwide. Now live in Chicago and Atlanta." />
      </Helmet>

      <section className="border-b border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Find your next home</h1>
              <p className="text-white/85 mb-2">
                Yearly leases on apartments, houses, condos, lofts and townhouses. Direct from landlords — no broker fees for tenants.
              </p>
              <p className="text-mansagold text-sm">Now live in <strong>Chicago</strong> and <strong>Atlanta</strong> · Listings available nationwide</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 min-h-[48px]">
                <Link to="/stays/host/lease/dashboard">My Listings</Link>
              </Button>
              <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold shadow-lg min-h-[48px]">
                <Link to="/stays/host/lease/new">List Your Property — Free</Link>
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <PropertyTypeFilter value={propertyType} onChange={handleTypeChange} />
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Input placeholder="Min rent" type="number" value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Input placeholder="Max rent" type="number" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Input placeholder="Beds" type="number" value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Button onClick={() => fetchListings()} size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">Search</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white">
            <label className="flex items-center gap-2"><Checkbox checked={filters.pets} onCheckedChange={(v) => setFilters({ ...filters, pets: !!v })} /> Pets OK</label>
            <label className="flex items-center gap-2"><Checkbox checked={filters.section8} onCheckedChange={(v) => setFilters({ ...filters, section8: !!v })} /> Section 8 accepted</label>
            <label className="flex items-center gap-2"><Checkbox checked={filters.furnished} onCheckedChange={(v) => setFilters({ ...filters, furnished: !!v })} /> Furnished</label>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-white/70">Loading listings…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 bg-white/10 border-white/20 text-center">
              <p className="text-white/90 mb-4">No lease listings match your filters yet.</p>
              <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">
                <Link to="/stays/host/lease/new">List Your Property — Free</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => {
                const type = findByValue(l.property_type);
                return (
                  <Link to={`/stays/lease/${l.id}`} key={l.id}>
                    <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-mansagold/50 transition h-full">
                      <div className="aspect-video bg-white/10">
                        {l.photos?.[0] && <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" loading="lazy" />}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-1">{l.title}</h3>
                        <p className="text-white/60 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{l.city}, {l.state}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-white/70 flex-wrap">
                          {type && <span className="text-mansagold font-medium">{type.label}</span>}
                          <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{l.bedrooms}bd</span>
                          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{l.bathrooms}ba</span>
                        </div>
                        <p className="mt-3 text-mansagold font-bold text-xl flex items-center"><DollarSign className="w-4 h-4" />{Number(l.monthly_rent).toLocaleString()}<span className="text-sm text-white/50 font-normal">/mo</span></p>
                        <div className="flex flex-wrap gap-1 mt-2 text-xs">
                          {l.pets_allowed && <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Pets</span>}
                          {l.section_8_accepted && <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Section 8</span>}
                          {l.furnished && <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Furnished</span>}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
          <LeaseLegalFooter />
        </div>
      </section>
    </div>
  );
};

export default LeaseSearchPage;
