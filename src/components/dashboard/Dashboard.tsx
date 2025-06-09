
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoyalty } from '@/hooks/use-loyalty';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import { WelcomeGuide, RecentActivity, NearbyBusinesses } from '@/components/dashboard';
import SystemHealthWidget from './SystemHealthWidget';
import CommunityImpactDashboard from '@/components/community-impact/CommunityImpactDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { summary } = useLoyalty();
  const { profile } = useBusinessProfile();

  // Mock data for demonstration
  const recentActivities = [
    { id: 1, businessName: 'Sample Business', action: 'Scan', points: 25, date: 'Today 2:30 PM' }
  ];

  const nearbyBusinesses = [
    { id: 1, name: 'Local Coffee Shop', category: 'Food & Drink', discount: '10% off', rating: 4.5, reviewCount: 42, distance: '0.5' }
  ];

  const userType = profile ? 'business' : 'customer';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoyaltyPointsCard points={summary.totalPoints} />
        </div>
        <div>
          <SystemHealthWidget />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WelcomeGuide userType={userType} />
        <CommunityImpactDashboard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} />
        <NearbyBusinesses businesses={nearbyBusinesses} />
      </div>
    </div>
  );
};

export default Dashboard;
