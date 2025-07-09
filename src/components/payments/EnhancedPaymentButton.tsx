
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { enhancedSubscriptionService } from '@/lib/services/enhanced-subscription-service';
import { toast } from 'sonner';

interface PaymentButtonProps {
  userType: 'customer' | 'business' | 'corporate';
  tier: string;
  email: string;
  name: string;
  businessName?: string;
  price: string;
  features: string[];
  isCurrentPlan?: boolean;
  onSuccess?: () => void;
}

const EnhancedPaymentButton: React.FC<PaymentButtonProps> = ({
  userType,
  tier,
  email,
  name,
  businessName,
  price,
  features,
  isCurrentPlan = false,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    if (isCurrentPlan) {
      toast.info('This is your current plan');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      const result = await enhancedSubscriptionService.createCheckoutSession({
        userType,
        email,
        name,
        businessName,
        tier
      });

      if (result.success && result.url) {
        // Open checkout in new tab
        window.open(result.url, '_blank');
        setPaymentStatus('success');
        toast.success('Redirecting to secure checkout...');
        onSuccess?.();
      } else {
        throw new Error(result.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setLoading(false);
      // Reset status after 3 seconds
      setTimeout(() => setPaymentStatus('idle'), 3000);
    }
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Redirected to Checkout
        </>
      );
    }

    if (paymentStatus === 'error') {
      return (
        <>
          <AlertCircle className="h-4 w-4 mr-2" />
          Try Again
        </>
      );
    }

    if (isCurrentPlan) {
      return 'Current Plan';
    }

    return (
      <>
        <CreditCard className="h-4 w-4 mr-2" />
        Subscribe - {price}
      </>
    );
  };

  const getButtonVariant = () => {
    if (paymentStatus === 'error') return 'destructive';
    if (paymentStatus === 'success') return 'default';
    if (isCurrentPlan) return 'outline';
    return 'default';
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize">{tier} Plan</h3>
          {isCurrentPlan && <Badge variant="default">Current</Badge>}
        </div>
        <p className="text-2xl font-bold text-mansablue">{price}</p>
      </div>
      
      <ul className="space-y-1 text-sm text-gray-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      
      <Button
        onClick={handlePayment}
        disabled={loading || isCurrentPlan}
        variant={getButtonVariant()}
        className="w-full"
      >
        {getButtonContent()}
      </Button>
    </div>
  );
};

export default EnhancedPaymentButton;
