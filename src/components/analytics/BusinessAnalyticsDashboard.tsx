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
      const { data: scans, error: scansError } = await supabase
        .from('qr_scans')
        .select('id, customer_id, points_awarded, scan_date')
        .eq('business_id', businessId)
        .order('scan_date', { ascending: false });

      if (scansError) {
        console.error('Error fetching QR scans:', scansError);
        setIsLoading(false);
        return;
      }

      if (!scans) {
        setIsLoading(false);
        return;
      }

      // Look up customer names separately (no direct FK between qr_scans and profiles)
      const customerIds = Array.from(
        new Set(scans.map(s => s.customer_id).filter(Boolean))
      ) as string[];
      const nameById = new Map<string, string>();
      if (customerIds.length > 0) {
        const { data: profileRows } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', customerIds);
        (profileRows || []).forEach((p: any) => {
          if (p?.full_name) nameById.set(p.id, p.full_name);
        });
      }
      const nameFor = (id: string | null) =>
        (id && nameById.get(id)) || 'Anonymous Customer';

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
        customer_name: nameFor(scan.customer_id)
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
            customer_name: nameFor(customerId),
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
      .channel(`business-analytics-${Math.random().toString(36).slice(2)}`)
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
    const placeholderKpis = [
      { label: 'Total Scans', value: '0', icon: QrCode, hint: 'All-time QR check-ins' },
      { label: 'Unique Customers', value: '0', icon: Users, hint: 'People who scanned' },
      { label: 'Points Awarded', value: '0', icon: Star, hint: 'Loyalty issued' },
      { label: 'Avg. per Scan', value: '0.0', icon: TrendingUp, hint: 'Points per visit' },
    ];

    const steps = [
      { title: 'Print or display your QR code', body: 'Place it at the register, on receipts, and in your window.' },
      { title: 'Invite customers to scan', body: 'Each scan awards loyalty points and records a visit.' },
      { title: 'Watch performance build here', body: 'Trends, peak hours and top customers appear automatically.' },
    ];

    return (
      <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-mansablue via-mansablue/80 to-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-mansablue/40 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-mansagold/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 space-y-10">
          {/* Executive header */}
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mansagold/90">
                Business Intelligence
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Business Analytics</h1>
              <p className="mt-2 max-w-xl text-white/70">
                Real-time insight into customer engagement, loyalty and visit patterns.
              </p>
            </div>
            <Badge className="w-fit border border-mansagold/30 bg-mansagold/10 text-mansagold hover:bg-mansagold/10">
              <Clock className="mr-1 h-3 w-3" />
              Awaiting first scan
            </Badge>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {placeholderKpis.map(({ label, value, icon: Icon, hint }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">{label}</span>
                  <Icon className="h-4 w-4 text-mansagold" />
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</div>
                <p className="mt-1 text-xs text-white/50">{hint}</p>
              </div>
            ))}
          </div>

          {/* Getting started */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">Your reporting starts with the first scan</h2>
              <p className="mt-1 text-sm text-white/70">
                Three steps to turn everyday visits into measurable data.
              </p>
              <ol className="mt-6 space-y-5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-mansagold/40 text-sm font-semibold text-mansagold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="text-sm text-white/60">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">What you'll see here</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
                  Daily visit trends across the last 7 days
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
                  Peak hours so you can staff with confidence
                </li>
                <li className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
                  Your most loyal customers, ranked
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
                  Live updates the moment a scan happens
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Scans', value: `${analytics.totalScans}`, icon: QrCode, hint: 'All-time QR check-ins' },
    { label: 'Unique Customers', value: `${analytics.uniqueCustomers}`, icon: Users, hint: 'People who scanned' },
    { label: 'Points Awarded', value: `${analytics.totalPointsAwarded}`, icon: Star, hint: 'Loyalty issued' },
    { label: 'Avg. per Scan', value: analytics.averagePointsPerScan.toFixed(1), icon: TrendingUp, hint: 'Points per visit' },
  ];

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-mansablue via-mansablue/80 to-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-mansablue/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-mansagold/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-4 py-12">
        {/* Executive header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mansagold/90">
              Business Intelligence
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">Business Analytics</h1>
            <p className="mt-2 max-w-xl text-white/70">
              Real-time insight into customer engagement, loyalty and visit patterns.
            </p>
          </div>
          {liveScans.length > 0 && (
            <Badge className="w-fit border border-mansagold/30 bg-mansagold/10 text-mansagold hover:bg-mansagold/10">
              <Zap className="mr-1 h-3 w-3" />
              Live Updates
            </Badge>
          )}
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon, hint }) => (
            <Card key={label} className="border-blue-300/20 bg-mansablue/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-white/70">{label}</p>
                  <Icon className="h-5 w-5 text-mansagold" />
                </div>
                <p className="mt-3 text-3xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-white/50">{hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="border border-white/10 bg-mansablue/40">
          <TabsTrigger value="overview" className="text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-black">Overview</TabsTrigger>
          <TabsTrigger value="customers" className="text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-black">Customers</TabsTrigger>
          <TabsTrigger value="activity" className="text-white/70 data-[state=active]:bg-mansagold data-[state=active]:text-black">Live Activity</TabsTrigger>
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
    </div>
  );
};

export default BusinessAnalyticsDashboard;