import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useReferrals } from '@/hooks/use-referrals';
import { useAuth } from '@/contexts/AuthContext';

type TimeFilter = 'weekly' | 'monthly' | 'all-time';

interface LeaderboardEntry {
  id: string;
  rank: number;
  user_id: string;
  name: string;
  referrals: number;
  points: number;
  change?: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

export const LiveLeaderboard: React.FC = () => {
  const { leaderboard } = useReferrals();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');

  // Transform leaderboard data
  const entries: LeaderboardEntry[] = (leaderboard || []).map((entry: any, index: number) => ({
    id: entry.id || `entry-${index}`,
    rank: index + 1,
    user_id: entry.user_id,
    name: entry.profiles?.full_name || 'Anonymous',
    referrals: entry.successful_referrals || 0,
    points: entry.total_points_earned || 0,
    change: index < 3 ? 'up' : index > 5 ? 'down' : 'same',
    isCurrentUser: entry.user_id === user?.id,
  }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg"
          >
            <Crown className="w-5 h-5 text-yellow-900" />
          </motion.div>
        );
      case 2:
        return (
          <div className="p-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full">
            <Medal className="w-5 h-5 text-gray-700" />
          </div>
        );
      case 3:
        return (
          <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full">
            <Medal className="w-5 h-5 text-orange-900" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-full text-blue-200 font-bold">
            {rank}
          </div>
        );
    }
  };

  const getChangeIcon = (change?: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up':
        return <ChevronUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <ChevronDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white">Top Referrers</span>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
            Live
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-4">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-white/10">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-white/10">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="all-time" className="data-[state=active]:bg-white/10">
              All Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeFilter} className="mt-0">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      entry.isCurrentUser
                        ? 'bg-purple-500/20 border border-purple-400/50'
                        : entry.rank <= 3
                          ? 'bg-white/10'
                          : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {/* Rank */}
                    {getRankIcon(entry.rank)}

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium truncate ${
                          entry.isCurrentUser ? 'text-purple-300' : 'text-white'
                        }`}>
                          {entry.name}
                          {entry.isCurrentUser && (
                            <span className="ml-2 text-xs text-purple-400">(You)</span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-blue-200">
                        {entry.referrals} referrals • {entry.points.toLocaleString()} pts
                      </p>
                    </div>

                    {/* Change indicator */}
                    <div className="flex items-center gap-1">
                      {getChangeIcon(entry.change)}
                    </div>

                    {/* Prize indicator for top 3 */}
                    {entry.rank === 1 && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                        🏆 $500
                      </Badge>
                    )}
                    {entry.rank === 2 && (
                      <Badge className="bg-gray-400/20 text-gray-300 text-xs">
                        🥈 $250
                      </Badge>
                    )}
                    {entry.rank === 3 && (
                      <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                        🥉 $100
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {entries.length === 0 && (
                <div className="text-center py-8 text-blue-200">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No referrers yet this period</p>
                  <p className="text-sm">Be the first to claim the top spot!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Your position if not in top 10 */}
        {entries.length > 0 && !entries.find(e => e.isCurrentUser) && (
          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-400/30 rounded-xl">
            <p className="text-sm text-purple-300 text-center">
              You're not on the leaderboard yet. Start referring to climb the ranks! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
