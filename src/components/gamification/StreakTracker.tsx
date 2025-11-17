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
    <Card className="bg-slate-800/60 backdrop-blur-xl border-mansagold/30 overflow-hidden relative">
      {/* Gradient decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/20 to-transparent rounded-bl-full blur-2xl"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-mansagold" />
            <CardTitle className="text-white">Shopping Streak</CardTitle>
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
        <CardDescription className="text-blue-200/70">Keep the momentum going!</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">
                {shoppingStreak?.current_streak || 0}
              </p>
              <p className="text-sm text-blue-300/70">days in a row</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-200">Personal Best</p>
              <p className="text-2xl font-bold text-mansagold">
                {shoppingStreak?.longest_streak || 0}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-300/70">Next milestone</span>
              <span className="font-medium text-white">{((shoppingStreak?.current_streak || 0) % 7) + 1} / 7 days</span>
            </div>
            <Progress 
              value={((shoppingStreak?.current_streak || 0) % 7) * (100 / 7)} 
              className="h-2 bg-slate-700"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-300/60 pt-2 border-t border-white/10">
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
