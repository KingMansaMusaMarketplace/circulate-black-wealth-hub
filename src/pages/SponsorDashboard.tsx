import React from 'react';
import { useSponsorSubscription, useSponsorImpactMetrics } from '@/hooks/use-sponsor-subscription';
import { ImpactMetricsCard } from '@/components/sponsor-dashboard/ImpactMetricsCard';
import { SubscriptionDetailsCard } from '@/components/sponsor-dashboard/SubscriptionDetailsCard';
import { LogoUploadCard } from '@/components/sponsor-dashboard/LogoUploadCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SponsorDashboard: React.FC = () => {
  const { data: subscription, isLoading: subscriptionLoading, refetch } = useSponsorSubscription();
  const { data: metrics, isLoading: metricsLoading } = useSponsorImpactMetrics(subscription?.id);

  if (subscriptionLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Active Sponsorship</AlertTitle>
          <AlertDescription>
            You don't have an active corporate sponsorship. Please contact us to become a sponsor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const latestMetrics = metrics?.[0];

  // Show approval status alerts
  const showApprovalAlert = subscription.approval_status === 'pending' || subscription.approval_status === 'rejected';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Corporate Sponsor Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your impact and manage your sponsorship
        </p>
      </div>

      {/* Approval Status Alerts */}
      {showApprovalAlert && (
        <Alert variant={subscription.approval_status === 'rejected' ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {subscription.approval_status === 'pending' && 'Sponsorship Pending Approval'}
            {subscription.approval_status === 'rejected' && 'Sponsorship Application Rejected'}
          </AlertTitle>
          <AlertDescription>
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
            <Skeleton className="h-96" />
          ) : latestMetrics ? (
            <ImpactMetricsCard
              businessesSupported={latestMetrics.businesses_supported}
              totalTransactions={latestMetrics.total_transactions}
              communityReach={latestMetrics.community_reach}
              economicImpact={latestMetrics.economic_impact}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
                <CardDescription>
                  Your impact data will appear here once transactions are processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <TrendingUp className="h-8 w-8" />
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
          />

          <Card>
            <CardHeader>
              <CardTitle>Your Benefits</CardTitle>
              <CardDescription>Active sponsorship perks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Logo placement on platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Impact metrics tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Monthly impact reports</span>
                </li>
                {(subscription.tier === 'gold' || subscription.tier === 'platinum') && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Featured placement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Social media recognition</span>
                    </li>
                  </>
                )}
                {subscription.tier === 'platinum' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Homepage banner</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>Priority support</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;
