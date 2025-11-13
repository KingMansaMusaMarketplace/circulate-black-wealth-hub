import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Building2, Calendar, DollarSign } from 'lucide-react';

interface Referral {
  id: string;
  referred_user_id: string;
  referral_date: string;
  commission_status: string;
  commission_amount: number;
  subscription_amount: number;
  businesses?: {
    business_name: string;
    city: string;
    state: string;
  };
}

interface ReferralsListProps {
  referrals: Referral[];
  isLoading: boolean;
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'due':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted/30 text-muted-foreground border-border/50';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Business Referrals
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Loading your referrals...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/30 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (referrals.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Business Referrals
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Your referrals will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-body">No referrals yet. Share your referral code to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-display font-semibold text-foreground">
          Business Referrals
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
          {referrals.length} total referral{referrals.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-all hover-lift group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-primary/60 transition-transform group-hover:scale-110" />
                  <h4 className="font-display font-semibold text-foreground">
                    {referral.businesses?.business_name || 'Business'}
                  </h4>
                  <Badge className={`${getStatusColor(referral.commission_status)} font-body border`}>
                    {referral.commission_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(referral.referral_date), 'MMM d, yyyy')}
                  </span>
                  {referral.businesses?.city && (
                    <span>
                      {referral.businesses.city}, {referral.businesses.state}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-display font-bold text-green-600 dark:text-green-400">
                  <DollarSign className="h-4 w-4" />
                  {referral.commission_amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground font-body">
                  on ${referral.subscription_amount} sub
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralsList;