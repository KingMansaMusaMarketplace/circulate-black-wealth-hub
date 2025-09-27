import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  type: 'auth' | 'access' | 'admin' | 'rate_limit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  details?: any;
}

interface UseSecurityMonitoringOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  alertThresholds?: {
    failedAuthPerHour?: number;
    rateLimitViolationsPerHour?: number;
    suspiciousAccessPerHour?: number;
  };
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedAuthAttempts: number;
  rateLimitViolations: number;
  suspiciousActivities: number;
  isHealthy: boolean;
}

export const useSecurityMonitoring = (options: UseSecurityMonitoringOptions = {}) => {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    alertThresholds = {
      failedAuthPerHour: 10,
      rateLimitViolationsPerHour: 5,
      suspiciousAccessPerHour: 20
    }
  } = options;

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSecurityHealth = useCallback(async (): Promise<SecurityMetrics> => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    try {
      // Get counts for different security events in the last hour
      const [
        { count: failedAuthCount },
        { count: rateLimitCount },
        { count: dataAccessCount }
      ] = await Promise.all([
        supabase
          .from('failed_auth_attempts')
          .select('*', { count: 'exact', head: true })
          .gte('attempt_time', oneHourAgo),
        supabase
          .from('rate_limit_log')
          .select('*', { count: 'exact', head: true })
          .gte('window_start', oneHourAgo)
          .not('blocked_until', 'is', null),
        supabase
          .from('personal_data_access_audit')
          .select('*', { count: 'exact', head: true })
          .gte('accessed_at', oneHourAgo)
      ]);

      const failedAuth = failedAuthCount || 0;
      const rateLimitViolations = rateLimitCount || 0;
      const suspiciousAccess = dataAccessCount || 0;
      
      const totalEvents = failedAuth + rateLimitViolations + suspiciousAccess;
      
      // Determine critical events
      let criticalEvents = 0;
      if (failedAuth > alertThresholds.failedAuthPerHour!) criticalEvents++;
      if (rateLimitViolations > alertThresholds.rateLimitViolationsPerHour!) criticalEvents++;
      if (suspiciousAccess > alertThresholds.suspiciousAccessPerHour!) criticalEvents++;

      const isHealthy = criticalEvents === 0;

      return {
        totalEvents,
        criticalEvents,
        failedAuthAttempts: failedAuth,
        rateLimitViolations,
        suspiciousActivities: suspiciousAccess,
        isHealthy
      };
    } catch (error) {
      console.error('Error checking security health:', error);
      throw error;
    }
  }, [alertThresholds]);

  const loadSecurityEvents = useCallback(async () => {
    try {
      setError(null);
      
      // Load recent security events
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const [
        { data: failedAuth },
        { data: rateLimits },
        { data: dataAccesses },
        { data: roleChanges }
      ] = await Promise.all([
        supabase
          .from('failed_auth_attempts')
          .select('*')
          .gte('attempt_time', twentyFourHoursAgo)
          .order('attempt_time', { ascending: false })
          .limit(25),
        supabase
          .from('rate_limit_log')
          .select('*')
          .gte('window_start', twentyFourHoursAgo)
          .not('blocked_until', 'is', null)
          .order('window_start', { ascending: false })
          .limit(15),
        supabase
          .from('personal_data_access_audit')
          .select('*')
          .gte('accessed_at', twentyFourHoursAgo)
          .order('accessed_at', { ascending: false })
          .limit(20),
        supabase
          .from('role_change_audit')
          .select('*')
          .gte('changed_at', twentyFourHoursAgo)
          .order('changed_at', { ascending: false })
          .limit(10)
      ]);

      // Transform data into security events
      const securityEvents: SecurityEvent[] = [];

      failedAuth?.forEach(attempt => {
        securityEvents.push({
          id: `auth_${attempt.id}`,
          type: 'auth',
          severity: 'medium',
          message: `Failed authentication: ${attempt.email} - ${attempt.failure_reason}`,
          timestamp: attempt.attempt_time,
          details: attempt
        });
      });

      rateLimits?.forEach(limit => {
        securityEvents.push({
          id: `rate_${limit.id}`,
          type: 'rate_limit',
          severity: 'high',
          message: `Rate limit exceeded for ${limit.operation}`,
          timestamp: limit.window_start,
          details: limit
        });
      });

      dataAccesses?.forEach(access => {
        securityEvents.push({
          id: `access_${access.id}`,
          type: 'access',
          severity: 'low',
          message: `Personal data accessed: ${access.data_type}`,
          timestamp: access.accessed_at,
          details: access
        });
      });

      roleChanges?.forEach(change => {
        securityEvents.push({
          id: `role_${change.id}`,
          type: 'admin',
          severity: change.new_role === 'admin' ? 'critical' : 'medium',
          message: `Role changed: ${change.old_role} → ${change.new_role}`,
          timestamp: change.changed_at,
          details: change
        });
      });

      // Sort by timestamp (most recent first)
      securityEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setEvents(securityEvents);

      // Get security health metrics
      const healthMetrics = await checkSecurityHealth();
      setMetrics(healthMetrics);

      // Show alerts for critical security issues
      if (!healthMetrics.isHealthy) {
        const criticalIssues = [];
        if (healthMetrics.failedAuthAttempts > alertThresholds.failedAuthPerHour!) {
          criticalIssues.push(`${healthMetrics.failedAuthAttempts} failed auth attempts in last hour`);
        }
        if (healthMetrics.rateLimitViolations > alertThresholds.rateLimitViolationsPerHour!) {
          criticalIssues.push(`${healthMetrics.rateLimitViolations} rate limit violations in last hour`);
        }
        if (healthMetrics.suspiciousActivities > alertThresholds.suspiciousAccessPerHour!) {
          criticalIssues.push(`${healthMetrics.suspiciousActivities} suspicious activities in last hour`);
        }

        toast.error(`Security Alert: ${criticalIssues.join(', ')}`, {
          duration: 10000,
          description: 'Critical security thresholds exceeded. Please review immediately.'
        });
      }

    } catch (error: any) {
      console.error('Error loading security events:', error);
      setError(error.message);
      toast.error('Failed to load security monitoring data');
    } finally {
      setLoading(false);
    }
  }, [checkSecurityHealth, alertThresholds]);

  // Set up auto-refresh
  useEffect(() => {
    loadSecurityEvents();
    
    if (autoRefresh) {
      const interval = setInterval(loadSecurityEvents, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadSecurityEvents, autoRefresh, refreshInterval]);

  // Log security event helper
  const logSecurityEvent = useCallback(async (
    eventType: string,
    details: any = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase.rpc('log_user_activity', {
        p_user_id: user.user.id,
        p_activity_type: `security_${eventType}`,
        p_activity_data: {
          ...details,
          severity,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }, []);

  return {
    events,
    metrics,
    loading,
    error,
    refresh: loadSecurityEvents,
    logSecurityEvent,
    checkSecurityHealth
  };
};

export default useSecurityMonitoring;