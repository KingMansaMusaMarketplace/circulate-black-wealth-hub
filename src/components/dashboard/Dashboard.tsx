
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 py-6 space-y-6 relative z-10">
      {/* Welcome Section - Enhanced */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
            Welcome back, {user?.user_metadata?.fullName || user?.email}
          </h1>
          <p className="text-white/90 text-lg">
            Continue building wealth in the Black community
          </p>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/scanner">
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white via-purple-50 to-pink-50 border-purple-200/50">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Scan QR Code</CardTitle>
              <CardDescription className="text-gray-700">Earn points at Black-owned businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Start Scanning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/directory">
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white via-pink-50 to-orange-50 border-pink-200/50">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">Find Businesses</CardTitle>
              <CardDescription className="text-gray-700">Discover nearby Black-owned businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-pink-300 text-pink-600 hover:bg-pink-50">
                Explore Directory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/loyalty">
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white via-orange-50 to-yellow-50 border-orange-200/50">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">View Rewards</CardTitle>
              <CardDescription className="text-gray-700">Check your loyalty points and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
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
    </div>
  );
};

export default Dashboard;
