import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  economic_karma: number;
}

const KarmaLeaderboard: React.FC = () => {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['karma-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, economic_karma')
        .gt('economic_karma', 0)
        .order('economic_karma', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as LeaderboardEntry[];
    }
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Award className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return 'bg-slate-800/40 border-white/5';
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
        <CardContent className="p-6 text-center text-slate-400">
          Loading leaderboard...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-mansagold" />
          Community Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard?.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.id === user?.id;
          
          return (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                getRankBg(rank)
              } ${isCurrentUser ? 'ring-2 ring-mansagold/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(rank)}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-600 text-white text-sm">
                    {entry.display_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium flex items-center gap-2">
                    {entry.display_name || 'Anonymous'}
                    {isCurrentUser && (
                      <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30 text-xs">
                        You
                      </Badge>
                    )}
                  </p>
                  <p className="text-slate-500 text-xs">Rank #{rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-mansagold font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {Math.round(entry.economic_karma)}
                </p>
                <p className="text-slate-500 text-xs">karma</p>
              </div>
            </div>
          );
        })}

        {(!leaderboard || leaderboard.length === 0) && (
          <div className="text-center py-6">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400">No karma scores yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KarmaLeaderboard;
