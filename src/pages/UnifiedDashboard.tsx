import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AIRecommendations } from '@/components/recommendations/AIRecommendations';
import { AchievementsBadges } from '@/components/gamification/AchievementsBadge';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Landmark, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommunityInvestments, useSavingsCircles } from '@/hooks/use-community-finance';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {getGreeting()}{user ? `, ${user.email?.split('@')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personalized hub for community impact and growth
          </p>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Recommendations</p>
                  <p className="text-2xl font-bold">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Award className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">Track</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Landmark className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Savings Circles</p>
                  <p className="text-2xl font-bold">{circles?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investments</p>
                  <p className="text-2xl font-bold">{investments?.length || 0}</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Explore community features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/community-finance')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Landmark className="w-4 h-4" />
                  Community Finance
                </Button>
                <Button 
                  onClick={() => navigate('/businesses')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4" />
                  Discover Businesses
                </Button>
                <Button 
                  onClick={() => navigate('/community-impact')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Users className="w-4 h-4" />
                  View Impact
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
