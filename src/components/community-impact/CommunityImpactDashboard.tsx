
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
import { AlertCircle, TrendingUp, Users, DollarSign, Building2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Use actual data if available, otherwise use fallback data
  const displayUserMetrics = userMetrics || fallbackUserMetrics;
  const displayCommunityMetrics = communityMetrics || fallbackCommunityMetrics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user ? 'Your Community Impact' : 'Community Impact Dashboard'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {user 
              ? 'See how your support of Black-owned businesses creates real wealth circulation and job opportunities in our community'
              : 'Discover the collective impact of supporting Black-owned businesses in building community wealth'
            }
          </p>
          
          {/* Show different notices based on auth status */}
          {!user ? (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-flex flex-col items-center gap-3 text-blue-700">
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                <span className="text-sm">Sign in to track your personal impact</span>
              </div>
              <Link to="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign In to Get Started
                </Button>
              </Link>
            </div>
          ) : !userMetrics && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg inline-flex items-center gap-2 text-blue-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              Start shopping to see your real impact!
            </div>
          )}
        </motion.div>

        {user && (
          <>
            {/* Quick Stats Overview - Only show for authenticated users */}
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

            {/* Personal Impact Cards - Only for authenticated users */}
            <div className="mb-6">
              <PersonalImpactCards 
                userMetrics={displayUserMetrics}
                formatCurrency={formatCurrency}
                formatNumber={formatNumber}
              />
            </div>

            {/* Wealth Circulation Explanation - Only for authenticated users */}
            <div className="mb-6">
              <MultiplierEffectCard 
                userMetrics={displayUserMetrics}
                formatCurrency={formatCurrency}
                onShareImpact={handleShareImpact}
              />
            </div>

            {/* Impact Goals - Only for authenticated users */}
            <div className="mb-6">
              <ImpactGoals 
                userMetrics={displayUserMetrics}
                formatCurrency={formatCurrency}
              />
            </div>
          </>
        )}

        {/* Community-Wide Impact - Show for everyone */}
        <div className="mb-6">
          <CommunityWideImpact 
            communityMetrics={displayCommunityMetrics}
            formatCurrency={formatCurrency}
            formatNumber={formatNumber}
          />
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-mansablue to-mansablue-dark text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">
              {user ? 'Ready to Increase Your Impact?' : 'Ready to Make an Impact?'}
            </h3>
            <p className="mb-4 text-blue-100">
              {user 
                ? 'Discover more Black-owned businesses in your area and continue building community wealth.'
                : 'Join our community and start supporting Black-owned businesses to build wealth together.'
              }
            </p>
            <div className="flex gap-3 justify-center">
              {user ? (
                <>
                  <Link to="/directory">
                    <Button className="bg-white text-mansablue hover:bg-gray-100">
                      Find Businesses
                    </Button>
                  </Link>
                  <Link to="/scanner">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Scan QR Code
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="bg-white text-mansablue hover:bg-gray-100">
                      Join the Movement
                    </Button>
                  </Link>
                  <Link to="/directory">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Browse Businesses
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityImpactDashboard;
