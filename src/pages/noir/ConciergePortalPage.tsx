import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Plane, Hotel } from 'lucide-react';
import { toast } from 'sonner';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { getMyConciergeMemberships } from '@/lib/api/noir-hotel-partners-api';

interface Membership {
  id: string;
  role: string;
  hotel_partner_id: string;
}

interface HotelRide {
  id: string;
  scheduled_for: string;
  pickup_address: string;
  dropoff_address: string;
  trip_type: string;
  guest_name: string | null;
  guest_room_number: string | null;
  flight_number: string | null;
  status: string;
}

const ConciergePortalPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string>('');
  const [rides, setRides] = useState<HotelRide[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    guest_name: '', guest_room_number: '',
    trip_type: 'airport_dropoff', pickup_address: '', dropoff_address: '',
    scheduled_for: '', flight_number: '', passenger_count: 1, luggage_count: 1,
    meet_and_greet: false, special_instructions: '',
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await getMyConciergeMemberships(user.id);
      const mems = (data as Membership[] | null) ?? [];
      setMemberships(mems);
      if (mems[0]) {
        setHotelId(mems[0].hotel_partner_id);
        const { data: hotel } = await supabase
          .from('noir_hotel_partners')
          .select('hotel_name')
          .eq('id', mems[0].hotel_partner_id)
          .maybeSingle();
        setHotelName(hotel?.hotel_name || 'Your hotel');
      }
      setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    if (!hotelId) return;
    supabase
      .from('noire_scheduled_rides')
      .select('id, scheduled_for, pickup_address, dropoff_address, trip_type, guest_name, guest_room_number, flight_number, status')
      .eq('hotel_partner_id', hotelId)
      .gte('scheduled_for', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('scheduled_for')
      .then(({ data }) => setRides((data as HotelRide[] | null) ?? []));
  }, [hotelId, showForm]);

  if (isLoading || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-mansagold" /></div>;
  }
  if (!user) return <Navigate to="/login?redirect=/noir/concierge" replace />;

  if (memberships.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-3">No concierge access yet</h1>
          <p className="text-white/60 mb-6">Your account isn't linked to a Noire hotel partner. If your hotel just signed up, an admin will activate your access shortly.</p>
          <Button asChild className="bg-mansagold text-black"><Link to="/noir/hotels">Apply to partner</Link></Button>
        </div>
      </div>
    );
  }

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId || !user) return;
    const { error } = await supabase.from('noire_scheduled_rides').insert({
      rider_user_id: user.id,
      hotel_partner_id: hotelId,
      booked_by_concierge_id: user.id,
      pickup_address: form.pickup_address,
      dropoff_address: form.dropoff_address,
      scheduled_for: new Date(form.scheduled_for).toISOString(),
      status: 'pending',
      trip_type: form.trip_type as 'airport_dropoff',
      flight_number: form.flight_number || null,
      passenger_count: form.passenger_count,
      luggage_count: form.luggage_count,
      meet_and_greet: form.meet_and_greet,
      guest_name: form.guest_name || null,
      guest_room_number: form.guest_room_number || null,
      special_instructions: form.special_instructions || null,
      notes: `Guest: ${form.guest_name} · Room: ${form.guest_room_number}`,
    });
    if (error) return toast.error(error.message);
    toast.success('Booking created');
    setShowForm(false);
    setForm({ ...form, guest_name: '', guest_room_number: '', pickup_address: '', dropoff_address: '', scheduled_for: '', flight_number: '', special_instructions: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <Helmet><title>Concierge Portal | {hotelName} — Noire</title></Helmet>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{hotelName}</h1>
            <p className="text-white/50 text-sm">Concierge Portal · Noire Rideshare</p>
          </div>
          <Button onClick={() => setShowForm(s => !s)} className="bg-mansagold text-black font-bold">
            <Plus className="h-4 w-4 mr-1" /> Book ride for guest
          </Button>
        </div>

        {showForm && (
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader><CardTitle className="text-white text-lg">New guest booking</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={submitBooking} className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-white">Guest name *</Label><Input required value={form.guest_name} onChange={e => setForm({...form, guest_name: e.target.value})} className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div><Label className="text-white">Room #</Label><Input value={form.guest_room_number} onChange={e => setForm({...form, guest_room_number: e.target.value})} className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div className="sm:col-span-2"><Label className="text-white">Pickup date & time *</Label><Input type="datetime-local" required value={form.scheduled_for} onChange={e => setForm({...form, scheduled_for: e.target.value})} className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div><Label className="text-white">Pickup address *</Label><Input required value={form.pickup_address} onChange={e => setForm({...form, pickup_address: e.target.value})} placeholder={hotelName} className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div><Label className="text-white">Drop-off address *</Label><Input required value={form.dropoff_address} onChange={e => setForm({...form, dropoff_address: e.target.value})} placeholder="e.g. ORD or MDW" className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div><Label className="text-white">Flight number</Label><Input value={form.flight_number} onChange={e => setForm({...form, flight_number: e.target.value})} className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div className="sm:col-span-2"><Label className="text-white">Notes</Label><Textarea rows={2} value={form.special_instructions} onChange={e => setForm({...form, special_instructions: e.target.value})} className="bg-black/40 border-white/10 text-white mt-1" /></div>
                <div className="sm:col-span-2"><Button type="submit" className="bg-mansagold text-black font-bold w-full">Create booking</Button></div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white text-lg">Today & upcoming pickups</CardTitle></CardHeader>
          <CardContent>
            {rides.length === 0 ? (
              <p className="text-white/50 text-center py-8">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {rides.map(r => (
                  <div key={r.id} className="p-4 rounded-lg bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{r.guest_name || 'Guest'} {r.guest_room_number && <span className="text-white/40 text-sm">· Room {r.guest_room_number}</span>}</div>
                      <div className="text-xs text-white/60 mt-1">{new Date(r.scheduled_for).toLocaleString()}</div>
                      <div className="text-xs text-white/50 mt-1">{r.pickup_address} → {r.dropoff_address}</div>
                      {r.flight_number && <div className="text-xs text-mansagold mt-1 flex items-center gap-1"><Plane className="h-3 w-3" /> {r.flight_number}</div>}
                    </div>
                    <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConciergePortalPage;
