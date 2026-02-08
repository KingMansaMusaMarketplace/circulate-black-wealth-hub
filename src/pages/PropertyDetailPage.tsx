
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { vacationRentalService, calculatePricing } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PropertyReview, PricingBreakdown as PricingBreakdownType } from '@/types/vacation-rental';
import PropertyGallery from '@/components/vacation-rentals/PropertyGallery';
import AmenitiesList from '@/components/vacation-rentals/AmenitiesList';
import PricingBreakdown from '@/components/vacation-rentals/PricingBreakdown';
import GuestCounter from '@/components/vacation-rentals/GuestCounter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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
  ChevronRight,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/AuthContext';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState<VacationProperty | null>(null);
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0, pets: 0 });
  const [pricing, setPricing] = useState<PricingBreakdownType | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const handleBookNow = async () => {
    if (!user) {
      toast.error('Please log in to book this property');
      navigate('/login', { state: { from: `/stays/${id}` } });
      return;
    }

    if (!dateRange?.from || !dateRange?.to || !pricing) {
      toast.error('Please select your check-in and check-out dates');
      return;
    }

    setBookingLoading(true);
    try {
      // TODO: Implement booking creation with Stripe
      toast.success('Booking functionality coming soon!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-[400px] w-full rounded-xl mb-6" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <p className="text-muted-foreground mb-6">
            This property may have been removed or is no longer available.
          </p>
          <Button onClick={() => navigate('/stays')}>
            Browse other properties
          </Button>
        </div>
      </Layout>
    );
  }

  const nights = dateRange?.from && dateRange?.to
    ? differenceInDays(dateRange.to, dateRange.from)
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-4"
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
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}, {property.state}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-mansagold text-mansagold" />
                      <span className="font-medium text-foreground">
                        {property.average_rating > 0 ? property.average_rating.toFixed(1) : 'New'}
                      </span>
                      {property.review_count > 0 && (
                        <span>({property.review_count} reviews)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
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

            <Separator />

            {/* Property Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span>{property.max_guests} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-muted-foreground" />
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-muted-foreground" />
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span>Check-in: {property.check_in_time}</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description || 'No description provided.'}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <AmenitiesList amenities={property.amenities} variant="grid" />
            </div>

            {/* House Rules */}
            {property.house_rules && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {property.house_rules}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to stay here!
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg">👤</span>
                        </div>
                        <div>
                          <p className="font-medium">{review.guest_name || 'Guest'}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'MMM yyyy')}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Star className="w-4 h-4 fill-mansagold text-mansagold" />
                          <span className="font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.review_text}</p>
                      {review.host_response && (
                        <div className="mt-3 pl-4 border-l-2 border-muted">
                          <p className="text-sm font-medium">Host response:</p>
                          <p className="text-sm text-muted-foreground">{review.host_response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      ${property.base_nightly_rate.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-base font-normal">
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
                  <label className="text-sm font-medium">Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !dateRange && 'text-muted-foreground'
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
                  <label className="text-sm font-medium">Guests</label>
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
                    <Separator />
                    <PricingBreakdown pricing={pricing} />
                  </>
                )}

                {/* Book Button */}
                <Button
                  className="w-full bg-mansablue hover:bg-mansablue/90"
                  size="lg"
                  onClick={handleBookNow}
                  disabled={!dateRange?.from || !dateRange?.to || bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : 
                   property.is_instant_book ? 'Reserve Now' : 'Request to Book'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged yet
                </p>

                {/* Min/Max nights */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Minimum stay: {property.min_nights} night{property.min_nights !== 1 ? 's' : ''}</p>
                  {property.max_nights < 365 && (
                    <p>Maximum stay: {property.max_nights} nights</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetailPage;
