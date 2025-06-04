
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { subscriptionService, SubscriptionInfo } from '@/lib/services/subscription-service';

interface SubscriptionContextType {
  subscriptionInfo: SubscriptionInfo | null;
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
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscriptionInfo(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await subscriptionService.checkSubscription();
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
      const { url } = await subscriptionService.createCustomerPortalSession();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      toast.error('Failed to open subscription management portal');
    }
  };

  // Refresh subscription when user changes
  useEffect(() => {
    refreshSubscription();
    
    // Set up periodic refresh
    const intervalId = setInterval(refreshSubscription, 60000); // every minute
    
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
