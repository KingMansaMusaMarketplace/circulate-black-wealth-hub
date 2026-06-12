import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Link2, Globe, TrendingUp, Award, Sparkles, Plus, Trash2, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import PageSEO from '@/components/SEO/PageSEO';

const DOMAINS = [
  { label: '1325.ai', value: '1325.ai' },
  { label: 'mansamusamarketplace.com', value: 'mansamusamarketplace.com' },
];

const MAX_COMPETITORS = 5;
const fmt = new Intl.NumberFormat('en-US');

function pitchPriority(ascore: number | null, count: number): { label: string; tone: 'high' | 'med' | 'low' } {
  const a = ascore ?? 0;
  if (a >= 50 && count >= 2) return { label: 'High', tone: 'high' };
  if (a >= 30 || count >= 2) return { label: 'Medium', tone: 'med' };
  return { label: 'Low', tone: 'low' };
}

export default function BacklinksDashboard() {
  const [domain, setDomain] = useState(DOMAINS[0].value);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [minAscore, setMinAscore] = useState(0);
  const [minCompetitors, setMinCompetitors] = useState(1);
  const qc = useQueryClient();

  const { data: latest } = useQuery({
    queryKey: ['backlink-latest', domain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backlink_snapshots').select('*').eq('domain', domain)
        .order('captured_at', { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: trend } = useQuery({
    queryKey: ['backlink-trend', domain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backlink_snapshots')
        .select('captured_at, referring_domains, total_backlinks, authority_score')
        .eq('domain', domain).order('captured_at', { ascending: true }).limit(26);
      if (error) throw error;
      return (data ?? []).map((r) => ({
        date: new Date(r.captured_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        refDomains: Number(r.referring_domains ?? 0),
      }));
    },
  });

  const { data: refDomains } = useQuery({
    queryKey: ['backlink-ref-domains', latest?.id],
    enabled: !!latest?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('backlink_referring_domains')
        .select('referring_domain, ascore, backlinks_num, country, first_seen')
        .eq('snapshot_id', latest!.id).order('ascore', { ascending: false }).limit(25);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: anchors } = useQuery({
    queryKey: ['backlink-anchors', latest?.id],
    enabled: !!latest?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('backlink_anchors')
        .select('anchor, backlinks_num, referring_domains_num')
        .eq('snapshot_id', latest!.id).order('backlinks_num', { ascending: false }).limit(15);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Competitors
  const { data: competitors } = useQuery({
    queryKey: ['backlink-competitors', domain],
    queryFn: async () => {
      const { data, error } = await supabase.from('backlink_competitors')
        .select('*').eq('owner_domain', domain).order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Latest competitor snapshots (one per competitor)
  const { data: competitorSnaps } = useQuery({
    queryKey: ['backlink-competitor-snaps', domain],
    queryFn: async () => {
      const { data, error } = await supabase.from('backlink_competitor_snapshots')
        .select('*').eq('owner_domain', domain).order('captured_at', { ascending: false }).limit(200);
      if (error) throw error;
      const latestByDomain = new Map<string, typeof data[number]>();
      for (const row of data ?? []) {
        if (!latestByDomain.has(row.competitor_domain)) latestByDomain.set(row.competitor_domain, row);
      }
      return Array.from(latestByDomain.values());
    },
  });

  // Gap
  const { data: gap } = useQuery({
    queryKey: ['backlink-gap', domain],
    queryFn: async () => {
      const { data, error } = await supabase.from('backlink_gap_domains')
        .select('*').eq('owner_domain', domain)
        .order('competitor_count', { ascending: false })
        .order('ascore', { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filteredGap = useMemo(() => {
    return (gap ?? []).filter((r) =>
      Number(r.ascore ?? 0) >= minAscore && (r.competitor_count ?? 0) >= minCompetitors
    );
  }, [gap, minAscore, minCompetitors]);

  const refresh = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('refresh-backlinks', { body: { domain } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success('Snapshot saved');
      qc.invalidateQueries({ queryKey: ['backlink-latest', domain] });
      qc.invalidateQueries({ queryKey: ['backlink-trend', domain] });
      qc.invalidateQueries({ queryKey: ['backlink-competitor-snaps', domain] });
      qc.invalidateQueries({ queryKey: ['backlink-gap', domain] });
    },
    onError: (e: Error) => toast.error(e.message ?? 'Refresh failed'),
  });

  const addCompetitor = useMutation({
    mutationFn: async (rawDomain: string) => {
      const cleaned = rawDomain.trim().toLowerCase()
        .replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
      if (!cleaned || !cleaned.includes('.')) throw new Error('Enter a valid domain (e.g. example.com)');
      if ((competitors?.length ?? 0) >= MAX_COMPETITORS) throw new Error(`Max ${MAX_COMPETITORS} competitors per domain`);
      const { error } = await supabase.from('backlink_competitors').insert({
        owner_domain: domain, competitor_domain: cleaned,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewCompetitor('');
      toast.success('Competitor added. Click Refresh to pull data.');
      qc.invalidateQueries({ queryKey: ['backlink-competitors', domain] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeCompetitor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('backlink_competitors').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Competitor removed');
      qc.invalidateQueries({ queryKey: ['backlink-competitors', domain] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportGapCsv = () => {
    const rows = filteredGap;
    if (rows.length === 0) { toast.error('Nothing to export yet'); return; }
    const header = ['referring_domain', 'authority_score', 'competitor_count', 'competitors', 'last_seen', 'pitch_priority'];
    const lines = [header.join(',')];
    for (const r of rows) {
      const p = pitchPriority(r.ascore as number | null, r.competitor_count);
      const row = [
        r.referring_domain,
        r.ascore ?? '',
        r.competitor_count ?? 0,
        `"${(r.competitors ?? []).join('; ')}"`,
        r.last_seen ?? '',
        p.label,
      ];
      lines.push(row.join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `link-gap-${domain}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const cards = [
    { label: 'Authority Score', icon: Award, value: latest?.authority_score != null ? Number(latest.authority_score).toFixed(0) : '—' },
    { label: 'Total Backlinks', icon: Link2, value: latest?.total_backlinks != null ? fmt.format(Number(latest.total_backlinks)) : '—' },
    { label: 'Referring Domains', icon: Globe, value: latest?.referring_domains != null ? fmt.format(Number(latest.referring_domains)) : '—' },
    {
      label: 'Follow / Nofollow', icon: TrendingUp,
      value: latest?.follow_backlinks != null && latest?.nofollow_backlinks != null
        ? `${fmt.format(Number(latest.follow_backlinks))} / ${fmt.format(Number(latest.nofollow_backlinks))}` : '—',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <PageSEO title="Backlinks Dashboard – Admin" description="Track backlink growth and competitor link gaps" />

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

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="gap">Link Gap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
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

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Top referring domains</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead className="text-right">Authority</TableHead>
                    <TableHead className="text-right">Backlinks</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {(refDomains ?? []).map((r) => (
                      <TableRow key={r.referring_domain}>
                        <TableCell className="font-medium">
                          <a href={`https://${r.referring_domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.referring_domain}</a>
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
                  <TableHeader><TableRow>
                    <TableHead>Anchor</TableHead>
                    <TableHead className="text-right">Backlinks</TableHead>
                    <TableHead className="text-right">Domains</TableHead>
                  </TableRow></TableHeader>
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
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tracked competitors for {domain}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Up to {MAX_COMPETITORS} competitors per domain. After adding one, click <b>Refresh now</b> at the top to pull their data.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="competitor.com"
                  value={newCompetitor}
                  onChange={(e) => setNewCompetitor(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newCompetitor) addCompetitor.mutate(newCompetitor); }}
                />
                <Button
                  onClick={() => addCompetitor.mutate(newCompetitor)}
                  disabled={!newCompetitor || addCompetitor.isPending || (competitors?.length ?? 0) >= MAX_COMPETITORS}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {/* Your card */}
                <Card className="border-mansagold/40">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs text-muted-foreground">You</div>
                        <div className="font-semibold">{domain}</div>
                      </div>
                      <Badge variant="outline" className="border-mansagold text-mansagold">You</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                      <div><div className="text-muted-foreground text-xs">Authority</div><div className="font-bold">{latest?.authority_score != null ? Number(latest.authority_score).toFixed(0) : '—'}</div></div>
                      <div><div className="text-muted-foreground text-xs">Backlinks</div><div className="font-bold">{latest?.total_backlinks != null ? fmt.format(Number(latest.total_backlinks)) : '—'}</div></div>
                      <div><div className="text-muted-foreground text-xs">Ref. domains</div><div className="font-bold">{latest?.referring_domains != null ? fmt.format(Number(latest.referring_domains)) : '—'}</div></div>
                    </div>
                  </CardContent>
                </Card>

                {(competitors ?? []).map((c) => {
                  const snap = (competitorSnaps ?? []).find((s) => s.competitor_domain === c.competitor_domain);
                  return (
                    <Card key={c.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Competitor</div>
                            <div className="font-semibold">{c.competitor_domain}</div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeCompetitor.mutate(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                          <div><div className="text-muted-foreground text-xs">Authority</div><div className="font-bold">{snap?.authority_score != null ? Number(snap.authority_score).toFixed(0) : '—'}</div></div>
                          <div><div className="text-muted-foreground text-xs">Backlinks</div><div className="font-bold">{snap?.total_backlinks != null ? fmt.format(Number(snap.total_backlinks)) : '—'}</div></div>
                          <div><div className="text-muted-foreground text-xs">Ref. domains</div><div className="font-bold">{snap?.referring_domains != null ? fmt.format(Number(snap.referring_domains)) : '—'}</div></div>
                        </div>
                        {!snap && <p className="text-xs text-muted-foreground mt-2">No snapshot yet — click Refresh to pull data.</p>}
                      </CardContent>
                    </Card>
                  );
                })}
                {(competitors?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground col-span-2 py-8 text-center">
                    No competitors yet. Add one above (e.g. a direct competitor's homepage domain).
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gap" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-mansagold" />
                Link Gap — sites linking to competitors but not to you
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                These are your best outreach targets. Higher authority + linking to more competitors = better pitch.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Min authority score</label>
                  <Input type="number" min={0} max={100} value={minAscore} onChange={(e) => setMinAscore(Number(e.target.value) || 0)} className="w-28" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Min competitors linking</label>
                  <Input type="number" min={1} max={MAX_COMPETITORS} value={minCompetitors} onChange={(e) => setMinCompetitors(Number(e.target.value) || 1)} className="w-28" />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{filteredGap.length} of {gap?.length ?? 0}</span>
                  <Button variant="outline" onClick={exportGapCsv}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader><TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right">Authority</TableHead>
                  <TableHead className="text-right"># Competitors</TableHead>
                  <TableHead>Linked from</TableHead>
                  <TableHead>Last seen</TableHead>
                  <TableHead>Pitch priority</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredGap.slice(0, 200).map((r) => {
                    const p = pitchPriority(r.ascore as number | null, r.competitor_count);
                    const toneClass = p.tone === 'high' ? 'bg-mansagold/20 text-mansagold border-mansagold/40'
                      : p.tone === 'med' ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                      : 'bg-muted text-muted-foreground';
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">
                          <a href={`https://${r.referring_domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.referring_domain}</a>
                        </TableCell>
                        <TableCell className="text-right">{r.ascore != null ? Number(r.ascore).toFixed(0) : '—'}</TableCell>
                        <TableCell className="text-right">{r.competitor_count}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{(r.competitors ?? []).join(', ')}</TableCell>
                        <TableCell className="text-xs">{r.last_seen ?? '—'}</TableCell>
                        <TableCell><Badge variant="outline" className={toneClass}>{p.label}</Badge></TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredGap.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {(competitors?.length ?? 0) === 0
                        ? 'Add competitors first, then click Refresh.'
                        : 'No gap data yet — click Refresh to compute, or loosen the filters.'}
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
