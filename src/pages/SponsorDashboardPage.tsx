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
import { SponsorDocuments } from '@/components/sponsors/SponsorDocuments';
import { CancelSubscriptionDialog } from '@/components/sponsor/CancelSubscriptionDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Crown, ExternalLink, Sparkles, FileText, BarChart3, Building2 } from 'lucide-react';
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
      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/30 to-yellow-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/25 to-indigo-700/15 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]" />
        </div>
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/30 to-yellow-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/25 to-indigo-700/15 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]" />
        </div>
      <ResponsiveLayout useSubtleBackground={false} className="!bg-transparent">
        <Helmet>
          <title>Sponsor Dashboard | Mansa Musa Marketplace</title>
        </Helmet>
        <div className="max-w-4xl mx-auto py-8 px-4 relative z-10">
            <Button
              variant="ghost"
              onClick={() => navigate('/sponsor-pricing')}
              className="mb-6 text-amber-100 hover:text-amber-200 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>

            <Alert className="bg-white/5 backdrop-blur-xl border-amber-500/30">
              <AlertDescription className="text-blue-100">
                {error
                  ? 'Failed to load your sponsorship. Please try again later.'
                  : 'You do not have an active sponsorship. Visit our pricing page to become a sponsor.'}
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <Button 
                onClick={() => navigate('/sponsor-pricing')} 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700"
              >
                View Sponsorship Options
              </Button>
            </div>
          </div>
        </ResponsiveLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/30 to-yellow-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/25 to-indigo-700/15 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-amber-400/20 to-orange-500/10 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-gradient-to-bl from-blue-500/15 to-cyan-600/10 rounded-full blur-3xl animate-[pulse_9s_ease-in-out_infinite_0.5s]" />
      </div>

      <ResponsiveLayout useSubtleBackground={false} className="!bg-transparent">
        <Helmet>
          <title>Sponsor Dashboard | Mansa Musa Marketplace</title>
          <meta name="description" content="Manage your corporate sponsorship" />
        </Helmet>

        <div className="max-w-6xl mx-auto py-8 px-4 relative z-10">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 text-amber-100 hover:text-amber-200 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Enhanced Header */}
            <div className="animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/25">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                    Sponsor Dashboard
                  </h1>
                  <p className="text-blue-200/70 mt-1">
                    Track your impact and manage your sponsorship
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-100">
                <Building2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-100">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-100">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <SubscriptionStatus subscription={subscription} />
                  <TierBenefits tier={subscription.tier} />
                </div>

                <div className="space-y-6">
                  <CompanyInfoEditor subscription={subscription} />

                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
                    <CardHeader>
                      <CardTitle className="text-amber-100">Manage Subscription</CardTitle>
                      <CardDescription className="text-blue-200/70">
                        Update your payment method, view invoices, upgrade/downgrade, or cancel your subscription
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 relative">
                      {subscription.stripe_customer_id ? (
                        <>
                          <Button 
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700"
                            onClick={handleManageSubscription}
                            disabled={isLoadingPortal}
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
                          <p className="text-xs text-blue-200/50 text-center">
                            Access your customer portal to update payment methods, view invoices, upgrade/downgrade tiers, and manage your subscription
                          </p>
                        </>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-sm text-amber-200/70">
                            Billing portal not available
                          </p>
                          <p className="text-xs text-blue-200/50 mt-1">
                            Your subscription was set up manually. Please contact support to manage billing.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-amber-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  Sponsorship Analytics
                </h2>
                <SponsorAnalytics subscriptionId={subscription.id} />
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <SponsorDocuments subscription={subscription} />
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveLayout>
    </div>
  );
}