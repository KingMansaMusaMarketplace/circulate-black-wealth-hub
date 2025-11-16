import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSponsorSubscription } from '@/hooks/useSponsorSubscription';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { SubscriptionStatus } from '@/components/sponsor/SubscriptionStatus';
import { CompanyInfoEditor } from '@/components/sponsors/CompanyInfoEditor';
import { TierBenefits } from '@/components/sponsor/TierBenefits';
import { SponsorAnalytics } from '@/components/sponsors/SponsorAnalytics';
import { CancelSubscriptionDialog } from '@/components/sponsor/CancelSubscriptionDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SponsorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, isLoading, error, updateCompanyInfo } = useSponsorSubscription();
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsLoadingPortal(true);
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          returnUrl: `${window.location.origin}/sponsor-dashboard`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Error creating portal session:', err);
      toast.error(err.message || 'Failed to open customer portal');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error || !subscription) {
    return (
      <ResponsiveLayout>
        <Helmet>
          <title>Sponsor Dashboard | Mansa Musa Marketplace</title>
        </Helmet>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/sponsor-pricing')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>

          <Alert>
            <AlertDescription>
              {error
                ? 'Failed to load your sponsorship. Please try again later.'
                : 'You do not have an active sponsorship. Visit our pricing page to become a sponsor.'}
            </AlertDescription>
          </Alert>

          <div className="mt-6">
            <Button onClick={() => navigate('/sponsor-pricing')} className="w-full">
              View Sponsorship Options
            </Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <ResponsiveLayout>
        <Helmet>
          <title>Sponsor Dashboard | Mansa Musa Marketplace</title>
          <meta name="description" content="Manage your corporate sponsorship" />
        </Helmet>

        <div className="max-w-6xl mx-auto py-8 px-4 relative z-10">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Enhanced Header */}
            <div className="animate-fade-in">
              <div className="relative inline-block w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 via-rose-400/30 to-pink-400/30 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                   <div className="flex items-center gap-3">
                    <Heart className="w-12 h-12 text-red-600" />
                    <div>
                      <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                        Sponsor <span className="text-yellow-500">Dashboard</span> ❤️
                      </h1>
                      <p className="text-gray-700 text-lg font-medium">
                        Track your impact and manage your sponsorship ✨
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <SubscriptionStatus subscription={subscription} />
              
              <TierBenefits tier={subscription.tier} />
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Sponsorship Analytics</h2>
                <SponsorAnalytics subscriptionId={subscription.id} />
              </div>
            </div>

            <div className="space-y-6">
              <CompanyInfoEditor subscription={subscription} />

              <Card>
                <CardHeader>
                  <CardTitle>Manage Subscription</CardTitle>
                  <CardDescription>
                    Update your payment method, view invoices, upgrade/downgrade, or cancel your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handleManageSubscription}
                    disabled={isLoadingPortal || !subscription.stripe_customer_id}
                  >
                    {isLoadingPortal ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Manage Subscription & Billing
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Access your customer portal to update payment methods, view invoices, upgrade/downgrade tiers, and manage your subscription
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    </div>
  );
}
