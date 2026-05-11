import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AIRecommendations } from '@/components/recommendations/AIRecommendations';
import { AchievementsBadges } from '@/components/gamification/AchievementsBadge';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Users, Landmark, Award, Target, Gift, Share2, Lightbulb, Megaphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCommunityInvestments, useSavingsCircles } from '@/hooks/use-community-finance';
import { EnterpriseQuickAccessCard } from '@/components/business/EnterpriseQuickAccessCard';


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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.05), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white animate-fade-in">
              {getGreeting()}{user ? `, ${user.email?.split('@')[0]}` : ''}
            </h1>
            <p className="text-slate-400 text-lg">
              Your personalized hub for community impact and growth
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/features')}
              variant="outline"
              className="border-white/15 bg-transparent text-slate-200 hover:bg-white/5 hover:text-white hover:border-mansagold/40 transition-colors"
              data-tour="features-btn"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Discover Features
            </Button>
            <Button
              onClick={() => navigate('/share-impact')}
              className="bg-mansagold text-black hover:bg-mansagold/90 font-medium transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Impact
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-white/10 bg-slate-900/40 transition-colors hover:border-mansagold/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-xl">
                  <Sparkles className="w-6 h-6 text-mansagold" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">AI Recommendations</p>
                  <p className="text-2xl font-bold text-white">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-slate-900/40 transition-colors hover:border-mansagold/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-xl">
                  <Award className="w-6 h-6 text-mansagold" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Achievements</p>
                  <p className="text-2xl font-bold text-white">Track</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-slate-900/40 transition-colors hover:border-mansagold/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mansablue/15 ring-1 ring-mansablue/40 rounded-xl">
                  <Landmark className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Savings Circles</p>
                  <p className="text-2xl font-bold text-white">{circles?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-slate-900/40 transition-colors hover:border-mansagold/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-mansablue/15 ring-1 ring-mansablue/40 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Investments</p>
                  <p className="text-2xl font-bold text-white">{investments?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Promote Your Business CTA */}
        <Card className="border border-mansagold/30 bg-gradient-to-br from-mansagold/10 via-amber-500/5 to-transparent">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-mansagold/15 ring-1 ring-mansagold/40 rounded-xl">
                <Megaphone className="w-6 h-6 text-mansagold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Promote your business</h3>
                <p className="text-sm text-slate-400 max-w-xl">
                  Pin your listing at the top of category and city searches. Featured Placements start at $20/month — cancel anytime.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/business/featured-placement')}
              className="bg-mansagold text-black hover:bg-mansagold/90 font-medium whitespace-nowrap"
            >
              Get Featured
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

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
            {/* Enterprise quick access (only for Enterprise tier) */}
            <EnterpriseQuickAccessCard />

            {/* Streak Tracker */}
            <StreakTracker />

            {/* Leaderboard */}
            <Leaderboard />

            {/* Quick Actions */}
            <Card className="border border-white/10 bg-slate-900/40">
              <CardHeader>
                <CardTitle className="font-display tracking-tight flex items-center gap-2 text-xl text-white">
                  <div className="p-2 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-lg">
                    <Target className="w-5 h-5 text-mansagold" />
                  </div>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-slate-400">Explore community features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/challenges')}
                  className="w-full justify-start gap-2 text-slate-200 border-white/15 bg-transparent hover:bg-white/5 hover:text-white hover:border-mansagold/40 transition-colors"
                  variant="outline"
                >
                  <Target className="w-4 h-4" />
                  Group Challenges
                </Button>
                <Button 
                  onClick={() => navigate('/community-finance')}
                  className="w-full justify-start gap-2 text-slate-200 border-white/15 bg-transparent hover:bg-white/5 hover:text-white hover:border-mansagold/40 transition-colors"
                  variant="outline"
                >
                  <Landmark className="w-4 h-4" />
                  Community Finance
                </Button>
                <Button 
                  onClick={() => navigate('/directory')}
                  className="w-full justify-start gap-2 text-slate-200 border-white/15 bg-transparent hover:bg-white/5 hover:text-white hover:border-mansagold/40 transition-colors"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4" />
                  Discover Businesses
                </Button>
                <Button 
                  onClick={() => navigate('/community-impact')}
                  className="w-full justify-start gap-2 text-slate-200 border-white/15 bg-transparent hover:bg-white/5 hover:text-white hover:border-mansagold/40 transition-colors"
                  variant="outline"
                >
                  <Users className="w-4 h-4" />
                  View Impact
                </Button>
                <Button 
                  onClick={() => navigate('/business/featured-placement')}
                  className="w-full justify-start gap-2 text-slate-200 border-white/15 bg-transparent hover:bg-white/5 hover:text-white hover:border-mansagold/40 transition-colors"
                  variant="outline"
                >
                  <Megaphone className="w-4 h-4" />
                  Promote My Business
                </Button>
                <Button 
                  onClick={() => navigate('/referrals')}
                  className="w-full justify-start gap-2 bg-mansagold text-black hover:bg-mansagold/90 font-medium transition-colors"
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
