import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft } from "lucide-react";

const HostEditLeasePage: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [f, setF] = useState<any>(null);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("vacation_properties")
        .select("*")
        .eq("id", id)
        .eq("host_id", user.id)
        .maybeSingle();
      if (error || !data) {
        toast.error("Listing not found or you don't have access");
        navigate("/stays/host/lease/dashboard");
        return;
      }
      setF({
        title: data.title || "",
        description: data.description || "",
        property_type: data.property_type || "apartment",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zip_code: data.zip_code || "",
        bedrooms: data.bedrooms || 1,
        bathrooms: data.bathrooms || 1,
        max_guests: data.max_guests || 2,
        monthly_rent: data.monthly_rent || 0,
        security_deposit_amount: data.security_deposit_amount || 0,
        lease_term_months: data.lease_term_months || 12,
        pets_allowed: !!data.pets_allowed,
        pet_deposit: data.pet_deposit || 0,
        section_8_accepted: !!data.section_8_accepted,
        furnished: !!data.furnished,
        min_credit_score: data.min_credit_score || "",
        min_income_multiplier: data.min_income_multiplier || 3,
        available_from: data.available_from || "",
        utilities_included: (data.utilities_included || []).join(", "),
        is_active: data.is_active !== false,
      });
      setPhotos(Array.isArray(data.photos) ? (data.photos as string[]) : []);
      setLoading(false);
    })();
  }, [id, user, navigate]);

  const save = async () => {
    if (!user || !id || !f) return;
    if (!f.title || !f.city || !f.state || !f.monthly_rent) {
      toast.error("Fill in title, city, state, and monthly rent");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("vacation_properties")
      .update({
        title: f.title,
        description: f.description,
        property_type: f.property_type,
        address: f.address || f.city,
        city: f.city,
        state: f.state,
        zip_code: f.zip_code || null,
        bedrooms: Number(f.bedrooms),
        bathrooms: Number(f.bathrooms),
        max_guests: Number(f.max_guests),
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
        utilities_included: f.utilities_included
          ? f.utilities_included.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        photos,
        is_active: f.is_active,
      } as any)
      .eq("id", id)
      .eq("host_id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing updated");
    navigate("/stays/host/lease/dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <p>Please sign in.</p>
      </div>
    );
  }
  if (loading || !f) {
    return <div className="min-h-screen bg-black text-white p-10">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Edit listing — Mansa Stays</title>
      </Helmet>
      <section className="max-w-3xl mx-auto p-4 md:p-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/stays/host/lease/dashboard")}
          className="text-white/80 hover:text-white hover:bg-white/10 mb-3 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">Edit listing</h1>
        <p className="text-white/80 mt-2">Update details and upload property photos.</p>

        <Card className="bg-white/10 border-white/20 p-6 mt-6 space-y-5">
          <div>
            <label className="text-sm text-white/90 font-medium mb-2 block">
              Property photos ({photos.length})
            </label>
            <PropertyPhotoUploader photos={photos} onChange={setPhotos} userId={user.id} />
          </div>

          <div className="border-t border-white/15 pt-4 space-y-4">
            <Input
              placeholder="Listing title *"
              value={f.title}
              onChange={(e) => setF({ ...f, title: e.target.value })}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
            />
            <div>
              <label className="text-sm text-white/90 font-medium mb-1 block">Property type *</label>
              <select
                value={f.property_type}
                onChange={(e) => setF({ ...f, property_type: e.target.value })}
                className="w-full bg-white/10 border border-white/30 text-white rounded-md px-3 py-2 min-h-[44px]"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-black text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              placeholder="Description"
              rows={4}
              value={f.description}
              onChange={(e) => setF({ ...f, description: e.target.value })}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Street address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input placeholder="City *" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input placeholder="State *" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input placeholder="ZIP" value={f.zip_code} onChange={(e) => setF({ ...f, zip_code: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input type="number" placeholder="Bedrooms" value={f.bedrooms} onChange={(e) => setF({ ...f, bedrooms: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
              <Input type="number" placeholder="Bathrooms" value={f.bathrooms} onChange={(e) => setF({ ...f, bathrooms: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
              <Input type="number" placeholder="Max occupants" value={f.max_guests} onChange={(e) => setF({ ...f, max_guests: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input type="number" placeholder="Monthly rent ($) *" value={f.monthly_rent || ""} onChange={(e) => setF({ ...f, monthly_rent: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
              <Input type="number" placeholder="Security deposit ($)" value={f.security_deposit_amount || ""} onChange={(e) => setF({ ...f, security_deposit_amount: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
              <Input type="number" placeholder="Lease term (months)" value={f.lease_term_months} onChange={(e) => setF({ ...f, lease_term_months: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
            </div>
            <Input type="date" value={f.available_from} onChange={(e) => setF({ ...f, available_from: e.target.value })} className="bg-white/10 border-white/30 text-white" />
            <Input placeholder="Utilities included (comma-separated)" value={f.utilities_included} onChange={(e) => setF({ ...f, utilities_included: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input type="number" placeholder="Min credit score" value={f.min_credit_score} onChange={(e) => setF({ ...f, min_credit_score: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/70" />
              <Input type="number" step="0.1" placeholder="Min income multiplier" value={f.min_income_multiplier} onChange={(e) => setF({ ...f, min_income_multiplier: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <label className="flex items-center gap-2"><Checkbox checked={f.pets_allowed} onCheckedChange={(v) => setF({ ...f, pets_allowed: !!v })} /> Pets allowed</label>
              <label className="flex items-center gap-2"><Checkbox checked={f.section_8_accepted} onCheckedChange={(v) => setF({ ...f, section_8_accepted: !!v })} /> Section 8 accepted</label>
              <label className="flex items-center gap-2"><Checkbox checked={f.furnished} onCheckedChange={(v) => setF({ ...f, furnished: !!v })} /> Furnished</label>
              <label className="flex items-center gap-2"><Checkbox checked={f.is_active} onCheckedChange={(v) => setF({ ...f, is_active: !!v })} /> Listing active</label>
            </div>
            {f.pets_allowed && (
              <Input type="number" placeholder="Pet deposit ($)" value={f.pet_deposit || ""} onChange={(e) => setF({ ...f, pet_deposit: +e.target.value })} className="bg-white/10 border-white/30 text-white" />
            )}
          </div>

          <Button onClick={save} disabled={saving} className="w-full bg-mansagold text-black hover:bg-mansagold/90 font-bold">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Card>

        <LeaseLegalFooter />
      </section>
    </div>
  );
};

export default HostEditLeasePage;
