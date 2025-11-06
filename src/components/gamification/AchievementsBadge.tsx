import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Zap, Target } from 'lucide-react';
import { useGamification } from '@/hooks/use-gamification';
import { Skeleton } from '@/components/ui/skeleton';
import { ShareButton } from '@/components/social-share/ShareButton';
import { generateAchievementShareText } from '@/utils/social-share';

export const AchievementsBadges: React.FC = () => {
  const { achievements, isLoading } = useGamification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'first_purchase':
        return <Zap className="w-5 h-5" />;
      case 'streak':
        return <Target className="w-5 h-5" />;
      case 'community':
        return <Award className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <CardTitle>Your Achievements</CardTitle>
        </div>
        <CardDescription>
          {achievements?.length || 0} achievements unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="border-2 border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    {getIcon(achievement.achievement_type)}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{achievement.achievement_name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      +{achievement.points_awarded} pts
                    </Badge>
                    <ShareButton
                      data={generateAchievementShareText(achievement)}
                      variant="ghost"
                      size="icon"
                      showLabel={false}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No achievements yet. Start shopping to unlock rewards!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
