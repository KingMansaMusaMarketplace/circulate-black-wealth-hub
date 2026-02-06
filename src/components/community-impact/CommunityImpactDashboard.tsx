
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityImpact } from './hooks/useCommunityImpact';
import { formatCurrency, formatNumber } from './utils/formatters';
import { shareImpact } from './utils/socialShare';
import HeroSection from './HeroSection';
import QuickStatsOverview from './QuickStatsOverview';
import PersonalImpactCards from './PersonalImpactCards';
import MultiplierEffectCard from './MultiplierEffectCard';
import CommunityWideImpact from './CommunityWideImpact';
import ImpactGoals from './ImpactGoals';
import CallToActionSection from './CallToActionSection';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingUp } from 'lucide-react';

const CommunityImpactDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMetrics, communityMetrics, loading, hasRealData, userHasImpact } = useCommunityImpact(user?.id);

  console.log('Community Impact Debug:', { user: !!user, userMetrics, communityMetrics, loading, hasRealData });

  const handleShareImpact = () => shareImpact(userMetrics);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse shadow-lg bg-slate-800/50 border-white/10">
                <CardContent className="p-4">
                  <div className="h-6 bg-slate-700 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default metrics when no data available
  const defaultMetrics = {
    total_spending: 0,
    businesses_supported: 0,
    wealth_circulated: 0,
    circulation_multiplier: 0,
    estimated_jobs_created: 0
  };

  const defaultCommunityMetrics = {
    total_users: 0,
    total_businesses: 0,
    total_circulation: 0,
    total_transactions: 0,
    active_this_month: 0,
    estimated_jobs_created: 0
  };

  const displayUserMetrics = userMetrics || defaultMetrics;
  const displayCommunityMetrics = communityMetrics || defaultCommunityMetrics;

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <HeroSection user={user} />

      {/* Show empty state message when no real data */}
      {!hasRealData && (
        <Card className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Building Community Impact</p>
              <p className="text-sm text-white/70">
                As our community grows, you'll see real-time impact metrics here. 
                Start supporting businesses to contribute to the collective wealth circulation!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {user && (
        <>
          {/* Show getting started message for users with no impact yet */}
          {!userHasImpact && (
            <Card className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-amber-500/30">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-full">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Start Your Impact Journey</p>
                  <p className="text-sm text-white/70">
                    Visit and support Black-owned businesses to see your personal impact metrics grow!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Overview - Only show for authenticated users with impact */}
          {userHasImpact && <QuickStatsOverview displayUserMetrics={displayUserMetrics} />}

          {/* Personal Impact Cards - Only for authenticated users with impact */}
          {userHasImpact && (
            <PersonalImpactCards 
              userMetrics={displayUserMetrics}
              formatCurrency={formatCurrency}
              formatNumber={formatNumber}
            />
          )}

          {/* Wealth Circulation Explanation - Only for authenticated users with impact */}
          {userHasImpact && (
            <MultiplierEffectCard 
              userMetrics={displayUserMetrics}
              formatCurrency={formatCurrency}
              onShareImpact={handleShareImpact}
            />
          )}

          {/* Impact Goals - Only for authenticated users */}
          <ImpactGoals 
            userMetrics={displayUserMetrics}
            formatCurrency={formatCurrency}
          />
        </>
      )}

      {/* Community-Wide Impact - Show for everyone when there's real data */}
      {hasRealData && (
        <CommunityWideImpact 
          communityMetrics={displayCommunityMetrics}
          formatCurrency={formatCurrency}
          formatNumber={formatNumber}
        />
      )}

      {/* Call to Action */}
      <CallToActionSection user={user} />
    </div>
  );
};

export default CommunityImpactDashboard;

