
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

const CommunityImpactDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMetrics, communityMetrics, loading } = useCommunityImpact(user?.id);

  console.log('Community Impact Debug:', { user: !!user, userMetrics, communityMetrics, loading });

  const handleShareImpact = () => shareImpact(userMetrics);

  // Show fallback data for demonstration purposes when no real data is available
  const fallbackUserMetrics = {
    total_spending: 1250,
    businesses_supported: 8,
    wealth_circulated: 2100,
    circulation_multiplier: 1.67,
    estimated_jobs_created: 0.12
  };

  const fallbackCommunityMetrics = {
    total_users: 2450,
    total_businesses: 187,
    total_circulation: 485000,
    total_transactions: 12500,
    active_this_month: 890,
    estimated_jobs_created: 48.5
  };

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

  // Use actual data if available, otherwise use fallback data
  const displayUserMetrics = userMetrics || fallbackUserMetrics;
  const displayCommunityMetrics = communityMetrics || fallbackCommunityMetrics;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="mb-4">
          <HeroSection user={user} />
        </div>

        {user && (
          <>
            {/* Quick Stats Overview - Only show for authenticated users */}
            <div className="mb-4">
              <QuickStatsOverview displayUserMetrics={displayUserMetrics} />
            </div>

            {/* Personal Impact Cards - Only for authenticated users */}
            <div className="mb-4">
              <PersonalImpactCards 
                userMetrics={displayUserMetrics}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
              />
            </div>

            {/* Wealth Circulation Explanation - Only for authenticated users */}
            <div className="mb-4">
              <MultiplierEffectCard 
                userMetrics={displayUserMetrics}
                formatCurrency={formatCurrency}
                onShareImpact={handleShareImpact}
              />
            </div>

            {/* Impact Goals - Only for authenticated users */}
            <div className="mb-4">
              <ImpactGoals 
                userMetrics={displayUserMetrics}
                formatCurrency={formatCurrency}
              />
            </div>
          </>
        )}

        {/* Community-Wide Impact - Show for everyone */}
        <div className="mb-4">
          <CommunityWideImpact 
            communityMetrics={displayCommunityMetrics}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        </div>

        {/* Call to Action */}
        <CallToActionSection user={user} />
      </div>
    </div>
  );
};

export default CommunityImpactDashboard;
