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
        return 'border-2 border-mansagold bg-gradient-to-br from-mansagold/10 via-yellow-50 to-mansagold/5 shadow-lg shadow-mansagold/20 hover:shadow-xl hover:shadow-mansagold/30';
      case 2:
        return 'border-2 border-gray-400 bg-gradient-to-br from-gray-100 via-gray-50 to-white shadow-lg shadow-gray-200 hover:shadow-xl';
      case 3:
        return 'border-2 border-amber-500 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 shadow-lg shadow-amber-200 hover:shadow-xl';
      default:
        return 'border border-primary/20 bg-gradient-to-br from-background via-primary/5 to-mansablue/5 hover:shadow-md hover:border-primary/40';
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
      <ResponsiveLayout title="Agent Leaderboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Agent Leaderboard">
      <Helmet>
        <title>Sales Agent Leaderboard | Mansa Musa Marketplace</title>
        <meta name="description" content="View top performing sales agents and their achievements" />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mansablue via-primary to-mansagold p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Trophy className="h-10 w-10 text-mansagold animate-bounce-subtle" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-mansagold-light to-white bg-clip-text text-transparent">
                Agent Leaderboard
              </h1>
            </div>
            <p className="text-xl text-white/90 font-medium">
              🏆 Celebrating our top performing sales agents 🌟
            </p>
          </div>
        </div>

        {/* Time Period Filter */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-mansagold/5 to-mansablue/5">
          <CardHeader>
            <CardTitle className="text-center text-2xl bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
              📅 Leaderboard Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
              <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-primary/10 via-mansagold/10 to-mansablue/10">
                <TabsTrigger value="all_time" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-primary data-[state=active]:text-white">All Time</TabsTrigger>
                <TabsTrigger value="yearly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-mansagold data-[state=active]:text-white">This Year</TabsTrigger>
                <TabsTrigger value="quarterly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-mansablue data-[state=active]:text-white">This Quarter</TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-mansagold data-[state=active]:text-white">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-2 border-mansablue/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-mansablue/5 via-primary/5 to-mansagold/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-mansablue to-primary rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-mansablue via-primary to-mansagold bg-clip-text text-transparent">
                Top Performers - {getTimePeriodLabel()}
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              🎯 Ranked by total referrals and active subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">
                  No agents on the leaderboard yet for this period
                </p>
                <p className="text-sm text-muted-foreground mt-2">
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
                        <h3 className="font-semibold text-lg truncate">
                          {entry.agent_name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getTierColor(entry.tier)}`}
                        >
                          {entry.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        Code: {entry.referral_code}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-center">
                      <div className="bg-gradient-to-br from-mansablue/10 to-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                        <p className="text-3xl font-bold bg-gradient-to-r from-mansablue to-primary bg-clip-text text-transparent">
                          {entry.total_referrals}
                        </p>
                        <p className="text-xs text-muted-foreground font-semibold">
                          Total Referrals
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 px-4 py-3 rounded-lg border border-green-300">
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {entry.active_referrals}
                        </p>
                        <p className="text-xs text-green-700 font-semibold">
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
        <Card className="bg-gradient-to-br from-mansagold/10 via-primary/10 to-mansablue/10 border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                How Rankings Work
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
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
    </ResponsiveLayout>
  );
};

export default LeaderboardPage;
