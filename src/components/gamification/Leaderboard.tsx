import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { useGamification } from '@/hooks/use-gamification';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Leaderboard: React.FC = () => {
  const { leaderboard, isLoading } = useGamification();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-mansagold" />
          <CardTitle className="text-white">Community Leaders</CardTitle>
        </div>
        <CardDescription className="text-blue-200/70">Top supporters this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-blue-200/70 py-8">Loading leaderboard...</p>
          ) : leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((entry: any, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40 border border-white/5 hover:border-mansagold/30 hover:bg-slate-900/60 transition-all"
              >
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank || index + 1)}
                </div>
                <Avatar className="w-10 h-10 border-2 border-mansagold/30">
                  <AvatarFallback className="bg-slate-700 text-white">
                    {entry.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-white">
                    {entry.profiles?.full_name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-blue-300/60">
                    {entry.score} points
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-blue-200/70 py-8">
              No leaderboard data yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
