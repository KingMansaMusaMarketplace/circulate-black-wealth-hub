import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VacationProperty, PricingBreakdown } from '@/types/vacation-rental';
import { calculatePricing } from '@/lib/services/vacation-rental-service';
import { toast } from 'sonner';

interface BookingData {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  numGuests: number;
  numPets: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  specialRequests?: string;
}

interface BookingResult {
  success: boolean;
  booking?: {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    total: number;
    status: string;
  };
  url?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  pricing?: {
    nightlyRate: number;
    nights: number;
    subtotal: number;
    cleaningFee: number;
    petFee: number;
    platformFee: number;
    total: number;
    hostPayout: number;
  };
  error?: string;
}

export function useVacationBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (data: BookingData): Promise<BookingResult> => {
    setLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        'create-vacation-booking',
        {
          body: data,
        }
      );

      if (fnError) {
        throw new Error(fnError.message || 'Failed to create booking');
      }

      if (!result.success) {
        throw new Error(result.error || 'Booking failed');
      }

      // Redirect to Stripe Checkout if URL is provided
      if (result.url) {
        window.open(result.url, '_blank');
        toast.success('Redirecting to payment...');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const calculateBookingPrice = (
    property: VacationProperty,
    checkIn: Date,
    checkOut: Date,
    numPets: number = 0
  ): PricingBreakdown => {
    return calculatePricing(property, checkIn, checkOut, numPets);
  };

  const confirmPayment = async (
    clientSecret: string,
    paymentMethod: string
  ): Promise<{ success: boolean; error?: string }> => {
    // This would be called after Stripe Elements processes the payment
    // The actual payment confirmation happens on the client side with Stripe.js
    try {
      // Update booking status after successful payment
      // This is handled by the webhook or can be done here
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      return { success: false, error: errorMessage };
    }
  };

  return {
    createBooking,
    calculateBookingPrice,
    confirmPayment,
    loading,
    error,
  };
}

export default useVacationBooking;
