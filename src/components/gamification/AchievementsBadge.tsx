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
      <Card className="border-2 border-border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl">
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
    <Card className="border-2 border-border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-mansablue/10 to-transparent rounded-full blur-2xl" />
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Your Achievements</CardTitle>
            <CardDescription>
              {achievements?.length || 0} achievements earned
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-white dark:bg-gray-900 border-2 border-border hover:border-mansagold/40 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-mansagold to-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">{getIcon(achievement.achievement_type)}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-foreground">{achievement.achievement_name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="text-xs bg-gradient-to-r from-mansablue/10 to-mansagold/10 text-foreground border border-mansablue/20">
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
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No achievements yet. Start making purchases to earn rewards!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
