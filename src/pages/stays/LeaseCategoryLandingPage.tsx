import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Bath, MapPin, DollarSign, ChevronRight } from "lucide-react";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import { findBySlug, PROPERTY_TYPES } from "@/lib/lease/property-types";
import { findCityBySlug, LEASE_CITIES } from "@/lib/lease/city-data";

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
}

const LeaseCategoryLandingPage: React.FC = () => {
  const { category, city } = useParams<{ category?: string; city?: string }>();

  // Allow URL shapes:
  //   /stays/lease/:category         (e.g. /stays/lease/houses) — nationwide by type
  //   /stays/lease/:city/:category   (e.g. /stays/lease/chicago/houses) — city by type
  //   /stays/lease/:city             (when category param IS a known city, treat as city-only)
  const cityFromUrl =
    findCityBySlug(city) || (!city && findCityBySlug(category)) || null;
  const typeFromUrl =
    findBySlug(category) || (cityFromUrl && city ? findBySlug(category) : null);

  const [listings, setListings] = useState<LeaseListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.rpc("search_lease_listings", {
        p_city: cityFromUrl?.searchCity || null,
        p_property_type: typeFromUrl?.value || null,
        p_limit: 24,
        p_offset: 0,
      } as any);
      setListings((data as any) || []);
      setLoading(false);
    })();
  }, [cityFromUrl?.slug, typeFromUrl?.value]);

  // If neither matches a known city or type, treat as not found (lets /stays/lease/:id catch UUIDs)
  if (!cityFromUrl && !typeFromUrl) {
    return <Navigate to="/stays/lease" replace />;
  }

  // Compose headings
  const cityName = cityFromUrl?.name;
  const typeLabelPlural = typeFromUrl?.labelPlural;
  const h1 = typeLabelPlural && cityName
    ? `${typeLabelPlural} for Rent in ${cityName}`
    : typeLabelPlural
    ? `${typeLabelPlural} for Rent — Nationwide`
    : `Apartments, Houses & Condos for Rent in ${cityName}`;

  const seoTitle = `${h1} | Mansa Stays Yearly Leases`;
  const seoDesc =
    typeFromUrl?.seoIntro(cityName) ||
    `Browse yearly lease listings${cityName ? ` in ${cityName}` : ""} on Mansa Stays. Direct from Black-owned landlords — no broker fees for tenants.`;
  const canonical = `https://1325.ai/stays/lease${cityFromUrl ? `/${cityFromUrl.slug}` : ""}${typeFromUrl ? `/${typeFromUrl.slug}` : ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: h1,
    description: seoDesc,
    url: canonical,
    ...(cityFromUrl
      ? { about: { "@type": "Place", name: `${cityFromUrl.name}, ${cityFromUrl.state}` } }
      : {}),
  };

  // Internal link suggestions
  const siblingTypes = typeFromUrl ? PROPERTY_TYPES.filter((t) => t.value !== typeFromUrl.value) : PROPERTY_TYPES;
  const otherCities = cityFromUrl ? LEASE_CITIES.filter((c) => c.slug !== cityFromUrl.slug) : LEASE_CITIES;

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={h1} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="border-b border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className="text-sm text-white/60 mb-4">
            <Link to="/stays" className="hover:text-white">Mansa Stays</Link>
            <ChevronRight className="inline w-3 h-3 mx-1" />
            <Link to="/stays/lease" className="hover:text-white">Yearly Leases</Link>
            {cityFromUrl && <>
              <ChevronRight className="inline w-3 h-3 mx-1" />
              <Link to={`/stays/lease/${cityFromUrl.slug}`} className="hover:text-white">{cityFromUrl.name}</Link>
            </>}
            {typeFromUrl && <>
              <ChevronRight className="inline w-3 h-3 mx-1" />
              <span className="text-white">{typeFromUrl.labelPlural}</span>
            </>}
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{h1}</h1>
              <p className="text-white/85 text-lg">{seoDesc}</p>
              {cityFromUrl && (
                <p className="text-white/70 mt-3 text-sm">
                  <strong className="text-mansagold">Popular neighborhoods:</strong> {cityFromUrl.neighborhoods.join(" · ")}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">
                <Link to="/stays/host/lease/new">List Your Property — Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 min-h-[48px]">
                <Link to="/stays/lease">All Listings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Available now</h2>
          {loading ? (
            <p className="text-white/70">Loading listings…</p>
          ) : listings.length === 0 ? (
            <Card className="p-8 bg-white/10 border-white/20 text-center">
              <p className="text-white/90 mb-1 text-lg font-semibold">No {typeLabelPlural?.toLowerCase() || "listings"} live yet{cityFromUrl ? ` in ${cityFromUrl.name}` : ""}.</p>
              <p className="text-white/70 mb-4">Be the first landlord to list — free, $99 only when your tenant confirms.</p>
              <Button asChild className="bg-mansagold text-black hover:bg-mansagold/90 font-bold">
                <Link to="/stays/host/lease/new">List Your Property</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <Link to={`/stays/lease/${l.id}`} key={l.id}>
                  <Card className="bg-white/5 border-white/10 overflow-hidden hover:border-mansagold/50 transition h-full">
                    <div className="aspect-video bg-white/10">
                      {l.photos?.[0] && <img src={l.photos[0]} alt={l.title} className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-1">{l.title}</h3>
                      <p className="text-white/60 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{l.city}, {l.state}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                        <span className="capitalize">{l.property_type}</span>
                        <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{l.bedrooms}bd</span>
                        <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{l.bathrooms}ba</span>
                      </div>
                      <p className="mt-3 text-mansagold font-bold text-xl flex items-center"><DollarSign className="w-4 h-4" />{Number(l.monthly_rent).toLocaleString()}<span className="text-sm text-white/50 font-normal">/mo</span></p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {cityFromUrl && (
        <section className="py-10 px-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
            <div className="space-y-4">
              {cityFromUrl.faqs.map((f, i) => (
                <Card key={i} className="bg-white/5 border-white/10 p-5">
                  <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                  <p className="text-white/80 text-sm">{f.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal links — sibling categories & cities */}
      <section className="py-10 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Explore more</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-2">Other property types {cityFromUrl ? `in ${cityFromUrl.name}` : "nationwide"}</p>
              <div className="flex flex-wrap gap-2">
                {siblingTypes.map((t) => (
                  <Button asChild key={t.value} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    <Link to={`/stays/lease${cityFromUrl ? `/${cityFromUrl.slug}` : ""}/${t.slug}`}>
                      {t.labelPlural} {cityFromUrl ? `in ${cityFromUrl.name}` : "nationwide"}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-2">{typeFromUrl ? `${typeFromUrl.labelPlural} in other cities` : "Other launch cities"}</p>
              <div className="flex flex-wrap gap-2">
                {otherCities.map((c) => (
                  <Button asChild key={c.slug} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    <Link to={`/stays/lease/${c.slug}${typeFromUrl ? `/${typeFromUrl.slug}` : ""}`}>
                      {typeFromUrl ? `${typeFromUrl.labelPlural} in ${c.name}` : `Leases in ${c.name}`}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <LeaseLegalFooter />
        </div>
      </section>
    </div>
  );
};

export default LeaseCategoryLandingPage;
