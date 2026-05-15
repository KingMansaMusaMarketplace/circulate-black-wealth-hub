import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, CreditCard, Gift, Ban, ArrowUpDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Price {
  id: string;
  nickname: string | null;
  unit_amount: number | null;
  currency: string;
  recurring: { interval: string } | null;
  product_name: string | null;
}

interface SubItem {
  id: string;
  price_id: string;
  nickname: string | null;
  unit_amount: number | null;
  currency: string;
  interval?: string;
  product_name: string | null;
}

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: SubItem[];
}

interface Customer {
  id: string;
  email: string | null;
  name: string | null;
  balance: number;
  created: number;
}

interface Invoice {
  id: string;
  number: string | null;
  amount_paid: number;
  status: string | null;
  created: number;
  hosted_invoice_url: string | null;
}

const fmtCents = (c: number | null | undefined, ccy = 'usd') =>
  ((c ?? 0) / 100).toLocaleString('en-US', { style: 'currency', currency: ccy.toUpperCase() });
const fmtTs = (t: number) => new Date(t * 1000).toLocaleDateString();

const SubscriptionsAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [tierTarget, setTierTarget] = useState<Record<string, string>>({});
  const [creditAmount, setCreditAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    supabase.functions.invoke('admin-subscriptions', { body: { action: 'list_prices' } }).then(({ data }) => {
      if ((data as any)?.prices) setPrices((data as any).prices);
    });
  }, []);

  const lookup = async () => {
    if (!email.trim()) return toast.error('Enter an email');
    setSearching(true);
    setCustomer(null);
    setSubs([]);
    setInvoices([]);
    const { data, error } = await supabase.functions.invoke('admin-subscriptions', {
      body: { action: 'lookup', email: email.trim() },
    });
    setSearching(false);
    if (error || (data as any)?.error) return toast.error(error?.message || (data as any)?.error);
    if (!(data as any).found) return toast.info('No Stripe customer found for that email');
    setCustomer((data as any).customer);
    setSubs((data as any).subscriptions);
    setInvoices((data as any).invoices);
  };

  const call = async (body: any, success: string) => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('admin-subscriptions', { body });
    setBusy(false);
    if (error || (data as any)?.error) {
      toast.error(error?.message || (data as any)?.error);
      return false;
    }
    toast.success(success);
    return true;
  };

  const changeTier = async (sub: Subscription) => {
    const target = tierTarget[sub.id];
    if (!target) return toast.error('Pick a new price');
    if (!window.confirm(`Switch subscription to new price? Prorations will be created.`)) return;
    const ok = await call(
      { action: 'change_tier', subscription_id: sub.id, new_price_id: target },
      'Tier changed'
    );
    if (ok) lookup();
  };

  const compMonth = async (sub: Subscription) => {
    if (!window.confirm('Apply 100% off coupon for the next invoice?')) return;
    const ok = await call(
      { action: 'comp_month', subscription_id: sub.id, reason },
      'Comp applied'
    );
    if (ok) lookup();
  };

  const cancelSub = async (sub: Subscription, immediate: boolean) => {
    if (!window.confirm(immediate ? 'Cancel IMMEDIATELY (no refund)?' : 'Cancel at end of current period?')) return;
    const ok = await call(
      { action: 'cancel', subscription_id: sub.id, cancel_immediately: immediate },
      'Cancellation scheduled'
    );
    if (ok) lookup();
  };

  const issueCredit = async () => {
    const amt = parseFloat(creditAmount);
    if (!customer || !amt || amt <= 0) return toast.error('Enter a positive credit amount');
    if (!window.confirm(`Add ${fmtCents(amt * 100)} credit to ${customer.email}?`)) return;
    const ok = await call(
      { action: 'issue_credit', customer_id: customer.id, amount_cents: Math.round(amt * 100), reason },
      'Credit applied'
    );
    if (ok) {
      setCreditAmount('');
      lookup();
    }
  };

  return (
    <div className="space-y-6 text-white">
      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-mansagold" /> User Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by user email…"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()}
              className="bg-white/5 border-white/10"
            />
            <Button onClick={lookup} disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Search</span>
            </Button>
          </div>

          {customer && (
            <div className="rounded-md border border-white/10 bg-white/5 p-4 space-y-1">
              <div className="text-sm text-white/70">Stripe Customer</div>
              <div className="font-mono text-xs">{customer.id}</div>
              <div>{customer.name ?? '—'} · {customer.email}</div>
              <div className="text-xs text-white/60">
                Account balance: <span className={customer.balance < 0 ? 'text-green-400' : 'text-white'}>
                  {fmtCents(Math.abs(customer.balance))} {customer.balance < 0 ? '(credit)' : customer.balance > 0 ? '(owed)' : ''}
                </span>
                {' · '}Customer since {fmtTs(customer.created)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {subs.map(sub => (
        <Card key={sub.id} className="bg-black border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                {sub.items[0]?.product_name || sub.items[0]?.nickname || sub.id}
                <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>{sub.status}</Badge>
                {sub.cancel_at_period_end && <Badge variant="destructive">Cancels at period end</Badge>}
              </span>
              <span className="text-xs font-mono text-white/40">{sub.id}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-white/70">
              {sub.items.map(it => (
                <div key={it.id}>
                  {fmtCents(it.unit_amount, it.currency)} / {it.interval ?? 'one-time'} · {it.nickname ?? it.price_id}
                </div>
              ))}
              <div className="text-xs text-white/50 mt-1">Renews / ends: {fmtTs(sub.current_period_end)}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70 text-xs"><ArrowUpDown className="inline h-3 w-3 mr-1" /> Change Tier</Label>
                <div className="flex gap-2">
                  <Select value={tierTarget[sub.id] ?? ''} onValueChange={v => setTierTarget(t => ({ ...t, [sub.id]: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Pick new price" /></SelectTrigger>
                    <SelectContent>
                      {prices.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.product_name ?? p.nickname ?? p.id} · {fmtCents(p.unit_amount, p.currency)}
                          {p.recurring ? ` / ${p.recurring.interval}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => changeTier(sub)} disabled={busy}>Apply</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/70 text-xs"><Gift className="inline h-3 w-3 mr-1" /> Comp 1 Month</Label>
                <Button variant="outline" onClick={() => compMonth(sub)} disabled={busy} className="w-full">
                  Apply 100% off coupon (once)
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <Button variant="outline" onClick={() => cancelSub(sub, false)} disabled={busy}>
                <Ban className="h-4 w-4 mr-1" /> Cancel at period end
              </Button>
              <Button variant="destructive" onClick={() => cancelSub(sub, true)} disabled={busy}>
                <Ban className="h-4 w-4 mr-1" /> Cancel immediately
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {customer && (
        <Card className="bg-black border-white/10">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Gift className="h-4 w-4 text-mansagold" /> Issue Credit</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <Label className="text-white/70 text-xs">Amount (USD)</Label>
                <Input type="number" step="0.01" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="bg-white/5 border-white/10" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-white/70 text-xs">Reason / note (audit-logged)</Label>
                <Input value={reason} onChange={e => setReason(e.target.value)} className="bg-white/5 border-white/10" placeholder="e.g. apology for outage" />
              </div>
            </div>
            <Button onClick={issueCredit} disabled={busy}>Apply credit to customer balance</Button>
            <p className="text-xs text-white/50">Credit reduces the next invoice automatically.</p>
          </CardContent>
        </Card>
      )}

      {invoices.length > 0 && (
        <Card className="bg-black border-white/10">
          <CardHeader><CardTitle className="text-base">Recent Invoices</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-white/60 text-xs">
                <tr><th className="text-left p-2">Number</th><th className="text-left p-2">Date</th><th className="text-left p-2">Status</th><th className="text-right p-2">Amount</th><th></th></tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-t border-white/10">
                    <td className="p-2 font-mono text-xs">{inv.number ?? inv.id}</td>
                    <td className="p-2">{fmtTs(inv.created)}</td>
                    <td className="p-2"><Badge variant="secondary">{inv.status}</Badge></td>
                    <td className="p-2 text-right">{fmtCents(inv.amount_paid)}</td>
                    <td className="p-2 text-right">
                      {inv.hosted_invoice_url && (
                        <a href={inv.hosted_invoice_url} target="_blank" rel="noreferrer" className="text-mansagold inline-flex items-center gap-1 text-xs">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionsAdmin;
