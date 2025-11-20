import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry, TimePeriod } from '@/lib/api/leaderboard-api';
import { toast } from 'sonner';

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all_time');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timePeriod]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard(timePeriod);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <Trophy className="h-8 w-8 text-mansagold animate-bounce-subtle drop-shadow-lg" />
            <div className="absolute inset-0 animate-pulse bg-mansagold/20 rounded-full blur-xl"></div>
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <Medal className="h-7 w-7 text-gray-400 drop-shadow-md" />
            <div className="absolute inset-0 bg-gray-300/20 rounded-full blur-lg"></div>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <Award className="h-7 w-7 text-amber-600 drop-shadow-md" />
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg"></div>
          </div>
        );
      default:
        return <span className="text-2xl font-bold bg-gradient-to-br from-primary to-mansablue bg-clip-text text-transparent">#{rank}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg shadow-purple-200';
      case 'gold':
        return 'bg-gradient-to-r from-mansagold to-yellow-400 text-white border-mansagold-dark shadow-lg shadow-mansagold/30';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-400 shadow-lg shadow-gray-200';
      default:
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-lg shadow-amber-200';
    }
  };

  const getRankCardClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-2 border-mansagold bg-slate-800/40 backdrop-blur-sm shadow-lg shadow-mansagold/20 hover:shadow-xl hover:shadow-mansagold/30';
      case 2:
        return 'border-2 border-gray-400 bg-slate-800/40 backdrop-blur-sm shadow-lg shadow-gray-400/20 hover:shadow-xl';
      case 3:
        return 'border-2 border-amber-500 bg-slate-800/40 backdrop-blur-sm shadow-lg shadow-amber-500/20 hover:shadow-xl';
      default:
        return 'border border-white/10 bg-slate-800/30 backdrop-blur-sm hover:shadow-md hover:border-white/20';
    }
  };

  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case 'monthly':
        return 'This Month';
      case 'quarterly':
        return 'This Quarter';
      case 'yearly':
        return 'This Year';
      default:
        return 'All Time';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mansagold mx-auto mb-4"></div>
            <p className="text-white/70">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Helmet>
        <title>Sales Agent Leaderboard | Mansa Musa Marketplace</title>
        <meta name="description" content="View top performing sales agents and their achievements" />
      </Helmet>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 via-primary/10 to-mansagold/20"></div>
          <div className="relative text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Trophy className="h-10 w-10 text-mansagold animate-bounce-subtle" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-mansagold to-white bg-clip-text text-transparent">
                Agent Leaderboard
              </h1>
            </div>
            <p className="text-xl text-white/90 font-medium">
              🏆 Celebrating our top performing sales agents 🌟
            </p>
          </div>
        </div>

        {/* Time Period Filter */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
              📅 Leaderboard Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-white/10">
                <TabsTrigger value="all_time" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-primary data-[state=active]:text-white">All Time</TabsTrigger>
                <TabsTrigger value="yearly" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-mansagold data-[state=active]:text-white">This Year</TabsTrigger>
                <TabsTrigger value="quarterly" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-mansablue data-[state=active]:text-white">This Quarter</TabsTrigger>
                <TabsTrigger value="monthly" className="text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-mansagold data-[state=active]:text-white">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-mansablue/20 via-primary/10 to-mansagold/20 border-b border-white/10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-mansablue to-primary rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
                Top Performers - {getTimePeriodLabel()}
              </span>
            </CardTitle>
            <CardDescription className="text-base text-white/70">
              🎯 Ranked by total referrals and active subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-white/40 mx-auto mb-4 opacity-50" />
                <p className="text-lg text-white/70">
                  No agents on the leaderboard yet for this period
                </p>
                <p className="text-sm text-white/60 mt-2">
                  Be the first to earn referrals and claim the top spot!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.agent_id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-md ${getRankCardClass(entry.rank)}`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-16">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate text-white">
                          {entry.agent_name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getTierColor(entry.tier)}`}
                        >
                          {entry.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 font-mono">
                        Code: {entry.referral_code}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-center">
                      <div className="bg-mansablue/20 backdrop-blur-sm px-4 py-3 rounded-lg border border-mansablue/30">
                        <p className="text-3xl font-bold bg-gradient-to-r from-mansablue to-blue-300 bg-clip-text text-transparent">
                          {entry.total_referrals}
                        </p>
                        <p className="text-xs text-white/70 font-semibold">
                          Total Referrals
                        </p>
                      </div>
                      <div className="bg-green-500/20 backdrop-blur-sm px-4 py-3 rounded-lg border border-green-400/30">
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          {entry.active_referrals}
                        </p>
                        <p className="text-xs text-green-300 font-semibold">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-mansagold" />
                How Rankings Work
              </h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Agents are ranked by total referrals first, then by active subscriptions</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Achieve higher tiers (Silver, Gold, Platinum) by earning more referrals</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Rankings update in real-time as new referrals are made</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Use time filters to see performance across different periods</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
