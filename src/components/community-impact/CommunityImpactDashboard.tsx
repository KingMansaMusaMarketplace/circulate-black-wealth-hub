
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunityImpact } from './hooks/useCommunityImpact';
import { formatCurrency, formatNumber } from './utils/formatters';
import { shareImpact } from './utils/socialShare';
import PersonalImpactCards from './PersonalImpactCards';
import MultiplierEffectCard from './MultiplierEffectCard';
import CommunityWideImpact from './CommunityWideImpact';
import ImpactGoals from './ImpactGoals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Users, DollarSign, Building2 } from 'lucide-react';

const CommunityImpactDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMetrics, communityMetrics, loading } = useCommunityImpact(user?.id);

  console.log('Community Impact Debug:', { user: !!user, userMetrics, communityMetrics, loading });

  const handleShareImpact = () => shareImpact(userMetrics);

  // Show fallback data for demonstration purposes
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
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use actual data if available, otherwise use fallback data
  const displayUserMetrics = userMetrics || fallbackUserMetrics;
  const displayCommunityMetrics = communityMetrics || fallbackCommunityMetrics;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Community Impact</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how your support of Black-owned businesses creates real wealth circulation and job opportunities in our community
        </p>
        
        {/* Show notice if using fallback data */}
        {!userMetrics && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-2 text-blue-700 text-sm">
            <AlertCircle className="h-4 w-4" />
            Showing sample data - Start shopping to see your real impact!
          </div>
        )}
      </motion.div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(displayUserMetrics.total_spending)}</p>
                <p className="text-sm text-gray-600">You've Spent</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{displayUserMetrics.businesses_supported}</p>
                <p className="text-sm text-gray-600">Businesses Helped</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(displayUserMetrics.wealth_circulated)}</p>
                <p className="text-sm text-gray-600">Wealth Circulated</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{displayUserMetrics.estimated_jobs_created.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Jobs Supported</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Impact Cards */}
      <PersonalImpactCards 
        userMetrics={displayUserMetrics}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
      />

      {/* Wealth Circulation Explanation */}
      <MultiplierEffectCard 
        userMetrics={displayUserMetrics}
        formatCurrency={formatCurrency}
        onShareImpact={handleShareImpact}
      />

      {/* Community-Wide Impact */}
      <CommunityWideImpact 
        communityMetrics={displayCommunityMetrics}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
      />

      {/* Impact Goals */}
      <ImpactGoals 
        userMetrics={displayUserMetrics}
        formatCurrency={formatCurrency}
      />

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Increase Your Impact?</h3>
          <p className="mb-4 text-blue-100">
            Discover more Black-owned businesses in your area and continue building community wealth.
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-white text-mansablue hover:bg-gray-100">
              Find Businesses
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityImpactDashboard;
