import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Props {
  defaultTier?: string;
  trigger: React.ReactNode;
}

export const RequestAPIAccessDialog: React.FC<Props> = ({ defaultTier = 'starter', trigger }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    org_name: '',
    contact_name: '',
    contact_email: '',
    tier: defaultTier,
    use_case: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.org_name || !form.contact_name || !form.contact_email) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('api_access_requests').insert({
        org_name: form.org_name,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        tier: form.tier,
        use_case: form.use_case || null,
      });
      if (error) throw error;
      toast.success('Request received — our team will reach out within 2 business days.');
      setOpen(false);
      setForm({ org_name: '', contact_name: '', contact_email: '', tier: defaultTier, use_case: '' });
    } catch (err: any) {
      toast.error(err.message || 'Could not submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request API Access</DialogTitle>
          <DialogDescription>
            Tell us about your organization. Our partnerships team responds within 2 business days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="org">Organization *</Label>
            <Input id="org" value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Your name *</Label>
              <Input id="name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Work email *</Label>
              <Input id="email" type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label htmlFor="tier">Tier of interest</Label>
            <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
              <SelectTrigger id="tier"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter — $99/mo</SelectItem>
                <SelectItem value="pro">Pro — $499/mo</SelectItem>
                <SelectItem value="enterprise">Enterprise — $999+/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="use">Use case (optional)</Label>
            <Textarea id="use" rows={3} placeholder="e.g. CRA reporting, foundation grant analysis, academic research…" value={form.use_case} onChange={(e) => setForm({ ...form, use_case: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</> : 'Submit request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
