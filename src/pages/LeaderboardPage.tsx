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
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'silver':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-300';
    }
  };

  const getRankCardClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-2 border-yellow-500 bg-yellow-50/50';
      case 2:
        return 'border-2 border-gray-400 bg-gray-50/50';
      case 3:
        return 'border-2 border-amber-600 bg-amber-50/50';
      default:
        return '';
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
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Agent Leaderboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Celebrating our top performing sales agents
          </p>
        </div>

        {/* Time Period Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Leaderboard Period</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all_time">All Time</TabsTrigger>
                <TabsTrigger value="yearly">This Year</TabsTrigger>
                <TabsTrigger value="quarterly">This Quarter</TabsTrigger>
                <TabsTrigger value="monthly">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Performers - {getTimePeriodLabel()}
            </CardTitle>
            <CardDescription>
              Ranked by total referrals and active subscriptions
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
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {entry.total_referrals}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total Referrals
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {entry.active_referrals}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
        <Card className="bg-primary/5">
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
