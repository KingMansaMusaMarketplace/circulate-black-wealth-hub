import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RecruitedAgent {
  id: string;
  full_name: string;
  referral_code: string;
  created_at: string;
  total_referrals?: number;
}

interface TeamOverviewProps {
  recruitedAgents: RecruitedAgent[];
  teamOverrides: any[];
  isLoading: boolean;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({
  recruitedAgents,
  teamOverrides,
  isLoading
}) => {
  const totalTeamOverrides = teamOverrides.reduce(
    (sum, override) => sum + parseFloat(override.override_amount || 0),
    0
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
          <CardDescription>Loading team data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (recruitedAgents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Team</CardTitle>
          <CardDescription>Recruit agents to build your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-2">No team members yet</p>
            <p className="text-sm">
              Share your recruiter code when inviting new agents to earn $75 bonuses and 7.5% overrides!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Team</CardTitle>
        <CardDescription>
          {recruitedAgents.length} agent{recruitedAgents.length !== 1 ? 's' : ''} • $
          {totalTeamOverrides.toFixed(2)} in overrides
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recruitedAgents.map((agent) => {
            const agentOverrides = teamOverrides.filter(
              (o) => o.recruited_agent_id === agent.id
            );
            const agentOverrideTotal = agentOverrides.reduce(
              (sum, o) => sum + parseFloat(o.override_amount || 0),
              0
            );

            return (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{agent.full_name}</h4>
                    <Badge variant="outline">{agent.referral_code}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined {format(new Date(agent.created_at), 'MMM yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {agent.total_referrals || 0} referrals
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    ${agentOverrideTotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Your overrides
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
