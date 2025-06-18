
import React from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';
import CirculationImpact from '@/components/dashboard/CirculationImpact';
import RecentActivity from '@/components/dashboard/RecentActivity';
import NearbyBusinesses from '@/components/dashboard/NearbyBusinesses';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';
import { useAuth } from '@/contexts/AuthContext';
import { Home, RefreshCw, TrendingUp, Users, MapPin, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { userType, user } = useAuth();
  
  console.log('DashboardPage rendering, userType:', userType);
  
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

  // Quick stats for the overview cards
  const quickStats = [
    {
      title: "Points Earned",
      value: "2,450",
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Businesses Visited",
      value: "34",
      change: "+5",
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Rewards Available",
      value: "8",
      change: "New",
      icon: Gift,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Community Impact",
      value: "$1,250",
      change: "+$180",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Handle refresh functionality
  const handleRefresh = () => {
    console.log('Refresh button clicked');
    toast.success('Dashboard refreshed!');
    window.location.reload();
  };

  // Ensure userType is properly typed
  const validUserType = (userType === 'customer' || userType === 'business') ? userType : 'customer';

  return (
    <DashboardLayout title="Dashboard" icon={<Home className="mr-2 h-6 w-6" />}>
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.fullName || user?.email?.split('@')[0] || 'Friend'}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your community impact today</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active Member
          </Badge>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs ${stat.color} flex items-center mt-1`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 bg-gradient-to-r from-mansablue to-mansablue-dark text-white">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-blue-100">
            Start earning points and supporting Black-owned businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/scanner">
              <Button className="w-full bg-white text-mansablue hover:bg-gray-100">
                Scan QR Code
              </Button>
            </Link>
            <Link to="/directory">
              <Button className="w-full bg-mansagold text-mansablue hover:bg-mansagold/90">
                Find Businesses
              </Button>
            </Link>
            <Link to="/loyalty">
              <Button className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20">
                View Rewards
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <WelcomeGuide userType={validUserType} />
          <CirculationImpact metrics={impactMetrics} />
          
          {/* Community Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-mansablue" />
                Community Highlights
              </CardTitle>
              <CardDescription>
                See what's happening in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">New Business Added</p>
                    <p className="text-sm text-gray-600">Urban Threads Boutique joined the marketplace</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Community Milestone</p>
                    <p className="text-sm text-gray-600">$50,000+ circulated in local economy this month!</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Special Offer</p>
                    <p className="text-sm text-gray-600">Double points weekend at participating restaurants</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <MiniLoyaltyWidget />
          <NearbyBusinesses businesses={nearbyBusinessesList} />
          
          {/* Goals & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Visit 5 new businesses</span>
                  <span>3/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-mansablue h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Earn 500 points</span>
                  <span>450/500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-mansagold h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
    </DashboardLayout>
  );
};

export default DashboardPage;
