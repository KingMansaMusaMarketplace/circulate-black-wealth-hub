import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecruitedAgent } from '@/types/agent-recruitment';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Users, TrendingUp, Calendar } from 'lucide-react';

interface RecruitedAgentsListProps {
  agents: RecruitedAgent[];
}

const RecruitedAgentsList: React.FC<RecruitedAgentsListProps> = ({ agents }) => {
  if (!agents || agents.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>You haven't recruited any agents yet.</p>
        <p className="text-sm mt-2">Share your referral code with potential agents to start building your team!</p>
      </Card>
    );
  }

  const isOverrideActive = (endDate: string) => {
    return new Date(endDate) > new Date();
  };

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-foreground">
                  {agent.full_name}
                </p>
                <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                  {agent.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {isOverrideActive(agent.team_override_end_date) && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Override Active
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Recruited: {formatDate(agent.recruitment_date)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{agent.total_referrals} Referrals</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Earned: {formatCurrency(agent.total_earned)}</span>
                </div>
                {isOverrideActive(agent.team_override_end_date) && (
                  <div className="text-xs text-muted-foreground">
                    Override ends: {formatDate(agent.team_override_end_date)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecruitedAgentsList;
