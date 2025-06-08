
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useCommunityImpact } from './hooks/useCommunityImpact';
import { formatCurrency, formatNumber } from './utils/formatters';
import { shareImpact } from './utils/socialShare';
import PersonalImpactCards from './PersonalImpactCards';
import MultiplierEffectCard from './MultiplierEffectCard';
import CommunityWideImpact from './CommunityWideImpact';
import ImpactGoals from './ImpactGoals';
import { Card, CardContent } from '@/components/ui/card';

const CommunityImpactDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMetrics, communityMetrics, loading } = useCommunityImpact(user?.id);

  const handleShareImpact = () => shareImpact(userMetrics);

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
      </motion.div>

      {/* Personal Impact Cards */}
      <PersonalImpactCards 
        userMetrics={userMetrics}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
      />

      {/* Wealth Circulation Explanation */}
      <MultiplierEffectCard 
        userMetrics={userMetrics}
        formatCurrency={formatCurrency}
        onShareImpact={handleShareImpact}
      />

      {/* Community-Wide Impact */}
      <CommunityWideImpact 
        communityMetrics={communityMetrics}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
      />

      {/* Impact Goals */}
      <ImpactGoals 
        userMetrics={userMetrics}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default CommunityImpactDashboard;
