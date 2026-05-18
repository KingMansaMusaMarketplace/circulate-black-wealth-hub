import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, Calendar, DollarSign, CheckCircle2, Loader2, Eye, ShieldCheck, Power, Settings2, Search, Download, Key, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import PropertyDetailDialog from './mansa-stays/PropertyDetailDialog';
import HostsTab from './mansa-stays/HostsTab';
import PayoutsTab from './mansa-stays/PayoutsTab';
import BookingActionsDialog from './mansa-stays/BookingActionsDialog';
import ReportingTab from './mansa-stays/ReportingTab';
import { toCSV, downloadCSV } from './mansa-stays/csvUtils';

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

interface Property {
  id: string;
  title: string;
  city: string | null;
  state: string | null;
  base_nightly_rate: number | null;
  is_active: boolean;
  is_verified: boolean;
  bedrooms: number | null;
  max_guests: number | null;
  created_at: string;
  listing_mode: string | null;
  monthly_rent: number | null;
  property_type: string | null;
}

interface Booking {
  id: string;
  property_id: string;
  guest_name: string | null;
  guest_email: string | null;
  check_in_date: string;
  check_out_date: string;
  num_nights: number;
  total_amount: number;
  platform_fee: number;
  host_payout: number;
  status: string;
  payout_status: string | null;
  created_at: string;
}

