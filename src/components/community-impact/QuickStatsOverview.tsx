
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Building2, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from './utils/formatters';

interface UserImpactMetrics {
  total_spending: number;
  businesses_supported: number;
  wealth_circulated: number;
  estimated_jobs_created: number;
}

interface QuickStatsOverviewProps {
  displayUserMetrics: UserImpactMetrics;
}

const QuickStatsOverview: React.FC<QuickStatsOverviewProps> = ({ displayUserMetrics }) => {
  return (
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
  );
};

export default QuickStatsOverview;
