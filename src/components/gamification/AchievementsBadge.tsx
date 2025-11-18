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
      <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-slate-700" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-slate-700" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-mansagold" />
          <CardTitle className="text-white">Your Achievements</CardTitle>
        </div>
        <CardDescription className="text-blue-200/70">
          {achievements?.length || 0} achievements earned
        </CardDescription>
      </CardHeader>
      <CardContent>
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-slate-900/60 border-mansagold/30 hover:border-mansagold hover:shadow-lg hover:shadow-mansagold/20 transition-all">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-mansagold/20 to-amber-500/20 border border-mansagold/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-mansagold">{getIcon(achievement.achievement_type)}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 text-white">{achievement.achievement_name}</h4>
                  <p className="text-xs text-blue-300/60 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-mansablue/30 text-blue-200 border-mansablue/50">
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
            <Trophy className="w-12 h-12 text-blue-300/30 mx-auto mb-4" />
            <p className="text-blue-200/70">
              No achievements yet. Start making purchases to earn rewards!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
