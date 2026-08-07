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

  // Prefer the user's chosen display name, then full_name / fullName from
  // metadata, then a humanized email prefix as a last resort.
  const getDisplayName = () => {
    if (!user) return '';
    const m: any = user.user_metadata || {};
    const candidate =
      m.display_name ||
      m.displayName ||
      m.full_name ||
      m.fullName ||
      m.first_name ||
      m.firstName ||
      m.name ||
      '';
    if (candidate && typeof candidate === 'string') {
      return candidate.split(' ')[0];
    }
    const prefix = user.email?.split('@')[0] || '';
    // Capitalize and strip dots/underscores so "support" -> "Support"
    const cleaned = prefix.replace(/[._-]+/g, ' ').trim();
    return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : '';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const stats = [
    { label: 'AI Recommendations', value: 'Ready', hint: 'Personalized picks', Icon: Sparkles, tone: 'gold' as const },
    { label: 'Achievements', value: 'Track', hint: 'Milestones earned', Icon: Award, tone: 'gold' as const },
    { label: 'Savings Circles', value: String(circles?.length || 0), hint: 'Active circles', Icon: Landmark, tone: 'blue' as const },
    { label: 'Investments', value: String(investments?.length || 0), hint: 'Community stakes', Icon: TrendingUp, tone: 'blue' as const },
  ];

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10 relative z-10 max-w-7xl">
        {/* Welcome Header */}
        <header className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 md:p-8 overflow-hidden">
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mansagold/60 to-transparent"
          />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-mansagold/80 font-medium">
                {today}
              </p>
              <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white animate-fade-in">
                {getGreeting()}{user ? `, ${getDisplayName()}` : ''}
              </h1>
              <p className="text-slate-400 text-base md:text-lg max-w-xl">
                Your personalized hub for community impact and growth
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
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
        </header>

        {/* Quick Stats Overview */}
        <section aria-label="Overview" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map(({ label, value, hint, Icon, tone }) => (
            <Card
              key={label}
              className="group border border-white/10 bg-slate-900/40 rounded-2xl transition-all duration-300 hover:border-mansagold/30 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-16px_hsl(var(--mansagold)/0.35)]"
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ring-1 transition-colors ${
                      tone === 'gold'
                        ? 'bg-mansagold/10 ring-mansagold/30 group-hover:bg-mansagold/15'
                        : 'bg-mansablue/15 ring-mansablue/40 group-hover:bg-mansablue/25'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${tone === 'gold' ? 'text-mansagold' : 'text-blue-300'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate">
                      {label}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-white leading-tight mt-1">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Promote Your Business CTA */}
        <Card className="relative overflow-hidden border border-mansagold/30 rounded-2xl bg-slate-900/60 bg-gradient-to-br from-mansagold/10 via-amber-500/[0.04] to-transparent">
          <div
            aria-hidden
            className="absolute -top-24 -right-16 w-64 h-64 rounded-full bg-mansagold/10 blur-3xl pointer-events-none"
          />
          <CardContent className="p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between relative">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-mansagold/15 ring-1 ring-mansagold/40 rounded-xl shrink-0">
                <Megaphone className="w-6 h-6 text-mansagold" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white font-display tracking-tight">
                  Promote your business
                </h3>
                <p className="text-sm text-slate-400 max-w-xl mt-1">
                  Pin your listing at the top of category and city searches. Featured Placements start at $20/month — cancel anytime.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/business/featured-placement')}
              className="bg-mansagold text-black hover:bg-mansagold/90 font-medium whitespace-nowrap group"
            >
              Get Featured
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
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
