import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Map, List, SlidersHorizontal } from "lucide-react";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import PropertyTypeFilter from "@/components/stays/lease/PropertyTypeFilter";
import LeaseListingCard from "@/components/stays/lease/LeaseListingCard";
import LeaseMapView from "@/components/stays/lease/LeaseMapView";
import { PropertyTypeValue, PROPERTY_TYPES } from "@/lib/lease/property-types";

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
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  latitude?: number | null;
  longitude?: number | null;
}

type SortBy = "newest" | "price_low" | "price_high" | "beds";

const LeaseSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as PropertyTypeValue | null) || null;
  const validInitial = initialType && PROPERTY_TYPES.some((p) => p.value === initialType) ? initialType : null;

  const [listings, setListings] = useState<LeaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [showFilters, setShowFilters] = useState(false);
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
      p_limit: 100,
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

  const sorted = useMemo(() => {
    const arr = [...listings];
    switch (sortBy) {
      case "price_low": arr.sort((a, b) => Number(a.monthly_rent) - Number(b.monthly_rent)); break;
      case "price_high": arr.sort((a, b) => Number(b.monthly_rent) - Number(a.monthly_rent)); break;
      case "beds": arr.sort((a, b) => Number(b.bedrooms) - Number(a.bedrooms)); break;
      default:
        arr.sort((a, b) => {
          const da = a.updated_at || a.created_at || "";
          const db = b.updated_at || b.created_at || "";
          return db.localeCompare(da);
        });
    }
    return arr;
  }, [listings, sortBy]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Lease an Apartment, House, Condo, Loft or Townhouse | Mansa Stays</title>
        <meta name="description" content="Find yearly lease apartments, houses, condos, lofts and townhouses on Mansa Stays. Black-owned properties nationwide. Now live in Chicago and Atlanta." />
      </Helmet>

      <section className="border-b border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Find your next home</h1>
              <p className="text-white/85 mb-2 max-w-2xl">
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

          {/* Main search row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            <Input placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Input placeholder="Min rent" type="number" value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Input placeholder="Max rent" type="number" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Input placeholder="Beds" type="number" value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
            <Button onClick={() => fetchListings()} size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">Search</Button>
          </div>

          {/* Toggleable advanced filters */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters((s) => !s)}
              className="text-white/80 hover:text-white hover:bg-white/10 -ml-2"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              {showFilters ? "Hide filters" : "More filters"}
            </Button>
            {showFilters && (
              <div className="flex flex-wrap gap-4 text-sm text-white">
                <label className="flex items-center gap-2"><Checkbox checked={filters.pets} onCheckedChange={(v) => setFilters({ ...filters, pets: !!v })} /> Pets OK</label>
                <label className="flex items-center gap-2"><Checkbox checked={filters.section8} onCheckedChange={(v) => setFilters({ ...filters, section8: !!v })} /> Section 8 accepted</label>
                <label className="flex items-center gap-2"><Checkbox checked={filters.furnished} onCheckedChange={(v) => setFilters({ ...filters, furnished: !!v })} /> Furnished</label>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results header */}
      <section className="py-6 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-white/80 text-sm">
            {loading ? "Searching…" : (
              <>
                <span className="text-white font-semibold">{listings.length}</span> result{listings.length === 1 ? "" : "s"}
                {filters.city && <> in <span className="text-white">{filters.city}</span></>}
                {propertyType && <> · <span className="text-mansagold">{PROPERTY_TYPES.find(p => p.value === propertyType)?.label}</span></>}
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm min-h-[40px]"
              aria-label="Sort results"
            >
              <option value="newest" className="bg-black">Newest</option>
              <option value="price_low" className="bg-black">Price: low to high</option>
              <option value="price_high" className="bg-black">Price: high to low</option>
              <option value="beds" className="bg-black">Most bedrooms</option>
            </select>
            <div className="inline-flex rounded-md border border-white/20 overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-2 text-sm flex items-center gap-1 transition ${view === "list" ? "bg-mansagold text-black font-semibold" : "text-white hover:bg-white/10"}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" /> List
              </button>
              <button
                onClick={() => setView("map")}
                className={`px-3 py-2 text-sm flex items-center gap-1 transition ${view === "map" ? "bg-mansagold text-black font-semibold" : "text-white hover:bg-white/10"}`}
                aria-label="Map view"
              >
                <Map className="w-4 h-4" /> Map
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-white/70">Loading listings…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 bg-white/10 border-white/20 text-center">
              <p className="text-white/90 mb-4">No lease listings match your filters yet.</p>
              <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">
                <Link to="/stays/host/lease/new">List Your Property — Free</Link>
              </Button>
            </Card>
          ) : view === "map" ? (
            <div className="grid lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                <LeaseMapView listings={sorted} height="calc(100vh - 280px)" />
              </div>
              <div className="lg:col-span-2 max-h-[calc(100vh-280px)] overflow-y-auto space-y-3 pr-1">
                {sorted.map((l) => <LeaseListingCard key={l.id} l={l} />)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((l) => <LeaseListingCard key={l.id} l={l} />)}
            </div>
          )}
          <LeaseLegalFooter />
        </div>
      </section>
    </div>
  );
};

export default LeaseSearchPage;
