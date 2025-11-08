import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentTeamOverride } from '@/types/agent-recruitment';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TeamOverridesListProps {
  overrides: AgentTeamOverride[];
}

const TeamOverridesList: React.FC<TeamOverridesListProps> = ({ overrides }) => {
  if (!overrides || overrides.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <p>No team override commissions yet. Recruit agents and earn 7.5% on their sales for 6 months!</p>
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
      {overrides.map((override) => (
        <Card key={override.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-foreground">
                  Team Override ({override.override_percentage}%)
                </p>
                <Badge className={getStatusColor(override.status)}>
                  {override.status.charAt(0).toUpperCase() + override.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Base Commission: {formatCurrency(override.base_commission_amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                Earned: {formatDate(override.earned_date)}
              </p>
              {override.paid_date && (
                <p className="text-sm text-muted-foreground">
                  Paid: {formatDate(override.paid_date)}
                </p>
              )}
              {override.payment_reference && (
                <p className="text-xs text-muted-foreground mt-1">
                  Ref: {override.payment_reference}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                {formatCurrency(override.override_amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                Your Override
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TeamOverridesList;
