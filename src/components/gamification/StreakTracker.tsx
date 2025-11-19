import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Calendar } from 'lucide-react';
import { useGamification } from '@/hooks/use-gamification';
import { ShareButton } from '@/components/social-share/ShareButton';
import { generateStreakShareText } from '@/utils/social-share';

export const StreakTracker: React.FC = () => {
  const { streaks } = useGamification();

  const shoppingStreak = streaks?.find((s) => s.streak_type === 'shopping');

  return (
    <Card className="border-2 border-border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl overflow-hidden relative">
      {/* Gradient decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/10 to-transparent rounded-full blur-2xl"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-mansagold to-amber-600 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">Shopping Streak</CardTitle>
              <CardDescription>Keep the momentum going!</CardDescription>
            </div>
          </div>
          {shoppingStreak && shoppingStreak.current_streak > 0 && (
            <ShareButton
              data={generateStreakShareText(shoppingStreak)}
              variant="ghost"
              size="icon"
              showLabel={false}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">
                {shoppingStreak?.current_streak || 0}
              </p>
              <p className="text-sm text-muted-foreground">days in a row</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Personal Best</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-mansagold to-amber-600 bg-clip-text text-transparent">
                {shoppingStreak?.longest_streak || 0}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next milestone</span>
              <span className="font-medium text-foreground">{((shoppingStreak?.current_streak || 0) % 7) + 1} / 7 days</span>
            </div>
            <Progress 
              value={((shoppingStreak?.current_streak || 0) % 7) * (100 / 7)} 
              className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-mansablue [&>div]:to-mansagold"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
            <Calendar className="w-4 h-4" />
            <span>
              Last activity: {shoppingStreak?.last_activity_date 
                ? new Date(shoppingStreak.last_activity_date).toLocaleDateString()
                : 'Never'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
