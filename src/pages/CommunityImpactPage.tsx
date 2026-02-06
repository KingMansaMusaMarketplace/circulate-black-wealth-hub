import React from 'react';
import CommunityImpactDashboard from '@/components/community-impact/CommunityImpactDashboard';
import { DashboardLayout } from '@/components/dashboard';
import { TrendingUp } from 'lucide-react';

const CommunityImpactPage: React.FC = () => {
  return (
    <DashboardLayout 
      title="Community Impact" 
      icon={<TrendingUp className="h-6 w-6 mr-2" />}
    >
      <CommunityImpactDashboard />
    </DashboardLayout>
  );
};

export default CommunityImpactPage;
