import React from 'react';
import { useGroupChallenges } from '@/hooks/use-group-challenges';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GroupChallengesPage: React.FC = () => {
  const { challenges, myChallenges, isLoading, joinChallenge } = useGroupChallenges();

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'spending':
        return <TrendingUp className="h-5 w-5 text-mansagold" />;
      case 'visits':
        return <Target className="h-5 w-5 text-mansagold" />;
      case 'reviews':
        return <Trophy className="h-5 w-5 text-mansagold" />;
      default:
        return <Users className="h-5 w-5 text-mansagold" />;
    }
  };

  const getChallengeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      spending: 'Total Spending',
      visits: 'Business Visits',
      reviews: 'Reviews Written',
      referrals: 'Referrals Made',
    };
    return labels[type] || type;
  };

  const renderChallengeCard = (challenge: any, isParticipating: boolean = false) => {
    const progress = (challenge.current_value / challenge.goal_value) * 100;
    const daysLeft = formatDistanceToNow(new Date(challenge.end_date), { addSuffix: true });

    return (
      <Card key={challenge.id} className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-mansagold/20 rounded-lg">
                {getChallengeIcon(challenge.challenge_type)}
              </div>
              <div>
                <CardTitle className="text-lg text-white">{challenge.title}</CardTitle>
                <CardDescription className="mt-1 text-white/60">{challenge.description}</CardDescription>
              </div>
            </div>
            {isParticipating && (
              <Badge className="gap-1 bg-mansagold/20 text-mansagold border-mansagold/30">
                <Users className="h-3 w-3" />
                Joined
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">{getChallengeTypeLabel(challenge.challenge_type)}</span>
              <span className="font-medium text-white">
                {challenge.current_value.toLocaleString()} / {challenge.goal_value.toLocaleString()}
              </span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2 bg-white/10" />
            <p className="text-xs text-white/60">{progress.toFixed(1)}% complete</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-mansagold mb-1">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-white">{challenge.participant_count}</p>
              <p className="text-xs text-white/60">Participants</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-mansagold mb-1">
                <Trophy className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold text-white">{challenge.reward_points}</p>
              <p className="text-xs text-white/60">Points Reward</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-mansagold mb-1">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-white">{daysLeft}</p>
              <p className="text-xs text-white/60">Remaining</p>
            </div>
          </div>

          {/* Action Button */}
          {!isParticipating && (
            <Button
              onClick={() => joinChallenge(challenge.id)}
              className="w-full bg-mansagold hover:bg-mansagold/90 text-mansablue font-semibold"
            >
              Join Challenge
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-primary relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 py-8 space-y-6 relative z-10">
          <Skeleton className="h-12 w-64 bg-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansagold via-mansagold/80 to-mansagold rounded-t-2xl"></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              Group <span className="text-mansagold">Challenges</span> 🏆
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              Join forces with the community to achieve collective goals and earn rewards 🎯
            </p>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/20">
              <TabsTrigger value="all" className="gap-2 text-white data-[state=active]:bg-mansagold data-[state=active]:text-mansablue">
                <Target className="w-4 h-4" />
                All Challenges
              </TabsTrigger>
              <TabsTrigger value="mine" className="gap-2 text-white data-[state=active]:bg-mansagold data-[state=active]:text-mansablue">
                <Users className="w-4 h-4" />
                My Challenges ({myChallenges?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {challenges && challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {challenges.map((challenge) => {
                    const isParticipating = myChallenges?.some(
                      (mc: any) => mc.challenge_id === challenge.id
                    );
                    return renderChallengeCard(challenge, isParticipating);
                  })}
                </div>
              ) : (
                <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-12 w-12 text-mansagold mx-auto mb-4" />
                    <p className="text-white/70">No active challenges at the moment</p>
                    <p className="text-sm text-white/50 mt-2">Check back soon for new opportunities!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="mine" className="mt-6">
              {myChallenges && myChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myChallenges.map((participant: any) =>
                    renderChallengeCard(participant.group_challenges, true)
                  )}
                </div>
              ) : (
                <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-mansagold mx-auto mb-4" />
                    <p className="text-white/70">You haven't joined any challenges yet</p>
                    <p className="text-sm text-white/50 mt-2">Browse all challenges to get started!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default GroupChallengesPage;
