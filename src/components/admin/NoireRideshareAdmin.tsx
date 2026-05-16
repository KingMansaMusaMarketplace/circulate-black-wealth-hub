import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Car, Users, DollarSign, Loader2, Search, Download, Power, ShieldCheck, Settings2, AlertTriangle, CheckCircle2, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { toCSV, downloadCSV } from './noire-rideshare/csvUtils';
import DriverDetailDrawer from './noir/DriverDetailDrawer';
import { STATUS_COLORS, DriverApplicationStatus } from '@/lib/api/noir-driver-api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

interface Driver {
  id: string;
  user_id: string | null;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_color: string | null;
  license_plate: string | null;
  is_active: boolean;
  is_approved: boolean;
  is_online: boolean;
  rating_average: number | null;
  total_rides: number | null;
  total_earnings: number | null;
  created_at: string;
  application_status?: DriverApplicationStatus;
  submitted_at?: string | null;
}

interface Ride {
  id: string;
  rider_user_id: string | null;
  driver_id: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  estimated_distance_miles: number | null;
  estimated_fare: number | null;
  actual_fare: number | null;
  platform_fee: number | null;
  driver_payout: number | null;
  status: string;
  payment_intent_id: string | null;
  cancellation_reason: string | null;
  requested_at: string;
  created_at: string;
}

interface Pricing {
  id: string;
  base_fare: number;
  per_mile_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  surge_multiplier: number;
  platform_fee_pct: number;
}

interface Payout {
  id: string;
  driver_id: string;
  amount: number;
  method: string | null;
  reference: string | null;
  notes: string | null;
  paid_at: string;
}

interface Dispute {
  id: string;
  ride_id: string;
  filed_by: string;
  reason: string;
  description: string | null;
  status: string;
  resolution_notes: string | null;
  created_at: string;
}

const COLORS = ['#FFB300', '#003366', '#10b981', '#ef4444', '#8b5cf6'];

const NoireRideshareAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [openDriverId, setOpenDriverId] = useState<string | null>(null);

  const loadAll = async () => {
    const [d, r, p, py, dp] = await Promise.all([
      supabase.from('noir_drivers').select('*').order('created_at', { ascending: false }),
      supabase.from('noir_rides').select('*').order('created_at', { ascending: false }),
      supabase.from('noire_pricing_config').select('*').eq('is_active', true).maybeSingle(),
      supabase.from('noire_driver_payouts').select('*').order('paid_at', { ascending: false }),
      supabase.from('noire_ride_disputes').select('*').order('created_at', { ascending: false }),
    ]);
    setDrivers((d.data as Driver[]) ?? []);
    setRides((r.data as Ride[]) ?? []);
    setPricing(p.data as Pricing | null);
    setPayouts((py.data as Payout[]) ?? []);
    setDisputes((dp.data as Dispute[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  // Driver toggles
  const toggleDriver = async (id: string, field: 'is_active' | 'is_approved', value: boolean) => {
    const { error } = await supabase.from('noir_drivers').update({ [field]: value }).eq('id', id);
    if (error) return toast.error('Update failed: ' + error.message);
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    toast.success('Updated');
  };

  // Filters
  const [driverSearch, setDriverSearch] = useState('');
  const [driverStatus, setDriverStatus] = useState<'all' | 'approved' | 'pending' | 'active' | 'inactive'>('all');
  const [rideSearch, setRideSearch] = useState('');
  const [rideStatus, setRideStatus] = useState<string>('all');

  const filteredDrivers = useMemo(() => {
    const q = driverSearch.trim().toLowerCase();
    return drivers.filter(d => {
      if (driverStatus === 'approved' && !d.is_approved) return false;
      if (driverStatus === 'pending' && d.is_approved) return false;
      if (driverStatus === 'active' && !d.is_active) return false;
      if (driverStatus === 'inactive' && d.is_active) return false;
      if (!q) return true;
      return [d.full_name, d.email, d.phone, d.license_plate].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [drivers, driverSearch, driverStatus]);

  const filteredRides = useMemo(() => {
    const q = rideSearch.trim().toLowerCase();
    return rides.filter(r => {
      if (rideStatus !== 'all' && r.status !== rideStatus) return false;
      if (!q) return true;
      return [r.pickup_address, r.dropoff_address, r.payment_intent_id].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [rides, rideSearch, rideStatus]);

  // Pricing form
  const [pricingForm, setPricingForm] = useState<Pricing | null>(null);
  useEffect(() => { setPricingForm(pricing); }, [pricing]);

  const savePricing = async () => {
    if (!pricingForm) return;
    const { error } = await supabase
      .from('noire_pricing_config')
      .update({
        base_fare: pricingForm.base_fare,
        per_mile_rate: pricingForm.per_mile_rate,
        per_minute_rate: pricingForm.per_minute_rate,
        minimum_fare: pricingForm.minimum_fare,
        surge_multiplier: pricingForm.surge_multiplier,
        platform_fee_pct: pricingForm.platform_fee_pct,
      })
      .eq('id', pricingForm.id);
    if (error) return toast.error('Save failed: ' + error.message);
    toast.success('Pricing updated');
    loadAll();
  };

  // Refund / cancel ride
  const [rideAction, setRideAction] = useState<{ ride: Ride; type: 'refund' | 'cancel' } | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const performRideAction = async () => {
    if (!rideAction) return;
    setActionLoading(true);
    try {
      if (rideAction.type === 'cancel') {
        const { error } = await supabase
          .from('noir_rides')
          .update({ status: 'cancelled', cancellation_reason: actionReason || 'Admin cancelled', cancelled_at: new Date().toISOString() })
          .eq('id', rideAction.ride.id);
        if (error) throw error;
        toast.success('Ride cancelled');
      } else {
        // Refund via Stripe
        const amt = parseFloat(actionAmount);
        if (!amt || amt <= 0) throw new Error('Enter a valid refund amount');
        if (!(rideAction.ride as any).payment_intent_id) {
          throw new Error('No Stripe payment_intent_id on this ride — cannot refund.');
        }
        const ok = window.confirm(`Refund $${amt.toFixed(2)} to the rider via Stripe? This is REAL money and cannot be undone.`);
        if (!ok) { setActionLoading(false); return; }
        const { data, error } = await supabase.functions.invoke('process-refund', {
          body: {
            record_type: 'noir_ride',
            record_id: rideAction.ride.id,
            amount: amt,
            reason: 'requested_by_customer',
            notes: actionReason || undefined,
          },
        });
        if (error || (data as any)?.error) throw new Error(error?.message || (data as any)?.error);
        toast.success(`Stripe refund ${(data as any).status} · $${(data as any).amount}`);
      }
      setRideAction(null);
      setActionReason('');
      setActionAmount('');
      loadAll();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Payouts
  const driverOwedMap = useMemo(() => {
    const owed: Record<string, number> = {};
    rides.filter(r => r.status === 'completed' && r.driver_id).forEach(r => {
      owed[r.driver_id!] = (owed[r.driver_id!] || 0) + Number(r.driver_payout || 0);
    });
    payouts.forEach(p => {
      owed[p.driver_id] = (owed[p.driver_id] || 0) - Number(p.amount || 0);
    });
    return owed;
  }, [rides, payouts]);

  const [payDriver, setPayDriver] = useState<Driver | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const recordPayout = async () => {
    if (!payDriver || !payAmount) return toast.error('Amount required');
    const { error } = await supabase.from('noire_driver_payouts').insert({
      driver_id: payDriver.id,
      amount: Number(payAmount),
      method: payMethod,
      reference: payRef,
      notes: payNotes,
    });
    if (error) return toast.error(error.message);
    toast.success('Payout recorded');
    setPayDriver(null); setPayAmount(''); setPayMethod(''); setPayRef(''); setPayNotes('');
    loadAll();
  };

  // Dispute resolution
  const [resolveDispute, setResolveDispute] = useState<Dispute | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');
  const [resolveStatus, setResolveStatus] = useState<'investigating' | 'resolved' | 'dismissed'>('resolved');

  const submitDisputeResolution = async () => {
    if (!resolveDispute) return;
    const { error } = await supabase.from('noire_ride_disputes').update({
      status: resolveStatus,
      resolution_notes: resolveNotes,
      resolved_at: ['resolved', 'dismissed'].includes(resolveStatus) ? new Date().toISOString() : null,
    }).eq('id', resolveDispute.id);
    if (error) return toast.error(error.message);
    toast.success('Dispute updated');
    setResolveDispute(null); setResolveNotes('');
    loadAll();
  };

  // Reporting
  const [reportRange, setReportRange] = useState<30 | 90 | 365 | 0>(30);
  const cutoff = useMemo(() => {
    if (reportRange === 0) return new Date(0);
    const d = new Date(); d.setDate(d.getDate() - reportRange); return d;
  }, [reportRange]);

  const reportRides = useMemo(
    () => rides.filter(r => new Date(r.created_at) >= cutoff && r.status !== 'cancelled'),
    [rides, cutoff]
  );

  const reportingStats = useMemo(() => {
    const gmv = reportRides.reduce((s, r) => s + Number(r.actual_fare || r.estimated_fare || 0), 0);
    const fees = reportRides.reduce((s, r) => s + Number(r.platform_fee || 0), 0);
    const cancelled = rides.filter(r => new Date(r.created_at) >= cutoff && r.status === 'cancelled').length;
    const total = reportRides.length + cancelled;
    const cancelRate = total ? (cancelled / total) * 100 : 0;
    const avgFare = reportRides.length ? gmv / reportRides.length : 0;

    // Revenue over time
    const byDay: Record<string, { date: string; gmv: number; fees: number }> = {};
    reportRides.forEach(r => {
      const day = new Date(r.created_at).toISOString().slice(0, 10);
      if (!byDay[day]) byDay[day] = { date: day, gmv: 0, fees: 0 };
      byDay[day].gmv += Number(r.actual_fare || r.estimated_fare || 0);
      byDay[day].fees += Number(r.platform_fee || 0);
    });
    const series = Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));

    // Top drivers
    const driverRev: Record<string, number> = {};
    reportRides.forEach(r => {
      if (r.driver_id) driverRev[r.driver_id] = (driverRev[r.driver_id] || 0) + Number(r.driver_payout || 0);
    });
    const driverMap = Object.fromEntries(drivers.map(d => [d.id, d.full_name || 'Unknown']));
    const topDrivers = Object.entries(driverRev)
      .map(([id, v]) => ({ name: driverMap[id] || id.slice(0, 8), payout: Number(v.toFixed(2)) }))
      .sort((a, b) => b.payout - a.payout)
      .slice(0, 5);

    // Status breakdown
    const statusCounts: Record<string, number> = {};
    rides.filter(r => new Date(r.created_at) >= cutoff).forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    return { gmv, fees, cancelled, cancelRate, avgFare, series, topDrivers, statusData };
  }, [reportRides, rides, drivers, cutoff]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-mansagold" /></div>;
  }

  const driverMap = Object.fromEntries(drivers.map(d => [d.id, d.full_name || 'Unknown']));
  const totalGmv = rides.filter(r => r.status !== 'cancelled').reduce((s, r) => s + Number(r.actual_fare || r.estimated_fare || 0), 0);
  const realizedFees = rides.filter(r => r.status === 'completed').reduce((s, r) => s + Number(r.platform_fee || 0), 0);
  const onlineDrivers = drivers.filter(d => d.is_online).length;
  const openDisputes = disputes.filter(d => d.status === 'open' || d.status === 'investigating').length;

  const statusColor = (s: string) => {
    switch (s) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'accepted': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'requested': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-white/10 text-white/70';
    }
  };

  const exportDrivers = () => downloadCSV('noire-drivers', toCSV(filteredDrivers, [
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'license_plate', label: 'Plate' },
    { label: 'Vehicle', key: 'vehicle_make', get: d => `${d.vehicle_year ?? ''} ${d.vehicle_make ?? ''} ${d.vehicle_model ?? ''}`.trim() },
    { key: 'is_approved', label: 'Approved' },
    { key: 'is_active', label: 'Active' },
    { key: 'rating_average', label: 'Rating' },
    { key: 'total_rides', label: 'Rides' },
    { key: 'total_earnings', label: 'Earnings' },
  ]));

  const exportRides = () => downloadCSV('noire-rides', toCSV(filteredRides, [
    { label: 'Driver', key: 'driver_id', get: r => r.driver_id ? driverMap[r.driver_id] || r.driver_id : '—' },
    { key: 'pickup_address', label: 'Pickup' },
    { key: 'dropoff_address', label: 'Dropoff' },
    { key: 'estimated_distance_miles', label: 'Miles' },
    { key: 'actual_fare', label: 'Fare' },
    { key: 'platform_fee', label: 'Platform Fee' },
    { key: 'driver_payout', label: 'Driver Payout' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created' },
  ]));

  const exportPayouts = () => downloadCSV('noire-payouts', toCSV(payouts, [
    { label: 'Driver', key: 'driver_id', get: p => driverMap[p.driver_id] || p.driver_id },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Method' },
    { key: 'reference', label: 'Reference' },
    { key: 'notes', label: 'Notes' },
    { key: 'paid_at', label: 'Paid At' },
  ]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Noire Rideshare</h2>
        <p className="text-white/60 text-sm">Drivers, rides, payouts, pricing, and disputes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Drivers</CardDescription>
              <Users className="h-4 w-4 text-mansagold" />
            </div>
            <CardTitle className="text-2xl text-white">{drivers.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">{onlineDrivers} online · {drivers.filter(d => d.is_approved).length} approved</CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Rides</CardDescription>
              <Car className="h-4 w-4 text-mansagold" />
            </div>
            <CardTitle className="text-2xl text-white">{rides.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">All-time rides</CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Realized Fees</CardDescription>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-white">{fmt(realizedFees)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">Platform fees (completed)</CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Total GMV</CardDescription>
              <DollarSign className="h-4 w-4 text-mansagold" />
            </div>
            <CardTitle className="text-2xl text-white">{fmt(totalGmv)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">{openDisputes} open disputes</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto">
          <TabsTrigger value="applications">
            Applications ({drivers.filter(d => ['submitted','under_review'].includes(d.application_status || '')).length})
          </TabsTrigger>
          <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
          <TabsTrigger value="rides">Rides ({rides.length})</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="disputes">Disputes ({openDisputes})</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        {/* APPLICATIONS */}
        <TabsContent value="applications" className="mt-4 space-y-3">
          <div className="text-xs text-white/50">
            Click any driver to review documents, approve, reject, or suspend.
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Vehicle</TableHead>
                  <TableHead className="text-white/70">Submitted</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70 text-right">Review</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {drivers.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-white/50 py-8">No driver applications yet.</TableCell></TableRow>
                  ) : drivers
                      .slice()
                      .sort((a, b) => {
                        const order = ['submitted', 'under_review', 'approved', 'rejected', 'suspended', 'draft'];
                        return (order.indexOf(a.application_status || 'draft')) - (order.indexOf(b.application_status || 'draft'));
                      })
                      .map(d => (
                    <TableRow key={d.id} className="border-white/10 cursor-pointer hover:bg-white/5" onClick={() => setOpenDriverId(d.id)}>
                      <TableCell className="text-white font-medium">
                        {d.full_name || '—'}
                        <div className="text-xs text-white/50">{d.email || d.phone}</div>
                      </TableCell>
                      <TableCell className="text-white/70 text-sm">
                        {[d.vehicle_year, d.vehicle_make, d.vehicle_model].filter(Boolean).join(' ') || '—'}
                      </TableCell>
                      <TableCell className="text-white/50 text-xs">
                        {d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[(d.application_status || 'draft') as DriverApplicationStatus]}>
                          {(d.application_status || 'draft').replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-mansagold hover:bg-mansagold/10">
                          <FileCheck className="h-4 w-4 mr-1" /> Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DRIVERS */}
        <TabsContent value="drivers" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input placeholder="Search name, email, phone, plate…" value={driverSearch} onChange={e => setDriverSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white" />
            </div>
            <select value={driverStatus} onChange={e => setDriverStatus(e.target.value as any)} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm">
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="text-xs text-white/50 ml-auto">{filteredDrivers.length} of {drivers.length}</div>
            <Button size="sm" variant="outline" onClick={exportDrivers}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Vehicle</TableHead>
                  <TableHead className="text-white/70">Plate</TableHead>
                  <TableHead className="text-white/70">Rating</TableHead>
                  <TableHead className="text-white/70">Rides</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-white/50 py-8">No drivers match.</TableCell></TableRow>
                  ) : filteredDrivers.map(d => (
                    <TableRow key={d.id} className="border-white/10">
                      <TableCell className="text-white font-medium">
                        {d.full_name || '—'}
                        <div className="text-xs text-white/50">{d.email || d.phone}</div>
                      </TableCell>
                      <TableCell className="text-white/70 text-sm">{[d.vehicle_year, d.vehicle_color, d.vehicle_make, d.vehicle_model].filter(Boolean).join(' ') || '—'}</TableCell>
                      <TableCell className="text-white/70 font-mono text-xs">{d.license_plate || '—'}</TableCell>
                      <TableCell className="text-white/70">{d.rating_average ? `${Number(d.rating_average).toFixed(2)}★` : '—'}</TableCell>
                      <TableCell className="text-white/70">{d.total_rides ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {d.is_approved
                            ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-fit">Approved</Badge>
                            : <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 w-fit">Pending</Badge>}
                          {d.is_online && <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 w-fit text-xs">Online</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" title={d.is_approved ? 'Unapprove' : 'Approve'} onClick={() => toggleDriver(d.id, 'is_approved', !d.is_approved)} className="h-8 w-8 p-0 text-blue-300 hover:bg-blue-500/10">
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title={d.is_active ? 'Deactivate' : 'Activate'} onClick={() => toggleDriver(d.id, 'is_active', !d.is_active)} className={`h-8 w-8 p-0 hover:bg-white/10 ${d.is_active ? 'text-green-300' : 'text-white/40'}`}>
                            <Power className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RIDES */}
        <TabsContent value="rides" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input placeholder="Search pickup, dropoff, payment ID…" value={rideSearch} onChange={e => setRideSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white" />
            </div>
            <select value={rideStatus} onChange={e => setRideStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm">
              <option value="all">All Status</option>
              <option value="requested">Requested</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="text-xs text-white/50 ml-auto">{filteredRides.length} of {rides.length}</div>
            <Button size="sm" variant="outline" onClick={exportRides}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-white/10">
                  <TableHead className="text-white/70">Driver</TableHead>
                  <TableHead className="text-white/70">Route</TableHead>
                  <TableHead className="text-white/70">Miles</TableHead>
                  <TableHead className="text-white/70">Fare</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70">Created</TableHead>
                  <TableHead className="text-white/70 text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredRides.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-white/50 py-8">No rides match.</TableCell></TableRow>
                  ) : filteredRides.slice(0, 200).map(r => (
                    <TableRow key={r.id} className="border-white/10">
                      <TableCell className="text-white text-sm">{r.driver_id ? driverMap[r.driver_id] || r.driver_id.slice(0, 8) : '—'}</TableCell>
                      <TableCell className="text-white/70 text-xs max-w-[280px] truncate">{r.pickup_address} → {r.dropoff_address}</TableCell>
                      <TableCell className="text-white/70">{r.estimated_distance_miles ? Number(r.estimated_distance_miles).toFixed(1) : '—'}</TableCell>
                      <TableCell className="text-white/70">{fmt(Number(r.actual_fare || r.estimated_fare || 0))}</TableCell>
                      <TableCell><Badge variant="outline" className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                      <TableCell className="text-white/50 text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {!['cancelled', 'completed'].includes(r.status) && (
                            <Button size="sm" variant="ghost" className="text-red-300 hover:bg-red-500/10 h-8 px-2 text-xs" onClick={() => { setRideAction({ ride: r, type: 'cancel' }); }}>Cancel</Button>
                          )}
                          {r.status === 'completed' && r.payment_intent_id && (
                            <Button size="sm" variant="ghost" className="text-yellow-300 hover:bg-yellow-500/10 h-8 px-2 text-xs" onClick={() => { setRideAction({ ride: r, type: 'refund' }); setActionAmount(String(r.actual_fare || '')); }}>Refund</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYOUTS */}
        <TabsContent value="payouts" className="mt-4 space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-white text-lg">Owed by Driver</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-white/10">
                  <TableHead className="text-white/70">Driver</TableHead>
                  <TableHead className="text-white/70">Owed</TableHead>
                  <TableHead className="text-white/70 text-right">Action</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {Object.entries(driverOwedMap).filter(([, v]) => v > 0.01).sort((a, b) => b[1] - a[1]).map(([id, amt]) => {
                    const d = drivers.find(x => x.id === id);
                    return (
                      <TableRow key={id} className="border-white/10">
                        <TableCell className="text-white">{d?.full_name || id.slice(0, 8)}<div className="text-xs text-white/50">{d?.email}</div></TableCell>
                        <TableCell className="text-mansagold font-semibold">{fmt(amt)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => { setPayDriver(d!); setPayAmount(amt.toFixed(2)); }}>Mark Paid</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {Object.values(driverOwedMap).filter(v => v > 0.01).length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-white/50 py-8">All caught up.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">Payout History</CardTitle>
              <Button size="sm" variant="outline" onClick={exportPayouts}><Download className="h-4 w-4 mr-1" />Export</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-white/10">
                  <TableHead className="text-white/70">Driver</TableHead>
                  <TableHead className="text-white/70">Amount</TableHead>
                  <TableHead className="text-white/70">Method</TableHead>
                  <TableHead className="text-white/70">Reference</TableHead>
                  <TableHead className="text-white/70">Paid</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {payouts.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-white/50 py-8">No payouts yet.</TableCell></TableRow>
                    : payouts.map(p => (
                      <TableRow key={p.id} className="border-white/10">
                        <TableCell className="text-white">{driverMap[p.driver_id] || p.driver_id.slice(0, 8)}</TableCell>
                        <TableCell className="text-white">{fmt(p.amount)}</TableCell>
                        <TableCell className="text-white/70">{p.method || '—'}</TableCell>
                        <TableCell className="text-white/70 font-mono text-xs">{p.reference || '—'}</TableCell>
                        <TableCell className="text-white/50 text-xs">{new Date(p.paid_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PRICING */}
        <TabsContent value="pricing" className="mt-4">
          <Card className="bg-white/5 border-white/10 max-w-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Settings2 className="h-5 w-5" /> Pricing Configuration</CardTitle>
              <CardDescription>Adjust fare math live. Changes apply to new rides immediately.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricingForm && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">Base Fare ($)</Label>
                      <Input type="number" step="0.01" value={pricingForm.base_fare} onChange={e => setPricingForm({ ...pricingForm, base_fare: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label className="text-white/70">Minimum Fare ($)</Label>
                      <Input type="number" step="0.01" value={pricingForm.minimum_fare} onChange={e => setPricingForm({ ...pricingForm, minimum_fare: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label className="text-white/70">Per Mile ($)</Label>
                      <Input type="number" step="0.01" value={pricingForm.per_mile_rate} onChange={e => setPricingForm({ ...pricingForm, per_mile_rate: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label className="text-white/70">Per Minute ($)</Label>
                      <Input type="number" step="0.01" value={pricingForm.per_minute_rate} onChange={e => setPricingForm({ ...pricingForm, per_minute_rate: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label className="text-white/70">Surge Multiplier</Label>
                      <Input type="number" step="0.05" value={pricingForm.surge_multiplier} onChange={e => setPricingForm({ ...pricingForm, surge_multiplier: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label className="text-white/70">Platform Fee (%)</Label>
                      <Input type="number" step="0.5" value={pricingForm.platform_fee_pct} onChange={e => setPricingForm({ ...pricingForm, platform_fee_pct: Number(e.target.value) })} />
                    </div>
                  </div>
                  <Button onClick={savePricing} className="bg-mansagold text-slate-900 hover:bg-mansagold/90">Save Pricing</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DISPUTES */}
        <TabsContent value="disputes" className="mt-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow className="border-white/10">
                  <TableHead className="text-white/70">Filed</TableHead>
                  <TableHead className="text-white/70">Ride</TableHead>
                  <TableHead className="text-white/70">Reason</TableHead>
                  <TableHead className="text-white/70">Status</TableHead>
                  <TableHead className="text-white/70 text-right">Action</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {disputes.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center text-white/50 py-8">No disputes filed.</TableCell></TableRow>
                    : disputes.map(d => (
                      <TableRow key={d.id} className="border-white/10">
                        <TableCell className="text-white/50 text-xs">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-white/70 font-mono text-xs">{d.ride_id.slice(0, 8)}</TableCell>
                        <TableCell className="text-white">
                          {d.reason}
                          {d.description && <div className="text-xs text-white/50 mt-1 max-w-md truncate">{d.description}</div>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            d.status === 'open' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                              d.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                d.status === 'resolved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                  'bg-white/10 text-white/60'
                          }>{d.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!['resolved', 'dismissed'].includes(d.status) && (
                            <Button size="sm" variant="outline" onClick={() => { setResolveDispute(d); setResolveNotes(d.resolution_notes || ''); }}>Resolve</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTING */}
        <TabsContent value="reporting" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Label className="text-white/70 text-sm">Range:</Label>
            <select value={reportRange} onChange={e => setReportRange(Number(e.target.value) as any)} className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-sm">
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
              <option value={0}>All time</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10"><CardHeader className="pb-2"><CardDescription className="text-white/60">GMV</CardDescription><CardTitle className="text-2xl text-white">{fmt(reportingStats.gmv)}</CardTitle></CardHeader></Card>
            <Card className="bg-white/5 border-white/10"><CardHeader className="pb-2"><CardDescription className="text-white/60">Avg Fare</CardDescription><CardTitle className="text-2xl text-white">{fmt(reportingStats.avgFare)}</CardTitle></CardHeader></Card>
            <Card className="bg-white/5 border-white/10"><CardHeader className="pb-2"><CardDescription className="text-white/60">Cancel Rate</CardDescription><CardTitle className="text-2xl text-white">{reportingStats.cancelRate.toFixed(1)}%</CardTitle></CardHeader></Card>
            <Card className="bg-white/5 border-white/10"><CardHeader className="pb-2"><CardDescription className="text-white/60">Platform Fees</CardDescription><CardTitle className="text-2xl text-white">{fmt(reportingStats.fees)}</CardTitle></CardHeader></Card>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-white text-lg">Revenue Over Time</CardTitle></CardHeader>
            <CardContent style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportingStats.series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="gmv" stroke="#FFB300" strokeWidth={2} />
                  <Line type="monotone" dataKey="fees" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-white text-lg">Top Drivers by Payout</CardTitle></CardHeader>
              <CardContent style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportingStats.topDrivers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={100} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Bar dataKey="payout" fill="#FFB300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-white text-lg">Ride Status Breakdown</CardTitle></CardHeader>
              <CardContent style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={reportingStats.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {reportingStats.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ride Action Dialog */}
      <Dialog open={!!rideAction} onOpenChange={o => !o && setRideAction(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader><DialogTitle>{rideAction?.type === 'refund' ? 'Refund Ride' : 'Cancel Ride'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {rideAction?.type === 'refund' && (
              <div>
                <Label className="text-white/70">Refund Amount ($)</Label>
                <Input type="number" step="0.01" value={actionAmount} onChange={e => setActionAmount(e.target.value)} />
              </div>
            )}
            <div>
              <Label className="text-white/70">Reason</Label>
              <Textarea value={actionReason} onChange={e => setActionReason(e.target.value)} placeholder="Why is this happening?" />
            </div>
            {rideAction?.type === 'refund' && (
              <p className="text-xs text-yellow-300 flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> Sends a REAL refund to the rider's card via Stripe.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRideAction(null)}>Close</Button>
            <Button onClick={performRideAction} disabled={actionLoading} className="bg-red-600 hover:bg-red-700">{actionLoading ? 'Processing…' : 'Confirm'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payout Dialog */}
      <Dialog open={!!payDriver} onOpenChange={o => !o && setPayDriver(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader><DialogTitle>Mark Payout Paid — {payDriver?.full_name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-white/70">Amount ($)</Label><Input type="number" step="0.01" value={payAmount} onChange={e => setPayAmount(e.target.value)} /></div>
            <div><Label className="text-white/70">Method</Label><Input value={payMethod} onChange={e => setPayMethod(e.target.value)} placeholder="ACH, Stripe, Zelle…" /></div>
            <div><Label className="text-white/70">Reference</Label><Input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Transaction ID" /></div>
            <div><Label className="text-white/70">Notes</Label><Textarea value={payNotes} onChange={e => setPayNotes(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayDriver(null)}>Cancel</Button>
            <Button onClick={recordPayout} className="bg-mansagold text-slate-900 hover:bg-mansagold/90">Record Payout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Resolution Dialog */}
      <Dialog open={!!resolveDispute} onOpenChange={o => !o && setResolveDispute(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader><DialogTitle>Resolve Dispute</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-white/70">
              <div className="font-semibold text-white">{resolveDispute?.reason}</div>
              {resolveDispute?.description && <div className="mt-1">{resolveDispute.description}</div>}
            </div>
            <div>
              <Label className="text-white/70">Status</Label>
              <select value={resolveStatus} onChange={e => setResolveStatus(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white">
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            <div><Label className="text-white/70">Resolution Notes</Label><Textarea value={resolveNotes} onChange={e => setResolveNotes(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResolveDispute(null)}>Cancel</Button>
            <Button onClick={submitDisputeResolution} className="bg-mansagold text-slate-900 hover:bg-mansagold/90">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DriverDetailDrawer
        driverId={openDriverId}
        open={!!openDriverId}
        onClose={() => setOpenDriverId(null)}
        onChanged={loadAll}
      />
    </div>
  );
};

export default NoireRideshareAdmin;
