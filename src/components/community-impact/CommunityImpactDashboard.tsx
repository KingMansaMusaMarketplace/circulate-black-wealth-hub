
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building2,
  Target,
  Zap,
  ArrowUp,
  Share2,
  Trophy,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserImpactMetrics {
  total_spending: number;
  businesses_supported: number;
  transactions_count: number;
  estimated_jobs_created: number;
  wealth_circulated: number;
  circulation_multiplier: number;
}

interface CommunityMetrics {
  total_users: number;
  total_businesses: number;
  total_circulation: number;
  total_transactions: number;
  active_this_month: number;
  estimated_jobs_created: number;
}

const CommunityImpactDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userMetrics, setUserMetrics] = useState<UserImpactMetrics | null>(null);
  const [communityMetrics, setCommunityMetrics] = useState<CommunityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchImpactMetrics();
    }
  }, [user]);

  const fetchImpactMetrics = async () => {
    try {
      setLoading(true);

      // Fetch user impact metrics
      const { data: userImpactData, error: userError } = await supabase
        .rpc('calculate_user_impact_metrics', { p_user_id: user?.id });

      if (userError) {
        console.error('Error fetching user metrics:', userError);
      } else {
        setUserMetrics(userImpactData);
      }

      // Fetch community metrics
      const { data: communityData, error: communityError } = await supabase
        .rpc('get_community_impact_summary');

      if (communityError) {
        console.error('Error fetching community metrics:', communityError);
      } else {
        setCommunityMetrics(communityData);
      }

    } catch (error) {
      console.error('Error fetching impact metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const shareImpact = () => {
    if (userMetrics) {
      const text = `I've supported ${userMetrics.businesses_supported} Black-owned businesses and helped circulate ${formatCurrency(userMetrics.wealth_circulated)} in our community! 💪 #BlackOwnedBusinesses #CommunityWealth`;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Community Impact',
          text: text,
          url: window.location.origin
        });
      } else {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
      }
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Spending</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(userMetrics?.total_spending || 0)}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <Heart className="h-3 w-3 mr-1" />
                <span>Supporting community wealth</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Businesses Supported</CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(userMetrics?.businesses_supported || 0)}
              </div>
              <div className="text-sm text-blue-600">
                Unique businesses helped
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Wealth Circulated</CardTitle>
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(userMetrics?.wealth_circulated || 0)}
              </div>
              <div className="text-sm text-purple-600">
                {userMetrics?.circulation_multiplier}x multiplier effect
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Jobs Supported</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {userMetrics?.estimated_jobs_created?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-orange-600">
                Estimated job equivalents
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Wealth Circulation Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">The Multiplier Effect</CardTitle>
                <CardDescription className="text-blue-100">
                  How your spending creates exponential community impact
                </CardDescription>
              </div>
              <Button 
                onClick={shareImpact}
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Impact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-blue-100 mb-2">
                  When you spend {formatCurrency(userMetrics?.total_spending || 0)} at Black-owned businesses:
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Direct spending:</span>
                    <span className="font-bold">{formatCurrency(userMetrics?.total_spending || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community circulation:</span>
                    <span className="font-bold text-yellow-300">
                      {formatCurrency(userMetrics?.wealth_circulated || 0)}
                    </span>
                  </div>
                  <div className="text-xs text-blue-200 mt-2">
                    Black-owned businesses recirculate 67% more money in the community compared to non-Black businesses
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-300 mb-1">
                    {userMetrics?.circulation_multiplier}x
                  </div>
                  <div className="text-sm text-blue-100">
                    Economic Impact Multiplier
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community-Wide Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Community-Wide Impact
            </CardTitle>
            <CardDescription>
              See how our entire community is building wealth together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatCurrency(communityMetrics?.total_circulation || 0)}
                </div>
                <div className="text-sm text-green-700">Total Wealth Circulated</div>
                <div className="text-xs text-green-600 mt-1">
                  by {formatNumber(communityMetrics?.total_users || 0)} community members
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatNumber(communityMetrics?.total_businesses || 0)}
                </div>
                <div className="text-sm text-blue-700">Black-Owned Businesses</div>
                <div className="text-xs text-blue-600 mt-1">
                  supported by our community
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatNumber(communityMetrics?.estimated_jobs_created || 0)}
                </div>
                <div className="text-sm text-purple-700">Jobs Supported</div>
                <div className="text-xs text-purple-600 mt-1">
                  estimated job equivalents created
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Community Activity This Month</span>
                <Badge variant="secondary">
                  {formatNumber(communityMetrics?.active_this_month || 0)} active members
                </Badge>
              </div>
              <Progress 
                value={Math.min(((communityMetrics?.active_this_month || 0) / (communityMetrics?.total_users || 1)) * 100, 100)} 
                className="h-2"
              />
              <div className="text-xs text-gray-600 mt-1">
                {Math.round(((communityMetrics?.active_this_month || 0) / (communityMetrics?.total_users || 1)) * 100)}% 
                of community members were active this month
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Impact Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Your Impact Goals
            </CardTitle>
            <CardDescription>
              Milestones to increase your community impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Support 10 Different Businesses</span>
                  <Badge variant={userMetrics?.businesses_supported >= 10 ? "default" : "secondary"}>
                    {userMetrics?.businesses_supported || 0}/10
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(((userMetrics?.businesses_supported || 0) / 10) * 100, 100)} 
                  className="h-2"
                />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Create 1 Full-Time Job Equivalent</span>
                  <Badge variant={userMetrics?.estimated_jobs_created >= 1 ? "default" : "secondary"}>
                    {userMetrics?.estimated_jobs_created?.toFixed(1) || '0.0'}/1.0
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(((userMetrics?.estimated_jobs_created || 0) / 1) * 100, 100)} 
                  className="h-2"
                />
                <div className="text-xs text-gray-600 mt-1">
                  Spend {formatCurrency(10000 - (userMetrics?.total_spending || 0))} more to reach this goal
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Circulate $25K in Community Wealth</span>
                  <Badge variant={userMetrics?.wealth_circulated >= 25000 ? "default" : "secondary"}>
                    {formatCurrency(userMetrics?.wealth_circulated || 0)}/25K
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(((userMetrics?.wealth_circulated || 0) / 25000) * 100, 100)} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CommunityImpactDashboard;
