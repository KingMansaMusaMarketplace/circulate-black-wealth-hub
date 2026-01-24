import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface RoundStatusTrackerProps {
  circleId: string;
  currentRound: number;
  contributionAmount: number;
  maxMembers: number;
}

interface EscrowContribution {
  contributor_id: string;
  amount: number;
  status: string;
}

const RoundStatusTracker: React.FC<RoundStatusTrackerProps> = ({
  circleId,
  currentRound,
  contributionAmount,
  maxMembers
}) => {
  // Fetch contributions for current round
  const { data: contributions, isLoading } = useQuery({
    queryKey: ['round-contributions', circleId, currentRound],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('susu_escrow')
        .select('contributor_id, amount, status')
        .eq('circle_id', circleId)
        .eq('round_number', currentRound);
      if (error) throw error;
      return data as EscrowContribution[];
    }
  });

  // Fetch all members
  const { data: members } = useQuery({
    queryKey: ['susu-members-status', circleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('susu_memberships')
        .select('user_id, payout_position')
        .eq('circle_id', circleId)
        .order('payout_position', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const totalMembers = members?.length || 0;
  const paidCount = contributions?.filter(c => c.status === 'held' || c.status === 'released').length || 0;
  const progressPercent = totalMembers > 0 ? (paidCount / totalMembers) * 100 : 0;
  const totalCollected = contributions?.reduce((sum, c) => sum + c.amount, 0) || 0;
  const targetAmount = contributionAmount * totalMembers;

  const contributorIds = new Set(contributions?.map(c => c.contributor_id) || []);

  if (isLoading) {
    return (
      <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
        <CardContent className="p-6 text-center text-slate-400">
          Loading round status...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <span>Round {currentRound} Status</span>
          <Badge 
            className={progressPercent === 100 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }
          >
            {paidCount}/{totalMembers} Contributed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Collection Progress</span>
            <span className="text-mansagold font-semibold">
              ${totalCollected} / ${targetAmount}
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Member Status List */}
        <div className="space-y-2">
          <p className="text-sm text-slate-400 font-medium">Contribution Status</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {members?.map((member) => {
              const hasPaid = contributorIds.has(member.user_id);
              return (
                <div
                  key={member.user_id}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                    hasPaid 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'bg-slate-700/40 border border-slate-600/30'
                  }`}
                >
                  {hasPaid ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={hasPaid ? 'text-emerald-400' : 'text-slate-400'}>
                    Member #{member.payout_position}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Message */}
        {progressPercent === 100 ? (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 text-sm">
              All contributions received! Ready for payout.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p className="text-amber-400 text-sm">
              Waiting for {totalMembers - paidCount} more contribution(s).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoundStatusTracker;
