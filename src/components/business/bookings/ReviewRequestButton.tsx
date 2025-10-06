import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReviewRequestButtonProps {
  bookingId: string;
  customerEmail: string;
  bookingStatus: string;
}

export const ReviewRequestButton: React.FC<ReviewRequestButtonProps> = ({
  bookingId,
  customerEmail,
  bookingStatus
}) => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendReviewRequest = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-review-request', {
        body: { bookingId }
      });

      if (error) throw error;

      toast({
        title: 'Review request sent',
        description: `Email sent to ${customerEmail}`,
      });
    } catch (error: any) {
      console.error('Error sending review request:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send review request',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  // Only show for completed bookings
  if (bookingStatus !== 'completed') {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSendReviewRequest}
      disabled={sending}
    >
      {sending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Mail className="mr-2 h-4 w-4" />
          Request Review
        </>
      )}
    </Button>
  );
};