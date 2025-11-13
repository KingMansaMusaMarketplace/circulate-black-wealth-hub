
import React from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import WelcomeGuide from '@/components/dashboard/WelcomeGuide';
import CirculationImpact from '@/components/dashboard/CirculationImpact';
import RecentActivity from '@/components/dashboard/RecentActivity';
import NearbyBusinesses from '@/components/dashboard/NearbyBusinesses';
import { MiniLoyaltyWidget } from '@/components/loyalty/MiniLoyaltyWidget';
import { useAuth } from '@/contexts/AuthContext';
import { Home, RefreshCw, TrendingUp, Users, MapPin, Gift, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/animations/ScrollReveal';
import CountUpNumber from '@/components/animations/CountUpNumber';

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
      <div className="space-y-8">
        {/* Enhanced Header Section */}
        <ScrollReveal delay={0.1}>
          <div className="glass-card backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 border border-border/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.user_metadata?.fullName || user?.email?.split('@')[0] || 'Friend'}!
                </h1>
                <p className="font-body text-muted-foreground">Here's your community impact overview</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-gradient-gold/10 text-mansagold border-mansagold/30 font-semibold">
                  Active Member
                </Badge>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="shadow-sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Stats with animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <ScrollReveal key={index} delay={0.1 + index * 0.05}>
              <Card className="glass-card hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-border/30">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-body text-xs font-medium text-muted-foreground mb-2">{stat.title}</p>
                      <p className="font-display text-2xl font-bold text-foreground">
                        {stat.title.includes('Points') || stat.title.includes('Impact') ? (
                          <CountUpNumber end={parseInt(stat.value.replace(/[^0-9]/g, ''))} prefix={stat.value.includes('$') ? '$' : ''} suffix={stat.value.includes(',') ? '' : ''} duration={2000} />
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className={`font-body text-xs ${stat.color} flex items-center mt-1`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Enhanced Quick Actions */}
        <ScrollReveal delay={0.3}>
          <Card className="glass-card bg-gradient-to-br from-mansablue via-mansablue-dark to-mansablue text-white border-border/30 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]" />
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Quick Actions</h3>
                  <p className="font-body text-white/80">Start earning points today</p>
                </div>
                <div className="flex items-center gap-2 glass-card bg-white/10 px-3 py-2 rounded-full">
                  <Zap className="h-4 w-4 text-mansagold" />
                  <span className="font-body text-sm">Ready to go!</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/scanner">
                  <Button className="w-full bg-white text-mansablue hover:bg-gray-50 font-semibold py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    Scan QR Code
                  </Button>
                </Link>
                <Link to="/directory">
                  <Button className="w-full bg-gradient-gold text-mansablue-dark hover:opacity-90 font-semibold py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    Find Businesses
                  </Button>
                </Link>
                <Link to="/loyalty">
                  <Button className="w-full glass-card bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 font-semibold py-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    View Rewards
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal delay={0.4}>
              <WelcomeGuide userType={validUserType} />
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <CirculationImpact metrics={impactMetrics} />
            </ScrollReveal>
            
            {/* Enhanced Community Highlights */}
            <ScrollReveal delay={0.6}>
              <Card className="glass-card border-border/30 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display flex items-center text-xl">
                      <Users className="h-5 w-5 mr-2 text-mansablue" />
                      Community Updates
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/30">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 glass-card bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-foreground">New Business Added</p>
                      <p className="font-body text-sm text-muted-foreground">Urban Threads Boutique joined</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 glass-card bg-green-500/5 rounded-xl border border-green-500/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-foreground">Community Milestone</p>
                      <p className="font-body text-sm text-muted-foreground">$50K+ circulated this month!</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 glass-card bg-purple-500/5 rounded-xl border border-purple-500/10">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-foreground">Special Offer</p>
                      <p className="font-body text-sm text-muted-foreground">Double points weekend</p>
                      <p className="font-body text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
          
          {/* Right Column - Enhanced Sidebar */}
          <div className="space-y-6">
            <ScrollReveal delay={0.4}>
              <MiniLoyaltyWidget />
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <NearbyBusinesses businesses={nearbyBusinessesList} />
            </ScrollReveal>
            
            {/* Enhanced Goals */}
            <ScrollReveal delay={0.6}>
              <Card className="glass-card border-border/30 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-mansablue" />
                    Monthly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between font-body text-sm mb-2">
                      <span className="text-muted-foreground">Visit 5 new businesses</span>
                      <span className="font-bold text-foreground">3/5</span>
                    </div>
                    <div className="w-full glass-card h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-mansablue to-mansablue-light h-3 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-body text-sm mb-2">
                      <span className="text-muted-foreground">Earn 500 points</span>
                      <span className="font-bold text-foreground">450/500</span>
                    </div>
                    <div className="w-full glass-card h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-gold h-3 rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>

        {/* Recent Activity */}
        <ScrollReveal delay={0.7}>
          <RecentActivity activities={recentActivities} />
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
