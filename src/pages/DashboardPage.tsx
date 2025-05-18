
import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';

const DashboardPage = () => {
  const { userType } = useAuth();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Access your personalized dashboard for the Mansa Musa Marketplace. Track your loyalty points, find nearby businesses, and manage your account." />
      </Helmet>

      <DashboardLayout title="Dashboard" icon={<BarChart3 className="h-5 w-5 mr-2" />}>
        {userType && <WelcomeGuide userType={userType} />}
      </DashboardLayout>
    </div>
  );
};

export default DashboardPage;
