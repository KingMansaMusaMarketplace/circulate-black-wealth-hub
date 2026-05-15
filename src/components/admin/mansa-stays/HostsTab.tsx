import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wallet, Search, Download } from 'lucide-react';
import HostPayoutMethodDialog from './HostPayoutMethodDialog';
import { toCSV, downloadCSV } from './csvUtils';

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

interface HostRow {
  host_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  property_count: number;
  active_count: number;
  total_bookings: number;
  total_payout_owed: number;
  total_paid: number;
  payout_method_type: string | null;
  payout_verified: boolean;
}

const HostsTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<HostRow[]>([]);
  const [selectedHost, setSelectedHost] = useState<{ id: string; name: string } | null>(null);
  const [methodOpen, setMethodOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: props }, { data: bookings }, { data: methods }] = await Promise.all([
      supabase.from('vacation_properties').select('id, host_id, is_active'),
      supabase.from('vacation_bookings').select('property_id, host_payout, payout_status, status'),
      supabase.from('host_payout_methods').select('host_id, method_type, is_verified'),
    ]);

    const hostIds = Array.from(new Set((props ?? []).map((p: any) => p.host_id).filter(Boolean)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone')
      .in('id', hostIds);

    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const methodMap = new Map((methods ?? []).map((m: any) => [m.host_id, m]));
    const propToHost = new Map((props ?? []).map((p: any) => [p.id, p.host_id]));

    const agg: Record<string, HostRow> = {};
    for (const hid of hostIds) {
      const profile: any = profileMap.get(hid) ?? {};
      const method: any = methodMap.get(hid);
      const hostProps = (props ?? []).filter((p: any) => p.host_id === hid);
      agg[hid] = {
        host_id: hid,
        full_name: profile.full_name ?? null,
        email: profile.email ?? null,
        phone: profile.phone ?? null,
        property_count: hostProps.length,
        active_count: hostProps.filter((p: any) => p.is_active).length,
        total_bookings: 0,
        total_payout_owed: 0,
        total_paid: 0,
        payout_method_type: method?.method_type ?? null,
        payout_verified: method?.is_verified ?? false,
      };
    }

    for (const b of (bookings ?? []) as any[]) {
      const hid = propToHost.get(b.property_id);
      if (!hid || !agg[hid]) continue;
      if (b.status === 'cancelled') continue;
      agg[hid].total_bookings += 1;
      const payout = Number(b.host_payout || 0);
      if (b.payout_status === 'paid') {
        agg[hid].total_paid += payout;
      } else {
        agg[hid].total_payout_owed += payout;
      }
    }

    setRows(Object.values(agg).sort((a, b) => b.total_payout_owed - a.total_payout_owed));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'with' | 'without'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (methodFilter === 'with' && !r.payout_method_type) return false;
      if (methodFilter === 'without' && r.payout_method_type) return false;
      if (!q) return true;
      return [r.full_name, r.email, r.phone].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [rows, search, methodFilter]);

  const totals = useMemo(() => ({
    hosts: rows.length,
    owed: rows.reduce((s, r) => s + r.total_payout_owed, 0),
    paid: rows.reduce((s, r) => s + r.total_paid, 0),
    withMethod: rows.filter(r => r.payout_method_type).length,
  }), [rows]);

  const exportCSV = () => {
    downloadCSV('mansa-stays-hosts', toCSV(filtered, [
      { key: 'full_name', label: 'Host' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'property_count', label: 'Properties' },
      { key: 'active_count', label: 'Active Properties' },
      { key: 'total_bookings', label: 'Bookings' },
      { key: 'total_payout_owed', label: 'Owed' },
      { key: 'total_paid', label: 'Paid' },
      { key: 'payout_method_type', label: 'Payout Method' },
      { key: 'payout_verified', label: 'Verified' },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">Total Hosts</div>
          <div className="text-white text-xl font-semibold">{totals.hosts}</div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">Owed to Hosts</div>
          <div className="text-yellow-300 text-xl font-semibold">{fmt(totals.owed)}</div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">Paid Out</div>
          <div className="text-green-300 text-xl font-semibold">{fmt(totals.paid)}</div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <div className="text-white/60 text-xs">With Payout Method</div>
          <div className="text-white text-xl font-semibold">{totals.withMethod} / {totals.hosts}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search host name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white"
          />
        </div>
        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
        >
          <option value="all">All Hosts</option>
          <option value="with">With Payout Method</option>
          <option value="without">Missing Payout Method</option>
        </select>
        <div className="text-xs text-white/50 ml-auto">{filtered.length} of {rows.length}</div>
        <Button size="sm" variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Host</TableHead>
                <TableHead className="text-white/70">Contact</TableHead>
                <TableHead className="text-white/70">Properties</TableHead>
                <TableHead className="text-white/70">Bookings</TableHead>
                <TableHead className="text-white/70">Owed</TableHead>
                <TableHead className="text-white/70">Paid</TableHead>
                <TableHead className="text-white/70">Payout Method</TableHead>
                <TableHead className="text-white/70 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-white/50 py-8">No hosts yet.</TableCell></TableRow>
              ) : rows.map(r => (
                <TableRow key={r.host_id} className="border-white/10">
                  <TableCell className="text-white">
                    <div className="font-medium">{r.full_name || 'Unnamed host'}</div>
                    <div className="text-xs text-white/40">{r.host_id.slice(0, 8)}…</div>
                  </TableCell>
                  <TableCell className="text-white/70 text-xs">
                    <div>{r.email || '—'}</div>
                    <div className="text-white/40">{r.phone || ''}</div>
                  </TableCell>
                  <TableCell className="text-white/70">{r.active_count} / {r.property_count}</TableCell>
                  <TableCell className="text-white/70">{r.total_bookings}</TableCell>
                  <TableCell className="text-yellow-300">{fmt(r.total_payout_owed)}</TableCell>
                  <TableCell className="text-green-300">{fmt(r.total_paid)}</TableCell>
                  <TableCell>
                    {r.payout_method_type ? (
                      <Badge className={r.payout_verified
                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}>
                        {r.payout_method_type}{r.payout_verified ? ' ✓' : ''}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Missing</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Manage payout method"
                        onClick={() => {
                          setSelectedHost({ id: r.host_id, name: r.full_name || r.email || 'Host' });
                          setMethodOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-mansagold hover:bg-white/10"
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <HostPayoutMethodDialog
        host={selectedHost}
        open={methodOpen}
        onOpenChange={setMethodOpen}
        onSaved={load}
      />
    </div>
  );
};

export default HostsTab;
