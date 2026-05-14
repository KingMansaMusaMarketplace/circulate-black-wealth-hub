import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, MousePointerClick, Eye, Target } from 'lucide-react';
import PageSEO from '@/components/SEO/PageSEO';

const SITES = [
  { label: '1325.ai', value: 'https://1325.ai/' },
  { label: 'mansamusamarketplace.com', value: 'https://mansamusamarketplace.com/' },
];

const RANGES = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 28 days', value: 28 },
  { label: 'Last 90 days', value: 90 },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

async function callGsc(payload: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke('gsc-analytics', { body: payload });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

const fmt = new Intl.NumberFormat('en-US');
const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const pos = (n: number) => n.toFixed(1);

const SEODashboard: React.FC = () => {
  const [siteUrl, setSiteUrl] = useState(SITES[0].value);
  const [days, setDays] = useState(28);

  const startDate = useMemo(() => daysAgo(days + 2), [days]);
  const endDate = useMemo(() => daysAgo(2), [days]); // GSC has ~2 day lag

  const baseKey = [siteUrl, startDate, endDate];

  const totals = useQuery({
    queryKey: ['gsc-totals', ...baseKey],
    queryFn: () => callGsc({ siteUrl, startDate, endDate, dimensions: [], rowLimit: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const queries = useQuery({
    queryKey: ['gsc-queries', ...baseKey],
    queryFn: () => callGsc({ siteUrl, startDate, endDate, dimensions: ['query'], rowLimit: 25 }),
    staleTime: 5 * 60 * 1000,
  });

  const pages = useQuery({
    queryKey: ['gsc-pages', ...baseKey],
    queryFn: () => callGsc({ siteUrl, startDate, endDate, dimensions: ['page'], rowLimit: 25 }),
    staleTime: 5 * 60 * 1000,
  });

  const countries = useQuery({
    queryKey: ['gsc-countries', ...baseKey],
    queryFn: () => callGsc({ siteUrl, startDate, endDate, dimensions: ['country'], rowLimit: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  const sitemaps = useQuery({
    queryKey: ['gsc-sitemaps', siteUrl],
    queryFn: () => callGsc({ siteUrl, action: 'sitemaps' }),
    staleTime: 10 * 60 * 1000,
  });

  const refreshAll = () => {
    [totals, queries, pages, countries, sitemaps].forEach((q) => q.refetch());
  };

  const totalRow = totals.data?.rows?.[0];
  const errorMsg = [totals, queries, pages, countries].find((q) => q.error)?.error?.message;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageSEO title="SEO Dashboard" description="Live Google Search Console analytics" path="/admin/seo" noindex />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">SEO Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Live data from Google Search Console · {startDate} to {endDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={siteUrl} onValueChange={setSiteUrl}>
            <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SITES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList>
              {RANGES.map((r) => <TabsTrigger key={r.value} value={String(r.value)}>{r.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={refreshAll} disabled={totals.isFetching}>
            <RefreshCw className={`h-4 w-4 ${totals.isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {errorMsg && (
        <Card className="border-destructive">
          <CardContent className="pt-6 text-sm text-destructive">
            Error loading data: {errorMsg}
          </CardContent>
        </Card>
      )}

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={MousePointerClick} label="Clicks" value={totalRow ? fmt.format(totalRow.clicks) : '—'} loading={totals.isLoading} />
        <MetricCard icon={Eye} label="Impressions" value={totalRow ? fmt.format(totalRow.impressions) : '—'} loading={totals.isLoading} />
        <MetricCard icon={TrendingUp} label="Avg CTR" value={totalRow ? pct(totalRow.ctr) : '—'} loading={totals.isLoading} />
        <MetricCard icon={Target} label="Avg Position" value={totalRow ? pos(totalRow.position) : '—'} loading={totals.isLoading} />
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DataTable title="Top Queries" col="Query" rows={queries.data?.rows} loading={queries.isLoading} />
        <DataTable title="Top Pages" col="Page" rows={pages.data?.rows} loading={pages.isLoading} truncate />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DataTable title="Top Countries" col="Country" rows={countries.data?.rows} loading={countries.isLoading} />
        <Card>
          <CardHeader><CardTitle>Sitemap Indexing Status</CardTitle></CardHeader>
          <CardContent>
            {sitemaps.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : sitemaps.data?.sitemap?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sitemap</TableHead>
                    <TableHead className="text-right">Submitted</TableHead>
                    <TableHead className="text-right">Indexed</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sitemaps.data.sitemap.map((s: any) => {
                    const submitted = Number(s.contents?.[0]?.submitted ?? 0);
                    const indexed = Number(s.contents?.[0]?.indexed ?? 0);
                    return (
                      <TableRow key={s.path}>
                        <TableCell className="font-mono text-xs truncate max-w-[200px]">
                          {s.path?.split('/').pop()}
                        </TableCell>
                        <TableCell className="text-right">{fmt.format(submitted)}</TableCell>
                        <TableCell className="text-right">{fmt.format(indexed)}</TableCell>
                        <TableCell>
                          {s.errors > 0 || s.warnings > 0 ? (
                            <Badge variant="destructive">{s.errors} err / {s.warnings} warn</Badge>
                          ) : (
                            <Badge variant="secondary">OK</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No sitemaps submitted for this property yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ComponentType<any>; label: string; value: string; loading: boolean }> = ({ icon: Icon, label, value, loading }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold">{loading ? '…' : value}</div>
    </CardContent>
  </Card>
);

const DataTable: React.FC<{ title: string; col: string; rows?: any[]; loading: boolean; truncate?: boolean }> = ({ title, col, rows, loading, truncate }) => (
  <Card>
    <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
    <CardContent>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{col}</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Impr.</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Pos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className={truncate ? 'truncate max-w-[240px] text-xs' : 'text-sm'}>{r.keys?.[0]}</TableCell>
                <TableCell className="text-right">{fmt.format(r.clicks)}</TableCell>
                <TableCell className="text-right">{fmt.format(r.impressions)}</TableCell>
                <TableCell className="text-right">{pct(r.ctr)}</TableCell>
                <TableCell className="text-right">{pos(r.position)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">No data yet — Google needs ~24–48h after sitemap submission.</p>
      )}
    </CardContent>
  </Card>
);

export default SEODashboard;
