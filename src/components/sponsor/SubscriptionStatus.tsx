import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Award } from 'lucide-react';
import { SponsorSubscription } from '@/hooks/useSponsorSubscription';
import { format } from 'date-fns';

interface SubscriptionStatusProps {
  subscription: SponsorSubscription;
}

const tierColors = {
  bronze: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  silver: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
  gold: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  platinum: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
};

const statusIcons = {
  active: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  cancelled: <XCircle className="w-5 h-5 text-red-400" />,
  past_due: <Clock className="w-5 h-5 text-orange-400" />,
};

export const SubscriptionStatus = ({ subscription }: SubscriptionStatusProps) => {
  const tierColor = tierColors[subscription.tier as keyof typeof tierColors] || tierColors.bronze;
  const statusIcon = statusIcons[subscription.status as keyof typeof statusIcons] || statusIcons.active;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-amber-100">Subscription Status</CardTitle>
              <CardDescription className="text-blue-200/70">Your current sponsorship details</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusIcon}
            <Badge variant="outline" className="capitalize bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              {subscription.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 relative">
        <div>
          <h3 className="text-sm font-medium text-blue-200/70 mb-2">Current Tier</h3>
          <Badge className={`${tierColor} text-lg py-2 px-4 capitalize`}>
            {subscription.tier} Partner
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-blue-200/70 mb-1">Company</h3>
            <p className="text-base font-semibold text-blue-100">{subscription.company_name}</p>
          </div>

          {subscription.current_period_end && (
            <div>
              <h3 className="text-sm font-medium text-blue-200/70 mb-1">
                {subscription.cancel_at_period_end ? 'Ends On' : 'Renews On'}
              </h3>
              <p className="text-base font-semibold text-blue-100">
                {format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}
              </p>
            </div>
          )}

          {subscription.created_at && (
            <div>
              <h3 className="text-sm font-medium text-blue-200/70 mb-1">Member Since</h3>
              <p className="text-base font-semibold text-blue-100">
                {format(new Date(subscription.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          )}
        </div>

        {subscription.cancel_at_period_end && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <p className="text-sm text-orange-200">
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