import React, { useEffect, useState, lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Bed, Bath, MapPin, Calendar, DollarSign, ShieldCheck, BadgeCheck, PawPrint, Sofa, Home, ArrowLeft } from "lucide-react";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import LightboxGallery from "@/components/stays/lease/LightboxGallery";
import LeaseListingCard from "@/components/stays/lease/LeaseListingCard";
const LeaseMapView = lazy(() => import("@/components/stays/lease/LeaseMapView"));
import { findByValue } from "@/lib/lease/property-types";
import ReportContentButton from "@/components/stays/ReportContentButton";

const LeaseListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [inquiry, setInquiry] = useState({ name: "", email: "", phone: "", move_in: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("vacation_properties")
        .select("*")
        .eq("id", id)
        .eq("listing_mode", "yearly_lease")
        .maybeSingle();
      setListing(data);
      if (data) {
        const { data: more } = await supabase
          .from("vacation_properties")
          .select("id, title, city, state, bedrooms, bathrooms, monthly_rent, photos, property_type, pets_allowed, section_8_accepted, furnished, available_from, is_verified, created_at, updated_at")
          .eq("listing_mode", "yearly_lease")
          .eq("city", data.city)
          .eq("is_active", true)
          .neq("id", data.id)
          .limit(4);
        setSimilar(more || []);
      }
    })();
  }, [id]);

  const submitInquiry = async () => {
    if (!user) { toast.error("Please sign in to send an inquiry"); return; }
    if (!inquiry.name || !inquiry.email) { toast.error("Name and email are required"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("lease_inquiries").insert({
      property_id: id,
      tenant_id: user.id,
      tenant_name: inquiry.name,
      tenant_email: inquiry.email,
      tenant_phone: inquiry.phone || null,
      desired_move_in: inquiry.move_in || null,
      message: inquiry.message || null,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else { toast.success("Inquiry sent! The landlord will reach out."); setInquiry({ name: "", email: "", phone: "", move_in: "", message: "" }); }
  };

  if (!listing) return <div className="min-h-screen bg-black text-white p-10">Loading…</div>;

  const type = findByValue(listing.property_type);
  const amenities = Array.isArray(listing.amenities) ? listing.amenities : [];

  return (
    <div className="min-h-screen bg-black text-white pb-24 md:pb-0">
      <Helmet>
        <title>{listing.title} — Lease | Mansa Stays</title>
        <meta name="description" content={`Lease ${listing.title} in ${listing.city}, ${listing.state}. ${listing.bedrooms} bed, ${listing.bathrooms} bath. $${listing.monthly_rent}/mo.`} />
      </Helmet>

      <section className="max-w-6xl mx-auto p-4 md:p-8">
        <Link to="/stays/lease" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to search
        </Link>

        <LightboxGallery photos={listing.photos || []} alt={listing.title} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main column */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{listing.title}</h1>
                <p className="text-white/70 mt-1 flex items-center gap-2 flex-wrap">
                  {type && <span className="text-mansagold font-medium">{type.label}</span>}
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.city}, {listing.state}</span>
                </p>
              </div>
              {listing.is_verified && (
                <span className="flex items-center gap-1 text-sm text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <BadgeCheck className="w-4 h-4" /> Verified listing
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 text-sm">
              <Card className="bg-white/5 border-white/10 p-4">
                <Bed className="w-5 h-5 text-mansagold mb-1" />
                <div className="text-white/50 text-xs">Bedrooms</div>
                <div className="text-xl font-semibold">{listing.bedrooms}</div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-4">
                <Bath className="w-5 h-5 text-mansagold mb-1" />
                <div className="text-white/50 text-xs">Bathrooms</div>
                <div className="text-xl font-semibold">{listing.bathrooms}</div>
              </Card>
              <Card className="bg-white/5 border-white/10 p-4">
                <Calendar className="w-5 h-5 text-mansagold mb-1" />
                <div className="text-white/50 text-xs">Lease term</div>
                <div className="text-xl font-semibold">{listing.lease_term_months || 12} mo</div>
              </Card>
            </div>

            {listing.description && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">About this home</h2>
                <p className="text-white/75 whitespace-pre-line leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Features grid */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-3">What's included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {listing.furnished && (
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                    <Sofa className="w-4 h-4 text-mansagold" /> Furnished
                  </div>
                )}
                {listing.pets_allowed && (
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                    <PawPrint className="w-4 h-4 text-mansagold" /> Pets allowed
                  </div>
                )}
                {listing.section_8_accepted && (
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3">
                    <ShieldCheck className="w-4 h-4 text-mansagold" /> Section 8 accepted
                  </div>
                )}
                {(listing.utilities_included || []).map((u: string) => (
                  <div key={u} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 capitalize">
                    <Home className="w-4 h-4 text-mansagold" /> {u} included
                  </div>
                ))}
                {amenities.map((a: string) => (
                  <div key={a} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 capitalize">
                    <Home className="w-4 h-4 text-mansagold" /> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Lease details */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-3">Lease details</h2>
              <ul className="text-white/75 space-y-2 text-sm bg-white/5 border border-white/10 rounded-lg p-5">
                <li className="flex justify-between"><span>Security deposit</span><span className="text-white">${Number(listing.security_deposit_amount || 0).toLocaleString()}</span></li>
                {listing.pets_allowed && (
                  <li className="flex justify-between"><span>Pet deposit</span><span className="text-white">${Number(listing.pet_deposit || 0).toLocaleString()}</span></li>
                )}
                {listing.min_credit_score && (
                  <li className="flex justify-between"><span>Minimum credit score</span><span className="text-white">{listing.min_credit_score}</span></li>
                )}
                {listing.min_income_multiplier && (
                  <li className="flex justify-between"><span>Minimum income</span><span className="text-white">{listing.min_income_multiplier}× monthly rent</span></li>
                )}
                {listing.available_from && (
                  <li className="flex justify-between"><span>Available from</span><span className="text-white">{new Date(listing.available_from).toLocaleDateString()}</span></li>
                )}
              </ul>
            </div>

            {/* Location map */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-3">Location</h2>
              <Suspense fallback={<div className="w-full bg-slate-800/40 animate-pulse rounded-lg" style={{ height: '360px' }} />}>
                <LeaseMapView
                  listings={[{
                    id: listing.id,
                    title: listing.title,
                    city: listing.city,
                    state: listing.state,
                    monthly_rent: listing.monthly_rent,
                    bedrooms: listing.bedrooms,
                    bathrooms: listing.bathrooms,
                    photos: listing.photos,
                    latitude: listing.latitude,
                    longitude: listing.longitude,
                  }]}
                  height="360px"
                />
              </Suspense>
              <p className="text-xs text-white/40 mt-2">Approximate location shown. Exact address shared after the landlord accepts your inquiry.</p>
            </div>

            <div className="mt-6 flex justify-end">
              <ReportContentButton contentType="lease_property" contentId={listing.id} variant="link" />
            </div>
          </div>

          {/* Sidebar - sticky contact card */}
          <aside className="lg:col-span-1">
            <Card className="bg-white/5 border-white/15 p-6 lg:sticky lg:top-6">
              <p className="text-mansagold text-3xl font-bold flex items-baseline">
                <DollarSign className="w-6 h-6" />
                {Number(listing.monthly_rent).toLocaleString()}
                <span className="text-base text-white/50 font-normal ml-1">/month</span>
              </p>
              <p className="text-white/60 text-sm mt-1">No broker fees for tenants</p>

              <div className="mt-5 space-y-3">
                <h3 className="text-lg font-semibold">Contact the landlord</h3>
                <Input placeholder="Your name *" value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} className="bg-white/10 border-white/20" />
                <Input placeholder="Your email *" type="email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} className="bg-white/10 border-white/20" />
                <Input placeholder="Phone (optional)" value={inquiry.phone} onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })} className="bg-white/10 border-white/20" />
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Desired move-in</label>
                  <Input type="date" value={inquiry.move_in} onChange={(e) => setInquiry({ ...inquiry, move_in: e.target.value })} className="bg-white/10 border-white/20" />
                </div>
                <Textarea placeholder="Tell the landlord about yourself, household size, etc." value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} className="bg-white/10 border-white/20" rows={4} />
                <Button onClick={submitInquiry} disabled={submitting} className="w-full bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">
                  {submitting ? "Sending…" : "Send inquiry"}
                </Button>
                <p className="text-[11px] text-white/50">
                  Mansa Stays is a listing platform. The landlord contacts you directly. We do not handle leases, deposits, or background checks.
                </p>
              </div>
            </Card>
          </aside>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">More homes in {listing.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((l) => <LeaseListingCard key={l.id} l={l} />)}
            </div>
          </div>
        )}

        <LeaseLegalFooter />
      </section>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-black/95 backdrop-blur border-t border-white/10 p-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-mansagold font-bold text-lg leading-tight">${Number(listing.monthly_rent).toLocaleString()}<span className="text-xs text-white/50">/mo</span></p>
          <p className="text-white/60 text-xs">{listing.bedrooms}bd · {listing.bathrooms}ba</p>
        </div>
        <Button
          onClick={() => (document.querySelector('aside input') as HTMLElement | null)?.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="bg-mansagold text-black hover:bg-mansagold/90 font-bold flex-1 max-w-[200px]"
        >
          Contact landlord
        </Button>
      </div>
    </div>
  );
};

export default LeaseListingDetailPage;