interface LeaseInquiry {
  id: string;
  property_id: string;
  tenant_name: string | null;
  tenant_email: string | null;
  tenant_phone: string | null;
  desired_move_in: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface LeaseAgreement {
  id: string;
  property_id: string;
  tenant_name: string | null;
  tenant_email: string | null;
  lease_start_date: string | null;
  lease_end_date: string | null;
  monthly_rent: number | null;
  status: string;
  fee_amount: number | null;
  fee_charged_at: string | null;
  refund_eligible_until: string | null;
  refunded_at: string | null;
  created_at: string;
}

const MansaStaysAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [leaseInquiries, setLeaseInquiries] = useState<LeaseInquiry[]>([]);
  const [leaseAgreements, setLeaseAgreements] = useState<LeaseAgreement[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = async () => {
    const [{ data: p }, { data: b }, { data: li }, { data: la }] = await Promise.all([
      supabase.from('vacation_properties').select('*').order('created_at', { ascending: false }),
      supabase.from('vacation_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('lease_inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('lease_agreements').select('*').order('created_at', { ascending: false }),
    ]);
    setProperties((p as Property[]) ?? []);
    setBookings((b as Booking[]) ?? []);
    setLeaseInquiries((li as LeaseInquiry[]) ?? []);
    setLeaseAgreements((la as LeaseAgreement[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleField = async (id: string, field: 'is_active' | 'is_verified', value: boolean) => {
    const { error } = await supabase
      .from('vacation_properties')
      .update({ [field]: value })
      .eq('id', id);
    if (error) {
      toast.error('Update failed: ' + error.message);
      return;
    }
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
    toast.success(field === 'is_verified' ? (value ? 'Verified' : 'Unverified') : (value ? 'Activated' : 'Deactivated'));
  };

  const openDetail = (id: string) => {
    setSelectedPropertyId(id);
    setDetailOpen(true);
  };

  // Filters / search
  const [propSearch, setPropSearch] = useState('');
  const [propStatus, setPropStatus] = useState<'all' | 'active' | 'inactive' | 'verified' | 'unverified'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const filteredProperties = useMemo(() => {
    const q = propSearch.trim().toLowerCase();
    return properties.filter(p => {
      if (propStatus === 'active' && !p.is_active) return false;
      if (propStatus === 'inactive' && p.is_active) return false;
      if (propStatus === 'verified' && !p.is_verified) return false;
      if (propStatus === 'unverified' && p.is_verified) return false;
      if (!q) return true;
      return [p.title, p.city, p.state].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [properties, propSearch, propStatus]);

  const filteredBookings = useMemo(() => {
    const q = bookingSearch.trim().toLowerCase();
    return bookings.filter(b => {
      if (bookingStatus !== 'all' && b.status !== bookingStatus) return false;
      if (!q) return true;
      const propTitle = (properties.find(p => p.id === b.property_id)?.title) || '';
      return [b.guest_name, b.guest_email, propTitle].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    });
  }, [bookings, bookingSearch, bookingStatus, properties]);

  const exportProperties = () => {
    downloadCSV('mansa-stays-properties', toCSV(filteredProperties, [
      { key: 'title', label: 'Title' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'bedrooms', label: 'Bedrooms' },
      { key: 'max_guests', label: 'Max Guests' },
      { key: 'base_nightly_rate', label: 'Nightly Rate' },
      { key: 'is_active', label: 'Active' },
      { key: 'is_verified', label: 'Verified' },
      { key: 'created_at', label: 'Created' },
    ]));
  };

  const exportBookings = () => {
    downloadCSV('mansa-stays-bookings', toCSV(filteredBookings, [
      { key: 'guest_name', label: 'Guest' },
      { key: 'guest_email', label: 'Email' },
      { label: 'Property', key: 'property_id', get: b => properties.find(p => p.id === b.property_id)?.title || b.property_id },
      { key: 'check_in_date', label: 'Check In' },
      { key: 'check_out_date', label: 'Check Out' },
      { key: 'num_nights', label: 'Nights' },
      { key: 'total_amount', label: 'Total' },
      { key: 'platform_fee', label: 'Platform Fee' },
      { key: 'host_payout', label: 'Host Payout' },
      { key: 'status', label: 'Status' },
      { key: 'payout_status', label: 'Payout Status' },
      { key: 'created_at', label: 'Created' },
    ]));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  const activeProperties = properties.filter(p => p.is_active).length;
  const verifiedProperties = properties.filter(p => p.is_verified).length;
  const realized = bookings
    .filter(b => ['confirmed', 'completed'].includes(b.status))
    .reduce((sum, b) => sum + Number(b.platform_fee || 0), 0);
  const pendingFees = bookings
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + Number(b.platform_fee || 0), 0);
  const totalGmv = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  const propMap = Object.fromEntries(properties.map(p => [p.id, p.title]));

  const statusColor = (s: string) => {
    switch (s) {
      case 'confirmed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-white/10 text-white/70';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Mansa Stays</h2>
        <p className="text-white/60 text-sm">Vacation rental properties, bookings, and host payouts.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Properties</CardDescription>
              <Home className="h-4 w-4 text-mansagold" />
            </div>
            <CardTitle className="text-2xl text-white">{properties.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">
            {activeProperties} active · {verifiedProperties} verified
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Bookings</CardDescription>
              <Calendar className="h-4 w-4 text-mansagold" />
            </div>
            <CardTitle className="text-2xl text-white">{bookings.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">
            All-time bookings
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Realized Revenue</CardDescription>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-white">{fmt(realized)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">
            Platform fees (confirmed)
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-white/60">Total GMV</CardDescription>
              <DollarSign className="h-4 w-4 text-mansagold" />
            </div>
            <CardTitle className="text-2xl text-white">{fmt(totalGmv)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-white/50">
            {fmt(pendingFees)} pending fees
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="properties">Properties ({properties.length})</TabsTrigger>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="hosts">Hosts</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search title, city, state…"
                value={propSearch}
                onChange={e => setPropSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white"
              />
            </div>
            <select
              value={propStatus}
              onChange={e => setPropStatus(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
            <div className="text-xs text-white/50 ml-auto">{filteredProperties.length} of {properties.length}</div>
            <Button size="sm" variant="outline" onClick={exportProperties}>
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/70">Title</TableHead>
                    <TableHead className="text-white/70">Location</TableHead>
                    <TableHead className="text-white/70">Beds</TableHead>
                    <TableHead className="text-white/70">Nightly</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Verified</TableHead>
                    <TableHead className="text-white/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-white/50 py-8">No properties match.</TableCell></TableRow>
                  ) : filteredProperties.map(p => (
                    <TableRow key={p.id} className="border-white/10">
                      <TableCell className="text-white font-medium">{p.title}</TableCell>
                      <TableCell className="text-white/70">{[p.city, p.state].filter(Boolean).join(', ') || '—'}</TableCell>
                      <TableCell className="text-white/70">{p.bedrooms ?? '—'} bd · {p.max_guests ?? '—'} guests</TableCell>
                      <TableCell className="text-white/70">{fmt(Number(p.base_nightly_rate || 0))}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={p.is_active ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-white/10 text-white/60'}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {p.is_verified ? (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Verified</Badge>
                        ) : <span className="text-white/40 text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            title={p.is_verified ? 'Unverify' : 'Verify'}
                            onClick={() => toggleField(p.id, 'is_verified', !p.is_verified)}
                            className="h-8 w-8 p-0 text-blue-300 hover:bg-blue-500/10"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title={p.is_active ? 'Deactivate' : 'Activate'}
                            onClick={() => toggleField(p.id, 'is_active', !p.is_active)}
                            className={`h-8 w-8 p-0 hover:bg-white/10 ${p.is_active ? 'text-green-300' : 'text-white/40'}`}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View / Edit"
                            onClick={() => openDetail(p.id)}
                            className="h-8 w-8 p-0 text-white/80 hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="bookings" className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search guest, email, property…"
                value={bookingSearch}
                onChange={e => setBookingSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white"
              />
            </div>
            <select
              value={bookingStatus}
              onChange={e => setBookingStatus(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="text-xs text-white/50 ml-auto">{filteredBookings.length} of {bookings.length}</div>
            <Button size="sm" variant="outline" onClick={exportBookings}>
              <Download className="h-4 w-4 mr-1" /> Export CSV
            </Button>
          </div>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/70">Guest</TableHead>
                    <TableHead className="text-white/70">Property</TableHead>
                    <TableHead className="text-white/70">Dates</TableHead>
                    <TableHead className="text-white/70">Total</TableHead>
                    <TableHead className="text-white/70">Platform Fee</TableHead>
                    <TableHead className="text-white/70">Host Payout</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Payout</TableHead>
                    <TableHead className="text-white/70 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center text-white/50 py-8">No bookings match.</TableCell></TableRow>
                  ) : filteredBookings.map(b => (
                    <TableRow key={b.id} className="border-white/10">
                      <TableCell className="text-white">
                        <div className="font-medium">{b.guest_name || '—'}</div>
                        <div className="text-xs text-white/50">{b.guest_email}</div>
                      </TableCell>
                      <TableCell className="text-white/70">{propMap[b.property_id] || b.property_id.slice(0, 8)}</TableCell>
                      <TableCell className="text-white/70 text-xs">
                        {b.check_in_date} → {b.check_out_date}
                        <div className="text-white/40">{b.num_nights} nights</div>
                      </TableCell>
                      <TableCell className="text-white/70">{fmt(Number(b.total_amount))}</TableCell>
                      <TableCell className="text-mansagold">{fmt(Number(b.platform_fee))}</TableCell>
                      <TableCell className="text-white/70">{fmt(Number(b.host_payout))}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(b.status)}>{b.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-white/60">{b.payout_status || 'pending'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Manage booking"
                          onClick={() => { setSelectedBookingId(b.id); setBookingDialogOpen(true); }}
                          className="h-8 w-8 p-0 text-white/80 hover:bg-white/10"
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hosts" className="mt-4">
          <HostsTab />
        </TabsContent>

        <TabsContent value="payouts" className="mt-4">
          <PayoutsTab />
        </TabsContent>

        <TabsContent value="reporting" className="mt-4">
          <ReportingTab />
        </TabsContent>
      </Tabs>

      <PropertyDetailDialog
        propertyId={selectedPropertyId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSaved={loadData}
      />

      <BookingActionsDialog
        bookingId={selectedBookingId}
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        onSaved={loadData}
      />
    </div>
  );
};

export default MansaStaysAdmin;
