import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Calendar, UserPlus } from 'lucide-react';
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
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Your Team
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Loading team data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted/30 animate-pulse rounded-lg shimmer" />
        </CardContent>
      </Card>
    );
  }

  if (recruitedAgents.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-display font-semibold text-foreground">
            Your Team
          </CardTitle>
          <CardDescription className="font-body text-muted-foreground">
            Recruit agents to build your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-2">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-body text-foreground font-medium">No team members yet</p>
              <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
                Share your recruiter code when inviting new agents to earn $75 bonuses and 7.5% overrides!
              </p>
            </div>
            <Button className="gap-2 mt-4">
              <UserPlus className="h-4 w-4" />
              Invite Agents
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-display font-semibold text-foreground">
          Your Team
        </CardTitle>
        <CardDescription className="font-body text-muted-foreground">
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
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-all hover-lift group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-semibold text-foreground">{agent.full_name}</h4>
                    <Badge variant="outline" className="font-body">{agent.referral_code}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
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
                  <div className="text-lg font-display font-bold text-purple-600 dark:text-purple-400">
                    ${agentOverrideTotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
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