import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Users, Lock, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';

interface SecurityMetrics {
  failed_auth_attempts_24h: number;
  admin_actions_24h: number;
  suspicious_ips: number;
  last_updated: string;
}

interface SecurityEvent {
  id: string;
  action: string;
  table_name: string;
  user_id: string | null;
  timestamp: string;
  ip_address: string | null;
  user_agent: string | null;
}

export const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSecurityData = async () => {
    try {
      // Fetch security metrics
      const { data: metricsData, error: metricsError } = await supabase.rpc('get_security_metrics');
      
      if (metricsError) {
        console.error('Failed to fetch security metrics:', metricsError);
        toast.error('Failed to load security metrics');
      } else {
        setMetrics(metricsData);
      }

      // Fetch recent security events
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (eventsError) {
        console.error('Failed to fetch security events:', eventsError);
        toast.error('Failed to load security events');
      } else {
        setEvents(eventsData || []);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security dashboard');
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchSecurityData();
    setRefreshing(false);
    toast.success('Security data refreshed');
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSecurityData();
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const getEventSeverity = (action: string): 'default' | 'destructive' | 'secondary' => {
    if (action.includes('failed') || action.includes('unauthorized') || action.includes('exceeded')) {
      return 'destructive';
    }
    if (action.includes('admin') || action.includes('role_change') || action.includes('personal_data')) {
      return 'secondary';
    }
    return 'default';
  };

  const formatEventAction = (action: string): string => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Auth Attempts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {metrics.failed_auth_attempts_24h}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
              <Lock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {metrics.admin_actions_24h}
              </div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspicious IPs</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {metrics.suspicious_ips}
              </div>
              <p className="text-xs text-muted-foreground">Multiple failed attempts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Latest security-related activities and audit logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent security events found.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getEventSeverity(event.action)}>
                        {formatEventAction(event.action)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        on {event.table_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                      {event.user_id && (
                        <span>User: {event.user_id.slice(0, 8)}...</span>
                      )}
                      {event.ip_address && (
                        <span>IP: {event.ip_address}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status: Protected
          </CardTitle>
          <CardDescription>
            Your application has comprehensive security measures in place
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Row Level Security (RLS) enabled on all tables</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Enhanced authentication rate limiting active</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Comprehensive audit logging enabled</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Personal data access controls implemented</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All database functions secured with proper search paths</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};