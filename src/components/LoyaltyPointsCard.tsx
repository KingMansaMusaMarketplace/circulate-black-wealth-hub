
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, Award, Sparkles } from 'lucide-react';
import { useLoyalty } from '@/hooks/use-loyalty';
import { motion } from 'framer-motion';

interface LoyaltyPointsCardProps {
  points?: number;
  target?: number;
  saved?: number;
}

const LoyaltyPointsCard: React.FC<LoyaltyPointsCardProps> = ({
  points,
  target = 500,
  saved = 0
}) => {
  const { loyaltyPoints, pointsHistory, isLoading, nextRewardThreshold, currentTier } = useLoyalty();
  
  // Use provided points or fall back to the points from the hook
  const displayPoints = points !== undefined ? points : loyaltyPoints;
  const displayTarget = target || nextRewardThreshold;
  
  // Calculate the points earned this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const pointsThisMonth = pointsHistory
    ? pointsHistory
        .filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === currentMonth && 
                 entryDate.getFullYear() === currentYear &&
                 entry.type === 'earned';
        })
        .reduce((total, entry) => total + entry.points, 0)
    : 0;
  
  // Calculate progress percentage toward next tier/reward
  const progress = displayTarget > 0 
    ? Math.min(Math.floor((displayPoints / displayTarget) * 100), 100) 
    : 0;

  return (
    <Card className="overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Loyalty Points</h3>
          </div>
          {currentTier && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              {currentTier} Tier
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 -mt-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-white/20">
          <div className="flex items-end justify-between mb-4">
            <div>
              <motion.div 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLoading ? '---' : displayPoints?.toLocaleString() || 0}
              </motion.div>
              <span className="text-white/90 text-sm font-medium">Total Points</span>
            </div>
            
            {pointsThisMonth > 0 && (
              <div className="flex items-center text-green-400">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="font-medium">{pointsThisMonth}</span>
                <span className="text-xs ml-1">this month</span>
              </div>
            )}
          </div>
          
          {displayTarget > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span className="font-medium">Progress to next reward</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between items-center text-xs text-white/90">
                <span>Current</span>
                <div className="flex items-center text-yellow-400 font-medium">
                  <Award className="h-3 w-3 mr-1" />
                  <span>{displayTarget - displayPoints} points to go</span>
                </div>
              </div>
            </div>
          )}
          
          {saved > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/90 font-medium">Total Savings</span>
                <span className="font-bold text-green-400">${saved.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
