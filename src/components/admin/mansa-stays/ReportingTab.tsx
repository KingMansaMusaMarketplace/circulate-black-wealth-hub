import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

interface Booking {
  id: string;
  property_id: string;
  total_amount: number;
  platform_fee: number;
  host_payout: number;
  status: string;
  refund_amount: number | null;
  num_nights: number;
  check_in_date: string;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  host_id: string | null;
}

const COLORS = ['#FFB300', '#003366', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

const ReportingTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [range, setRange] = useState<'30' | '90' | '365' | 'all'>('90');

  useEffect(() => {
    (async () => {
      const [{ data: b }, { data: p }] = await Promise.all([
        supabase.from('vacation_bookings').select('id,property_id,total_amount,platform_fee,host_payout,status,refund_amount,num_nights,check_in_date,created_at').order('created_at', { ascending: true }),
        supabase.from('vacation_properties').select('id,title,host_id'),
      ]);
      setBookings((b as Booking[]) ?? []);
      setProperties((p as Property[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const cutoff = useMemo(() => {
    if (range === 'all') return null;
    const d = new Date();
    d.setDate(d.getDate() - parseInt(range));
    return d;
  }, [range]);

  const inRange = useMemo(() => {
    if (!cutoff) return bookings;
    return bookings.filter(b => new Date(b.created_at) >= cutoff);
  }, [bookings, cutoff]);

  // Revenue over time (by day)
  const revenueSeries = useMemo(() => {
    const map: Record<string, { date: string; gmv: number; fees: number; bookings: number }> = {};
    inRange.forEach(b => {
      if (b.status === 'cancelled') return;
      const d = b.created_at.slice(0, 10);
      if (!map[d]) map[d] = { date: d, gmv: 0, fees: 0, bookings: 0 };
      map[d].gmv += Number(b.total_amount || 0);
      map[d].fees += Number(b.platform_fee || 0);
      map[d].bookings += 1;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [inRange]);

  // Status breakdown
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    inRange.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [inRange]);

  // Top properties by GMV
  const topProperties = useMemo(() => {
    const map: Record<string, number> = {};
    inRange.forEach(b => {
      if (b.status === 'cancelled') return;
      map[b.property_id] = (map[b.property_id] || 0) + Number(b.total_amount || 0);
    });
    return Object.entries(map)
      .map(([id, gmv]) => ({ name: properties.find(p => p.id === id)?.title || id.slice(0, 8), gmv }))
      .sort((a, b) => b.gmv - a.gmv)
      .slice(0, 10);
  }, [inRange, properties]);

  // Top hosts by payout
  const topHosts = useMemo(() => {
    const propHost = Object.fromEntries(properties.map(p => [p.id, p.host_id]));
    const map: Record<string, number> = {};
    inRange.forEach(b => {
      if (b.status === 'cancelled') return;
      const host = propHost[b.property_id] || 'unknown';
      map[host] = (map[host] || 0) + Number(b.host_payout || 0);
    });
    return Object.entries(map)
      .map(([id, payout]) => ({ name: id === 'unknown' ? 'Unknown' : id.slice(0, 8), payout }))
      .sort((a, b) => b.payout - a.payout)
      .slice(0, 10);
  }, [inRange, properties]);

  // Refund/cancellation metrics
  const totals = useMemo(() => {
    const total = inRange.length;
    const cancelled = inRange.filter(b => b.status === 'cancelled').length;
    const refunded = inRange.filter(b => Number(b.refund_amount || 0) > 0).length;
    const refundAmount = inRange.reduce((s, b) => s + Number(b.refund_amount || 0), 0);
    const gmv = inRange.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_amount || 0), 0);
    const fees = inRange.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.platform_fee || 0), 0);
    const nights = inRange.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.num_nights || 0), 0);
    return { total, cancelled, refunded, refundAmount, gmv, fees, nights, cancelRate: total ? (cancelled / total) * 100 : 0 };
  }, [inRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/60">Range:</span>
        <select
          value={range}
          onChange={e => setRange(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
        >
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 12 months</option>
          <option value="all">All time</option>
        </select>
        <div className="text-xs text-white/50 ml-auto">{inRange.length} bookings in range</div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardDescription className="text-white/60">GMV</CardDescription>
            <CardTitle className="text-2xl text-white">{fmt(totals.gmv)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">{fmt(totals.fees)} platform fees</CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardDescription className="text-white/60">Nights Booked</CardDescription>
            <CardTitle className="text-2xl text-white">{totals.nights}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">across {totals.total} bookings</CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardDescription className="text-white/60">Cancellation Rate</CardDescription>
            <CardTitle className="text-2xl text-white">{totals.cancelRate.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">{totals.cancelled} cancelled</CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2"><CardDescription className="text-white/60">Refunds Issued</CardDescription>
            <CardTitle className="text-2xl text-white">{fmt(totals.refundAmount)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">{totals.refunded} refunded bookings</CardContent>
        </Card>
      </div>

      {/* Revenue line chart */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Revenue Over Time</CardTitle>
          <CardDescription className="text-white/60">GMV and platform fees by booking date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#fff', fontSize: 12 }} />
                <Line type="monotone" dataKey="gmv" stroke="#FFB300" strokeWidth={2} dot={false} name="GMV" />
                <Line type="monotone" dataKey="fees" stroke="#10b981" strokeWidth={2} dot={false} name="Fees" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Properties */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top Properties by GMV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={topProperties} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} width={120} />
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="gmv" fill="#FFB300" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Booking Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Hosts */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Top Hosts by Payout</CardTitle>
          <CardDescription className="text-white/60">Total host payouts (excluding cancelled)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={topHosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} formatter={(v: number) => fmt(v)} />
                <Bar dataKey="payout" fill="#003366" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingTab;
