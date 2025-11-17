import React from 'react';
import { AIRecommendations } from '@/components/recommendations/AIRecommendations';
import { AchievementsBadges } from '@/components/gamification/AchievementsBadge';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { Leaderboard } from '@/components/gamification/Leaderboard';

const RecommendationsPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Dark gradient mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-10 animate-fade-in">
          <div className="relative inline-block w-full max-w-4xl mx-auto">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue/40 via-mansagold/40 to-blue-600/40 rounded-3xl blur-2xl animate-pulse"></div>
            
            {/* Glass card */}
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden">
              {/* Shimmer effect on top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mansagold to-transparent animate-pulse"></div>
              
              {/* Gradient orb decoration */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-mansagold/30 to-transparent rounded-full blur-3xl"></div>
              
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent pt-2 relative">
                Discover & <span className="bg-gradient-to-r from-mansagold via-amber-400 to-yellow-300 bg-clip-text text-transparent">Achieve</span> ✨
              </h1>
              <p className="text-blue-100/90 text-xl font-medium relative">
                Personalized recommendations and track your community impact 🎯
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
          <AIRecommendations />
          <AchievementsBadges />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <StreakTracker />
          <Leaderboard />
        </div>
      </div>
    </div>
    </div>
  );
};

export default RecommendationsPage;
