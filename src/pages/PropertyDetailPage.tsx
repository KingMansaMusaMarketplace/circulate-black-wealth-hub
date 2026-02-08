
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vacationRentalService, calculatePricing } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PropertyReview, PricingBreakdown as PricingBreakdownType } from '@/types/vacation-rental';
import PropertyGallery from '@/components/vacation-rentals/PropertyGallery';
import AmenitiesList from '@/components/vacation-rentals/AmenitiesList';
import PricingBreakdown from '@/components/vacation-rentals/PricingBreakdown';
import GuestCounter from '@/components/vacation-rentals/GuestCounter';
import PropertyReviewsComponent from '@/components/stays/PropertyReviews';
import { useVacationBooking } from '@/hooks/useVacationBooking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Calendar as CalendarIcon,
  Share2,
  Heart,
  Shield,
  Zap,
  Clock,
  ChevronLeft,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Stripe public key from environment
const stripePromise = loadStripe('pk_test_51L0Q0QGpXkZjXvXKjMxwLmRqKqZzPvnLlJQhzNHJZXkqZRvRlMkJqLqMzNkJLqRvMkJLqRvMkJLqRvMkJLqRv');

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, loading: bookingLoading } = useVacationBooking();

  const [property, setProperty] = useState<VacationProperty | null>(null);
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0, pets: 0 });
  const [pricing, setPricing] = useState<PricingBreakdownType | null>(null);
  
  // Booking dialog state
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  useEffect(() => {
    if (property && dateRange?.from && dateRange?.to) {
      const calculatedPricing = calculatePricing(
        property,
        dateRange.from,
        dateRange.to,
        guests.pets
      );
      setPricing(calculatedPricing);
    } else {
      setPricing(null);
    }
  }, [property, dateRange, guests.pets]);

  useEffect(() => {
    if (user) {
      setGuestName(user.user_metadata?.full_name || '');
      setGuestEmail(user.email || '');
    }
  }, [user]);

  const loadProperty = async (propertyId: string) => {
    setLoading(true);
    try {
      const [propertyData, reviewsData] = await Promise.all([
        vacationRentalService.fetchPropertyById(propertyId),
        vacationRentalService.fetchPropertyReviews(propertyId),
      ]);
      setProperty(propertyData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please log in to book this property');
      navigate('/login', { state: { from: `/stays/${id}` } });
      return;
    }

    if (!dateRange?.from || !dateRange?.to || !pricing) {
      toast.error('Please select your check-in and check-out dates');
      return;
    }

    setShowBookingDialog(true);
  };

  const handleConfirmBooking = async () => {
    if (!property || !dateRange?.from || !dateRange?.to || !pricing) return;

    setProcessingPayment(true);
    try {
      const result = await createBooking({
        propertyId: property.id,
        checkInDate: format(dateRange.from, 'yyyy-MM-dd'),
        checkOutDate: format(dateRange.to, 'yyyy-MM-dd'),
        numGuests: guests.adults + guests.children,
        numPets: guests.pets,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      });

      if (result.success && result.clientSecret) {
        // For now, show success - in production you'd integrate Stripe Elements
        toast.success('Booking created! Redirecting to payment...');
        // In a real implementation, you'd show Stripe payment form here
        // For MVP, we redirect to a success page or show payment confirmation
        navigate('/my-bookings', { 
          state: { 
            bookingId: result.booking?.id,
            message: 'Booking created successfully!' 
          }
        });
      } else {
        toast.error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    } finally {
      setProcessingPayment(false);
      setShowBookingDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-[400px] w-full rounded-xl mb-6 bg-slate-800" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-2/3 bg-slate-800" />
              <Skeleton className="h-6 w-1/3 bg-slate-800" />
              <Skeleton className="h-32 w-full bg-slate-800" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Property not found</h1>
          <p className="text-white/60 mb-6">
            This property may have been removed or is no longer available.
          </p>
          <Button onClick={() => navigate('/stays')} className="bg-mansagold text-black hover:bg-mansagold/90">
            Browse other properties
          </Button>
        </div>
      </div>
    );
  }

  const nights = dateRange?.from && dateRange?.to
    ? differenceInDays(dateRange.to, dateRange.from)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-4 text-white hover:text-white hover:bg-white/10"
            onClick={() => navigate('/stays')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to search
          </Button>

        {/* Photo Gallery */}
        <PropertyGallery photos={property.photos} title={property.title} />

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}, {property.state}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-mansagold text-mansagold" />
                      <span className="font-medium text-white">
                        {property.average_rating > 0 ? property.average_rating.toFixed(1) : 'New'}
                      </span>
                      {property.review_count > 0 && (
                        <span>({property.review_count} reviews)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {property.is_verified && (
                  <Badge className="bg-mansagold text-black">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Host
                  </Badge>
                )}
                {property.is_instant_book && (
                  <Badge variant="secondary">
                    <Zap className="w-3 h-3 mr-1" />
                    Instant Book
                  </Badge>
                )}
                {property.pets_allowed && (
                  <Badge variant="outline">🐾 Pet Friendly</Badge>
                )}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Property Stats */}
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white/60" />
                <span>{property.max_guests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-white/60" />
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-white/60" />
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white/60" />
                <span>Check-in: {property.check_in_time}</span>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">About this place</h2>
              <p className="text-white/70 whitespace-pre-line">
                {property.description || 'No description provided.'}
              </p>
            </div>

            <Separator className="bg-white/10" />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Amenities</h2>
              <AmenitiesList amenities={property.amenities} variant="grid" />
            </div>

            {/* House Rules */}
            {property.house_rules && (
              <>
                <Separator className="bg-white/10" />
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">House Rules</h2>
                  <p className="text-white/70 whitespace-pre-line">
                    {property.house_rules}
                  </p>
                </div>
              </>
            )}

            <Separator className="bg-white/10" />

            {/* Reviews Section */}
            <div className="pt-4">
              <PropertyReviewsComponent propertyId={id!} />
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 bg-slate-900/80 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between text-white">
                  <div>
                    <span className="text-2xl font-bold text-mansagold">
                      ${property.base_nightly_rate.toLocaleString()}
                    </span>
                    <span className="text-white/60 text-base font-normal">
                      {' '}/ night
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-mansagold text-mansagold" />
                    <span className="font-medium">
                      {property.average_rating > 0 ? property.average_rating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal border-white/20 bg-slate-800/50',
                          !dateRange && 'text-white/60'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                            </>
                          ) : (
                            format(dateRange.from, 'MMM d, yyyy')
                          )
                        ) : (
                          <span>Select dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Counter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Guests</label>
                  <GuestCounter
                    value={guests}
                    onChange={setGuests}
                    maxGuests={property.max_guests}
                    petsAllowed={property.pets_allowed}
                  />
                </div>

                {/* Pricing Breakdown */}
                {pricing && nights > 0 && (
                  <>
                    <Separator className="bg-white/10" />
                    <PricingBreakdown pricing={pricing} />
                  </>
                )}

                {/* Book Button */}
                <Button
                  className="w-full bg-mansablue hover:bg-mansablue/90"
                  size="lg"
                  onClick={handleBookNow}
                  disabled={!dateRange?.from || !dateRange?.to || bookingLoading || processingPayment}
                >
                  {bookingLoading || processingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {property.is_instant_book ? 'Reserve Now' : 'Request to Book'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-white/50">
                  You won't be charged yet
                </p>

                {/* Min/Max nights */}
                <div className="text-xs text-white/50 space-y-1">
                  <p>Minimum stay: {property.min_nights} night{property.min_nights !== 1 ? 's' : ''}</p>
                  {property.max_nights < 365 && (
                    <p>Maximum stay: {property.max_nights} nights</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Confirmation Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-md bg-slate-900 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Your Booking</DialogTitle>
              <DialogDescription className="text-white/60">
                {property.title} • {nights} night{nights !== 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Booking Summary */}
              <div className="p-4 bg-slate-800 rounded-lg border border-white/10">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Check-in</span>
                  <span className="font-medium text-white">
                    {dateRange?.from && format(dateRange.from, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Check-out</span>
                  <span className="font-medium text-white">
                    {dateRange?.to && format(dateRange.to, 'MMM d, yyyy')}
                  </span>
                </div>
                <Separator className="my-2 bg-white/10" />
                <div className="flex justify-between font-semibold text-white">
                  <span>Total</span>
                  <span className="text-mansagold">${pricing?.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Guest Information */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="guestName" className="text-white">Full Name</Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="bg-slate-800 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail" className="text-white">Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="bg-slate-800 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="guestPhone" className="text-white">Phone (optional)</Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="bg-slate-800 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="specialRequests" className="text-white">Special Requests (optional)</Label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Early check-in, late checkout, etc."
                    rows={3}
                    className="bg-slate-800 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Platform Fee Notice */}
              <p className="text-xs text-white/50 text-center">
                A 7.5% platform fee helps support Black-owned businesses
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowBookingDialog(false)}
                disabled={processingPayment}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-mansagold hover:bg-mansagold/90 text-black"
                onClick={handleConfirmBooking}
                disabled={processingPayment || !guestName || !guestEmail}
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
