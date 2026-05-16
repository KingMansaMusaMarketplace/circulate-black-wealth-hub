import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plane, Hotel, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

type TripType = 'airport_pickup' | 'airport_dropoff' | 'hotel_pickup' | 'hotel_dropoff' | 'hotel_to_hotel';

const TRIP_LABELS: Record<TripType, string> = {
  airport_pickup: 'Airport → Hotel (pick me up at the airport)',
  airport_dropoff: 'Hotel → Airport (drop me off at the airport)',
  hotel_pickup: 'Hotel pickup (downtown ride)',
  hotel_dropoff: 'Drop off at a hotel',
  hotel_to_hotel: 'Hotel ↔ Hotel transfer',
};

const BookRidePage: React.FC = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    trip_type: 'airport_pickup' as TripType,
    pickup_address: '',
    dropoff_address: '',
    scheduled_for: '',
    flight_number: '',
    hotel_name_freeform: '',
    passenger_count: 1,
    luggage_count: 1,
    meet_and_greet: false,
    special_instructions: '',
  });

  // Minimum 2 hours from now
  const minDateTime = (() => {
    const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  })();

  const isAirport = form.trip_type === 'airport_pickup' || form.trip_type === 'airport_dropoff';
  const isHotel = form.trip_type !== 'airport_pickup' || true; // hotel is involved in every trip

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to book a ride.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('noire_scheduled_rides').insert({
      rider_user_id: user.id,
      pickup_address: form.pickup_address,
      dropoff_address: form.dropoff_address,
      scheduled_for: new Date(form.scheduled_for).toISOString(),
      status: 'pending',
      trip_type: form.trip_type,
      flight_number: form.flight_number || null,
      hotel_name_freeform: form.hotel_name_freeform || null,
      passenger_count: form.passenger_count,
      luggage_count: form.luggage_count,
      meet_and_greet: form.meet_and_greet,
      special_instructions: form.special_instructions || null,
      notes: form.special_instructions || null,
    });
    setSubmitting(false);
    if (error) return toast.error('Booking failed: ' + error.message);
    setSubmitted(true);
    toast.success('Booking received. We\'ll confirm your driver shortly.');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle2 className="h-16 w-16 text-mansagold mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Booking received</h1>
          <p className="text-white/60 mb-8">
            Your scheduled ride for {new Date(form.scheduled_for).toLocaleString()} has been booked.
            We'll text you when a driver is assigned.
          </p>
          <Button asChild className="bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl">
            <Link to="/noir">Back to Noire</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Book a Ride | Noire — Airport & Hotel Transport</title>
        <meta name="description" content="Schedule a premium Black-owned airport or hotel ride in Chicago. Flight tracking, meet-and-greet, vetted drivers." />
      </Helmet>

      <section className="pt-24 pb-12">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Book your <span className="text-mansagold">scheduled ride</span></h1>
            <p className="text-white/60">Premium hotel and airport transport. Pickups confirmed at least 2 hours in advance.</p>
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className="text-white">Trip type *</Label>
                  <Select value={form.trip_type} onValueChange={(v) => setForm({ ...form, trip_type: v as TripType })}>
                    <SelectTrigger className="bg-black/40 border-white/10 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      {Object.entries(TRIP_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k} className="text-white">{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Pickup date & time *</Label>
                  <Input
                    type="datetime-local"
                    required
                    min={minDateTime}
                    value={form.scheduled_for}
                    onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })}
                    className="bg-black/40 border-white/10 text-white mt-1"
                  />
                  <p className="text-xs text-white/40 mt-1">Earliest pickup: 2 hours from now.</p>
                </div>

                <div>
                  <Label className="text-white flex items-center gap-2">Pickup address *</Label>
                  <Input
                    required
                    placeholder={form.trip_type === 'airport_pickup' ? 'e.g. O\'Hare Terminal 2, ORD' : 'Hotel name or street address'}
                    value={form.pickup_address}
                    onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
                    className="bg-black/40 border-white/10 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-white">Drop-off address *</Label>
                  <Input
                    required
                    placeholder={form.trip_type === 'airport_dropoff' ? 'e.g. O\'Hare (ORD) or Midway (MDW)' : 'Hotel name or street address'}
                    value={form.dropoff_address}
                    onChange={(e) => setForm({ ...form, dropoff_address: e.target.value })}
                    className="bg-black/40 border-white/10 text-white mt-1"
                  />
                </div>

                {isAirport && (
                  <div>
                    <Label className="text-white flex items-center gap-2"><Plane className="h-4 w-4 text-mansagold" /> Flight number (optional)</Label>
                    <Input
                      placeholder="e.g. AA 1234 — helps your driver track delays"
                      value={form.flight_number}
                      onChange={(e) => setForm({ ...form, flight_number: e.target.value })}
                      className="bg-black/40 border-white/10 text-white mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-white flex items-center gap-2"><Hotel className="h-4 w-4 text-mansagold" /> Hotel name (if applicable)</Label>
                  <Input
                    placeholder="e.g. The Robey, Sable at Navy Pier"
                    value={form.hotel_name_freeform}
                    onChange={(e) => setForm({ ...form, hotel_name_freeform: e.target.value })}
                    className="bg-black/40 border-white/10 text-white mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white">Passengers</Label>
                    <Input type="number" min={1} max={8} value={form.passenger_count} onChange={(e) => setForm({ ...form, passenger_count: Number(e.target.value) })} className="bg-black/40 border-white/10 text-white mt-1" />
                  </div>
                  <div>
                    <Label className="text-white">Luggage</Label>
                    <Input type="number" min={0} max={10} value={form.luggage_count} onChange={(e) => setForm({ ...form, luggage_count: Number(e.target.value) })} className="bg-black/40 border-white/10 text-white mt-1" />
                  </div>
                </div>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-mansagold/5 border border-mansagold/20 cursor-pointer">
                  <Checkbox
                    checked={form.meet_and_greet}
                    onCheckedChange={(v) => setForm({ ...form, meet_and_greet: !!v })}
                    className="mt-1 border-mansagold/50"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Add meet-and-greet (+$15)</div>
                    <div className="text-xs text-white/60">Driver meets you inside the terminal with a sign — perfect for airport arrivals.</div>
                  </div>
                </label>

                <div>
                  <Label className="text-white">Special instructions</Label>
                  <Textarea
                    rows={3}
                    placeholder="Car seat needed, large suitcase, specific terminal entrance, etc."
                    value={form.special_instructions}
                    onChange={(e) => setForm({ ...form, special_instructions: e.target.value })}
                    className="bg-black/40 border-white/10 text-white mt-1"
                  />
                </div>

                {!user && (
                  <p className="text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    You'll need to sign in to confirm your booking.
                  </p>
                )}

                <Button type="submit" disabled={submitting || !user} className="w-full bg-mansagold hover:bg-amber-500 text-black font-bold rounded-xl h-12 text-lg">
                  {submitting ? 'Booking…' : 'Confirm booking'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BookRidePage;
