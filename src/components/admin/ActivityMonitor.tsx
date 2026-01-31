import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Activity, RefreshCw, User, Building2, QrCode, CreditCard, Shield, Clock, Filter } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  activity_type: string;
  user_id: string;
  business_id: string | null;
  activity_data: Record<string, unknown> | null;
  points_involved: number | null;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
  businesses?: { business_name: string } | null;
}

const activityTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  login: { icon: User, color: 'bg-blue-500', label: 'Login' },
  logout: { icon: User, color: 'bg-gray-500', label: 'Logout' },
  qr_scan: { icon: QrCode, color: 'bg-green-500', label: 'QR Scan' },
  points_earned: { icon: CreditCard, color: 'bg-yellow-500', label: 'Points Earned' },
  points_redeemed: { icon: CreditCard, color: 'bg-orange-500', label: 'Points Redeemed' },
  business_view: { icon: Building2, color: 'bg-purple-500', label: 'Business View' },
  review_posted: { icon: Activity, color: 'bg-pink-500', label: 'Review Posted' },
  profile_update: { icon: User, color: 'bg-indigo-500', label: 'Profile Update' },
  security_alert: { icon: Shield, color: 'bg-red-500', label: 'Security Alert' },
  default: { icon: Activity, color: 'bg-muted', label: 'Activity' },
};

const ActivityMonitor: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalToday: 0,
    activeUsers: 0,
    qrScans: 0,
    securityAlerts: 0,
  });

  const fetchActivities = useCallback(async () => {
    try {
      let query = supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch profiles and businesses separately
      const userIds = [...new Set((data || []).map(a => a.user_id).filter(Boolean))];
      const businessIds = [...new Set((data || []).map(a => a.business_id).filter(Boolean))];
      
      const [profilesResult, businessesResult] = await Promise.all([
        userIds.length > 0 
          ? supabase.from('profiles').select('id, full_name, email').in('id', userIds)
          : Promise.resolve({ data: [] }),
        businessIds.length > 0
          ? supabase.from('businesses').select('id, business_name').in('id', businessIds)
          : Promise.resolve({ data: [] })
      ]);
      
      const profilesMap = new Map((profilesResult.data || []).map(p => [p.id, p]));
      const businessesMap = new Map((businessesResult.data || []).map(b => [b.id, b]));
      
      const enrichedData = (data || []).map(a => ({
        ...a,
        profiles: profilesMap.get(a.user_id) || null,
        businesses: businessesMap.get(a.business_id) || null
      }));
      
      setActivities(enrichedData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayActivities = (data || []).filter(a => 
        a.created_at.startsWith(today)
      );
      
      const uniqueUsers = new Set(todayActivities.map(a => a.user_id));
      const qrScans = todayActivities.filter(a => a.activity_type === 'qr_scan').length;
      const alerts = todayActivities.filter(a => a.activity_type === 'security_alert').length;

      setStats({
        totalToday: todayActivities.length,
        activeUsers: uniqueUsers.size,
        qrScans,
        securityAlerts: alerts,
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchActivities, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, fetchActivities]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('activity-monitor')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        async (payload) => {
          // Fetch the new activity
          const { data } = await supabase
            .from('activity_log')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            // Fetch profile and business separately
            const [profileResult, businessResult] = await Promise.all([
              data.user_id 
                ? supabase.from('profiles').select('id, full_name, email').eq('id', data.user_id).maybeSingle()
                : Promise.resolve({ data: null }),
              data.business_id
                ? supabase.from('businesses').select('id, business_name').eq('id', data.business_id).maybeSingle()
                : Promise.resolve({ data: null })
            ]);
            
            const enrichedData = {
              ...data,
              profiles: profileResult.data || null,
              businesses: businessResult.data || null
            };
            
            setActivities(prev => [enrichedData, ...prev.slice(0, 99)]);
            
            // Show toast for security alerts
            if (data.activity_type === 'security_alert') {
              toast.warning('Security Alert', {
                description: `${profileResult.data?.full_name || 'Unknown'}: ${(data.activity_data as Record<string, unknown>)?.message || 'New security event'}`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActivityConfig = (type: string) => {
    return activityTypeConfig[type] || activityTypeConfig.default;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activities Today</p>
                <p className="text-2xl font-bold">{stats.totalToday}</p>
              </div>
              <Activity className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <User className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">QR Scans</p>
                <p className="text-2xl font-bold">{stats.qrScans}</p>
              </div>
              <QrCode className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Alerts</p>
                <p className="text-2xl font-bold">{stats.securityAlerts}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time Activity Monitor
              </CardTitle>
              <CardDescription>
                Live feed of platform activity
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="qr_scan">QR Scans</SelectItem>
                  <SelectItem value="points_earned">Points Earned</SelectItem>
                  <SelectItem value="security_alert">Security Alerts</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Live' : 'Paused'}
              </Button>
              <Button variant="outline" size="sm" onClick={fetchActivities}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities found
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {activities.map((activity) => {
                  const config = getActivityConfig(activity.activity_type);
                  const Icon = config.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`p-2 rounded-full ${config.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {activity.profiles?.full_name || 'Unknown User'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.profiles?.email}
                          {activity.businesses && ` • ${activity.businesses.business_name}`}
                        </p>
                        {activity.points_involved && (
                          <p className="text-sm text-primary">
                            {activity.points_involved > 0 ? '+' : ''}{activity.points_involved} points
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityMonitor;
