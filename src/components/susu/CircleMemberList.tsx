import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, CheckCircle, Clock, Calendar } from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

interface CircleMember {
  id: string;
  user_id: string;
  payout_position: number;
  has_received_payout: boolean;
  joined_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface CircleMemberListProps {
  circleId: string;
  creatorId: string;
  currentRound: number;
  frequency: string;
  createdAt: string;
  maxMembers: number;
}

const CircleMemberList: React.FC<CircleMemberListProps> = ({
  circleId,
  creatorId,
  currentRound,
  frequency,
  createdAt,
  maxMembers
}) => {
  const { data: members, isLoading } = useQuery({
    queryKey: ['susu-members', circleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('susu_memberships')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('circle_id', circleId)
        .order('payout_position', { ascending: true });
      if (error) throw error;
      return data as CircleMember[];
    }
  });

  const getPayoutDate = (position: number) => {
    const startDate = new Date(createdAt);
    switch (frequency) {
      case 'weekly':
        return addWeeks(startDate, position - 1);
      case 'biweekly':
        return addWeeks(startDate, (position - 1) * 2);
      case 'monthly':
      default:
        return addMonths(startDate, position - 1);
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
        <CardContent className="p-6 text-center text-slate-400">
          Loading members...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <span>Members & Payout Schedule</span>
          <Badge variant="outline" className="text-slate-400 border-slate-600">
            {members?.length || 0}/{maxMembers}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {members?.map((member, index) => {
          const isCreator = member.user_id === creatorId;
          const isCurrentRecipient = member.payout_position === currentRound;
          const payoutDate = getPayoutDate(member.payout_position);
          const isPast = payoutDate < new Date();

          return (
            <div
              key={member.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isCurrentRecipient
                  ? 'bg-mansagold/20 border border-mansagold/30'
                  : 'bg-slate-700/40 hover:bg-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-600 text-white">
                      #{member.payout_position}
                    </AvatarFallback>
                  </Avatar>
                  {isCreator && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-mansagold" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium flex items-center gap-2">
                    Position #{member.payout_position}
                    {isCurrentRecipient && (
                      <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 text-xs">
                        Current
                      </Badge>
                    )}
                  </p>
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Payout: {format(payoutDate, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div>
                {member.has_received_payout ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Received
                  </Badge>
                ) : isPast ? (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                    Scheduled
                  </Badge>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty slots */}
        {members && members.length < maxMembers && (
          <div className="pt-2">
            {Array.from({ length: maxMembers - members.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center p-3 rounded-lg bg-slate-800/40 border border-dashed border-slate-700 text-slate-500 text-sm"
              >
                Open slot #{members.length + i + 1}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CircleMemberList;
