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
        return <TrendingUp className="h-5 w-5" />;
      case 'visits':
        return <Target className="h-5 w-5" />;
      case 'reviews':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
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
      <Card key={challenge.id} className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getChallengeIcon(challenge.challenge_type)}
              </div>
              <div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription className="mt-1">{challenge.description}</CardDescription>
              </div>
            </div>
            {isParticipating && (
              <Badge variant="secondary" className="gap-1">
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
              <span className="text-muted-foreground">{getChallengeTypeLabel(challenge.challenge_type)}</span>
              <span className="font-medium">
                {challenge.current_value.toLocaleString()} / {challenge.goal_value.toLocaleString()}
              </span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">{progress.toFixed(1)}% complete</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold">{challenge.participant_count}</p>
              <p className="text-xs text-muted-foreground">Participants</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                <Trophy className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold">{challenge.reward_points}</p>
              <p className="text-xs text-muted-foreground">Points Reward</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium">{daysLeft}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
          </div>

          {/* Action Button */}
          {!isParticipating && (
            <Button
              onClick={() => joinChallenge(challenge.id)}
              className="w-full"
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
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Group Challenges</h1>
        <p className="text-muted-foreground">
          Join forces with the community to achieve collective goals and earn rewards
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="all" className="gap-2">
            <Target className="w-4 h-4" />
            All Challenges
          </TabsTrigger>
          <TabsTrigger value="mine" className="gap-2">
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
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active challenges at the moment</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for new opportunities!</p>
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
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You haven't joined any challenges yet</p>
                <p className="text-sm text-muted-foreground mt-2">Browse all challenges to get started!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupChallengesPage;
