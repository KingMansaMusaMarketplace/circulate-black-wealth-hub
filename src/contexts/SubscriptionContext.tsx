
import React, { createContext, useContext, useState } from 'react';

interface SubscriptionInfo {
  subscription_tier: string;
  status: string;
  current_period_end?: string;
  subscription_end?: string;
  subscribed?: boolean;
}

interface SubscriptionContextType {
  currentTier: string;
  isLoading: boolean;
  subscriptionInfo: SubscriptionInfo | null;
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

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTier] = useState('free');
  const [isLoading] = useState(false);
  const [subscriptionInfo] = useState<SubscriptionInfo | null>({
    subscription_tier: 'free',
    status: 'active',
    subscribed: false
  });

  const refreshSubscription = async () => {
    console.log('Refreshing subscription info');
  };

  const openCustomerPortal = async () => {
    console.log('Opening customer portal');
  };

  const value = {
    currentTier,
    isLoading,
    subscriptionInfo,
    refreshSubscription,
    openCustomerPortal
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
