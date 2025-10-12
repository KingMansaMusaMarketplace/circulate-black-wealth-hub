import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Award } from 'lucide-react';
import { SponsorSubscription } from '@/hooks/useSponsorSubscription';
import { format } from 'date-fns';

interface SubscriptionStatusProps {
  subscription: SponsorSubscription;
}

const tierColors = {
  bronze: 'bg-orange-100 text-orange-800 border-orange-300',
  silver: 'bg-gray-100 text-gray-800 border-gray-300',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  platinum: 'bg-purple-100 text-purple-800 border-purple-300',
};

const statusIcons = {
  active: <CheckCircle className="w-5 h-5 text-green-600" />,
  cancelled: <XCircle className="w-5 h-5 text-red-600" />,
  past_due: <Clock className="w-5 h-5 text-orange-600" />,
};

export const SubscriptionStatus = ({ subscription }: SubscriptionStatusProps) => {
  const tierColor = tierColors[subscription.tier as keyof typeof tierColors] || tierColors.bronze;
  const statusIcon = statusIcons[subscription.status as keyof typeof statusIcons] || statusIcons.active;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current sponsorship details</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusIcon}
            <Badge variant="outline" className="capitalize">
              {subscription.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Tier</h3>
          <Badge className={`${tierColor} text-lg py-2 px-4 capitalize`}>
            {subscription.tier} Partner
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
            <p className="text-base font-semibold">{subscription.company_name}</p>
          </div>

          {subscription.current_period_end && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {subscription.cancel_at_period_end ? 'Ends On' : 'Renews On'}
              </h3>
              <p className="text-base font-semibold">
                {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
              </p>
            </div>
          )}

          {subscription.created_at && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
              <p className="text-base font-semibold">
                {format(new Date(subscription.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          )}
        </div>

        {subscription.cancel_at_period_end && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              Your subscription will end on{' '}
              {subscription.current_period_end && format(new Date(subscription.current_period_end), 'MMMM dd, yyyy')}.
              You can renew anytime before this date.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
