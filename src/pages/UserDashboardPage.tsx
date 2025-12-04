import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  MapPin, 
  Gift, 
  TrendingUp, 
  Calendar,
  QrCode,
  History,
  Zap,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveActivityWidget from '@/components/realtime/LiveActivityWidget';
import ActivityFeed from '@/components/realtime/ActivityFeed';
import { useOnboardingTour } from '@/hooks/useOnboardingTour';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

interface DashboardStats {
  totalPoints: number;
  totalScans: number;
  businessesVisited: number;
  rewardsRedeemed: number;
  currentTier: string;
  nextTierPoints: number;
  pointsToNextTier: number;
}

interface RecentActivity {
  id: string;
  type: 'scan' | 'reward' | 'points';
  business_name: string;
  points: number;
  created_at: string;
}

interface FavoriteBusiness {
  id: string;
  business_name: string;
  logo_url?: string;
  category: string;
  total_points: number;
  visit_count: number;
}

export default function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPoints: 0,
    totalScans: 0,
    businessesVisited: 0,
    rewardsRedeemed: 0,
    currentTier: 'Bronze',
    nextTierPoints: 1000,
    pointsToNextTier: 850
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<FavoriteBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { shouldShowTour, tourSteps, tourKey, completeTour, skipTour } = useOnboardingTour();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    
    if (user) {
      Promise.all([
        fetchDashboardStats(),
        fetchRecentActivity(),
        fetchFavoriteBusinesses()
      ]).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false); // User not authenticated, stop loading
    }
  }, [user, authLoading]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch user transactions for points
      const { data: transactions } = await supabase
        .from('transactions')
        .select('points_earned')
        .eq('customer_id', user?.id);

      // Fetch QR scans
      const { data: scans } = await supabase
        .from('qr_scans')
        .select('business_id')
        .eq('customer_id', user?.id);

      // Fetch redeemed rewards
      const { data: rewards } = await supabase
        .from('redeemed_rewards')
        .select('id')
        .eq('customer_id', user?.id);

      const totalPoints = transactions?.reduce((sum, t) => sum + t.points_earned, 0) || 0;
      const uniqueBusinesses = new Set(scans?.map(s => s.business_id)).size;

      // Determine tier based on points
      let currentTier = 'Bronze';
      let nextTierPoints = 1000;
      if (totalPoints >= 5000) {
        currentTier = 'Platinum';
        nextTierPoints = 10000;
      } else if (totalPoints >= 2500) {
        currentTier = 'Gold';
        nextTierPoints = 5000;
      } else if (totalPoints >= 1000) {
        currentTier = 'Silver';
        nextTierPoints = 2500;
      }

      setStats({
        totalPoints,
        totalScans: scans?.length || 0,
        businessesVisited: uniqueBusinesses,
        rewardsRedeemed: rewards?.length || 0,
        currentTier,
        nextTierPoints,
        pointsToNextTier: Math.max(0, nextTierPoints - totalPoints)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent QR scans with business info
      const { data: scans } = await supabase
        .from('qr_scans')
        .select(`
          id,
          points_awarded,
          created_at,
          businesses (
            business_name
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = (scans || []).map(scan => ({
        id: scan.id,
        type: 'scan',
        business_name: (scan.businesses as any)?.business_name || 'Unknown Business',
        points: scan.points_awarded,
        created_at: scan.created_at
      }));

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchFavoriteBusinesses = async () => {
    try {
      // This would be a more complex query in a real app
      // For now, we'll simulate favorite businesses based on scan frequency
      const { data: scans } = await supabase
        .from('qr_scans')
        .select(`
          business_id,
          points_awarded,
          businesses (
            business_name,
            logo_url,
            category
          )
        `)
        .eq('customer_id', user?.id);

      // Group by business and calculate totals
      const businessStats = new Map();
      scans?.forEach(scan => {
        const businessId = scan.business_id;
        if (!businessStats.has(businessId)) {
          businessStats.set(businessId, {
            id: businessId,
            business_name: (scan.businesses as any)?.business_name || 'Unknown',
            logo_url: (scan.businesses as any)?.logo_url,
            category: (scan.businesses as any)?.category || 'Other',
            total_points: 0,
            visit_count: 0
          });
        }
        const stats = businessStats.get(businessId);
        stats.total_points += scan.points_awarded;
        stats.visit_count += 1;
        businessStats.set(businessId, stats);
      });

      const favorites = Array.from(businessStats.values())
        .sort((a, b) => b.visit_count - a.visit_count)
        .slice(0, 3);

      setFavoriteBusinesses(favorites);
    } catch (error) {
      console.error('Error fetching favorite businesses:', error);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-500';
      case 'Gold': return 'bg-yellow-500';
      case 'Silver': return 'bg-gray-400';
      default: return 'bg-orange-600';
    }
  };

  const getTierProgress = () => {
    const currentTierMin = stats.nextTierPoints - (stats.nextTierPoints - (stats.totalPoints - stats.pointsToNextTier));
    const progress = ((stats.totalPoints - currentTierMin) / (stats.nextTierPoints - currentTierMin)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-white/10 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-white/10 rounded-xl"></div>
                <div className="h-64 bg-white/10 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-yellow-500/20" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Welcome back! 👋</h1>
                <p className="text-blue-200 text-lg font-medium drop-shadow">Here's what's happening with your account</p>
              </div>
              <div className="flex items-center space-x-2" data-tour="user-menu">
                <Badge className={`${getTierColor(stats.currentTier)} text-white text-lg px-6 py-2 font-bold shadow-lg animate-pulse`}>
                  ⭐ {stats.currentTier} Member
                </Badge>
              </div>
            </div>
          </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" data-tour="dashboard-stats" style={{ animationDelay: '0.1s' }}>
          <Card className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-400/30 hover:shadow-2xl transition-all">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg mr-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400">
                  {stats.totalPoints.toLocaleString()}
                </p>
                <p className="text-sm font-semibold text-yellow-200">Total Points</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-400/30 hover:shadow-2xl transition-all">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg mr-4">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-400">
                  {stats.totalScans}
                </p>
                <p className="text-sm font-semibold text-blue-200">QR Scans</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-green-500/10 border border-green-400/30 hover:shadow-2xl transition-all">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg mr-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">
                  {stats.businessesVisited}
                </p>
                <p className="text-sm font-semibold text-green-200">Businesses Visited</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-purple-500/10 border border-purple-400/30 hover:shadow-2xl transition-all">
            <CardContent className="flex items-center p-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg mr-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.rewardsRedeemed}
                </p>
                <p className="text-sm font-semibold text-purple-200">Rewards Redeemed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Tier Progress */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold">
                  Tier Progress
                </span>
              </CardTitle>
              <CardDescription className="font-medium text-blue-200">
                Keep earning points to reach the next tier! 🎯
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Current: {stats.currentTier}</span>
                <span className="text-sm font-medium text-blue-200">
                  {stats.pointsToNextTier > 0 ? `${stats.pointsToNextTier} points to next tier` : 'Max tier reached! 🌟'}
                </span>
              </div>
              <Progress value={getTierProgress()} className="w-full h-3 bg-white/10" />
              <div className="flex justify-between text-xs font-semibold text-blue-300">
                <span>{stats.totalPoints} points</span>
                <span>{stats.nextTierPoints} points</span>
              </div>
              {stats.pointsToNextTier > 0 && (
                <div className="mt-4">
                  <Link to="/scanner">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code to Earn Points ⚡
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Activity Widget */}
          <LiveActivityWidget />
        </div>

        {/* Community Activity Feed */}
        <ActivityFeed />

        {/* Favorite Businesses */}
        {favoriteBusinesses.length > 0 && (
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:shadow-2xl transition-all animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold">
                  Your Favorite Businesses 💖
                </span>
              </CardTitle>
              <CardDescription className="font-medium text-blue-200">Businesses you visit most often</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteBusinesses.map((business, index) => (
                  <Card 
                    key={business.id} 
                    className="border backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10 transition-all animate-fade-in" 
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-rose-400/50">
                          <AvatarImage src={business.logo_url} />
                          <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-400 text-white font-bold">
                            {business.business_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate text-white">{business.business_name}</h3>
                          <p className="text-sm font-medium text-rose-300">{business.category}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge className="bg-rose-500/20 text-rose-300 border-rose-400/30 font-semibold">{business.visit_count} visits</Badge>
                            <span className="text-sm font-bold text-rose-300">
                              {business.total_points} pts ⭐
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:shadow-2xl transition-all animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold">
                Quick Actions ⚡
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/scanner">
                <Button className="w-full h-24 flex flex-col space-y-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <QrCode className="h-7 w-7" />
                  <span className="text-sm font-bold">Scan QR</span>
                </Button>
              </Link>
              <Link to="/rewards">
                <Button className="w-full h-24 flex flex-col space-y-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <Gift className="h-7 w-7" />
                  <span className="text-sm font-bold">View Rewards</span>
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button className="w-full h-24 flex flex-col space-y-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <MapPin className="h-7 w-7" />
                  <span className="text-sm font-bold">Find Businesses</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button className="w-full h-24 flex flex-col space-y-2 bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all">
                  <Star className="h-7 w-7" />
                  <span className="text-sm font-bold">My Profile</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
    
    {shouldShowTour && (
      <OnboardingTour
        steps={tourSteps}
        tourKey={tourKey}
        onComplete={completeTour}
        onSkip={skipTour}
      />
    )}
    </>
  );
}
