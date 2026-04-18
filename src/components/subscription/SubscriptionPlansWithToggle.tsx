import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Building, Users, Rocket, ExternalLink, Sparkles, FileText, Bot, Shield, Zap } from 'lucide-react';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';
import { useFoundersCount } from './hooks/useFoundersCount';
import { subscriptionTiers, type SubscriptionTier, type TierInfo } from '@/lib/services/subscription-tiers';
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SubscriptionPlansWithToggleProps {
  currentTier?: SubscriptionTier;
  userType?: 'customer' | 'business';
}

// Map tier keys to icons (semantic-token friendly)
const TIER_ICON: Partial<Record<SubscriptionTier, React.ReactElement>> = {
  free: <Rocket className="h-6 w-6" />,
  kayla_essentials: <Sparkles className="h-6 w-6" />,
  kayla_essentials_annual: <Sparkles className="h-6 w-6" />,
  business_pro: <Building className="h-6 w-6" />,
  business_pro_annual: <Building className="h-6 w-6" />,
  kayla_starter: <FileText className="h-6 w-6" />,
  kayla_starter_annual: <FileText className="h-6 w-6" />,
  kayla_pro: <Bot className="h-6 w-6" />,
  kayla_pro_annual: <Bot className="h-6 w-6" />,
  kayla_pro_founders: <Crown className="h-6 w-6" />,
  kayla_enterprise: <Shield className="h-6 w-6" />,
};

// Display feature bullets per tier (marketing-friendly)
const TIER_BULLETS: Partial<Record<SubscriptionTier, string[]>> = {
  free: [
    'Business directory listing',
    'Basic profile page',
    'Community access',
    'Mentorship & networking',
  ],
  kayla_essentials: [
    'Business verification',
    'Up to 5 QR codes',
    'Kayla AI assistant access',
    'Email support',
    '30-day free trial',
  ],
  kayla_essentials_annual: [
    'Business verification',
    'Up to 5 QR codes',
    'Kayla AI assistant access',
    'Email support',
    '30-day free trial',
  ],
  business_pro: [
    'Analytics dashboard',
    'Booking system with Stripe',
    'Review management tools',
    'Up to 25 QR codes',
    'Business verification',
    'Event creation',
    'Priority support',
  ],
  business_pro_annual: [
    'Analytics dashboard',
    'Booking system with Stripe',
    'Review management tools',
    'Up to 25 QR codes',
    'Business verification',
    'Event creation',
    'Priority support',
  ],
  kayla_starter: [
    'Everything in Business Pro',
    'Kayla AI Employee',
    'Records management',
    'Up to 25 QR codes',
    '30-day free trial',
  ],
  kayla_starter_annual: [
    'Everything in Business Pro',
    'Kayla AI Employee',
    'Records management',
    'Up to 25 QR codes',
    '30-day free trial',
  ],
  kayla_pro: [
    'Everything in Starter',
    'Full Kayla AI Pro suite (28 services)',
    'AI review responses & social media',
    'Tax prep & legal templates',
    'Investment readiness scoring',
    'Unlimited QR codes',
    '14-day free trial',
  ],
  kayla_pro_annual: [
    'Everything in Starter',
    'Full Kayla AI Pro suite (28 services)',
    'AI review responses & social media',
    'Tax prep & legal templates',
    'Investment readiness scoring',
    'Unlimited QR codes',
    '14-day free trial',
  ],
  kayla_pro_founders: [
    'Full Kayla AI Pro suite (28 services)',
    '$149/mo locked for life',
    'AI review responses & social media',
    'Tax prep & legal templates',
    'Investment readiness scoring',
    'Unlimited QR codes',
    'Founder badge on profile',
  ],
  kayla_enterprise: [
    'Everything in Kayla AI Pro',
    'Multi-location support',
    'White-label branding',
    'Advanced integrations',
    'Dedicated account manager',
    '$50/user/mo for additional seats',
  ],
};

