
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';
import { SystemHealthWidget } from './SystemHealthWidget';
import WelcomeGuide from './WelcomeGuide';
import NearbyBusinesses from './NearbyBusinesses';
import RecentActivity from './RecentActivity';
import ActivityFeed from '@/components/community/ActivityFeed';
import CommunityImpactDashboard from '@/components/community-impact/CommunityImpactDashboard';
import { ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, userType } = useAuth();

  // Sample data for components that need it
  const sampleBusinesses = [
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
    }
  ];

  const sampleActivities = [
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
    }
  ];

  // Ensure userType is properly typed for WelcomeGuide
  const validUserType: 'customer' | 'business' = userType === 'business' ? 'business' : 'customer';

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/scanner">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Scan QR Code</CardTitle>
              <CardDescription>Earn points at Black-owned businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Scanning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/directory">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Find Businesses</CardTitle>
              <CardDescription>Discover nearby Black-owned businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Explore Directory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/loyalty">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">View Rewards</CardTitle>
              <CardDescription>Check your loyalty points and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                My Rewards
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeGuide userType={validUserType} />
          <CommunityImpactDashboard />
          <NearbyBusinesses businesses={sampleBusinesses} />
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
          
          <RecentActivity activities={sampleActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
