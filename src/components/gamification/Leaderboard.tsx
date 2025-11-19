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
    <Card className="border-2 border-border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/10 to-transparent rounded-full blur-2xl" />
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-mansagold to-amber-600 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Community Leaders</CardTitle>
            <CardDescription>Top supporters this week</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading leaderboard...</p>
          ) : leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((entry: any, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-border hover:border-mansagold/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank || index + 1)}
                </div>
                <Avatar className="w-10 h-10 border-2 border-mansagold/30">
                  <AvatarFallback className="bg-gradient-to-br from-mansablue to-mansablue-dark text-white">
                    {entry.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-foreground">
                    {entry.profiles?.full_name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.score} points
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No leaderboard data yet
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