const SubscriptionPlansWithToggle: React.FC<SubscriptionPlansWithToggleProps> = ({
  currentTier = 'free',
  userType = 'customer',
}) => {
  const navigate = useNavigate();
  const { loading, handleSubscribe, isAuthenticated } = useSubscriptionActions();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const founders = useFoundersCount();
  const isIOS = shouldHideStripePayments();

  const handleManageSubscriptions = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.location.href = 'itms-apps://apps.apple.com/account/subscriptions';
  };

  const handleSubscribeViaWebsite = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open('https://circulate-black-wealth-hub.lovable.app/subscription', '_blank');
  };

  // iOS: show subscription management info
  if (isIOS) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/60 backdrop-blur-xl border-border/40">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Subscription Management</CardTitle>
            <CardDescription>
              Manage your subscription through your device settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button
                onClick={handleManageSubscriptions}
                className="w-full font-semibold py-6"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Manage Subscriptions (Apple ID)
              </Button>
              <Button
                onClick={handleSubscribeViaWebsite}
                variant="outline"
                className="w-full py-6"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                Subscribe via Website
              </Button>
            </div>
            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertTitle>iOS Subscription Info</AlertTitle>
              <AlertDescription>
                To view or cancel subscriptions on iOS, tap "Manage Subscriptions" above or go to
                Settings → Apple ID → Subscriptions on your device.
              </AlertDescription>
            </Alert>
            <div className="border-t border-border/40 pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center mb-3">
                By using our services, you agree to our:
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/terms')}
                  className="bg-muted hover:bg-muted/80 text-mansagold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  📜 Terms of Service (EULA)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/privacy')}
                  className="bg-muted hover:bg-muted/80 text-mansagold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  🔒 Privacy Policy
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Customer view (only free for now)
  if (userType === 'customer') {
    const tier = subscriptionTiers.free;
    return (
      <div className="max-w-md mx-auto">
        <PlanCard
          tierKey="free"
          tier={tier}
          currentTier={currentTier}
          loading={loading}
          isAuthenticated={isAuthenticated}
          onSubscribe={handleSubscribe}
          customBullets={[
            'Browse complete business directory',
            'Discover businesses near you',
            'Earn loyalty points on purchases',
            'Redeem points for rewards',
            'Access exclusive member deals',
            'Join mentorship programs',
            'Network with the community',
          ]}
          highlighted
        />
      </div>
    );
  }

  // Business plans by billing cycle
  const monthlyTiers: SubscriptionTier[] = [
    'free',
    'kayla_essentials',
    'business_pro',
    'kayla_starter',
    'kayla_pro',
    'kayla_enterprise',
  ];

  const annualTiers: SubscriptionTier[] = [
    'free',
    'kayla_essentials_annual',
    'business_pro_annual',
    'kayla_starter_annual',
    'kayla_pro_annual',
    'kayla_enterprise', // enterprise is monthly only for now
  ];

  const activeTiers = billingCycle === 'monthly' ? monthlyTiers : annualTiers;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Founders' Lock spotlight (only when available, monthly view) */}
      {founders.isAvailable && billingCycle === 'monthly' && (
        <FoundersLockBanner
          remaining={founders.remaining}
          limit={founders.limit}
          loading={founders.loading}
          isAuthenticated={isAuthenticated}
          isLoading={loading === 'kayla_pro_founders'}
          onSubscribe={() => handleSubscribe('kayla_pro_founders')}
          isCurrent={currentTier === 'kayla_pro_founders'}
        />
      )}

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg flex border border-border/40">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-mansagold text-mansablue shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'annual'
                ? 'bg-mansagold text-mansablue shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <Badge className="ml-2 bg-emerald-500 text-white text-xs">Save ~17%</Badge>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTiers.map((tierKey) => {
          const tier = subscriptionTiers[tierKey];
          if (!tier) return null;
          return (
            <PlanCard
              key={tierKey}
              tierKey={tierKey}
              tier={tier}
              currentTier={currentTier}
              loading={loading}
              isAuthenticated={isAuthenticated}
              onSubscribe={handleSubscribe}
            />
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All paid business plans include a free trial. Cancel anytime. Existing subscribers on legacy
        prices keep their original rate.
      </p>
    </div>
  );
};

// =====================================================================
// Founders' Lock spotlight banner
// =====================================================================
interface FoundersLockBannerProps {
  remaining: number;
  limit: number;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCurrent: boolean;
  onSubscribe: () => void;
}

