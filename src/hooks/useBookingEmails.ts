import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useBookingEmails() {
  const [isSending, setIsSending] = useState(false);

  const sendBookingConfirmation = async (bookingId: string) => {
    setIsSending(true);
    try {
      // Send customer email
      const { error: customerError } = await supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId, recipientType: 'customer' }
      });

      if (customerError) {
        console.error('Error sending customer email:', customerError);
        toast.error('Failed to send customer confirmation email');
      }

      // Send business email
      const { error: businessError } = await supabase.functions.invoke('send-booking-confirmation', {
        body: { bookingId, recipientType: 'business' }
      });

      if (businessError) {
        console.error('Error sending business email:', businessError);
        toast.error('Failed to send business confirmation email');
      }

      if (!customerError && !businessError) {
        toast.success('Confirmation emails sent successfully');
      }
    } catch (error) {
      console.error('Error sending booking emails:', error);
      toast.error('Failed to send confirmation emails');
    } finally {
      setIsSending(false);
    }
  };

  const sendCancellationEmail = async (bookingId: string) => {
    setIsSending(true);
    try {
      // Send customer email
      const { error: customerError } = await supabase.functions.invoke('send-booking-cancellation', {
        body: { bookingId, recipientType: 'customer' }
      });

      if (customerError) {
        console.error('Error sending customer cancellation email:', customerError);
      }

      // Send business email
      const { error: businessError } = await supabase.functions.invoke('send-booking-cancellation', {
        body: { bookingId, recipientType: 'business' }
      });

      if (businessError) {
        console.error('Error sending business cancellation email:', businessError);
      }

      if (!customerError && !businessError) {
        toast.success('Cancellation emails sent');
      }
    } catch (error) {
      console.error('Error sending cancellation emails:', error);
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendBookingConfirmation,
    sendCancellationEmail,
    isSending
  };
}
