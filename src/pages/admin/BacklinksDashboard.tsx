import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Link2, Globe, TrendingUp, Award, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import PageSEO from '@/components/SEO/PageSEO';

const DOMAINS = [
  { label: '1325.ai', value: '1325.ai' },
  { label: 'mansamusamarketplace.com', value: 'mansamusamarketplace.com' },
];

const fmt = new Intl.NumberFormat('en-US');

export default function BacklinksDashboard() {
  const [domain, setDomain] = useState(DOMAINS[0].value);
  const qc = useQueryClient();

  // Latest snapshot
  const { data: latest } = useQuery({
    queryKey: ['backlink-latest', domain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backlink_snapshots')
        .select('*')
        .eq('domain', domain)
        .order('captured_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Trend (last 26 snapshots = ~6 months weekly)
  const { data: trend } = useQuery({
    queryKey: ['backlink-trend', domain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backlink_snapshots')
        .select('captured_at, referring_domains, total_backlinks, authority_score')
        .eq('domain', domain)
        .order('captured_at', { ascending: true })
        .limit(26);
      if (error) throw error;
      return (data ?? []).map((r) => ({
        date: new Date(r.captured_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        refDomains: Number(r.referring_domains ?? 0),
        backlinks: Number(r.total_backlinks ?? 0),
        ascore: Number(r.authority_score ?? 0),
      }));
    },
  });

  // Top referring domains for latest snapshot
  const { data: refDomains } = useQuery({
    queryKey: ['backlink-ref-domains', latest?.id],
    enabled: !!latest?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backlink_referring_domains')
        .select('referring_domain, ascore, backlinks_num, country, first_seen')
        .eq('snapshot_id', latest!.id)
        .order('ascore', { ascending: false })
        .limit(25);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Anchors
  const { data: anchors } = useQuery({
    queryKey: ['backlink-anchors', latest?.id],
    enabled: !!latest?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backlink_anchors')
        .select('anchor, backlinks_num, referring_domains_num')
        .eq('snapshot_id', latest!.id)
        .order('backlinks_num', { ascending: false })
        .limit(15);
      if (error) throw error;
      return data ?? [];
    },
  });

  // New referring domains since previous snapshot
  const { data: newDomains } = useQuery({
    queryKey: ['backlink-new', domain, latest?.id],
    enabled: !!latest?.id,
    queryFn: async () => {
      const { data: snaps } = await supabase
        .from('backlink_snapshots')
        .select('id')
        .eq('domain', domain)
        .order('captured_at', { ascending: false })
        .limit(2);
      if (!snaps || snaps.length < 2) return [];
      const [curr, prev] = snaps;
      const { data: currRefs } = await supabase
        .from('backlink_referring_domains')
        .select('referring_domain, ascore')
        .eq('snapshot_id', curr.id);
      const { data: prevRefs } = await supabase
        .from('backlink_referring_domains')
        .select('referring_domain')
        .eq('snapshot_id', prev.id);
      const prevSet = new Set((prevRefs ?? []).map((r) => r.referring_domain));
      return (currRefs ?? [])
        .filter((r) => !prevSet.has(r.referring_domain))
        .sort((a, b) => Number(b.ascore ?? 0) - Number(a.ascore ?? 0));
    },
  });

  const refresh = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('refresh-backlinks', {
        body: { domain },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success('Snapshot saved');
      qc.invalidateQueries({ queryKey: ['backlink-latest', domain] });
      qc.invalidateQueries({ queryKey: ['backlink-trend', domain] });
    },
    onError: (e: Error) => toast.error(e.message ?? 'Refresh failed'),
  });

  const cards = [
    { label: 'Authority Score', icon: Award, value: latest?.authority_score != null ? Number(latest.authority_score).toFixed(0) : '—' },
    { label: 'Total Backlinks', icon: Link2, value: latest?.total_backlinks != null ? fmt.format(Number(latest.total_backlinks)) : '—' },
    { label: 'Referring Domains', icon: Globe, value: latest?.referring_domains != null ? fmt.format(Number(latest.referring_domains)) : '—' },
    {
      label: 'Follow / Nofollow',
      icon: TrendingUp,
      value: latest?.follow_backlinks != null && latest?.nofollow_backlinks != null
        ? `${fmt.format(Number(latest.follow_backlinks))} / ${fmt.format(Number(latest.nofollow_backlinks))}`
        : '—',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageSEO title="Backlinks Dashboard – Admin" description="Track backlink growth over time" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Backlinks</h1>
          <p className="text-muted-foreground text-sm">
            Powered by Semrush · {latest ? `Last snapshot: ${new Date(latest.captured_at).toLocaleString()}` : 'No snapshots yet — click Refresh to capture your first one.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DOMAINS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => refresh.mutate()} disabled={refresh.isPending}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refresh.isPending ? 'animate-spin' : ''}`} />
            {refresh.isPending ? 'Refreshing…' : 'Refresh now'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{c.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{c.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Referring domains over time</CardTitle></CardHeader>
        <CardContent>
          {trend && trend.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="refDomains" stroke="#FFB300" strokeWidth={2} dot={{ r: 3 }} name="Referring domains" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-12 text-center">
              Trend builds up as snapshots accumulate. A weekly snapshot fills in this chart automatically.
            </p>
          )}
        </CardContent>
      </Card>

      {newDomains && newDomains.length > 0 && (
        <Card className="border-mansagold/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-mansagold" />
              New referring domains since last snapshot ({newDomains.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {newDomains.slice(0, 30).map((d) => (
                <Badge key={d.referring_domain} variant="outline">
                  {d.referring_domain}
                  {d.ascore != null && <span className="ml-2 text-xs opacity-70">AS {Number(d.ascore).toFixed(0)}</span>}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Top referring domains</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Authority</TableHead>
                  <TableHead className="text-right">Backlinks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(refDomains ?? []).map((r) => (
                  <TableRow key={r.referring_domain}>
                    <TableCell className="font-medium">
                      <a href={`https://${r.referring_domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {r.referring_domain}
                      </a>
                    </TableCell>
                    <TableCell className="text-right">{r.ascore != null ? Number(r.ascore).toFixed(0) : '—'}</TableCell>
                    <TableCell className="text-right">{r.backlinks_num != null ? fmt.format(Number(r.backlinks_num)) : '—'}</TableCell>
                  </TableRow>
                ))}
                {(!refDomains || refDomains.length === 0) && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No data yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top anchor texts</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anchor</TableHead>
                  <TableHead className="text-right">Backlinks</TableHead>
                  <TableHead className="text-right">Domains</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(anchors ?? []).map((a, i) => (
                  <TableRow key={`${a.anchor}-${i}`}>
                    <TableCell className="font-medium truncate max-w-[260px]">{a.anchor || '(empty)'}</TableCell>
                    <TableCell className="text-right">{a.backlinks_num != null ? fmt.format(Number(a.backlinks_num)) : '—'}</TableCell>
                    <TableCell className="text-right">{a.referring_domains_num != null ? fmt.format(Number(a.referring_domains_num)) : '—'}</TableCell>
                  </TableRow>
                ))}
                {(!anchors || anchors.length === 0) && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">No data yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
