import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Building2 } from 'lucide-react';

interface SubscriptionOverviewProps {
  subscription: {
    company_name: string;
    tier: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({ subscription }) => {
  const tierColors = {
    bronze: 'bg-orange-100 text-orange-800 border-orange-300',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    past_due: 'bg-orange-100 text-orange-800',
    paused: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Subscription Overview</CardTitle>
            <CardDescription>Your corporate sponsorship details</CardDescription>
          </div>
          <Badge className={tierColors[subscription.tier as keyof typeof tierColors]}>
            {subscription.tier.toUpperCase()} TIER
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start space-x-3">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Company Name</p>
              <p className="text-lg">{subscription.company_name}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge className={statusColors[subscription.status as keyof typeof statusColors]}>
                {subscription.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Billing Period</p>
              <p className="text-sm text-muted-foreground">
                {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Renewal Status</p>
              <p className="text-sm text-muted-foreground">
                {subscription.cancel_at_period_end 
                  ? 'Cancels at period end' 
                  : 'Auto-renews monthly'}
              </p>
            </div>
          </div>
        </div>

        {subscription.cancel_at_period_end && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              Your subscription will be cancelled on{' '}
              {new Date(subscription.current_period_end).toLocaleDateString()}.
              You'll continue to have access to all benefits until then.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionOverview;
