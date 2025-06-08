
import React from 'react';
import EconomicImpactDashboard from '@/components/dashboard/EconomicImpactDashboard';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { TrendingUp } from 'lucide-react';

const EconomicImpactPage: React.FC = () => {
  return (
    <DashboardLayout 
      title="Economic Impact" 
      icon={<TrendingUp className="h-6 w-6" />}
    >
      <EconomicImpactDashboard />
    </DashboardLayout>
  );
};

export default EconomicImpactPage;
