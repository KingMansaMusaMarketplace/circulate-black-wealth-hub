import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Bill = { id: string; bill_code: string; amount_cents: number; description: string | null; status: string; expires_at: string; checkout_session_id: string | null };

// Table is newer than the generated types; keep the cast local to this screen.
const bills = () => (supabase as any).from('qr_bill_requests');

/** Cashier creates the bill; the customer only types the code, so the business sets the amount. */
export const QRBillsTab = ({ businessId }: { businessId?: string }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [rows, setRows] = useState<Bill[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!businessId) return;
    const { data, error } = await bills()
      .select('id,bill_code,amount_cents,description,status,expires_at,checkout_session_id')
      .eq('business_id', businessId).order('created_at', { ascending: false }).limit(10);
    if (!error) setRows((data ?? []) as Bill[]);
  }, [businessId]);
  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    const cents = Math.round((parseFloat(amount) || 0) * 100);
    if (!businessId) return;
    if (cents < 50 || cents > 9999999) { toast.error('Enter an amount between $0.50 and $99,999.99'); return; }
    setBusy(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { data, error } = await bills()
        .insert({ business_id: businessId, amount_cents: cents, description: note.trim() || null, created_by: auth.user?.id })
        .select('bill_code').single();
      if (error || !data) throw error ?? new Error('not saved');
      toast.success(`Bill code ${data.bill_code} — give this to the customer. It works for 30 minutes.`);
      setAmount(''); setNote(''); await load();
    } catch {
      toast.error('The bill could not be created.');
    } finally { setBusy(false); }
  };

  const cancel = async (id: string) => {
    const { error } = await bills().update({ status: 'cancelled' }).eq('id', id).eq('status', 'open');
    if (error) toast.error('The bill could not be cancelled.'); else { toast.success('Bill cancelled.'); await load(); }
  };

  if (!businessId) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> Create a bill</CardTitle>
        <p className="text-sm text-muted-foreground">Customers who pay by scanning your QR code type this bill code. You set the amount, so it can't be changed by the customer.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[160px_1fr_auto] md:items-end">
          <div className="space-y-1">
            <Label htmlFor="bill-new-amount">Amount (USD)</Label>
            <Input id="bill-new-amount" type="number" inputMode="decimal" step="0.01" min="0.5" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bill-new-note">Note (optional)</Label>
            <Input id="bill-new-note" maxLength={200} placeholder="e.g. Table 4" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button onClick={create} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create bill code'}</Button>
        </div>
        {rows.length > 0 && (
          <ul className="divide-y rounded-md border">
            {rows.map((b) => {
              const expired = new Date(b.expires_at).getTime() <= Date.now();
              const label = b.status !== 'open' ? b.status : expired ? 'expired' : b.checkout_session_id ? 'customer at checkout' : 'open';
              return (
                <li key={`qr-bill:${b.id}`} className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span className="font-mono text-base font-semibold">{b.bill_code}</span>
                  <span>${(b.amount_cents / 100).toFixed(2)}</span>
                  <span className="hidden flex-1 truncate text-muted-foreground md:block">{b.description}</span>
                  <Badge variant="secondary">{label}</Badge>
                  {b.status === 'open' && !expired && <Button size="sm" variant="ghost" onClick={() => cancel(b.id)}>Cancel</Button>}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default QRBillsTab;