const FoundersLockBanner: React.FC<FoundersLockBannerProps> = ({
  remaining,
  limit,
  loading,
  isAuthenticated,
  isLoading,
  isCurrent,
  onSubscribe,
}) => {
  const taken = limit - remaining;
  const pct = Math.min(100, Math.round((taken / limit) * 100));

  return (
    <Card className="border-2 border-mansagold bg-gradient-to-br from-mansagold/10 via-background to-mansagold/5 shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 bg-mansagold text-mansablue px-4 py-1 rounded-bl-lg font-bold text-sm flex items-center gap-1">
        <Crown className="h-4 w-4" />
        Founders' Lock
      </div>
      <CardHeader className="pb-3 pt-8">
        <CardTitle className="text-2xl flex items-center gap-2">
          Kayla AI Pro — $149/mo for life
        </CardTitle>
        <CardDescription className="text-base">
          Limited to the first <strong>{limit}</strong> businesses. Lock in $149/month{' '}
          <strong>forever</strong> on the full Kayla AI Pro suite (regular price $299/mo).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              Full Kayla AI Pro suite (28 services)
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              Unlimited QR codes & analytics
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              Founder badge on your profile
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <strong>Save $1,800/year</strong> vs. regular Pro
            </li>
          </ul>
          <div className="flex flex-col justify-center space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">
                  {loading ? '...' : `${taken} / ${limit} claimed`}
                </span>
                <span className="text-mansagold font-bold">
                  {loading ? '' : `${remaining} spots left`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-mansagold to-amber-500 h-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <Button
              onClick={onSubscribe}
              disabled={isCurrent || isLoading || !isAuthenticated}
              className="bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
              size="lg"
            >
              {isCurrent
                ? '✓ Active Founder'
                : isLoading
                  ? 'Processing...'
                  : `Lock In $149/mo Forever`}
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground">
                Please log in to claim a founder spot
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// =====================================================================
// Plan card
// =====================================================================
interface PlanCardProps {
  tierKey: SubscriptionTier;
  tier: TierInfo;
  currentTier: SubscriptionTier;
  loading: SubscriptionTier | null;
  isAuthenticated: boolean;
  onSubscribe: (tier: SubscriptionTier) => void;
  customBullets?: string[];
  highlighted?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  tierKey,
  tier,
  currentTier,
  loading,
  isAuthenticated,
  onSubscribe,
  customBullets,
  highlighted,
}) => {
  const icon = TIER_ICON[tierKey] ?? <Zap className="h-6 w-6" />;
  const bullets = customBullets ?? TIER_BULLETS[tierKey] ?? [];
  const isCurrent = currentTier === tierKey;
  const isLoading = loading === tierKey;
  const isPopular = !!tier.popular || highlighted;
  const isFree = tier.price === 0;

  const buttonText = (() => {
    if (isCurrent) return 'Current Plan';
    if (isLoading) return 'Processing...';
    if (isFree) return 'Free Forever';
    if (tier.trialDays) return `Start ${tier.trialDays}-day Free Trial`;
    return `Subscribe — $${tier.price}/${tier.interval}`;
  })();

  return (
    <Card
      className={`relative backdrop-blur-xl flex flex-col ${
        isPopular
          ? 'border-mansagold shadow-lg lg:scale-105 bg-card/80'
          : isCurrent
            ? 'border-emerald-500 bg-card/70'
            : 'border-border/40 bg-card/60'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-mansagold text-mansablue font-semibold px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div
          className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
            isPopular
              ? 'bg-mansagold/20 text-mansagold'
              : isCurrent
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-mansablue/20 text-mansablue'
          }`}
        >
          {icon}
        </div>

        <CardTitle className="text-xl font-bold">{tier.displayName}</CardTitle>
        <CardDescription className="text-sm min-h-[40px]">{tier.description}</CardDescription>

        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold">${tier.price}</span>
            {tier.price > 0 && (
              <span className="text-muted-foreground ml-1">/{tier.interval}</span>
            )}
          </div>
          {tier.monthlyEquivalent && (
            <p className="text-xs text-muted-foreground mt-1">
              ${tier.monthlyEquivalent.toFixed(2)}/mo equivalent
            </p>
          )}
          {tier.savingsText && (
            <p className="text-sm text-emerald-500 mt-1 font-medium">{tier.savingsText}</p>
          )}
          {tier.trialDays && !isFree && (
            <p className="text-sm text-emerald-500 mt-1 font-medium">
              {tier.trialDays}-day free trial
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <ul className="space-y-2 flex-1">
          {bullets.map((feat, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feat}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full ${
            isPopular && !isCurrent
              ? 'bg-mansagold hover:bg-mansagold/90 text-mansablue'
              : isCurrent
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : ''
          }`}
          variant={isPopular || isCurrent ? 'default' : 'outline'}
          onClick={() => onSubscribe(tierKey)}
          disabled={isCurrent || isLoading || (!isAuthenticated && !isFree)}
        >
          {buttonText}
        </Button>

        {!isAuthenticated && !isFree && (
          <p className="text-xs text-center text-muted-foreground">Please log in to subscribe</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionPlansWithToggle;
