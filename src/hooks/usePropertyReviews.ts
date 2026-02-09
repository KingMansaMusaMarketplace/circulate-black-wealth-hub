import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewableBooking {
  id: string;
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  property_title?: string;
  hasReview: boolean;
}

interface UsePropertyReviewsOptions {
  propertyId?: string;
}

export function usePropertyReviews(options: UsePropertyReviewsOptions = {}) {
  const { propertyId } = options;
  const { user } = useAuth();
  const [reviewableBookings, setReviewableBookings] = useState<ReviewableBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && propertyId) {
      checkReviewEligibility();
    } else {
      setLoading(false);
      setCanReview(false);
    }
  }, [user, propertyId]);

  const checkReviewEligibility = async () => {
    if (!user || !propertyId) return;

    setLoading(true);
    try {
      // Fetch completed bookings for this property by the user
      const { data: bookings, error: bookingsError } = await supabase
        .from('vacation_bookings')
        .select('id, property_id, check_in_date, check_out_date')
        .eq('guest_id', user.id)
        .eq('property_id', propertyId)
        .eq('status', 'completed')
        .order('check_out_date', { ascending: false });

      if (bookingsError) throw bookingsError;

      if (!bookings || bookings.length === 0) {
        setCanReview(false);
        setReviewableBookings([]);
        return;
      }

      // Check which bookings already have reviews
      const bookingIds = bookings.map(b => b.id);
      const { data: existingReviews, error: reviewsError } = await supabase
        .from('property_reviews')
        .select('booking_id')
        .eq('guest_id', user.id)
        .in('booking_id', bookingIds);

      if (reviewsError) throw reviewsError;

      const reviewedBookingIds = new Set(existingReviews?.map(r => r.booking_id) || []);

      const reviewable = bookings.map(booking => ({
        id: booking.id,
        property_id: booking.property_id,
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        hasReview: reviewedBookingIds.has(booking.id),
      }));

      setReviewableBookings(reviewable);

      // Find first booking without a review
      const unreviewedBooking = reviewable.find(b => !b.hasReview);
      setCanReview(!!unreviewedBooking);
      setPendingBookingId(unreviewedBooking?.id || null);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshEligibility = () => {
    checkReviewEligibility();
  };

  return {
    canReview,
    pendingBookingId,
    reviewableBookings,
    loading,
    refreshEligibility,
  };
}
