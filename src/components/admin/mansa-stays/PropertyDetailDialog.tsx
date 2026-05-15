import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Trash2, ExternalLink } from 'lucide-react';

interface Props {
  propertyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

interface FullProperty {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  max_guests: number | null;
  base_nightly_rate: number | null;
  cleaning_fee: number | null;
  pet_fee: number | null;
  pets_allowed: boolean;
  is_active: boolean;
  is_verified: boolean;
  is_instant_book: boolean;
  photos: any;
  amenities: any;
  house_rules: string | null;
  min_nights: number | null;
  max_nights: number | null;
  created_at: string;
}

const PropertyDetailDialog: React.FC<Props> = ({ propertyId, open, onOpenChange, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<FullProperty | null>(null);
  const [hostName, setHostName] = useState<string>('');
  const [hostEmail, setHostEmail] = useState<string>('');

  useEffect(() => {
    if (!open || !propertyId) return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('vacation_properties')
        .select('*')
        .eq('id', propertyId)
        .maybeSingle();
      if (error || !data) {
        toast.error('Failed to load property');
        setLoading(false);
        return;
      }
      setProperty(data as FullProperty);

      // Fetch host info
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', data.host_id)
        .maybeSingle();
      setHostName(profile?.full_name || 'Unknown');
      setHostEmail(profile?.email || '');
      setLoading(false);
    })();
  }, [propertyId, open]);

  const update = (patch: Partial<FullProperty>) =>
    setProperty(p => (p ? { ...p, ...patch } : p));

  const handleSave = async () => {
    if (!property) return;
    setSaving(true);
    const { error } = await supabase
      .from('vacation_properties')
      .update({
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        max_guests: property.max_guests,
        base_nightly_rate: property.base_nightly_rate,
        cleaning_fee: property.cleaning_fee,
        pet_fee: property.pet_fee,
        pets_allowed: property.pets_allowed,
        is_active: property.is_active,
        is_verified: property.is_verified,
        is_instant_book: property.is_instant_book,
        house_rules: property.house_rules,
        min_nights: property.min_nights,
        max_nights: property.max_nights,
      })
      .eq('id', property.id);
    setSaving(false);
    if (error) {
      toast.error('Save failed: ' + error.message);
      return;
    }
    toast.success('Property updated');
    onSaved();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!property) return;
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    const { error } = await supabase
      .from('vacation_properties')
      .delete()
      .eq('id', property.id);
    if (error) {
      toast.error('Delete failed: ' + error.message);
      return;
    }
    toast.success('Property deleted');
    onSaved();
    onOpenChange(false);
  };

  const photos: string[] = Array.isArray(property?.photos) ? property!.photos : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Property Details</DialogTitle>
          <DialogDescription className="text-white/60">
            View and edit a Mansa Stays listing.
          </DialogDescription>
        </DialogHeader>

        {loading || !property ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-mansagold" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Host info + status badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div>
                <div className="text-xs text-white/50">Host</div>
                <div className="text-white font-medium">{hostName}</div>
                <div className="text-white/60 text-xs">{hostEmail}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={property.is_active ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-white/10 text-white/60'}>
                  {property.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {property.is_verified && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Verified</Badge>
                )}
                {property.is_instant_book && (
                  <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Instant Book</Badge>
                )}
              </div>
            </div>

            {/* Photos preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 6).map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" className="relative block aspect-video rounded overflow-hidden bg-white/5">
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    <ExternalLink className="absolute top-1 right-1 h-3 w-3 text-white/70 bg-black/50 rounded p-0.5" />
                  </a>
                ))}
              </div>
            )}

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Active (visible to guests)</Label>
                <Switch checked={property.is_active} onCheckedChange={v => update({ is_active: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Verified by admin</Label>
                <Switch checked={property.is_verified} onCheckedChange={v => update({ is_verified: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Instant Book</Label>
                <Switch checked={property.is_instant_book} onCheckedChange={v => update({ is_instant_book: v })} />
              </div>
            </div>

            {/* Basic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <Label className="text-white/70">Title</Label>
                <Input value={property.title} onChange={e => update({ title: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-white/70">Description</Label>
                <Textarea value={property.description ?? ''} onChange={e => update({ description: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={3} />
              </div>
              <div>
                <Label className="text-white/70">Address</Label>
                <Input value={property.address ?? ''} onChange={e => update({ address: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">City</Label>
                <Input value={property.city ?? ''} onChange={e => update({ city: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">State</Label>
                <Input value={property.state ?? ''} onChange={e => update({ state: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Zip</Label>
                <Input value={property.zip_code ?? ''} onChange={e => update({ zip_code: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>

            {/* Capacity & pricing */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-white/70">Bedrooms</Label>
                <Input type="number" value={property.bedrooms ?? 0} onChange={e => update({ bedrooms: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Bathrooms</Label>
                <Input type="number" step="0.5" value={property.bathrooms ?? 0} onChange={e => update({ bathrooms: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Max Guests</Label>
                <Input type="number" value={property.max_guests ?? 0} onChange={e => update({ max_guests: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Nightly Rate ($)</Label>
                <Input type="number" step="0.01" value={property.base_nightly_rate ?? 0} onChange={e => update({ base_nightly_rate: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Cleaning Fee ($)</Label>
                <Input type="number" step="0.01" value={property.cleaning_fee ?? 0} onChange={e => update({ cleaning_fee: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Pet Fee ($)</Label>
                <Input type="number" step="0.01" value={property.pet_fee ?? 0} onChange={e => update({ pet_fee: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Min Nights</Label>
                <Input type="number" value={property.min_nights ?? 1} onChange={e => update({ min_nights: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70">Max Nights</Label>
                <Input type="number" value={property.max_nights ?? 30} onChange={e => update({ max_nights: Number(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
              <Switch checked={property.pets_allowed} onCheckedChange={v => update({ pets_allowed: v })} />
              <Label className="text-white/80">Pets allowed</Label>
            </div>

            <div>
              <Label className="text-white/70">House Rules</Label>
              <Textarea value={property.house_rules ?? ''} onChange={e => update({ house_rules: e.target.value })} className="bg-white/5 border-white/10 text-white" rows={3} />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <Button variant="destructive" onClick={handleDelete} disabled={!property || saving}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={!property || saving} className="bg-mansagold text-black hover:bg-mansagold/90">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailDialog;
