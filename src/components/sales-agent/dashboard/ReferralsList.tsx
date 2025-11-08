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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'due':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Referrals</CardTitle>
          <CardDescription>Loading your referrals...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (referrals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Referrals</CardTitle>
          <CardDescription>Your referrals will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No referrals yet. Share your referral code to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Referrals</CardTitle>
        <CardDescription>
          {referrals.length} total referral{referrals.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">
                    {referral.businesses?.business_name || 'Business'}
                  </h4>
                  <Badge className={getStatusColor(referral.commission_status)}>
                    {referral.commission_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                  <DollarSign className="h-4 w-4" />
                  {referral.commission_amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
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
