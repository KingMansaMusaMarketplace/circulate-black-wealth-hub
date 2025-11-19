
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import SubscriptionPlansWithToggle from '@/components/subscription/SubscriptionPlansWithToggle';
import SubscriptionPageHeader from '@/components/subscription/SubscriptionPageHeader';
import AuthenticationNotice from '@/components/subscription/AuthenticationNotice';
import CurrentSubscriptionStatus from '@/components/subscription/CurrentSubscriptionStatus';
import SubscriptionBenefits from '@/components/subscription/SubscriptionBenefits';
import SubscriptionFAQ from '@/components/subscription/SubscriptionFAQ';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { IOSPaymentBlocker } from '@/components/platform/IOSPaymentBlocker';
import { shouldHideStripePayments } from '@/utils/platform-utils';

const SubscriptionPage: React.FC = () => {
  console.log('[SUBSCRIPTION PAGE] Loading dark theme version - 2025-11-19');
  
  const { user } = useAuth();
  const { subscriptionInfo, openCustomerPortal } = useSubscription();
  const [searchParams] = useSearchParams();
  
  const suggestedTier = searchParams.get('tier');
  const isTrialMode = searchParams.get('trial') === 'true';
  const isIOS = shouldHideStripePayments();
  
  const currentTier = (subscriptionInfo?.subscription_tier as SubscriptionTier) || 'free';
  
  // Determine user type based on profile or suggested tier
  const userType = user?.user_metadata?.user_type || 
    (suggestedTier === 'business_starter' || suggestedTier === 'business' ? 'business' : 'customer');

  // On iOS, show a simple free access message
  if (isIOS) {
    return (
      <div className="min-h-screen relative">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>
        
        <Helmet>
          <title>Welcome | Mansa Musa Marketplace</title>
        </Helmet>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Welcome to Mansa Musa Marketplace
              </h1>
              <p className="text-xl text-slate-300">
                Your gateway to supporting Black-owned businesses
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-lg p-8 text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-white">
                Full Access Included
              </h2>
              <p className="text-lg text-slate-300">
                All features are available to you at no cost. Start discovering and supporting Black-owned businesses today!
              </p>
              
              <div className="bg-slate-900/60 rounded-lg p-6 text-left space-y-3">
                <h3 className="font-semibold text-lg text-mansagold mb-4">What You Can Do:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-mansagold text-xl">✓</span>
                    <span className="text-slate-300">Browse and discover businesses near you</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-mansagold text-xl">✓</span>
                    <span className="text-slate-300">Earn loyalty points on every purchase</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-mansagold text-xl">✓</span>
                    <span className="text-slate-300">Redeem points for exclusive rewards</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-mansagold text-xl">✓</span>
                    <span className="text-slate-300">Access member-only deals and events</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-mansagold text-xl">✓</span>
                    <span className="text-slate-300">Connect with the community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      
      <Helmet>
        <title>Subscription Plans | Mansa Musa Marketplace</title>
      </Helmet>

      <IOSPaymentBlocker>
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
          {userType === 'customer' ? (
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-mansagold mb-4">You're All Set! 🎉</h2>
                <p className="text-lg text-slate-300 mb-6">
                  Your account is <span className="font-bold text-mansagold">100% FREE FOREVER</span> with all features included!
                </p>
                <div className="bg-slate-900/60 rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-lg mb-4 text-white">Your Free Benefits:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-mansagold mr-3">✓</span>
                      <span className="text-slate-300">Browse and discover Black-owned businesses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-mansagold mr-3">✓</span>
                      <span className="text-slate-300">Earn loyalty points on every purchase</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-mansagold mr-3">✓</span>
                      <span className="text-slate-300">Redeem points for exclusive rewards</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-mansagold mr-3">✓</span>
                      <span className="text-slate-300">Access member-only deals and discounts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-mansagold mr-3">✓</span>
                      <span className="text-slate-300">Join mentorship and networking programs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-mansagold mr-3">✓</span>
                      <span className="text-slate-300">Support community economic growth</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-slate-400 mt-6">
                  No payment required. No credit card needed. Just pure support for the community! 💚
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-mansablue mb-4">Business Plans</h2>
                <p className="text-gray-600">
                  All business plans include a 30-day free trial to get you started
                </p>
              </div>

              <SubscriptionPlansWithToggle currentTier={currentTier} userType={userType} />
            </div>
          )}

          {/* FAQ Section */}
          <SubscriptionFAQ userType={userType} />
          </div>
        </div>
      </IOSPaymentBlocker>
    </div>
  );
};

export default SubscriptionPage;
