import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Snowflake, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useReferralCampaigns } from '@/hooks/use-referral-campaigns';

interface ReferralStreakWidgetProps {
  compact?: boolean;
}

export const ReferralStreakWidget: React.FC<ReferralStreakWidgetProps> = ({ compact = false }) => {
  const { streak } = useReferralCampaigns();

  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const isFrozen = streak?.streak_frozen_until && new Date(streak.streak_frozen_until) > new Date();

  // Determine fire intensity based on streak
  const getFireColor = () => {
    if (currentStreak >= 30) return 'from-purple-500 to-pink-500';
    if (currentStreak >= 14) return 'from-orange-500 to-red-500';
    if (currentStreak >= 7) return 'from-yellow-500 to-orange-500';
    if (currentStreak >= 3) return 'from-yellow-400 to-yellow-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStreakMessage = () => {
    if (isFrozen) return 'Streak frozen! 🥶';
    if (currentStreak >= 30) return 'LEGENDARY! 🔥💎';
    if (currentStreak >= 14) return 'On fire! 🔥🔥';
    if (currentStreak >= 7) return 'Heating up! 🔥';
    if (currentStreak >= 3) return 'Building momentum!';
    if (currentStreak >= 1) return 'Great start!';
    return 'Start your streak!';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
        <motion.div
          animate={currentStreak > 0 ? { 
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1 
          }}
          className={`p-2 rounded-lg bg-gradient-to-br ${getFireColor()}`}
        >
          {isFrozen ? (
            <Snowflake className="w-5 h-5 text-white" />
          ) : (
            <Flame className="w-5 h-5 text-white" />
          )}
        </motion.div>
        <div>
          <p className="text-2xl font-bold text-white">{currentStreak}</p>
          <p className="text-xs text-blue-200">day streak</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${getFireColor()} p-4`}>
        <div className="flex items-center gap-2">
          <motion.div
            animate={currentStreak > 0 ? { 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0],
            } : {}}
            transition={{ 
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.5 
            }}
          >
            {isFrozen ? (
              <Snowflake className="w-6 h-6 text-white" />
            ) : (
              <Flame className="w-6 h-6 text-white" />
            )}
          </motion.div>
          <span className="font-bold text-white">Referral Streak</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <motion.div
            key={currentStreak}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold text-white mb-1"
          >
            {currentStreak}
          </motion.div>
          <p className="text-blue-200">day streak</p>
          <Badge 
            className={`mt-2 ${
              currentStreak >= 7 
                ? 'bg-orange-500/20 text-orange-400' 
                : 'bg-white/10 text-blue-200'
            }`}
          >
            {getStreakMessage()}
          </Badge>
        </div>

        {/* Streak visualization */}
        <div className="flex justify-center gap-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < Math.min(currentStreak, 7)
                  ? `bg-gradient-to-br ${getFireColor()} text-white`
                  : 'bg-white/10 text-blue-300'
              }`}
            >
              {i < Math.min(currentStreak, 7) ? (
                <Flame className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xl font-bold text-white">{longestStreak}</span>
            </div>
            <p className="text-xs text-blue-200">Best Streak</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-xl font-bold text-white">{streak?.total_streak_days || 0}</span>
            </div>
            <p className="text-xs text-blue-200">Total Days</p>
          </div>
        </div>

        {/* Frozen status */}
        {isFrozen && streak?.streak_frozen_until && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-center">
            <p className="text-sm text-cyan-300">
              <Snowflake className="w-4 h-4 inline mr-1" />
              Streak frozen until {new Date(streak.streak_frozen_until).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Motivation */}
        {currentStreak === 0 && (
          <div className="text-center p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
            <p className="text-sm text-purple-300">
              Make a referral today to start your streak! 
              <br />
              <span className="text-xs">7-day streaks earn bonus rewards 🎁</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
