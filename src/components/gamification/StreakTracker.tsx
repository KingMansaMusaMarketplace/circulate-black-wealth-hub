import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Calendar } from 'lucide-react';
import { useGamification } from '@/hooks/use-gamification';

export const StreakTracker: React.FC = () => {
  const { streaks } = useGamification();

  const shoppingStreak = streaks?.find((s) => s.streak_type === 'shopping');

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <CardTitle className="text-orange-900">Shopping Streak</CardTitle>
        </div>
        <CardDescription>Keep the momentum going!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-orange-600">
                {shoppingStreak?.current_streak || 0}
              </p>
              <p className="text-sm text-muted-foreground">days in a row</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Personal Best</p>
              <p className="text-2xl font-bold text-orange-500">
                {shoppingStreak?.longest_streak || 0}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next milestone</span>
              <span className="font-medium">{((shoppingStreak?.current_streak || 0) % 7) + 1} / 7 days</span>
            </div>
            <Progress 
              value={((shoppingStreak?.current_streak || 0) % 7) * (100 / 7)} 
              className="h-2"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
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
