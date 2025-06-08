
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
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
  return (
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
  );
};

export default CommunityWideImpact;
