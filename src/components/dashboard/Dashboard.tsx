
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';
import { SystemHealthWidget } from './SystemHealthWidget';
import WelcomeGuide from './WelcomeGuide';
import NearbyBusinesses from './NearbyBusinesses';
import RecentActivity from './RecentActivity';
import ActivityFeed from '@/components/community/ActivityFeed';
import { CommunityImpactDashboard } from '@/components/community-impact/CommunityImpactDashboard';

const Dashboard: React.FC = () => {
  const { user, userType } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-mansablue mb-2">
          Welcome back, {user?.user_metadata?.fullName || user?.email}
        </h1>
        <p className="text-gray-600">
          Continue building wealth in the Black community
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeGuide />
          <CommunityImpactDashboard />
          <NearbyBusinesses />
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <MiniLoyaltyWidget />
          <SystemHealthWidget />
          
          {/* Recent Community Activity */}
          <ActivityFeed 
            limit={5} 
            showHeader={true}
            className="border-mansagold/20"
          />
          
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
