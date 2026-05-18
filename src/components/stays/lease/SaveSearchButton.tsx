import React, { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SavedSearchPayload {
  city?: string | null;
  min_rent?: number | null;
  max_rent?: number | null;
  bedrooms?: number | null;
  property_type?: string | null;
  pets_allowed?: boolean | null;
  section_8_accepted?: boolean | null;
  furnished?: boolean | null;
}

interface Props {
  payload: SavedSearchPayload;
}

const buildLabel = (p: SavedSearchPayload) => {
  const parts: string[] = [];
  if (p.bedrooms) parts.push(`${p.bedrooms}+ bd`);
  if (p.property_type) parts.push(p.property_type);
  if (p.city) parts.push(`in ${p.city}`);
  if (p.min_rent || p.max_rent) {
    const lo = p.min_rent ? `$${p.min_rent}` : "$0";
    const hi = p.max_rent ? `$${p.max_rent}` : "any";
    parts.push(`${lo}–${hi}`);
  }
  return parts.length ? parts.join(" · ") : "All lease listings";
};

const SaveSearchButton: React.FC<Props> = ({ payload }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error("Sign in to save searches and get new-match emails");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("lease_saved_searches").insert({
      user_id: user.id,
      label: buildLabel(payload),
      city: payload.city || null,
      min_rent: payload.min_rent ?? null,
      max_rent: payload.max_rent ?? null,
      bedrooms: payload.bedrooms ?? null,
      property_type: payload.property_type || null,
      pets_allowed: payload.pets_allowed ?? null,
      section_8_accepted: payload.section_8_accepted ?? null,
      furnished: payload.furnished ?? null,
      notify_email: true,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSaved(true);
    toast.success("Search saved — we'll email you when new matches go live");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={saving || saved}
      className="border-mansagold/40 text-mansagold hover:bg-mansagold/10 hover:text-mansagold"
    >
      {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :
        saved ? <BookmarkCheck className="w-4 h-4 mr-1" /> :
        <Bookmark className="w-4 h-4 mr-1" />}
      {saved ? "Saved" : "Save search"}
    </Button>
  );
};

export default SaveSearchButton;
