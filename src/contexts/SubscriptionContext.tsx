
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end?: string;
}

interface SubscriptionContextType {
  subscription: any;
  loading: boolean;
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

const SubscriptionProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ensure component is properly mounted before proceeding
    setIsInitialized(true);
  }, []);

  const refreshSubscription = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual subscription refresh logic
      console.log('Refreshing subscription...');
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      // TODO: Implement customer portal logic
      console.log('Opening customer portal...');
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  const value = {
    subscription,
    loading,
    subscriptionInfo,
    isLoading: loading,
    refreshSubscription,
    openCustomerPortal,
  };

  // Don't render children until properly initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const SubscriptionProvider = SubscriptionProviderComponent;

export default SubscriptionProvider;
