import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, QrCode } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

interface QRPaymentButtonProps {
  businessId: string;
  qrCodeId?: string;
  amount: number;
  description?: string;
  onSuccess?: () => void;
}

export const QRPaymentButton = ({
  businessId,
  qrCodeId,
  amount,
  description = 'Purchase',
  onSuccess
}: QRPaymentButtonProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to make a purchase',
          variant: 'destructive'
        });
        return;
      }

      // Call edge function to create payment intent with commission
      const { data, error } = await supabase.functions.invoke('process-qr-transaction', {
        body: {
          businessId,
          qrCodeId,
          amount,
          description,
          customerEmail: user.email
        }
      });

      if (error) throw error;

      if (!data.success || !data.clientSecret) {
        throw new Error(data.error || 'Failed to create payment');
      }

      toast({
        title: 'Commission Calculated',
        description: `Platform fee: $${data.commission.amount.toFixed(2)} (${data.commission.rate}%)`,
      });

      // Load Stripe and redirect to checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
      if (!stripe) throw new Error('Failed to load Stripe');

      // You can either use confirmPayment or redirect to a checkout page
      // For now, showing success with commission details
      toast({
        title: 'Payment Ready',
        description: `Business receives: $${data.commission.businessReceives.toFixed(2)}`,
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={processing}
      className="w-full"
    >
      {processing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <QrCode className="mr-2 h-4 w-4" />
          Pay ${amount.toFixed(2)} (7.5% commission)
        </>
      )}
    </Button>
  );
};
