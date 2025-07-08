
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import SubscriptionPlansWithToggle from '@/components/subscription/SubscriptionPlansWithToggle';
import SubscriptionPageHeader from '@/components/subscription/SubscriptionPageHeader';
import AuthenticationNotice from '@/components/subscription/AuthenticationNotice';
import CurrentSubscriptionStatus from '@/components/subscription/CurrentSubscriptionStatus';
import SubscriptionBenefits from '@/components/subscription/SubscriptionBenefits';
import SubscriptionFAQ from '@/components/subscription/SubscriptionFAQ';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { subscriptionInfo, openCustomerPortal } = useSubscription();
  const [searchParams] = useSearchParams();
  
  const suggestedTier = searchParams.get('tier');
  const isTrialMode = searchParams.get('trial') === 'true';
  
  const currentTier = (subscriptionInfo?.subscription_tier as SubscriptionTier) || 'free';
  
  // Determine user type based on profile or suggested tier
  const userType = user?.user_metadata?.user_type || 
    (suggestedTier === 'business_starter' || suggestedTier === 'business' ? 'business' : 'customer');

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Subscription Plans | Mansa Musa Marketplace</title>
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Section */}
          <SubscriptionPageHeader userType={userType} isTrialMode={isTrialMode} />

          {/* Authentication Notice */}
          {!user && <AuthenticationNotice />}

          {/* Current Subscription Status */}
          {user && subscriptionInfo && (
            <CurrentSubscriptionStatus
              currentTier={currentTier}
              subscriptionEnd={subscriptionInfo.subscription_end}
              isSubscribed={subscriptionInfo.subscribed}
              onManageSubscription={openCustomerPortal}
            />
          )}

          {/* Benefits Section */}
          <SubscriptionBenefits userType={userType} />

          {/* Subscription Plans */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-mansablue mb-4">
                {userType === 'business' ? 'Business Plans' : 'Choose Your Plan'}
              </h2>
              <p className="text-gray-600">
                {userType === 'business' 
                  ? 'All business plans include a 30-day free trial to get you started'
                  : 'All plans include our core features to support Black-owned businesses'
                }
              </p>
            </div>

            <SubscriptionPlansWithToggle currentTier={currentTier} userType={userType} />
          </div>

          {/* FAQ Section */}
          <SubscriptionFAQ userType={userType} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
