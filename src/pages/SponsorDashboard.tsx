import React from 'react';
import { useSponsorSubscription, useSponsorImpactMetrics } from '@/hooks/use-sponsor-subscription';
import { useSponsorPortal } from '@/hooks/useSponsorPortal';
import { ImpactMetricsCard } from '@/components/sponsor-dashboard/ImpactMetricsCard';
import { SubscriptionDetailsCard } from '@/components/sponsor-dashboard/SubscriptionDetailsCard';
import { LogoUploadCard } from '@/components/sponsor-dashboard/LogoUploadCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, Settings, ExternalLink, Crown, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SponsorDashboard: React.FC = () => {
  const { data: subscription, isLoading: subscriptionLoading, refetch } = useSponsorSubscription();
  const { data: metrics, isLoading: metricsLoading } = useSponsorImpactMetrics(subscription?.id);
  const { openPortal, isLoading: portalLoading } = useSponsorPortal();

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-4 py-8 space-y-6 relative z-10">
          <Skeleton className="h-12 w-64 bg-white/10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-2 bg-white/10" />
            <Skeleton className="h-64 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Alert className="bg-white/5 border-amber-500/30 backdrop-blur-xl">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-100">No Active Sponsorship</AlertTitle>
            <AlertDescription className="text-blue-200/80">
              You don't have an active corporate sponsorship. Please contact us to become a sponsor.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const latestMetrics = metrics?.[0];
  const showApprovalAlert = subscription.approval_status === 'pending' || subscription.approval_status === 'rejected';

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/30 to-yellow-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/25 to-indigo-700/15 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-amber-400/20 to-orange-500/10 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-gradient-to-bl from-blue-500/15 to-cyan-600/10 rounded-full blur-3xl animate-[pulse_9s_ease-in-out_infinite_0.5s]" />
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/25">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                Corporate Sponsor Dashboard
              </h1>
              <p className="text-blue-200/70 mt-1">
                Track your impact and manage your sponsorship
              </p>
            </div>
          </div>
          <Button 
            onClick={openPortal} 
            disabled={portalLoading}
            className="bg-white/10 hover:bg-white/20 border border-amber-500/30 text-amber-100 backdrop-blur-xl gap-2 transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10"
          >
            <Settings className="h-4 w-4" />
            Manage Subscription
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* Approval Status Alerts */}
        {showApprovalAlert && (
          <Alert 
            className={`backdrop-blur-xl border ${
              subscription.approval_status === 'rejected' 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <AlertCircle className={`h-4 w-4 ${subscription.approval_status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`} />
            <AlertTitle className={subscription.approval_status === 'rejected' ? 'text-red-200' : 'text-amber-200'}>
              {subscription.approval_status === 'pending' && 'Sponsorship Pending Approval'}
              {subscription.approval_status === 'rejected' && 'Sponsorship Application Rejected'}
            </AlertTitle>
            <AlertDescription className="text-blue-200/80">
              {subscription.approval_status === 'pending' && 
                'Your corporate sponsorship application is currently under review. You will be notified once it has been approved by our team.'
              }
              {subscription.approval_status === 'rejected' && subscription.rejection_reason && (
                <>Reason: {subscription.rejection_reason}</>
              )}
              {subscription.approval_status === 'rejected' && !subscription.rejection_reason && (
                'Your application was not approved. Please contact us for more information.'
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {metricsLoading ? (
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 h-96 animate-pulse" />
            ) : latestMetrics ? (
              <ImpactMetricsCard
                businessesSupported={latestMetrics.businesses_supported}
                totalTransactions={latestMetrics.total_transactions}
                communityReach={latestMetrics.community_reach}
                economicImpact={latestMetrics.economic_impact}
                className="bg-white/5 backdrop-blur-xl border-white/10 text-white"
              />
            ) : (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-amber-100 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Impact Metrics
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    Your impact data will appear here once transactions are processed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-blue-200/60">
                    <TrendingUp className="h-8 w-8 text-amber-400/60" />
                    <p>Calculating your impact metrics...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <LogoUploadCard
              subscriptionId={subscription.id}
              currentLogoUrl={subscription.logo_url}
              currentWebsiteUrl={subscription.website_url}
              onUpdate={refetch}
              className="bg-white/5 backdrop-blur-xl border-white/10"
            />
          </div>

          <div className="space-y-6">
            <SubscriptionDetailsCard
              companyName={subscription.company_name}
              tier={subscription.tier}
              status={subscription.status}
              currentPeriodStart={subscription.current_period_start}
              currentPeriodEnd={subscription.current_period_end}
              logoUrl={subscription.logo_url}
              websiteUrl={subscription.website_url}
              className="bg-white/5 backdrop-blur-xl border-white/10"
            />

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
              <CardHeader>
                <CardTitle className="text-amber-100 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  Your Benefits
                </CardTitle>
                <CardDescription className="text-blue-200/70">Active sponsorship perks</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span className="text-blue-100">Logo placement on platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span className="text-blue-100">Impact metrics tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400 mt-0.5">✓</span>
                    <span className="text-blue-100">Monthly impact reports</span>
                  </li>
                  {(subscription.tier === 'gold' || subscription.tier === 'platinum') && (
                    <>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <span className="text-blue-100">Featured placement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <span className="text-blue-100">Social media recognition</span>
                      </li>
                    </>
                  )}
                  {subscription.tier === 'platinum' && (
                    <>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <span className="text-blue-100">Homepage banner</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <span className="text-blue-100">Priority support</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;