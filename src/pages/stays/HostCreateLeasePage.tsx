import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";
import PropertyPhotoUploader from "@/components/stays/PropertyPhotoUploader";
import { PROPERTY_TYPES } from "@/lib/lease/property-types";

const HostCreateLeasePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [f, setF] = useState({
    title: "", description: "", property_type: "apartment",
    address: "", city: "", state: "", zip_code: "", country: "USA",
    bedrooms: 1, bathrooms: 1, max_guests: 2,
    monthly_rent: 0, security_deposit_amount: 0, lease_term_months: 12,
    pets_allowed: false, pet_deposit: 0,
    section_8_accepted: false, furnished: false,
    min_credit_score: "", min_income_multiplier: 3,
    available_from: "", utilities_included: "",
    fair_housing_ack: false, no_broker_ack: false,
  });

  const submit = async () => {
    if (!user) { toast.error("Sign in to list a property"); return; }
    if (!f.fair_housing_ack || !f.no_broker_ack) { toast.error("Please acknowledge both legal statements"); return; }
    if (!f.title || !f.city || !f.state || !f.monthly_rent) { toast.error("Fill in the required fields"); return; }
    if (photos.length === 0) {
      toast.error("Add at least one property photo so renters can see your place");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("vacation_properties").insert({
      host_id: user.id,
      title: f.title,
      description: f.description,
      property_type: f.property_type,
      address: f.address || f.city,
      city: f.city, state: f.state, zip_code: f.zip_code || null, country: f.country,
      bedrooms: Number(f.bedrooms), bathrooms: Number(f.bathrooms), max_guests: Number(f.max_guests),
      base_nightly_rate: 0,
      listing_mode: "yearly_lease",
      monthly_rent: Number(f.monthly_rent),
      security_deposit_amount: Number(f.security_deposit_amount) || null,
      lease_term_months: Number(f.lease_term_months),
      pets_allowed: f.pets_allowed,
      pet_deposit: Number(f.pet_deposit) || 0,
      section_8_accepted: f.section_8_accepted,
      furnished: f.furnished,
      min_credit_score: f.min_credit_score ? Number(f.min_credit_score) : null,
      min_income_multiplier: Number(f.min_income_multiplier) || 3,
      available_from: f.available_from || null,
      utilities_included: f.utilities_included ? f.utilities_included.split(",").map(s => s.trim()).filter(Boolean) : [],
      is_active: true,
      amenities: [],
      photos,
    } as any).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Lease listing created! It's now live.");
    navigate(`/stays/lease/${(data as any).id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>List your property for lease — Mansa Stays</title>
      </Helmet>
      <section className="max-w-3xl mx-auto p-4 md:p-10">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">List your property for lease</h1>
          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 shrink-0">
            <a href="/stays/host/lease/dashboard">My Listings</a>
          </Button>
        </div>
        <p className="text-white/90 mt-2">Free to list. $99 success fee only when both you and your tenant confirm the lease in-app.</p>

        <Card className="bg-white/10 border-white/20 p-6 mt-6 space-y-5">
          <div>
            <label className="text-sm text-white/90 font-medium mb-2 block">
              Property photos * <span className="text-white/60 font-normal">({photos.length} uploaded)</span>
            </label>
            <PropertyPhotoUploader photos={photos} onChange={setPhotos} userId={user?.id || ""} />
          </div>

          <div className="border-t border-white/15 pt-4 space-y-4">
            <Input placeholder="Listing title *" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            <div>
              <label className="text-sm text-white/90 font-medium mb-1 block">Property type *</label>
              <select
                value={f.property_type}
                onChange={(e) => setF({ ...f, property_type: e.target.value })}
                className="w-full bg-white/10 border border-white/30 text-white rounded-md px-3 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-mansagold"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-black text-white">
                    {t.label} — {t.shortDesc}
                  </option>
                ))}
              </select>
            </div>
            <Textarea placeholder="Description" rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Street address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input placeholder="City *" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input placeholder="State *" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input placeholder="ZIP" value={f.zip_code} onChange={(e) => setF({ ...f, zip_code: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input type="number" placeholder="Bedrooms" value={f.bedrooms} onChange={(e) => setF({ ...f, bedrooms: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input type="number" placeholder="Bathrooms" value={f.bathrooms} onChange={(e) => setF({ ...f, bathrooms: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input type="number" placeholder="Max occupants" value={f.max_guests} onChange={(e) => setF({ ...f, max_guests: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input type="number" placeholder="Monthly rent ($) *" value={f.monthly_rent || ""} onChange={(e) => setF({ ...f, monthly_rent: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input type="number" placeholder="Security deposit ($)" value={f.security_deposit_amount || ""} onChange={(e) => setF({ ...f, security_deposit_amount: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input type="number" placeholder="Lease term (months)" value={f.lease_term_months} onChange={(e) => setF({ ...f, lease_term_months: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            </div>
            <Input type="date" placeholder="Available from" value={f.available_from} onChange={(e) => setF({ ...f, available_from: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            <Input placeholder="Utilities included (comma-separated: water, gas, trash)" value={f.utilities_included} onChange={(e) => setF({ ...f, utilities_included: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input type="number" placeholder="Min credit score" value={f.min_credit_score} onChange={(e) => setF({ ...f, min_credit_score: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input type="number" step="0.1" placeholder="Min income multiplier (e.g. 3)" value={f.min_income_multiplier} onChange={(e) => setF({ ...f, min_income_multiplier: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <label className="flex items-center gap-2"><Checkbox checked={f.pets_allowed} onCheckedChange={(v) => setF({ ...f, pets_allowed: !!v })} /> Pets allowed</label>
              <label className="flex items-center gap-2"><Checkbox checked={f.section_8_accepted} onCheckedChange={(v) => setF({ ...f, section_8_accepted: !!v })} /> Section 8 accepted</label>
              <label className="flex items-center gap-2"><Checkbox checked={f.furnished} onCheckedChange={(v) => setF({ ...f, furnished: !!v })} /> Furnished</label>
            </div>
            {f.pets_allowed && (
              <Input type="number" placeholder="Pet deposit ($)" value={f.pet_deposit || ""} onChange={(e) => setF({ ...f, pet_deposit: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            )}
          </div>

          <div className="space-y-3 border-t border-white/20 pt-4">
            <label className="flex items-start gap-2 text-sm text-white/95">
              <Checkbox checked={f.fair_housing_ack} onCheckedChange={(v) => setF({ ...f, fair_housing_ack: !!v })} className="mt-1" />
              <span>I will comply with the federal Fair Housing Act and all applicable state/local laws. I will not discriminate based on race, color, religion, sex, national origin, familial status, disability, or other protected characteristics.</span>
            </label>
            <label className="flex items-start gap-2 text-sm text-white/95">
              <Checkbox checked={f.no_broker_ack} onCheckedChange={(v) => setF({ ...f, no_broker_ack: !!v })} className="mt-1" />
              <span>I understand Mansa Stays is a listing platform, not a real estate broker. I am responsible for lease signing, security deposits, background checks, and rent collection. A $99 success fee will be charged after both parties confirm the lease (full refund available within 7 days).</span>
            </label>
          </div>

          <Button onClick={submit} disabled={saving} className="w-full bg-mansagold text-black hover:bg-mansagold/90 font-bold">
            {saving ? "Publishing…" : "Publish lease listing — free"}
          </Button>
        </Card>

        <LeaseLegalFooter />
      </section>
    </div>
  );
};

export default HostCreateLeasePage;
