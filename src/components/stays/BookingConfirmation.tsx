import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Home,
  Clock,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface BookingDetails {
  id: string;
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_pets: number;
  total_price: number;
  status: string;
  property?: {
    title: string;
    address: string;
    city: string;
    state: string;
    photos: string[];
    check_in_time: string;
    check_out_time: string;
    host_id: string;
  };
}

const BookingConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    } else {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('vacation_bookings')
        .select(`
          *,
          vacation_properties (
            title, address, city, state, photos, 
            check_in_time, check_out_time, host_id
          )
        `)
        .eq('id', bookingId)
        .single();

      if (fetchError) throw fetchError;

      setBooking({
        ...data,
        property: data.vacation_properties,
      });

      // Update status to confirmed if still pending (payment succeeded)
      if (data.status === 'pending') {
        await supabase
          .from('vacation_bookings')
          .update({ status: 'confirmed', payment_status: 'paid' })
          .eq('id', bookingId);
      }
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mansablack flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-mansablack flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-white/10 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">{error || 'Booking not found'}</p>
            <Button onClick={() => navigate('/stays')}>
              Back to Stays
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkIn = new Date(booking.check_in_date);
  const checkOut = new Date(booking.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-mansablack py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-white/60">
            Your reservation has been confirmed. Check your email for details.
          </p>
        </div>

        {/* Property Card */}
        <Card className="bg-slate-800/50 border-white/10 overflow-hidden">
          {booking.property?.photos?.[0] && (
            <div className="h-48 overflow-hidden">
              <img 
                src={booking.property.photos[0]} 
                alt={booking.property.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {booking.property?.title}
            </h2>
            <div className="flex items-center gap-1 text-white/60 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{booking.property?.city}, {booking.property?.state}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Check-in</span>
                </div>
                <p className="text-white font-medium">
                  {format(checkIn, 'EEE, MMM d, yyyy')}
                </p>
                <p className="text-white/50 text-sm">
                  After {booking.property?.check_in_time || '3:00 PM'}
                </p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Check-out</span>
                </div>
                <p className="text-white font-medium">
                  {format(checkOut, 'EEE, MMM d, yyyy')}
                </p>
                <p className="text-white/50 text-sm">
                  Before {booking.property?.check_out_time || '11:00 AM'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 text-white/70">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{booking.num_guests} guest{booking.num_guests > 1 ? 's' : ''}</span>
              </div>
              {booking.num_pets > 0 && (
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  <span>{booking.num_pets} pet{booking.num_pets > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="bg-slate-800/50 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Total Paid</span>
              <span className="text-2xl font-bold text-mansagold">
                ${booking.total_price?.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/stays/messages')}
            variant="outline"
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Host
          </Button>
          <Button 
            onClick={() => navigate('/stays/my-trips')}
            className="flex-1 bg-mansagold text-black hover:bg-mansagold/90"
          >
            View My Trips
          </Button>
        </div>

        {/* Confirmation Number */}
        <p className="text-center text-white/40 text-sm">
          Confirmation #{booking.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
