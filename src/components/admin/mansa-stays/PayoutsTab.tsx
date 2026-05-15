import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, DollarSign, Search, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toCSV, downloadCSV } from './csvUtils';

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

interface Booking {
  id: string;
  property_id: string;
  host_payout: number;
  payout_status: string | null;
  status: string;
  check_out_date: string;
  guest_name: string | null;
}
interface PayoutHistory {
  id: string;
  host_id: string;
  booking_id: string | null;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  status: string;
  paid_at: string | null;
  created_at: string;
  description: string | null;
}
interface HostAgg {
  host_id: string;
  full_name: string | null;
  email: string | null;
  payout_method_type: string | null;
  payout_verified: boolean;
  owed: number;
  bookings: Booking[];
  paid_total: number;
}

const PayoutsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState<HostAgg[]>([]);
  const [history, setHistory] = useState<PayoutHistory[]>([]);
  const [propMap, setPropMap] = useState<Record<string, string>>({});
  const [profileMap, setProfileMap] = useState<Record<string, { name: string | null; email: string | null }>>({});
  const [payDialog, setPayDialog] = useState<{ host: HostAgg } | null>(null);
  const [payForm, setPayForm] = useState({ amount: '', reference: '', notes: '' });
  const [paying, setPaying] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: props }, { data: bookings }, { data: methods }, { data: payouts }] = await Promise.all([
      supabase.from('vacation_properties').select('id, host_id, title'),
      supabase.from('vacation_bookings').select('id, property_id, host_payout, payout_status, status, check_out_date, guest_name'),
      supabase.from('host_payout_methods').select('host_id, method_type, is_verified'),
      supabase.from('stays_host_payouts').select('*').order('created_at', { ascending: false }),
    ]);

    const pMap: Record<string, string> = {};
    const propToHost = new Map<string, string>();
    for (const p of (props ?? []) as any[]) {
      pMap[p.id] = p.title;
      propToHost.set(p.id, p.host_id);
    }
    setPropMap(pMap);

    const hostIds = Array.from(new Set([
      ...(props ?? []).map((p: any) => p.host_id),
      ...(payouts ?? []).map((p: any) => p.host_id),
    ].filter(Boolean)));

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', hostIds);
    const profMap: Record<string, { name: string | null; email: string | null }> = {};
    for (const pr of (profiles ?? []) as any[]) {
      profMap[pr.id] = { name: pr.full_name, email: pr.email };
    }
    setProfileMap(profMap);

    const methodMap = new Map((methods ?? []).map((m: any) => [m.host_id, m]));

    const agg: Record<string, HostAgg> = {};
    for (const hid of hostIds) {
      const m: any = methodMap.get(hid);
      agg[hid] = {
        host_id: hid,
        full_name: profMap[hid]?.name ?? null,
        email: profMap[hid]?.email ?? null,
        payout_method_type: m?.method_type ?? null,
        payout_verified: m?.is_verified ?? false,
        owed: 0,
        bookings: [],
        paid_total: 0,
      };
    }

    for (const b of (bookings ?? []) as Booking[]) {
      const hid = propToHost.get(b.property_id);
      if (!hid || !agg[hid]) continue;
      if (b.status === 'cancelled') continue;
      // Owed = completed/confirmed bookings whose payout hasn't been marked paid
      const isPayable = ['confirmed', 'completed'].includes(b.status);
      if (isPayable && b.payout_status !== 'paid') {
        agg[hid].owed += Number(b.host_payout || 0);
        agg[hid].bookings.push(b);
      }
    }

    for (const p of (payouts ?? []) as PayoutHistory[]) {
      if (agg[p.host_id] && p.status === 'paid') {
        agg[p.host_id].paid_total += Number(p.net_amount || 0);
      }
    }

    setHosts(Object.values(agg).filter(h => h.owed > 0 || h.paid_total > 0).sort((a, b) => b.owed - a.owed));
    setHistory((payouts ?? []) as PayoutHistory[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openPay = (host: HostAgg) => {
    setPayDialog({ host });
    setPayForm({ amount: host.owed.toFixed(2), reference: '', notes: '' });
  };

  const markPaid = async () => {
    if (!payDialog) return;
    const host = payDialog.host;
    const amount = parseFloat(payForm.amount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    setPaying(true);

    // 1. Create payout history record
    const { error: payErr } = await supabase.from('stays_host_payouts').insert({
      host_id: host.host_id,
      gross_amount: amount,
      platform_fee: 0,
      net_amount: amount,
      status: 'paid',
      paid_at: new Date().toISOString(),
      description: payForm.notes || `Manual payout · ${host.bookings.length} bookings`,
      stripe_transfer_id: payForm.reference || null,
    });

    if (payErr) {
      toast.error('Failed to record payout: ' + payErr.message);
      setPaying(false);
      return;
    }

    // 2. Mark covered bookings as paid
    const bookingIds = host.bookings.map(b => b.id);
    if (bookingIds.length) {
      const { error: bErr } = await supabase
        .from('vacation_bookings')
        .update({ payout_status: 'paid' })
        .in('id', bookingIds);
      if (bErr) {
        toast.error('Payout recorded but bookings not updated: ' + bErr.message);
      }
    }

    setPaying(false);
    toast.success(`Marked ${fmt(amount)} as paid to ${host.full_name || 'host'}`);
    setPayDialog(null);
    load();
  };

  const [owedSearch, setOwedSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  const owedRows = useMemo(() => {
    const q = owedSearch.trim().toLowerCase();
    return hosts.filter(h => {
      if (h.owed <= 0) return false;
      if (!q) return true;
      return [h.full_name, h.email].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [hosts, owedSearch]);

  const historyRows = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    if (!q) return history;
    return history.filter(p => {
      const prof = profileMap[p.host_id];
      return [prof?.name, prof?.email, p.description, p.booking_id].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [history, historySearch, profileMap]);

  const totals = useMemo(() => ({
    owed: hosts.reduce((s, h) => s + h.owed, 0),
    paid: hosts.reduce((s, h) => s + h.paid_total, 0),
    hostsOwed: hosts.filter(h => h.owed > 0).length,
  }), [hosts]);

  const exportOwed = () => {
    downloadCSV('mansa-stays-owed', toCSV(owedRows, [
      { key: 'full_name', label: 'Host' },
      { key: 'email', label: 'Email' },
      { key: 'payout_method_type', label: 'Method' },
      { label: 'Bookings', key: 'bookings', get: r => r.bookings.length },
      { key: 'owed', label: 'Amount Owed' },
      { key: 'paid_total', label: 'Lifetime Paid' },
    ]));
  };

  const exportHistory = () => {
    downloadCSV('mansa-stays-payout-history', toCSV(historyRows, [
      { label: 'Date', key: 'paid_at', get: p => (p.paid_at || p.created_at) },
      { label: 'Host', key: 'host_id', get: p => profileMap[p.host_id]?.name || profileMap[p.host_id]?.email || p.host_id },
      { key: 'net_amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'booking_id', label: 'Reference' },
      { key: 'description', label: 'Notes' },
    ]));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">Hosts Owed</div>
          <div className="text-white text-xl font-semibold">{totals.hostsOwed}</div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">Total Owed</div>
          <div className="text-yellow-300 text-xl font-semibold">{fmt(totals.owed)}</div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">Total Paid (lifetime)</div>
          <div className="text-green-300 text-xl font-semibold">{fmt(totals.paid)}</div>
        </div>
      </div>

      <Tabs defaultValue="owed" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="owed">Owed by Host ({hosts.filter(h => h.owed > 0).length})</TabsTrigger>
          <TabsTrigger value="history">Payout History ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="owed" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search host name or email…"
                value={owedSearch}
                onChange={e => setOwedSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="text-xs text-white/50 ml-auto">{owedRows.length} hosts</div>
            <Button size="sm" variant="outline" onClick={exportOwed}>
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/70">Host</TableHead>
                    <TableHead className="text-white/70">Method</TableHead>
                    <TableHead className="text-white/70"># Bookings</TableHead>
                    <TableHead className="text-white/70">Amount Owed</TableHead>
                    <TableHead className="text-white/70">Lifetime Paid</TableHead>
                    <TableHead className="text-white/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owedRows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-white/50 py-8">No hosts currently owed.</TableCell></TableRow>
                  ) : owedRows.map(h => (
                    <TableRow key={h.host_id} className="border-white/10">
                      <TableCell className="text-white">
                        <div className="font-medium">{h.full_name || 'Unnamed host'}</div>
                        <div className="text-xs text-white/50">{h.email}</div>
                      </TableCell>
                      <TableCell>
                        {h.payout_method_type ? (
                          <Badge className={h.payout_verified
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}>
                            {h.payout_method_type}{h.payout_verified ? ' ✓' : ''}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Missing</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white/70">{h.bookings.length}</TableCell>
                      <TableCell className="text-yellow-300 font-semibold">{fmt(h.owed)}</TableCell>
                      <TableCell className="text-green-300">{fmt(h.paid_total)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => openPay(h)}
                          disabled={!h.payout_method_type}
                          className="h-8"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Mark as Paid
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/70">Date</TableHead>
                    <TableHead className="text-white/70">Host</TableHead>
                    <TableHead className="text-white/70">Amount</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Reference</TableHead>
                    <TableHead className="text-white/70">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-white/50 py-8">No payouts recorded yet.</TableCell></TableRow>
                  ) : history.map(p => (
                    <TableRow key={p.id} className="border-white/10">
                      <TableCell className="text-white/70 text-xs">
                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {profileMap[p.host_id]?.name || profileMap[p.host_id]?.email || p.host_id.slice(0, 8) + '…'}
                      </TableCell>
                      <TableCell className="text-green-300 font-semibold">{fmt(Number(p.net_amount))}</TableCell>
                      <TableCell>
                        <Badge className={p.status === 'paid'
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/60 text-xs">{p.booking_id ? p.booking_id.slice(0, 8) + '…' : '—'}</TableCell>
                      <TableCell className="text-white/60 text-xs">{p.description || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mark Paid Dialog */}
      <Dialog open={!!payDialog} onOpenChange={(v) => !v && setPayDialog(null)}>
        <DialogContent className="max-w-md bg-black border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Mark Payout as Paid</DialogTitle>
            <DialogDescription className="text-white/60">
              {payDialog?.host.full_name || payDialog?.host.email} · {payDialog?.host.bookings.length} bookings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label className="text-white/70">Amount (USD)</Label>
              <Input
                type="number"
                step="0.01"
                value={payForm.amount}
                onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-white/70">Reference / Transfer ID</Label>
              <Input
                placeholder="e.g. ACH-12345 or tr_..."
                value={payForm.reference}
                onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-white/70">Notes</Label>
              <Input
                placeholder="Optional"
                value={payForm.notes}
                onChange={e => setPayForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 text-xs text-yellow-200">
              This will mark {payDialog?.host.bookings.length} bookings as paid out and add an entry to payout history.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialog(null)}>Cancel</Button>
            <Button onClick={markPaid} disabled={paying}>
              {paying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <DollarSign className="h-4 w-4 mr-1" /> Confirm Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayoutsTab;
