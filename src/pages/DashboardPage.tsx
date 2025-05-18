
import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';
import { CirculationImpact, RecentActivity, NearbyBusinesses } from '@/components/dashboard';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';

const DashboardPage = () => {
  const { userType } = useAuth();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Access your personalized dashboard for the Mansa Musa Marketplace. Track your loyalty points, find nearby businesses, and manage your account." />
      </Helmet>

      <DashboardLayout title="Dashboard" icon={<BarChart3 className="h-5 w-5 mr-2" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {userType && <WelcomeGuide userType={userType} />}
            <CirculationImpact />
            <RecentActivity />
          </div>
          
          <div className="space-y-6">
            <MiniLoyaltyWidget />
            <NearbyBusinesses />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default DashboardPage;
