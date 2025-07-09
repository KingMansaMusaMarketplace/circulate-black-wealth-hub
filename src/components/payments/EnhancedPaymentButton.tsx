
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePayment = async () => {
    if (isCurrentPlan) {
      toast.info('This is your current plan');
      return;
    }

    // Skip payment for free tier
    if (tier === 'free') {
      toast.success('Free plan activated!');
      onSuccess?.();
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      console.log('Creating checkout session for:', { userType, tier, email, name });
      
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
      const errorMsg = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      // Reset status after 5 seconds
      setTimeout(() => {
        setPaymentStatus('idle');
        setErrorMessage('');
      }, 5000);
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
          Opening Checkout...
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

    if (tier === 'free') {
      return 'Select Free Plan';
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
    if (tier === 'free') return 'secondary';
    return 'default';
  };

  const isPopularPlan = tier === 'premium' || tier === 'business_pro';

  return (
    <div className={`relative space-y-4 p-6 border rounded-lg ${isPopularPlan ? 'border-mansablue shadow-lg' : 'border-gray-200'}`}>
      {isPopularPlan && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-mansablue text-white">
          Most Popular
        </Badge>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize">{tier.replace('_', ' ')} Plan</h3>
          {isCurrentPlan && <Badge variant="default">Current</Badge>}
        </div>
        <p className="text-2xl font-bold text-mansablue">{price}</p>
        
        {tier !== 'free' && (
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Shield className="h-3 w-3 mr-1" />
            <span>Secure payment with Stripe</span>
          </div>
        )}
      </div>
      
      <ul className="space-y-2 text-sm text-gray-600">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {errorMessage}
        </div>
      )}
      
      <Button
        onClick={handlePayment}
        disabled={loading || isCurrentPlan}
        variant={getButtonVariant()}
        className="w-full"
      >
        {getButtonContent()}
      </Button>
      
      {tier !== 'free' && (
        <p className="text-xs text-gray-500 text-center">
          Cancel anytime. {tier.includes('business') ? '30-day free trial included.' : 'No commitment.'}
        </p>
      )}
    </div>
  );
};

export default EnhancedPaymentButton;
