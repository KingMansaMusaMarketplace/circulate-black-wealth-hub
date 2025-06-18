
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Building2, Briefcase, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityMetrics {
  total_users: number;
  total_businesses: number;
  total_circulation: number;
  total_transactions: number;
  active_this_month: number;
  estimated_jobs_created: number;
}

interface CommunityWideImpactProps {
  communityMetrics: CommunityMetrics | null;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
}

const CommunityWideImpact: React.FC<CommunityWideImpactProps> = ({
  communityMetrics,
  formatCurrency,
  formatNumber
}) => {
  const activityPercentage = communityMetrics 
    ? Math.round(((communityMetrics.active_this_month || 0) / (communityMetrics.total_users || 1)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-6"
    >
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                <Trophy className="h-5 w-5 mr-2 text-mansagold" />
                Community-Wide Impact
              </CardTitle>
              <CardDescription className="text-base text-gray-600 mt-1">
                See how our entire community is building wealth together
              </CardDescription>
            </div>
            <div className="hidden md:block">
              <div className="bg-mansablue/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-mansablue" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(communityMetrics?.total_circulation || 0)}
                </div>
              </div>
              <div className="text-sm font-semibold text-green-800 mb-1">Total Wealth Circulated</div>
              <div className="text-xs text-green-600 flex items-center justify-center">
                <Users className="h-3 w-3 mr-1" />
                by {formatNumber(communityMetrics?.total_users || 0)} community members
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                <div className="text-2xl font-bold text-blue-700">
                  {formatNumber(communityMetrics?.total_businesses || 0)}
                </div>
              </div>
              <div className="text-sm font-semibold text-blue-800 mb-1">Black-Owned Businesses</div>
              <div className="text-xs text-blue-600">supported by our community</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                <div className="text-2xl font-bold text-purple-700">
                  {formatNumber(communityMetrics?.estimated_jobs_created || 0)}
                </div>
              </div>
              <div className="text-sm font-semibold text-purple-800 mb-1">Jobs Supported</div>
              <div className="text-xs text-purple-600">estimated job equivalents created</div>
            </motion.div>
          </div>

          {/* Community Activity Section */}
          <div className="bg-gradient-to-r from-mansablue/5 to-mansablue/10 rounded-lg p-4 border border-mansablue/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Activity className="h-4 w-4 text-mansablue mr-2" />
                <span className="text-base font-semibold text-gray-800">Community Activity This Month</span>
              </div>
              <Badge variant="secondary" className="bg-mansablue text-white px-2 py-1 text-sm">
                {formatNumber(communityMetrics?.active_this_month || 0)} active members
              </Badge>
            </div>
            <Progress 
              value={activityPercentage} 
              className="h-2 mb-2"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {activityPercentage}% of community members were active this month
              </span>
              <span className="font-medium text-mansablue">
                {formatNumber(communityMetrics?.total_transactions || 0)} transactions
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

export default CommunityWideImpact;
