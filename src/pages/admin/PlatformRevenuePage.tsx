import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Activity, TrendingUp } from 'lucide-react';

export default function PlatformRevenuePage() {
  const [stats, setStats] = useState({ total: 0, count: 0, avg: 0 });
  const [featuredCount, setFeaturedCount] = useState(0);
  const [apiCalls, setApiCalls] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('platform_transactions')
        .select('amount_platform_fee, amount_total')
        .eq('status', 'succeeded');
      const total = (data ?? []).reduce((s, t: any) => s + Number(t.amount_platform_fee || 0), 0);
      const count = data?.length ?? 0;
      const avg = count ? total / count : 0;
      setStats({ total, count, avg });

      const { count: fc } = await supabase
        .from('featured_placements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      setFeaturedCount(fc ?? 0);

      const monthStart = new Date(); monthStart.setUTCDate(1); monthStart.setUTCHours(0,0,0,0);
      const { count: ac } = await supabase
        .from('api_usage_logs')
        .select('*', { count: 'exact', head: true })
        .gte('request_timestamp', monthStart.toISOString());
      setApiCalls(ac ?? 0);
    })();
  }, []);

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <Helmet><title>Platform Revenue | Admin</title></Helmet>
      <h1 className="text-3xl font-bold mb-8">Platform Revenue</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <DollarSign className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Total QR Fees Collected</CardTitle>
            <CardDescription>All-time platform fees from QR transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.total.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">{stats.count} transactions · avg ${stats.avg.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-6 w-6 text-primary mb-2" />
            <CardTitle>Active Featured Placements</CardTitle>
            <CardDescription>Paid promotional slots currently live</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{featuredCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Activity className="h-6 w-6 text-primary mb-2" />
            <CardTitle>API Calls This Month</CardTitle>
            <CardDescription>Institutional Data API usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{apiCalls.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
