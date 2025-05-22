
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatCurrency } from '@/lib/utils';

interface CommissionsListProps {
  commissions: any[];
}

const CommissionsList: React.FC<CommissionsListProps> = ({ commissions }) => {
  if (commissions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any commissions yet.</p>
            <p className="text-sm mt-2">Commissions become available 30 days after a successful referral.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {commissions.map((commission) => (
        <Card key={commission.id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <div className="font-medium mb-1">
                  {formatCurrency(commission.amount)}
                </div>
                <div className="text-sm text-gray-500">
                  Due date: {formatDate(commission.due_date || new Date().toISOString())}
                </div>
                {commission.referral && (
                  <div className="text-sm text-gray-500 mt-1">
                    Referral from {formatDate(commission.referral.referral_date)}
                  </div>
                )}
              </div>
              <div className="flex flex-col mt-2 md:mt-0 items-end">
                <Badge 
                  className={`${
                    commission.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : commission.status === 'cancelled' 
                      ? 'bg-red-100 text-red-800'
                      : commission.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                </Badge>
                {commission.paid_date && (
                  <div className="text-xs text-gray-500 mt-1">
                    Paid on {formatDate(commission.paid_date)}
                  </div>
                )}
                {commission.payment_reference && (
                  <div className="text-xs font-mono mt-1">
                    {commission.payment_reference}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommissionsList;
