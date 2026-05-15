import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Home, Calendar, DollarSign, CheckCircle2, Loader2, Eye, ShieldCheck, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PropertyDetailDialog from './mansa-stays/PropertyDetailDialog';

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

const MansaStaysAdmin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadData = async () => {
    const [{ data: p }, { data: b }] = await Promise.all([
      supabase.from('vacation_properties').select('*').order('created_at', { ascending: false }),
      supabase.from('vacation_bookings').select('*').order('created_at', { ascending: false }),
    ]);
    setProperties((p as Property[]) ?? []);
    setBookings((b as Booking[]) ?? []);
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
        </TabsList>

        <TabsContent value="properties" className="mt-4">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-white/50 py-8">No properties yet.</TableCell></TableRow>
                  ) : properties.map(p => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="mt-4">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-white/50 py-8">No bookings yet.</TableCell></TableRow>
                  ) : bookings.map(b => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MansaStaysAdmin;
