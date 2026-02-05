
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
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

  // Handle iOS subscription management deep link
  const handleManageSubscriptions = () => {
    // iOS deep link to subscription management
    window.location.href = "itms-apps://apps.apple.com/account/subscriptions";
  };

  // Handle opening website for subscription
  const handleSubscribeViaWebsite = () => {
    window.open("https://circulate-black-wealth-hub.lovable.app/subscription", "_blank");
  };

  // On iOS, show simplified subscription page with FUNCTIONAL BUTTONS and required legal links
  if (isIOS) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        </div>

        <div className="relative z-10">
          <Helmet>
            <title>Subscription | Mansa Musa Marketplace</title>
          </Helmet>

          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto space-y-8 text-center">
              <h1 className="text-4xl font-bold text-white">Subscription</h1>
              
              <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-lg p-8 space-y-6">
                <div className="text-5xl">✨</div>
                <h2 className="text-2xl font-bold text-white">Community Member</h2>
                <p className="text-slate-300">
                  Consumer features are 100% free to use!
                </p>
                
                {/* Subscription Details - Required for Apple 3.1.2 compliance */}
                <div className="bg-slate-900/60 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-white mb-3">Business Plans Available</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Starter Business (30-day free trial)</span>
                      <span className="text-mansagold">$39/month</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Professional Business (30-day free trial)</span>
                      <span className="text-mansagold">$79/month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Subscriptions auto-renew monthly unless cancelled at least 24 hours before the renewal date.
                    </p>
                  </div>
                </div>

                {/* FUNCTIONAL BUTTONS - Required for Apple 2.1 compliance */}
                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleManageSubscriptions}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span>Manage Subscriptions (Apple ID)</span>
                  </button>
                  
                  <button
                    onClick={handleSubscribeViaWebsite}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-6 rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-2"
                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span>Subscribe via Website</span>
                  </button>
                </div>
              </div>

              {/* Legal Links - REQUIRED for Apple Guideline 3.1.2 */}
              <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-white">Legal Information</h3>
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/terms" 
                    className="bg-slate-700/50 hover:bg-slate-700 text-mansagold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    style={{ touchAction: 'manipulation' }}
                  >
                    📜 Terms of Service (EULA)
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="bg-slate-700/50 hover:bg-slate-700 text-mansagold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    style={{ touchAction: 'manipulation' }}
                  >
                    🔒 Privacy Policy
                  </Link>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Payment will be charged to your Apple ID account at confirmation of purchase. 
                  Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
                  You can manage or cancel subscriptions in your Apple ID account settings.
                </p>
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
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      
      <Helmet>
        <title>Subscription Plans | Mansa Musa Marketplace</title>
      </Helmet>

      <IOSPaymentBlocker>
        <div className="relative z-10 container mx-auto px-4 py-12">
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

          {/* Legal Links - Required for subscription pages */}
          <div className="text-center py-6 border-t border-white/10">
            <p className="text-xs text-slate-400 mb-3">
              By subscribing, you agree to our terms and policies:
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="/terms" className="text-mansagold hover:underline">
                Terms of Service
              </a>
              <span className="text-slate-500">•</span>
              <a href="/privacy" className="text-mansagold hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <SubscriptionFAQ userType={userType} />
          </div>
        </div>
      </IOSPaymentBlocker>
    </div>
  );
};

export default SubscriptionPage;
