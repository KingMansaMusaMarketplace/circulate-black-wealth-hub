import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import { findByValue } from "@/lib/lease/property-types";

const LeaseListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{listing.title} — Lease | Mansa Stays</title>
        <meta name="description" content={`Lease ${listing.title} in ${listing.city}, ${listing.state}. ${listing.bedrooms} bed, ${listing.bathrooms} bath. $${listing.monthly_rent}/mo.`} />
      </Helmet>

      <section className="max-w-5xl mx-auto p-4 md:p-10">
        {listing.photos?.[0] && (
          <img src={listing.photos[0]} alt={listing.title} className="w-full aspect-video object-cover rounded-2xl mb-6" />
        )}
        <h1 className="text-3xl md:text-4xl font-bold">{listing.title}</h1>
        <p className="text-white/60 mt-1">
          {(() => { const t = findByValue(listing.property_type); return t ? <><span className="text-mansagold font-medium">{t.label}</span> · </> : null; })()}
          {listing.city}, {listing.state}
        </p>
        <p className="text-mansagold text-3xl font-bold mt-3">${Number(listing.monthly_rent).toLocaleString()}<span className="text-base text-white/50 font-normal">/month</span></p>

        <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
          <Card className="bg-white/5 border-white/10 p-4"><div className="text-white/50">Bedrooms</div><div className="text-xl font-semibold">{listing.bedrooms}</div></Card>
          <Card className="bg-white/5 border-white/10 p-4"><div className="text-white/50">Bathrooms</div><div className="text-xl font-semibold">{listing.bathrooms}</div></Card>
          <Card className="bg-white/5 border-white/10 p-4"><div className="text-white/50">Lease term</div><div className="text-xl font-semibold">{listing.lease_term_months || 12} months</div></Card>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">About this home</h2>
          <p className="text-white/70 whitespace-pre-line">{listing.description}</p>

          <h3 className="text-xl font-semibold mt-6">Lease details</h3>
          <ul className="text-white/70 space-y-1 text-sm">
            <li>Security deposit: ${Number(listing.security_deposit_amount || 0).toLocaleString()}</li>
            {listing.pets_allowed && <li>Pets allowed · Pet deposit: ${Number(listing.pet_deposit || 0).toLocaleString()}</li>}
            {listing.utilities_included?.length > 0 && <li>Utilities included: {listing.utilities_included.join(", ")}</li>}
            {listing.section_8_accepted && <li>Section 8 vouchers accepted</li>}
            {listing.furnished && <li>Furnished</li>}
            {listing.min_credit_score && <li>Minimum credit score: {listing.min_credit_score}</li>}
            {listing.min_income_multiplier && <li>Minimum income: {listing.min_income_multiplier}x monthly rent</li>}
            {listing.available_from && <li>Available from: {new Date(listing.available_from).toLocaleDateString()}</li>}
          </ul>
        </div>

        <Card className="bg-white/5 border-white/10 p-6 mt-10">
          <h3 className="text-xl font-semibold mb-4">Contact the landlord</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Your name" value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} className="bg-white/5 border-white/20" />
            <Input placeholder="Your email" type="email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} className="bg-white/5 border-white/20" />
            <Input placeholder="Phone (optional)" value={inquiry.phone} onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })} className="bg-white/5 border-white/20" />
            <Input type="date" value={inquiry.move_in} onChange={(e) => setInquiry({ ...inquiry, move_in: e.target.value })} className="bg-white/5 border-white/20" />
          </div>
          <Textarea placeholder="Tell the landlord about yourself, your move-in plans, household size, etc." value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} className="bg-white/5 border-white/20 mt-3" rows={4} />
          <Button onClick={submitInquiry} disabled={submitting} className="mt-4 bg-mansagold text-black hover:bg-mansagold/90 w-full sm:w-auto">
            {submitting ? "Sending…" : "Send inquiry"}
          </Button>
          <p className="text-xs text-white/50 mt-3">
            Mansa Stays is a listing platform. The landlord will contact you directly. We do not handle leases, deposits, or background checks.
          </p>
        </Card>

        <LeaseLegalFooter />
      </section>
    </div>
  );
};

export default LeaseListingDetailPage;
