import React, { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { AlertTriangle, Clock, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * Sticky top banner that surfaces payment issues, expiring trials, and cancellations.
 * Hidden on iOS native per Apple compliance (no payment UI rule).
 */
export const SubscriptionAlertBanner: React.FC = () => {
  const { subscriptionInfo, openCustomerPortal } = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (shouldHideStripePayments() || dismissed || !subscriptionInfo) return null;

  const status = subscriptionInfo.status;
  const trialEnd = subscriptionInfo.trial_end;
  const subEnd = subscriptionInfo.subscription_end;
  const now = Date.now();

  // 1. Payment failed
  if (status === 'past_due' || status === 'unpaid' || status === 'incomplete') {
    return (
      <Banner
        tone="danger"
        icon={<AlertTriangle className="h-4 w-4" />}
        message="Your payment failed. Update your card to keep access to Kayla AI."
        actionLabel="Update Payment"
        onAction={openCustomerPortal}
        onDismiss={() => setDismissed(true)}
      />
    );
  }

  // 2. Trial ending in <= 3 days
  if (status === 'trialing' && trialEnd) {
    const daysLeft = Math.ceil((new Date(trialEnd).getTime() - now) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3 && daysLeft >= 0) {
      return (
        <Banner
          tone="warning"
          icon={<Clock className="h-4 w-4" />}
          message={`Your free trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Add a payment method to keep access.`}
          actionLabel="Manage Subscription"
          onAction={openCustomerPortal}
          onDismiss={() => setDismissed(true)}
        />
      );
    }
  }

  // 3. Canceled but still in active period
  if (status === 'canceled' && subEnd && new Date(subEnd).getTime() > now) {
    const endDate = new Date(subEnd).toLocaleDateString();
    return (
      <Banner
        tone="info"
        icon={<XCircle className="h-4 w-4" />}
        message={`Subscription canceled. Access ends on ${endDate}.`}
        actionLabel="Reactivate"
        href="/pricing"
        onDismiss={() => setDismissed(true)}
      />
    );
  }

  return null;
};

interface BannerProps {
  tone: 'danger' | 'warning' | 'info';
  icon: React.ReactNode;
  message: string;
  actionLabel: string;
  onAction?: () => void | Promise<void>;
  href?: string;
  onDismiss: () => void;
}

const TONE_CLASSES: Record<BannerProps['tone'], string> = {
  danger: 'bg-destructive text-destructive-foreground',
  warning: 'bg-amber-500/95 text-black',
  info: 'bg-primary text-primary-foreground',
};

const Banner: React.FC<BannerProps> = ({ tone, icon, message, actionLabel, onAction, href, onDismiss }) => (
  <div className={`${TONE_CLASSES[tone]} w-full px-4 py-2 flex items-center justify-center gap-3 text-sm shadow-md`}>
    <span className="flex items-center gap-2 flex-1 justify-center text-center">
      {icon}
      <span>{message}</span>
    </span>
    <div className="flex items-center gap-2">
      {href ? (
        <Link to={href}>
          <Button size="sm" variant="secondary" className="h-7 text-xs">
            {actionLabel}
          </Button>
        </Link>
      ) : (
        <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className="opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default SubscriptionAlertBanner;
