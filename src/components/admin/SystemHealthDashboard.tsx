import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, RefreshCw, Loader2, CircleDot } from 'lucide-react';
import { format } from 'date-fns';

interface HealthData {
  generated_at: string;
  kpis: Record<string, number | null>;
  subsystems: { name: string; status: string; note: string }[];
}

const statusColor: Record<string, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  red: 'bg-destructive',
  unknown: 'bg-muted-foreground',
};

const statusLabel: Record<string, string> = {
  green: 'Healthy', yellow: 'Degraded', red: 'Critical', unknown: 'Unknown',
};

const KPI_LABELS: Record<string, string> = {
  profiles: 'Total Users',
  businesses: 'Businesses',
  listings: 'Listings',
  qr_scans_total: 'QR Scans (all-time)',
  active_subscriptions: 'Active Subscriptions',
  active_users_5m: 'Online (last 5m)',
  active_webhooks: 'Active Webhooks',
  active_broadcasts: 'Active Broadcasts',
  active_api_tokens: 'Active API Tokens',
  security_errors_24h: 'Security Errors (24h)',
  qr_errors_24h: 'QR Errors (24h)',
  failed_deliveries_24h: 'Webhook Failures (24h)',
};

const SystemHealthDashboard: React.FC = () => {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke('admin-system-health', { body: {} });
      if (error) throw error;
      setData(resp as HealthData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Activity className="h-6 w-6" /> System Health</h2>
          <p className="text-sm text-muted-foreground">
            {data ? `Updated ${format(new Date(data.generated_at), 'p')} · Auto-refresh every 60s` : 'Loading...'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subsystems</CardTitle>
          <CardDescription>Status of core platform components.</CardDescription>
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.subsystems.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded border p-3">
                  <CircleDot className={`h-3 w-3 rounded-full ${statusColor[s.status]} text-transparent`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.note}</div>
                  </div>
                  <Badge variant={s.status === 'green' ? 'default' : s.status === 'red' ? 'destructive' : 'secondary'}>
                    {statusLabel[s.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data && Object.entries(data.kpis).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="text-xs text-muted-foreground">{KPI_LABELS[key] || key}</div>
                <div className="text-2xl font-bold">{value === null ? '—' : value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthDashboard;
