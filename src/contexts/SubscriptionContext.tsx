
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, SubscriptionInfo } from '@/lib/services/subscription-service';
import { unifiedSubscriptionService, UnifiedSubscriptionInfo } from '@/lib/services/unified-subscription-service';

interface SubscriptionContextType {
  subscriptionInfo: UnifiedSubscriptionInfo | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<UnifiedSubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscriptionInfo(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await unifiedSubscriptionService.checkAllSubscriptions();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
      toast.error('Failed to update subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setIsLoading(true);
      
      // Only open Stripe customer portal if the active subscription is from Stripe
      if (subscriptionInfo?.source === 'stripe') {
        const { url } = await subscriptionService.createCustomerPortalSession();
        window.open(url, '_blank');
      } else {
        // For Apple subscriptions, direct users to the App Store
        toast.info('To manage your App Store subscription, please go to Settings > Apple ID > Subscriptions on your device.');
      }
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      toast.error('Failed to open subscription management portal');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh subscription when user changes
  useEffect(() => {
    if (user) {
      refreshSubscription();
    } else {
      setSubscriptionInfo(null);
    }
    
    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(() => {
      if (user) {
        refreshSubscription();
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(intervalId);
  }, [user]);

  const value = {
    subscriptionInfo,
    isLoading,
    refreshSubscription,
    openCustomerPortal
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
