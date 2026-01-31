import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  QrCode, 
  Star, 
  Calendar,
  MapPin,
  Clock,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface BusinessAnalytics {
  totalScans: number;
  uniqueCustomers: number;
  totalPointsAwarded: number;
  averagePointsPerScan: number;
  conversionRate: number;
  recentScans: Array<{
    id: string;
    customer_id: string;
    points_awarded: number;
    scan_date: string;
    customer_name?: string;
  }>;
  scansByDay: Array<{
    date: string;
    scans: number;
    customers: number;
  }>;
  topCustomers: Array<{
    customer_id: string;
    customer_name: string;
    total_scans: number;
    total_points: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    scans: number;
  }>;
}

interface LiveScanEvent {
  id: string;
  customer_id: string;
  business_id: string;
  points_awarded: number;
  scan_date: string;
  customer_name?: string;
}

const BusinessAnalyticsDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveScans, setLiveScans] = useState<LiveScanEvent[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);

  // Colors for charts
  const COLORS = ['#d4af37', '#1a1a1a', '#6b7280', '#f59e0b', '#10b981'];

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading
    
    if (user) {
      fetchBusinessId();
    } else {
      setIsLoading(false); // User not authenticated, stop loading
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (businessId) {
      fetchAnalytics();
      setupRealtimeSubscription();
    }
  }, [businessId]);

  const fetchBusinessId = async () => {
    try {
      const { data: businessList } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (businessList && businessList.length > 0) {
        setBusinessId(businessList[0].id);
      }
    } catch (error) {
      console.error('Error fetching business ID:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!businessId) return;

    setIsLoading(true);
    try {
      // Fetch basic scan metrics
      const { data: scans } = await supabase
        .from('qr_scans')
        .select(`
          id,
          customer_id,
          points_awarded,
          scan_date,
          profiles (
            full_name
          )
        `)
        .eq('business_id', businessId)
        .order('scan_date', { ascending: false });

      if (!scans) {
        setIsLoading(false);
        return;
      }

      // Calculate analytics
      const totalScans = scans.length;
      const uniqueCustomers = new Set(scans.map(s => s.customer_id)).size;
      const totalPointsAwarded = scans.reduce((sum, s) => sum + (s.points_awarded || 0), 0);
      const averagePointsPerScan = totalScans > 0 ? totalPointsAwarded / totalScans : 0;

      // Recent scans (last 10)
      const recentScans = scans.slice(0, 10).map(scan => ({
        id: scan.id,
        customer_id: scan.customer_id,
        points_awarded: scan.points_awarded || 0,
        scan_date: scan.scan_date,
        customer_name: (scan.profiles as any)?.full_name || 'Anonymous Customer'
      }));

      // Scans by day (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const scansByDay = last7Days.map(date => {
        const dayScans = scans.filter(s => s.scan_date?.startsWith(date));
        return {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          scans: dayScans.length,
          customers: new Set(dayScans.map(s => s.customer_id)).size
        };
      });

      // Top customers
      const customerStats = new Map();
      scans.forEach(scan => {
        const customerId = scan.customer_id;
        if (!customerStats.has(customerId)) {
          customerStats.set(customerId, {
            customer_id: customerId,
            customer_name: (scan.profiles as any)?.full_name || 'Anonymous Customer',
            total_scans: 0,
            total_points: 0
          });
        }
        const stats = customerStats.get(customerId);
        stats.total_scans += 1;
        stats.total_points += scan.points_awarded || 0;
      });

      const topCustomers = Array.from(customerStats.values())
        .sort((a, b) => b.total_scans - a.total_scans)
        .slice(0, 5);

      // Hourly distribution
      const hourlyStats = new Map();
      scans.forEach(scan => {
        const hour = new Date(scan.scan_date).getHours();
        hourlyStats.set(hour, (hourlyStats.get(hour) || 0) + 1);
      });

      const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        scans: hourlyStats.get(hour) || 0
      }));

      setAnalytics({
        totalScans,
        uniqueCustomers,
        totalPointsAwarded,
        averagePointsPerScan,
        conversionRate: uniqueCustomers > 0 ? (totalScans / uniqueCustomers) : 0,
        recentScans,
        scansByDay,
        topCustomers,
        hourlyDistribution
      });

    } catch (error) {
      console.error('Error fetching business analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!businessId) return;

    console.log('Setting up realtime analytics for business:', businessId);

    const channel = supabase
      .channel('business-analytics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'qr_scans',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          console.log('New scan detected for analytics:', payload);
          
          const newScan: LiveScanEvent = {
            id: payload.new.id,
            customer_id: payload.new.customer_id,
            business_id: payload.new.business_id,
            points_awarded: payload.new.points_awarded || 0,
            scan_date: payload.new.scan_date,
            customer_name: 'New Customer'
          };

          setLiveScans(prev => [newScan, ...prev.slice(0, 9)]);
          
          // Refresh analytics after a delay to allow for database consistency
          setTimeout(() => {
            fetchAnalytics();
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up business analytics subscription');
      supabase.removeChannel(channel);
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="relative min-h-[60vh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center space-y-3">
          <QrCode className="h-12 w-12 text-yellow-400 mb-2" />
          <h3 className="text-lg font-semibold text-white">No Analytics Data</h3>
          <p className="text-white/70 max-w-md">
            Start getting QR code scans to see your analytics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-muted-foreground">Real-time insights into your customer engagement</p>
        </div>
        {liveScans.length > 0 && (
          <Badge variant="secondary" className="animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            Live Updates
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <QrCode className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{analytics.totalScans}</p>
              <p className="text-sm text-muted-foreground">Total Scans</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{analytics.uniqueCustomers}</p>
              <p className="text-sm text-muted-foreground">Unique Customers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{analytics.totalPointsAwarded}</p>
              <p className="text-sm text-muted-foreground">Points Awarded</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{analytics.averagePointsPerScan.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avg Points/Scan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="activity">Live Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Scans Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.scansByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scans" fill="#d4af37" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Scan Distribution by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.hourlyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="scans" stroke="#d4af37" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Most frequent scanners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCustomers.map((customer, index) => (
                    <div key={customer.customer_id} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{customer.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.total_scans} scans • {customer.total_points} points
                        </p>
                      </div>
                      <Progress 
                        value={(customer.total_scans / analytics.totalScans) * 100} 
                        className="w-20"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
                <CardDescription>Repeat vs new customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <span className="font-semibold">
                      {analytics.conversionRate.toFixed(1)} scans/customer
                    </span>
                  </div>
                  <Progress value={(analytics.conversionRate / 5) * 100} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{analytics.uniqueCustomers}</p>
                      <p className="text-sm text-muted-foreground">Unique Customers</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {((analytics.totalScans - analytics.uniqueCustomers) / Math.max(analytics.totalScans, 1) * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Repeat Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Scans */}
            <Card>
              <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
                <CardDescription>Real-time QR code scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveScans.length > 0 ? (
                    liveScans.map((scan) => (
                      <div key={scan.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New scan by {scan.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            +{scan.points_awarded} points • {formatDistanceToNow(new Date(scan.scan_date), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Waiting for live activity...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Latest customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <QrCode className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{scan.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          +{scan.points_awarded} points • {formatDistanceToNow(new Date(scan.scan_date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalyticsDashboard;