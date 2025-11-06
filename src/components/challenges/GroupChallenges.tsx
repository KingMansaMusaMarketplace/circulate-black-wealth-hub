import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import { useGroupChallenges } from '@/hooks/use-group-challenges';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export const GroupChallenges: React.FC = () => {
  const { challenges, myChallenges, isLoading, joinChallenge } = useGroupChallenges();

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'spending':
        return <TrendingUp className="h-5 w-5" />;
      case 'visits':
        return <Users className="h-5 w-5" />;
      case 'reviews':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getChallengeTypeLabel = (type: string) => {
    switch (type) {
      case 'spending':
        return 'Total Spending';
      case 'visits':
        return 'Business Visits';
      case 'reviews':
        return 'Reviews Written';
      case 'referrals':
        return 'Referrals Made';
      default:
        return type;
    }
  };

  const isParticipating = (challengeId: string) => {
    return myChallenges.some(p => p.challenge_id === challengeId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No active challenges at the moment</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon for new community challenges!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community Challenges</h2>
        <p className="text-muted-foreground">
          Join forces with the community to achieve collective goals and earn rewards!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const progress = (Number(challenge.current_value) / Number(challenge.goal_value)) * 100;
          const participating = isParticipating(challenge.id);
          const daysLeft = formatDistanceToNow(new Date(challenge.end_date), { addSuffix: true });

          return (
            <Card key={challenge.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getChallengeIcon(challenge.challenge_type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {getChallengeTypeLabel(challenge.challenge_type)}
                      </CardDescription>
                    </div>
                  </div>
                  {participating && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      Joined
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{challenge.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {challenge.current_value.toLocaleString()} / {challenge.goal_value.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{challenge.participant_count} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Ends {daysLeft}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{challenge.reward_points} points reward</span>
                  </div>
                  {!participating && (
                    <Button
                      size="sm"
                      onClick={() => joinChallenge(challenge.id)}
                      className="gap-2"
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
