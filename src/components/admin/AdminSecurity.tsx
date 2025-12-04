import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Lock, Key, RefreshCw, Clock, MapPin, Monitor } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AuthAttempt {
  id: string;
  email: string | null;
  success: boolean;
  attempt_time: string;
  ip_address: string | null;
  user_agent: string | null;
  failure_reason: string | null;
}

interface SecurityAuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  user_id: string | null;
  timestamp: string;
  user_agent: string | null;
}

interface RateLimitLog {
  id: string;
  user_id: string | null;
  operation: string;
  attempt_count: number;
  window_start: string;
  blocked_until: string | null;
}

const AdminSecurity: React.FC = () => {
  const [authAttempts, setAuthAttempts] = useState<AuthAttempt[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [authRes, auditRes, rateRes, metricsRes] = await Promise.all([
        supabase
          .from('auth_attempt_log')
          .select('*')
          .order('attempt_time', { ascending: false })
          .limit(50),
        supabase
          .from('security_audit_log')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50),
        supabase
          .from('rate_limit_log')
          .select('*')
          .order('window_start', { ascending: false })
          .limit(50),
        supabase.rpc('get_security_metrics'),
      ]);

      if (authRes.error) throw authRes.error;
      if (auditRes.error) throw auditRes.error;

      setAuthAttempts(authRes.data || []);
      setAuditLogs(auditRes.data || []);
      setRateLimits(rateRes.data || []);
      setSecurityMetrics(metricsRes.data);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to fetch security data');
    } finally {
      setLoading(false);
    }
  };

  const failedAttempts = authAttempts.filter(a => !a.success);
  const recentBlocks = rateLimits.filter(r => r.blocked_until && new Date(r.blocked_until) > new Date());

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Failed Auth (24h)</p>
                <p className="text-3xl font-bold text-red-400">
                  {securityMetrics?.failed_auth_attempts_24h || failedAttempts.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/20">
                <Lock className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Admin Actions (24h)</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {securityMetrics?.admin_actions_24h || auditLogs.filter(l => l.action.includes('admin')).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Key className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Suspicious IPs</p>
                <p className="text-3xl font-bold text-orange-400">
                  {securityMetrics?.suspicious_ips || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/20">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Active Blocks</p>
                <p className="text-3xl font-bold text-purple-400">{recentBlocks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button onClick={fetchData} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Active Rate Limit Blocks */}
      {recentBlocks.length > 0 && (
        <Card className="backdrop-blur-xl bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Rate Limit Blocks ({recentBlocks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBlocks.map((block) => (
              <div key={block.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{block.operation}</p>
                    <p className="text-blue-300 text-sm">
                      Blocked until: {block.blocked_until && format(new Date(block.blocked_until), 'PPp')}
                    </p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {block.attempt_count} attempts
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Failed Auth Attempts */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-400" />
            Failed Authentication Attempts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {failedAttempts.slice(0, 20).map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-2"
                >
                  <div>
                    <p className="text-white font-medium">{attempt.email || 'Unknown email'}</p>
                    <p className="text-red-300 text-sm">{attempt.failure_reason || 'Authentication failed'}</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-blue-300">
                      <Monitor className="h-3 w-3" />
                      <span className="truncate max-w-32">{attempt.ip_address || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-300">
                      <Clock className="h-3 w-3" />
                      {format(new Date(attempt.attempt_time), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
              {failedAttempts.length === 0 && (
                <div className="text-center py-8 text-green-400 flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  No failed authentication attempts
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Audit Log */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-yellow-400" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.slice(0, 20).map((log) => (
              <div
                key={log.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-2"
              >
                <div>
                  <p className="text-white font-medium">{log.action}</p>
                  <p className="text-blue-300 text-sm">
                    Table: {log.table_name} {log.record_id && `• ID: ${log.record_id.slice(0, 8)}...`}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-blue-300 text-sm">
                  <Clock className="h-3 w-3" />
                  {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                </div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="text-center py-8 text-blue-300">
                No audit logs found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;
