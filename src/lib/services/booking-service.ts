import { supabase } from '@/integrations/supabase/client';

export interface BookingService {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  booking_date: string;
  duration_minutes: number;
  amount: number;
  platform_fee: number;
  business_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_intent_id: string | null;
  stripe_charge_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingParams {
  businessId: string;
  serviceId: string;
  bookingDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
}

export interface CreateBookingResult {
  success: boolean;
  booking?: Booking;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

export const bookingService = {
  async getBusinessServices(businessId: string): Promise<BookingService[]> {
    try {
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching business services:', error);
      throw error;
    }
  },

  async createBooking(params: CreateBookingParams): Promise<CreateBookingResult> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('create-booking', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: params,
      });

      if (error) throw error;

      // Send confirmation emails in the background
      if (data.success && data.booking) {
        this.sendConfirmationEmails(data.booking.id);
      }

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async sendConfirmationEmails(bookingId: string): Promise<void> {
    try {
      // Send emails without awaiting to not block the response
      supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId, recipientType: 'customer' }
      });
      
      supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId, recipientType: 'business' }
      });
    } catch (error) {
      console.error('Error sending confirmation emails:', error);
      // Don't throw - email failures shouldn't fail the booking
    }
  },

  async getCustomerBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          business_services(name, description),
          businesses(business_name, logo_url)
        `)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw error;
    }
  },

  async getBusinessBookings(businessId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          business_services(name, description),
          profiles(full_name, email)
        `)
        .eq('business_id', businessId)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching business bookings:', error);
      throw error;
    }
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Send cancellation emails in the background
      this.sendCancellationEmails(bookingId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  async sendCancellationEmails(bookingId: string): Promise<void> {
    try {
      // Send emails without awaiting to not block the response
      supabase.functions.invoke('send-booking-cancellation', {
        body: { bookingId, recipientType: 'customer' }
      });
      
      supabase.functions.invoke('send-booking-cancellation', {
        body: { bookingId, recipientType: 'business' }
      });
    } catch (error) {
      console.error('Error sending cancellation emails:', error);
      // Don't throw - email failures shouldn't fail the cancellation
    }
  },

  async updateBookingStatus(
    bookingId: string,
    status: Booking['status']
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
};
