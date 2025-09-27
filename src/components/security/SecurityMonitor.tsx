import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Eye, Clock, Users, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityAlert {
  id: string;
  type: 'failed_auth' | 'rate_limit' | 'suspicious_access' | 'role_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  user_id?: string;
  details?: any;
}

interface SecurityStats {
  failedAuthAttempts: number;
  rateLimitViolations: number;
  personalDataAccesses: number;
  roleChanges: number;
  activeUsers: number;
}

const SecurityMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadSecurityData();
    
    if (autoRefresh) {
      const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadSecurityData = async () => {
    try {
      await Promise.all([
        loadSecurityAlerts(),
        loadSecurityStats()
      ]);
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityAlerts = async () => {
    try {
      // Get recent failed auth attempts
      const { data: failedAuth } = await supabase
        .from('failed_auth_attempts')
        .select('*')
        .order('attempt_time', { ascending: false })
        .limit(20);

      // Get rate limit violations
      const { data: rateLimits } = await supabase
        .from('rate_limit_log')
        .select('*')
        .not('blocked_until', 'is', null)
        .order('window_start', { ascending: false })
        .limit(10);

      // Get recent personal data accesses
      const { data: dataAccesses } = await supabase
        .from('personal_data_access_audit')
        .select('*')
        .order('accessed_at', { ascending: false })
        .limit(15);

      // Get recent role changes
      const { data: roleChanges } = await supabase
        .from('role_change_audit')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(10);

      // Transform data into security alerts
      const securityAlerts: SecurityAlert[] = [];

      failedAuth?.forEach(attempt => {
        securityAlerts.push({
          id: attempt.id,
          type: 'failed_auth',
          severity: 'medium',
          message: `Failed login attempt for ${attempt.email}: ${attempt.failure_reason}`,
          timestamp: attempt.attempt_time,
          details: attempt
        });
      });

      rateLimits?.forEach(limit => {
        securityAlerts.push({
          id: limit.id,
          type: 'rate_limit',
          severity: 'high',
          message: `Rate limit violation for ${limit.operation} - user blocked until ${new Date(limit.blocked_until).toLocaleString()}`,
          timestamp: limit.window_start,
          user_id: limit.user_id,
          details: limit
        });
      });

      dataAccesses?.forEach(access => {
        securityAlerts.push({
          id: access.id,
          type: 'suspicious_access',
          severity: 'low',
          message: `Personal data access: ${access.data_type} for user ${access.target_user_id}`,
          timestamp: access.accessed_at,
          user_id: access.accessed_by,
          details: access
        });
      });

      roleChanges?.forEach(change => {
        securityAlerts.push({
          id: change.id,
          type: 'role_change',
          severity: change.new_role === 'admin' ? 'critical' : 'medium',
          message: `Role changed from ${change.old_role} to ${change.new_role}`,
          timestamp: change.changed_at,
          user_id: change.user_id,
          details: change
        });
      });

      // Sort by timestamp
      securityAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAlerts(securityAlerts.slice(0, 50)); // Keep latest 50 alerts
    } catch (error) {
      console.error('Error loading security alerts:', error);
    }
  };

  const loadSecurityStats = async () => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get stats for the last 24 hours
      const [
        { count: failedAuthCount },
        { count: rateLimitCount },
        { count: dataAccessCount },
        { count: roleChangeCount }
      ] = await Promise.all([
        supabase
          .from('failed_auth_attempts')
          .select('*', { count: 'exact', head: true })
          .gte('attempt_time', oneDayAgo.toISOString()),
        supabase
          .from('rate_limit_log')
          .select('*', { count: 'exact', head: true })
          .gte('window_start', oneDayAgo.toISOString()),
        supabase
          .from('personal_data_access_audit')
          .select('*', { count: 'exact', head: true })
          .gte('accessed_at', oneDayAgo.toISOString()),
        supabase
          .from('role_change_audit')
          .select('*', { count: 'exact', head: true })
          .gte('changed_at', oneDayAgo.toISOString())
      ]);

      // Get active users count (users who have activity in last 24 hours)
      const { count: activeUsersCount } = await supabase
        .from('activity_log')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString());

      setStats({
        failedAuthAttempts: failedAuthCount || 0,
        rateLimitViolations: rateLimitCount || 0,
        personalDataAccesses: dataAccessCount || 0,
        roleChanges: roleChangeCount || 0,
        activeUsers: activeUsersCount || 0
      });
    } catch (error) {
      console.error('Error loading security stats:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'failed_auth': return <Lock className="h-4 w-4" />;
      case 'rate_limit': return <AlertTriangle className="h-4 w-4" />;
      case 'suspicious_access': return <Eye className="h-4 w-4" />;
      case 'role_change': return <Users className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading security monitoring data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Monitor</h2>
          <p className="text-muted-foreground">Real-time security monitoring and alerts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button onClick={loadSecurityData} size="sm" variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Auth</p>
                  <p className="text-2xl font-bold">{stats.failedAuthAttempts}</p>
                </div>
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rate Limits</p>
                  <p className="text-2xl font-bold">{stats.rateLimitViolations}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Access</p>
                  <p className="text-2xl font-bold">{stats.personalDataAccesses}</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role Changes</p>
                  <p className="text-2xl font-bold">{stats.roleChanges}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security alerts and monitoring events (Last 24 hours)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <p>No security events detected</p>
              <p className="text-sm">All systems appear secure</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    {alert.user_id && (
                      <p className="text-xs text-muted-foreground">
                        User ID: {alert.user_id}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;