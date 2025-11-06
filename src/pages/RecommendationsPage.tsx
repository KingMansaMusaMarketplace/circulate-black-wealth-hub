import React from 'react';
import { AIRecommendations } from '@/components/recommendations/AIRecommendations';
import { AchievementsBadges } from '@/components/gamification/AchievementsBadge';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { Leaderboard } from '@/components/gamification/Leaderboard';

const RecommendationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover & Achieve</h1>
        <p className="text-muted-foreground">
          Personalized recommendations and track your community impact
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <AIRecommendations />
          <AchievementsBadges />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StreakTracker />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
