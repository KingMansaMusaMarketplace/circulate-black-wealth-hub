import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentRecruitmentBonus } from '@/types/agent-recruitment';
import { formatCurrency, formatDate } from '@/lib/utils';

interface RecruitmentBonusesListProps {
  bonuses: AgentRecruitmentBonus[];
}

const RecruitmentBonusesList: React.FC<RecruitmentBonusesListProps> = ({ bonuses }) => {
  if (!bonuses || bonuses.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No recruitment bonuses yet. Refer other agents to earn $75 bonuses after they make 3 business sales!</p>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {bonuses.map((bonus) => (
        <Card key={bonus.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-foreground">
                  Recruitment Bonus
                </p>
                <Badge className={getStatusColor(bonus.status)}>
                  {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Earned: {formatDate(bonus.earned_date)}
              </p>
              {bonus.paid_date && (
                <p className="text-sm text-muted-foreground">
                  Paid: {formatDate(bonus.paid_date)}
                </p>
              )}
              {bonus.payment_reference && (
                <p className="text-xs text-muted-foreground mt-1">
                  Ref: {bonus.payment_reference}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                {formatCurrency(bonus.bonus_amount)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecruitmentBonusesList;
