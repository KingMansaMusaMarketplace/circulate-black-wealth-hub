import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import PropertyTypeFilter from "@/components/stays/lease/PropertyTypeFilter";
import LeaseListingCard from "@/components/stays/lease/LeaseListingCard";
import LeaseListRow from "@/components/stays/lease/LeaseListRow";
const LeaseMapView = lazy(() => import("@/components/stays/lease/LeaseMapView"));
import LeaseHero from "@/components/stays/lease/LeaseHero";
import SaveSearchButton from "@/components/stays/lease/SaveSearchButton";
import SmartEmptyState from "@/components/stays/lease/SmartEmptyState";
import BrowseLayout, { BrowseViewMode } from "@/components/browse/BrowseLayout";
import LeasePriceRail, { PRICE_TIERS, PriceTier } from "@/components/stays/lease/LeasePriceRail";
import DirectoryPagination from "@/components/directory/DirectoryPagination";
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
const PAGE_SIZE = 24;

const LeaseSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as PropertyTypeValue | null) || null;
  const validInitial = initialType && PROPERTY_TYPES.some((p) => p.value === initialType) ? initialType : null;

  const [listings, setListings] = useState<LeaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<BrowseViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyTypeValue | null>(validInitial);
  const [priceTier, setPriceTier] = useState<PriceTier>("all");
  const [page, setPage] = useState(1);
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
      p_limit: 200,
      p_offset: 0,
    } as any);
    if (!error && data) setListings(data as any);
    setLoading(false);
    setPage(1);
  };

  useEffect(() => { fetchListings(); /* eslint-disable-next-line */ }, []);

  const handleTypeChange = (v: PropertyTypeValue | null) => {
    setPropertyType(v);
    const next = new URLSearchParams(searchParams);
    if (v) next.set("type", v); else next.delete("type");
    setSearchParams(next, { replace: true });
    fetchListings(v);
  };

  // Apply price-tier filter client-side
  const tierFiltered = useMemo(() => {
    if (priceTier === "all") return listings;
    const t = PRICE_TIERS.find((p) => p.value === priceTier);
    if (!t) return listings;
    const [min, max] = t.range;
    return listings.filter((l) => {
      const r = Number(l.monthly_rent);
      if (r < min) return false;
      if (max !== null && r > max) return false;
      return true;
    });
  }, [listings, priceTier]);

  const tierCounts = useMemo(() => {
    const counts: Partial<Record<PriceTier, number>> = { all: listings.length };
    for (const t of PRICE_TIERS) {
      if (t.value === "all") continue;
      const [min, max] = t.range;
      counts[t.value] = listings.filter((l) => {
        const r = Number(l.monthly_rent);
        return r >= min && (max === null || r <= max);
      }).length;
    }
    return counts;
  }, [listings]);

  const sorted = useMemo(() => {
    const arr = [...tierFiltered];
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
  }, [tierFiltered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = useMemo(
    () => (viewMode === "map" ? sorted : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)),
    [sorted, page, viewMode]
  );

  const heroBlock = (
    <LeaseHero>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="inline-block rounded-2xl bg-black/55 backdrop-blur-sm px-5 py-4 md:px-6 md:py-5 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight text-white [text-shadow:_0_2px_18px_rgb(0_0_0_/_80%)]">Find your next home</h1>
          <p className="text-white mb-2 max-w-2xl text-lg [text-shadow:_0_1px_10px_rgb(0_0_0_/_85%)]">
            Yearly leases on apartments, houses, condos, lofts, townhouses, office space and warehouses. Direct from landlords — no broker fees for tenants.
          </p>
          <p className="text-mansagold text-sm font-medium [text-shadow:_0_1px_8px_rgb(0_0_0_/_90%)]">Now live in <strong>Chicago</strong> and <strong>Atlanta</strong> · Listings available nationwide</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Button asChild variant="outline" size="lg" className="border-white/40 bg-black/30 text-white hover:bg-white/10 min-h-[48px] backdrop-blur">
            <Link to="/stays/host/lease/dashboard">My Listings</Link>
          </Button>
          <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold shadow-lg min-h-[48px]">
            <Link to="/stays/host/lease/new">List Your Property — Free</Link>
          </Button>
        </div>
      </div>
    </LeaseHero>
  );

  const searchRow = (
    <>
      <PropertyTypeFilter value={propertyType} onChange={handleTypeChange} />
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <Input placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
        <Input placeholder="Min rent" type="number" value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
        <Input placeholder="Max rent" type="number" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
        <Input placeholder="Beds" type="number" value={filters.bedrooms} onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[48px]" />
        <Button onClick={() => fetchListings()} size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">Search</Button>
      </div>
    </>
  );

  const filterPanel = (
    <div className="flex flex-wrap gap-5 text-sm text-white">
      <label className="flex items-center gap-2"><Checkbox checked={filters.pets} onCheckedChange={(v) => setFilters({ ...filters, pets: !!v })} /> Pets OK</label>
      <label className="flex items-center gap-2"><Checkbox checked={filters.section8} onCheckedChange={(v) => setFilters({ ...filters, section8: !!v })} /> Section 8 accepted</label>
      <label className="flex items-center gap-2"><Checkbox checked={filters.furnished} onCheckedChange={(v) => setFilters({ ...filters, furnished: !!v })} /> Furnished</label>
      <Button onClick={() => fetchListings()} size="sm" className="bg-mansagold text-black hover:bg-mansagold/90 font-semibold ml-auto">Apply filters</Button>
    </div>
  );

  const resultsSummary = (
    <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-mansagold" />
        {loading ? <span>Searching…</span> : (
          <span>
            <span className="font-semibold text-white">{sorted.length.toLocaleString()}</span>{" "}
            home{sorted.length === 1 ? "" : "s"}
            {filters.city && <> in <span className="text-white">{filters.city}</span></>}
            {propertyType && <> · <span className="text-mansagold">{PROPERTY_TYPES.find(p => p.value === propertyType)?.label}</span></>}
          </span>
        )}
      </div>
      <LeasePriceRail active={priceTier} onChange={(t) => { setPriceTier(t); setPage(1); }} counts={tierCounts} />
    </div>
  );

  const sortControl = (
    <div className="flex items-center gap-2">
      <SaveSearchButton payload={{
        city: filters.city || null,
        min_rent: filters.minRent ? Number(filters.minRent) : null,
        max_rent: filters.maxRent ? Number(filters.maxRent) : null,
        bedrooms: filters.bedrooms ? Number(filters.bedrooms) : null,
        property_type: propertyType,
        pets_allowed: filters.pets || null,
        section_8_accepted: filters.section8 || null,
        furnished: filters.furnished || null,
      }} />
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
    </div>
  );

  const empty = !loading && sorted.length === 0;

  return (
    <>
      <Helmet>
        <title>Lease Apartments, Houses, Condos, Office Space & Warehouses | Mansa Stays</title>
        <meta name="description" content="Find yearly leases on apartments, houses, condos, lofts, townhouses, office space and warehouses on Mansa Stays. Black-owned properties nationwide. Now live in Chicago and Atlanta." />
      </Helmet>

      {/* Beta banner — Mansa Stays is onboarding hosts; sets honest expectations */}
      <div className="bg-gradient-to-r from-mansablue via-mansablue to-mansablue/90 border-b border-mansagold/40">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mansagold text-mansablue text-xs font-bold uppercase tracking-wide">
            <Sparkles className="h-3 w-3" /> Beta
          </span>
          <p className="text-sm text-white/95">
            Mansa Stays is launching soon — we're onboarding Black-owned hosts now.{" "}
            <Link to="/stays/become-host" className="font-semibold text-mansagold hover:underline">
              List your property →
            </Link>
          </p>
        </div>
      </div>

      {heroBlock}

      <BrowseLayout
        header={null}
        searchRow={searchRow}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        filterPanel={filterPanel}
        resultsSummary={resultsSummary}
        sortControl={sortControl}
        viewMode={viewMode}
        onViewModeChange={(v) => { setViewMode(v); setPage(1); }}
        pagination={
          viewMode !== "map" && totalPages > 1 ? (
            <DirectoryPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          ) : undefined
        }
        footer={<LeaseLegalFooter />}
      >
        {loading ? (
          <p className="text-white/70">Loading listings…</p>
        ) : empty ? (
          <SmartEmptyState
            city={filters.city || undefined}
            maxRent={filters.maxRent ? Number(filters.maxRent) : undefined}
            onSuggestion={(patch) => {
              setFilters((f) => ({
                ...f,
                ...(patch.city !== undefined ? { city: patch.city } : {}),
                ...(patch.maxRent !== undefined ? { maxRent: patch.maxRent } : {}),
              }));
              setTimeout(() => fetchListings(), 0);
            }}
          />
        ) : viewMode === "map" ? (
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="w-full bg-slate-800/40 animate-pulse rounded-lg" style={{ height: 'calc(100vh - 320px)' }} />}>
                <LeaseMapView listings={sorted} height="calc(100vh - 320px)" />
              </Suspense>
            </div>
            <div className="lg:col-span-2 max-h-[calc(100vh-320px)] overflow-y-auto space-y-3 pr-1">
              {sorted.map((l) => <LeaseListingCard key={l.id} l={l} />)}
            </div>
          </div>
        ) : viewMode === "list" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paged.map((l) => <LeaseListRow key={l.id} l={l} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paged.map((l) => <LeaseListingCard key={l.id} l={l} />)}
          </div>
        )}
      </BrowseLayout>
    </>
  );
};

export default LeaseSearchPage;
