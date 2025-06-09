
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Building2 } from 'lucide-react';

const CommunityImpactDashboard: React.FC = () => {
  const impactStats = {
    totalCirculated: 1250000,
    businessesSupported: 145,
    activeMembers: 2340,
    jobsCreated: 125
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-mansablue" />
          Community Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-mansablue">
              ${(impactStats.totalCirculated / 1000000).toFixed(1)}M
            </div>
            <p className="text-sm text-gray-600">Wealth Circulated</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-mansagold">
              {impactStats.businessesSupported}
            </div>
            <p className="text-sm text-gray-600">Businesses Supported</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-mansablue">
              {impactStats.activeMembers.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Active Members</p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-mansagold">
              {impactStats.jobsCreated}
            </div>
            <p className="text-sm text-gray-600">Jobs Created</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityImpactDashboard;
