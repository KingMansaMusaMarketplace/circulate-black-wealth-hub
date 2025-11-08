import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { shouldHideStripePayments } from '@/utils/platform-utils';

interface IOSPaymentBlockerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Blocks payment-related UI on iOS to comply with Apple's IAP guidelines (Guideline 3.1.1)
 * Shows fallback message on iOS, renders children on other platforms
 */
export const IOSPaymentBlocker: React.FC<IOSPaymentBlockerProps> = ({ 
  children, 
  fallback 
}) => {
  const hidePayments = shouldHideStripePayments();

  if (hidePayments) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Alert className="my-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Payment Features Unavailable</AlertTitle>
        <AlertDescription>
          Payment and subscription features are not available in the iOS app.
          Please visit our website to manage subscriptions and payments.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
