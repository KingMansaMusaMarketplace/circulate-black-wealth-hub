import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  host: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}

interface MethodRow {
  id?: string;
  host_id: string;
  method_type: string;
  account_holder_name: string | null;
  bank_name: string | null;
  account_last4: string | null;
  routing_last4: string | null;
  stripe_account_id: string | null;
  paypal_email: string | null;
  notes: string | null;
  is_verified: boolean;
}

const empty = (host_id: string): MethodRow => ({
  host_id,
  method_type: 'bank_transfer',
  account_holder_name: '',
  bank_name: '',
  account_last4: '',
  routing_last4: '',
  stripe_account_id: '',
  paypal_email: '',
  notes: '',
  is_verified: false,
});

const HostPayoutMethodDialog: React.FC<Props> = ({ host, open, onOpenChange, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [row, setRow] = useState<MethodRow | null>(null);

  useEffect(() => {
    if (!open || !host) return;
    setLoading(true);
    supabase
      .from('host_payout_methods')
      .select('*')
      .eq('host_id', host.id)
      .maybeSingle()
      .then(({ data }) => {
        setRow(data ? (data as MethodRow) : empty(host.id));
        setLoading(false);
      });
  }, [open, host]);

  if (!host) return null;

  const update = (patch: Partial<MethodRow>) => setRow(prev => prev ? { ...prev, ...patch } : prev);

  const save = async () => {
    if (!row) return;
    setSaving(true);
    const payload = { ...row };
    const { error } = await supabase
      .from('host_payout_methods')
      .upsert(payload, { onConflict: 'host_id' });
    setSaving(false);
    if (error) {
      toast.error('Save failed: ' + error.message);
      return;
    }
    toast.success('Payout method saved');
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Payout Method — {host.name}</DialogTitle>
          <DialogDescription className="text-white/60">
            Where Mansa Stays sends this host's earnings.
          </DialogDescription>
        </DialogHeader>

        {loading || !row ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-mansagold" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-white/70">Method Type</Label>
              <select
                value={row.method_type}
                onChange={e => update({ method_type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 mt-1 text-white"
              >
                <option value="bank_transfer">Bank Transfer (ACH)</option>
                <option value="stripe">Stripe Connect</option>
                <option value="paypal">PayPal</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70">Account Holder</Label>
                <Input value={row.account_holder_name || ''} onChange={e => update({ account_holder_name: e.target.value })} />
              </div>
              <div>
                <Label className="text-white/70">Bank Name</Label>
                <Input value={row.bank_name || ''} onChange={e => update({ bank_name: e.target.value })} />
              </div>
              <div>
                <Label className="text-white/70">Account (last 4)</Label>
                <Input maxLength={4} value={row.account_last4 || ''} onChange={e => update({ account_last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
              </div>
              <div>
                <Label className="text-white/70">Routing (last 4)</Label>
                <Input maxLength={4} value={row.routing_last4 || ''} onChange={e => update({ routing_last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
              </div>
            </div>

            <div>
              <Label className="text-white/70">Stripe Account ID</Label>
              <Input placeholder="acct_..." value={row.stripe_account_id || ''} onChange={e => update({ stripe_account_id: e.target.value })} />
            </div>

            <div>
              <Label className="text-white/70">PayPal Email</Label>
              <Input type="email" value={row.paypal_email || ''} onChange={e => update({ paypal_email: e.target.value })} />
            </div>

            <div>
              <Label className="text-white/70">Notes</Label>
              <Input value={row.notes || ''} onChange={e => update({ notes: e.target.value })} />
            </div>

            <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 p-3">
              <div>
                <div className="text-white text-sm font-medium">Verified</div>
                <div className="text-white/50 text-xs">Mark as verified after confirming details with host.</div>
              </div>
              <Switch checked={row.is_verified} onCheckedChange={v => update({ is_verified: v })} />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving || loading}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HostPayoutMethodDialog;
