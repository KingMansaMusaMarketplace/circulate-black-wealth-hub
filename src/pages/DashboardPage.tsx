
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

  // Quick stats for the overview cards with vibrant gradients
  const quickStats = [
    {
      title: "Points Earned",
      value: "2,450",
      change: "+12%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgGradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
      iconColor: "text-white"
    },
    {
      title: "Businesses Visited",
      value: "34",
      change: "+5",
      icon: MapPin,
      color: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
      iconColor: "text-white"
    },
    {
      title: "Rewards Available",
      value: "8",
      change: "New",
      icon: Gift,
      color: "text-purple-600",
      bgGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
      iconColor: "text-white"
    },
    {
      title: "Community Impact",
      value: "$1,250",
      change: "+$180",
      icon: Users,
      color: "text-orange-600",
      bgGradient: "bg-gradient-to-br from-orange-500 to-red-500",
      iconColor: "text-white"
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
        {/* Decorative Banner with vibrant gradient */}
        <div className="relative overflow-hidden rounded-3xl h-40 mb-4 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="relative h-full flex items-center justify-between px-8">
            <div className="text-white z-10">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">Welcome Back! 👋</h2>
              <p className="text-white/95 text-base drop-shadow">Track your impact and discover new opportunities</p>
            </div>
            <div className="hidden lg:flex items-center space-x-3 z-10">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white shadow-lg" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white shadow-lg" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white shadow-lg" />
              </div>
              <p className="text-white/90 text-sm font-semibold">Goal: 1M Members</p>
            </div>
          </div>
        </div>

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

        {/* Quick Stats with vibrant gradients and animations */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <ScrollReveal key={index} delay={0.1 + index * 0.05}>
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0">
                <div className={`absolute inset-0 ${stat.bgGradient} opacity-10`} />
                <CardContent className="relative p-5">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                      <div className={`p-2.5 rounded-xl ${stat.bgGradient} shadow-lg`}>
                        <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                      </div>
                    </div>
                    <div>
                      <p className="font-display text-3xl font-bold text-foreground mb-1">
                        {stat.title.includes('Points') || stat.title.includes('Impact') ? (
                          <CountUpNumber end={parseInt(stat.value.replace(/[^0-9]/g, ''))} prefix={stat.value.includes('$') ? '$' : ''} suffix={stat.value.includes(',') ? '' : ''} duration={2000} />
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className={`font-body text-sm font-semibold ${stat.color} flex items-center`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Enhanced Quick Actions */}
        <ScrollReveal delay={0.3}>
          <Card className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.2),transparent_50%)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-mansagold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
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
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display flex items-center text-xl text-white">
                      <Users className="h-5 w-5 mr-2 text-blue-400" />
                      Community Updates
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-white">New Business Added</p>
                      <p className="font-body text-sm text-white/70">Urban Threads Boutique joined</p>
                      <p className="font-body text-xs text-white/50 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-white">Community Milestone</p>
                      <p className="font-body text-sm text-white/70">$50K+ circulated this month!</p>
                      <p className="font-body text-xs text-white/50 mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-white">Special Offer</p>
                      <p className="font-body text-sm text-white/70">Double points weekend</p>
                      <p className="font-body text-xs text-white/50 mt-1">1 day ago</p>
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
