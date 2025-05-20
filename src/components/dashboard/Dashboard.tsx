
import React from 'react';
import { DashboardLayout } from './layout/DashboardLayout';
import WelcomeGuide from './WelcomeGuide';
import CirculationImpact from './CirculationImpact';
import RecentActivity from './RecentActivity';
import NearbyBusinesses from './NearbyBusinesses';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <WelcomeGuide />
          <CirculationImpact />
          <RecentActivity />
        </div>
        
        <div className="space-y-6">
          <MiniLoyaltyWidget />
          <NearbyBusinesses />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
