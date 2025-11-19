
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-gradient-to-br from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-700/20 to-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      <div className="container mx-auto px-4 py-6 space-y-6 relative z-10">
      {/* Welcome Section - Enhanced */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-mansablue/20 via-blue-600/20 to-mansagold/20" />
        
        {/* Animated decorative elements */}
        <div className="absolute top-8 right-10 w-32 h-32 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-8 left-10 w-40 h-40 bg-mansablue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">{user?.user_metadata?.fullName || user?.email}</span>
          </h1>
          <p className="text-blue-100/90 text-lg">
            Continue building wealth in the Black community
          </p>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/scanner">
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-slate-800/60 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Scan QR Code</CardTitle>
              <CardDescription className="text-blue-200/70">Earn points at Black-owned businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansablue-dark hover:to-blue-700 text-white">
                Start Scanning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/directory">
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-slate-800/60 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">Find Businesses</CardTitle>
              <CardDescription className="text-blue-200/70">Discover nearby Black-owned businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansablue-dark hover:to-blue-700 text-white">
                Explore Directory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/loyalty">
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-slate-800/60 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">View Rewards</CardTitle>
              <CardDescription className="text-blue-200/70">Check your loyalty points and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-mansagold-dark hover:to-amber-600 text-slate-900 font-semibold">
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
