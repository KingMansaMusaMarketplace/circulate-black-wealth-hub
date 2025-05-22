
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ReferralsListProps {
  referrals: any[];
}

const ReferralsList: React.FC<ReferralsListProps> = ({ referrals }) => {
  if (referrals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any referrals yet.</p>
            <p className="text-sm mt-2">Share your referral code to start earning commissions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {referrals.map((referral) => (
        <Card key={referral.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-medium">
                    {referral.referred_user?.email || 'User'}
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {referral.referred_user_type === 'business' ? 'Business' : 'Customer'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Referred on {formatDate(referral.referral_date)}
                </div>
              </div>
              <div className="flex flex-col mt-2 md:mt-0 text-right">
                <div className="font-medium">
                  {formatCurrency(referral.commission_amount || 0)}
                </div>
                <Badge 
                  className={`self-end mt-1 ${
                    referral.commission_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : referral.commission_status === 'cancelled' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {referral.commission_status === 'paid' ? 'Paid' : 
                   referral.commission_status === 'cancelled' ? 'Cancelled' : 'Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReferralsList;
