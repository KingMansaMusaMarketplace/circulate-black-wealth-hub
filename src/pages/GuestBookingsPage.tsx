import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import {
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  MessageSquare,
  ArrowRight,
  Luggage,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestBooking {
  id: string;
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_nights: number;
  total_price: number;
  status: string;
  created_at: string;
  guest_name?: string;
  guest_email?: string;
  special_requests?: string;
  property?: {
    id: string;
    title: string;
    photos: string[];
    city: string;
    state: string;
    property_type: string;
    host_id: string;
  };
  hasReview?: boolean;
}

const GuestBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<GuestBooking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      // Fetch bookings for the current user
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('vacation_bookings')
        .select('*')
        .eq('guest_id', user.id)
        .order('check_in_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      if (bookingsData && bookingsData.length > 0) {
        // Fetch associated properties
        const propertyIds = [...new Set(bookingsData.map(b => b.property_id))];
        const { data: propertiesData } = await supabase
          .from('vacation_properties')
          .select('id, title, photos, city, state, property_type, host_id')
          .in('id', propertyIds);

        // Fetch reviews to check which bookings have been reviewed
        const { data: reviewsData } = await supabase
          .from('property_reviews')
          .select('booking_id')
          .eq('guest_id', user.id)
          .in('booking_id', bookingsData.map(b => b.id));

        const reviewedBookingIds = new Set(reviewsData?.map(r => r.booking_id) || []);
        const propertyMap = new Map(propertiesData?.map(p => [p.id, p]) || []);

        const enrichedBookings = bookingsData.map(booking => ({
          ...booking,
          property: propertyMap.get(booking.property_id),
          hasReview: reviewedBookingIds.has(booking.id),
        }));

        setBookings(enrichedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const categorizeBookings = () => {
    const now = new Date();
    
    return {
      upcoming: bookings.filter(b => 
        b.status === 'confirmed' && isAfter(parseISO(b.check_in_date), now)
      ),
      current: bookings.filter(b => 
        b.status === 'confirmed' && 
        isBefore(parseISO(b.check_in_date), now) && 
        isAfter(parseISO(b.check_out_date), now)
      ),
      past: bookings.filter(b => 
        (b.status === 'completed' || b.status === 'confirmed') && 
        isBefore(parseISO(b.check_out_date), now)
      ),
      cancelled: bookings.filter(b => b.status === 'cancelled'),
    };
  };

  const openReviewDialog = (booking: GuestBooking) => {
    setSelectedBooking(booking);
    setReviewRating(5);
    setReviewText('');
    setReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selectedBooking || !user) return;

    setSubmittingReview(true);
    try {
      const { error } = await supabase
        .from('property_reviews')
        .insert({
          property_id: selectedBooking.property_id,
          booking_id: selectedBooking.id,
          guest_id: user.id,
          rating: reviewRating,
          review_text: reviewText.trim() || null,
        });

      if (error) throw error;

      toast.success('Thank you for your review!');
      setReviewDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-mansablue/20 text-mansablue border-mansablue/30">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderBookingCard = (booking: GuestBooking, showReviewButton = false) => (
    <Card 
      key={booking.id} 
      className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors cursor-pointer"
      onClick={() => navigate(`/stays/${booking.property_id}`)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Property Image */}
        <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
          {booking.property?.photos?.[0] ? (
            <img
              src={booking.property.photos[0]}
              alt={booking.property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <Home className="w-12 h-12 text-slate-500" />
            </div>
          )}
        </div>

        {/* Booking Details */}
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {booking.property?.title || 'Property'}
                  </h3>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {booking.property?.city}, {booking.property?.state}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(parseISO(booking.check_in_date), 'MMM d')} 
                    <ArrowRight className="w-3 h-3 inline mx-1" />
                    {format(parseISO(booking.check_out_date), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{booking.num_nights} night{booking.num_nights > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Luggage className="w-4 h-4" />
                  <span>{booking.num_guests} guest{booking.num_guests > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
              <div>
                <span className="text-xl font-bold text-white">
                  ${booking.total_price.toLocaleString()}
                </span>
                <span className="text-slate-400 text-sm ml-1">total</span>
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {showReviewButton && !booking.hasReview && booking.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openReviewDialog(booking)}
                    className="border-mansagold text-mansagold hover:bg-mansagold/10"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Leave Review
                  </Button>
                )}
                {booking.hasReview && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Reviewed
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/stays/${booking.property_id}`)}
                >
                  View Property
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  const categorized = categorizeBookings();

  if (loading) {
    return (
      <DashboardLayout title="My Stays" icon={<Luggage className="w-6 h-6" />}>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Stays" icon={<Luggage className="w-6 h-6" />}>
      <div className="space-y-6">
        {/* Current Stay Banner */}
        {categorized.current.length > 0 && (
          <Card className="bg-gradient-to-r from-mansagold/20 to-amber-500/10 border-mansagold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-mansagold" />
                Currently Staying
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categorized.current.map(booking => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{booking.property?.title}</h3>
                    <p className="text-sm text-slate-400">
                      Check-out: {format(parseISO(booking.check_out_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/stays/${booking.property_id}`)}
                    className="bg-mansagold text-black hover:bg-mansagold/90"
                  >
                    View Stay
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="upcoming">
              Upcoming ({categorized.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({categorized.past.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({categorized.cancelled.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {categorized.upcoming.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No upcoming stays</h3>
                  <p className="text-slate-400 text-center mb-4">
                    Ready for your next adventure?
                  </p>
                  <Button
                    onClick={() => navigate('/stays')}
                    className="bg-mansagold text-black hover:bg-mansagold/90"
                  >
                    Browse Vacation Rentals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              categorized.upcoming.map(booking => renderBookingCard(booking))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {categorized.past.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="w-12 h-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No past stays yet</h3>
                  <p className="text-slate-400 text-center">
                    Your completed stays will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              categorized.past.map(booking => renderBookingCard(booking, true))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6 space-y-4">
            {categorized.cancelled.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="w-12 h-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No cancelled bookings</h3>
                  <p className="text-slate-400 text-center">
                    Cancelled reservations will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              categorized.cancelled.map(booking => renderBookingCard(booking))
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Leave a Review</DialogTitle>
              <DialogDescription className="text-slate-400">
                Share your experience at {selectedBooking?.property?.title}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-white mb-2 block">Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'w-8 h-8',
                          star <= reviewRating
                            ? 'fill-mansagold text-mansagold'
                            : 'text-slate-600'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-white mb-2 block">Your Review (optional)</Label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell others about your experience..."
                  className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={submittingReview}
                className="bg-mansagold text-black hover:bg-mansagold/90"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default GuestBookingsPage;
