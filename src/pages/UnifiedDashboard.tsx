import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AIRecommendations } from '@/components/recommendations/AIRecommendations';
import { AchievementsBadges } from '@/components/gamification/AchievementsBadge';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Landmark, Award, Target, Gift, Share2, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommunityInvestments, useSavingsCircles } from '@/hooks/use-community-finance';
import { BusinessFeaturesTour } from '@/components/onboarding/BusinessFeaturesTour';

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { investments } = useCommunityInvestments();
  const { circles } = useSavingsCircles();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansablue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

      <BusinessFeaturesTour />
      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent animate-fade-in">
              {getGreeting()}{user ? `, ${user.email?.split('@')[0]}` : ''}!
            </h1>
            <p className="text-slate-300 text-lg">
              Your personalized hub for community impact and growth
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/features')}
              variant="outline"
              className="border-mansablue/30 hover:border-mansablue hover:bg-mansablue/5 transition-all duration-300"
              data-tour="features-btn"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Discover Features
            </Button>
            <Button
              onClick={() => navigate('/share-impact')}
              className="bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue-dark hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Impact
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-mansablue to-blue-600 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">AI Recommendations</p>
                  <p className="text-2xl font-bold text-white">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-mansagold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-mansagold to-amber-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Achievements</p>
                  <p className="text-2xl font-bold text-white">Track</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-mansablue to-blue-600 rounded-xl shadow-lg">
                  <Landmark className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Savings Circles</p>
                  <p className="text-2xl font-bold text-white">{circles?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-mansagold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-mansagold to-amber-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Investments</p>
                  <p className="text-2xl font-bold text-white">{investments?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommendations */}
            <AIRecommendations />

            {/* Achievements */}
            <AchievementsBadges />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Streak Tracker */}
            <StreakTracker />

            {/* Leaderboard */}
            <Leaderboard />

            {/* Quick Actions */}
            <Card className="border-2 border-border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/10 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 bg-gradient-to-br from-mansablue to-mansablue-dark rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-mansablue to-mansagold bg-clip-text text-transparent">Quick Actions</span>
                </CardTitle>
                <CardDescription>Explore community features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <Button 
                  onClick={() => navigate('/challenges')}
                  className="w-full justify-start gap-2 hover:bg-mansablue/5 hover:border-mansablue/30 transition-all duration-300"
                  variant="outline"
                >
                  <Target className="w-4 h-4" />
                  Group Challenges
                </Button>
                <Button 
                  onClick={() => navigate('/community-finance')}
                  className="w-full justify-start gap-2 hover:bg-mansagold/5 hover:border-mansagold/30 transition-all duration-300"
                  variant="outline"
                >
                  <Landmark className="w-4 h-4" />
                  Community Finance
                </Button>
                <Button 
                  onClick={() => navigate('/businesses')}
                  className="w-full justify-start gap-2 hover:bg-mansablue/5 hover:border-mansablue/30 transition-all duration-300"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4" />
                  Discover Businesses
                </Button>
                <Button 
                  onClick={() => navigate('/community-impact')}
                  className="w-full justify-start gap-2 hover:bg-mansagold/5 hover:border-mansagold/30 transition-all duration-300"
                  variant="outline"
                >
                  <Users className="w-4 h-4" />
                  View Impact
                </Button>
                <Button 
                  onClick={() => navigate('/referrals')}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-mansablue to-mansagold hover:from-mansablue-dark hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <Gift className="w-4 h-4" />
                  Earn Rewards
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
