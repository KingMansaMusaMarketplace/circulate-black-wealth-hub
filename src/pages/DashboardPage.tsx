
import React from 'react';
import { 
  DashboardLayout, 
  NearbyBusinesses, 
  RecentActivity, 
  CirculationImpact 
} from '@/components/dashboard';
import LoyaltyPointsCard from '@/components/LoyaltyPointsCard';
import QRCodeScanner from '@/components/QRCodeScanner';

const DashboardPage = () => {
  // Mock user data
  const userData = {
    name: "Jasmine Williams",
    loyaltyPoints: 350,
    targetPoints: 500,
    totalSaved: 120
  };

  // Mock nearby businesses
  const nearbyBusinesses = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      category: "Restaurant",
      discount: "15% off",
      rating: 4.8,
      reviewCount: 124,
      distance: "0.5"
    },
    {
      id: 2,
      name: "Prestigious Cuts",
      category: "Barber Shop",
      discount: "10% off",
      rating: 4.9,
      reviewCount: 207,
      distance: "0.7"
    },
    {
      id: 3,
      name: "Heritage Bookstore",
      category: "Retail",
      discount: "20% off",
      rating: 4.7,
      reviewCount: 89,
      distance: "1.2"
    }
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      businessName: "Soul Food Kitchen",
      action: "Scan",
      points: 15,
      date: "Today"
    },
    {
      id: 2,
      businessName: "Prestigious Cuts",
      action: "Review",
      points: 25,
      date: "3 days ago"
    },
    {
      id: 3,
      businessName: "Heritage Bookstore",
      action: "Scan",
      points: 10,
      date: "1 week ago"
    }
  ];

  // Impact metrics
  const impactMetrics = {
    totalSaved: userData.totalSaved,
    businessesSupported: 15,
    totalScans: 28
  };

  return (
    <DashboardLayout title={`Welcome back, ${userData.name}!`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - User stats and QR Scanner */}
        <div className="md:col-span-1 space-y-6">
          <LoyaltyPointsCard 
            points={userData.loyaltyPoints} 
            target={userData.targetPoints} 
            saved={userData.totalSaved} 
          />
          <QRCodeScanner />
        </div>

        {/* Right columns - Nearby businesses and activity */}
        <div className="md:col-span-2 space-y-6">
          <NearbyBusinesses businesses={nearbyBusinesses} />
          <RecentActivity activities={recentActivity} />
          <CirculationImpact metrics={impactMetrics} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
