
import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { DashboardLayout } from '@/components/dashboard';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';
import { CirculationImpact, RecentActivity, NearbyBusinesses } from '@/components/dashboard';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';
import { SystemHealthWidget } from '@/components/dashboard/SystemHealthWidget';

const DashboardPage = () => {
  const { userType } = useAuth();

  // Sample data for dashboard components
  const impactMetrics = {
    totalSaved: 1250,
    businessesSupported: 28,
    totalScans: 145
  };

  const recentActivities = [
    {
      id: 1,
      businessName: "Harmony Soul Food",
      action: "Scan",
      points: 15,
      date: "Today, 2:30 PM"
    },
    {
      id: 2,
      businessName: "Black Bean Coffee",
      action: "Reward",
      points: 25,
      date: "Yesterday, 10:15 AM"
    },
    {
      id: 3,
      businessName: "Culture Clothing",
      action: "Scan",
      points: 10,
      date: "Jan 15, 2025"
    }
  ];

  const nearbyBusinessesList = [
    {
      id: 1,
      name: "Harmony Soul Food",
      category: "Restaurant",
      discount: "10% Off",
      rating: 4.8,
      reviewCount: 124,
      distance: "0.8"
    },
    {
      id: 2,
      name: "Black Bean Coffee",
      category: "Coffee Shop",
      discount: "Free Drink",
      rating: 4.6,
      reviewCount: 87,
      distance: "1.2"
    },
    {
      id: 3,
      name: "Culture Clothing",
      category: "Retail",
      discount: "15% Off",
      rating: 4.7,
      reviewCount: 93,
      distance: "2.5"
    }
  ];

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
            <CirculationImpact metrics={impactMetrics} />
            <RecentActivity activities={recentActivities} />
          </div>
          
          <div className="space-y-6">
            <MiniLoyaltyWidget />
            <SystemHealthWidget />
            <NearbyBusinesses businesses={nearbyBusinessesList} />
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default DashboardPage;
