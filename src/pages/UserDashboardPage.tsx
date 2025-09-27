import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
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
  const { user } = useAuth();
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

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchDashboardStats(),
        fetchRecentActivity(),
        fetchFavoriteBusinesses()
      ]).finally(() => setIsLoading(false));
    }
  }, [user]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening with your account</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getTierColor(stats.currentTier)} text-white`}>
              {stats.currentTier} Member
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <QrCode className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalScans}</p>
                <p className="text-sm text-muted-foreground">QR Scans</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <MapPin className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.businessesVisited}</p>
                <p className="text-sm text-muted-foreground">Businesses Visited</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Gift className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.rewardsRedeemed}</p>
                <p className="text-sm text-muted-foreground">Rewards Redeemed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tier Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Tier Progress</span>
              </CardTitle>
              <CardDescription>
                Keep earning points to reach the next tier!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current: {stats.currentTier}</span>
                <span className="text-sm text-muted-foreground">
                  {stats.pointsToNextTier > 0 ? `${stats.pointsToNextTier} points to next tier` : 'Max tier reached!'}
                </span>
              </div>
              <Progress value={getTierProgress()} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{stats.totalPoints} points</span>
                <span>{stats.nextTierPoints} points</span>
              </div>
              {stats.pointsToNextTier > 0 && (
                <div className="mt-4">
                  <Link to="/scanner">
                    <Button className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR Code to Earn Points
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Your Favorite Businesses</span>
              </CardTitle>
              <CardDescription>Businesses you visit most often</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteBusinesses.map((business) => (
                  <Card key={business.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={business.logo_url} />
                          <AvatarFallback>
                            {business.business_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{business.business_name}</h3>
                          <p className="text-sm text-muted-foreground">{business.category}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline">{business.visit_count} visits</Badge>
                            <span className="text-sm font-medium text-primary">
                              {business.total_points} pts
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/scanner">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <QrCode className="h-6 w-6" />
                  <span className="text-sm">Scan QR</span>
                </Button>
              </Link>
              <Link to="/rewards">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Gift className="h-6 w-6" />
                  <span className="text-sm">View Rewards</span>
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <MapPin className="h-6 w-6" />
                  <span className="text-sm">Find Businesses</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full h-20 flex flex-col space-y-2">
                  <Star className="h-6 w-6" />
                  <span className="text-sm">My Profile</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}