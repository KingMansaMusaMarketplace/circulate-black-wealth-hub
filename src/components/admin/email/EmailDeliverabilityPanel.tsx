import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { AlertOctagon, ShieldOff, RefreshCw, MailX, TrendingDown, Trash2 } from 'lucide-react';

type LogRow = {
  id: string;
  message_id: string | null;
  template_name: string | null;
  recipient_email: string | null;
  status: string | null;
  error_message: string | null;
  created_at: string;
};

type Suppressed = { id: string; email: string; reason: string | null; created_at: string };

const statusColor = (s: string | null) => {
  if (s === 'sent') return 'default';
  if (s === 'dlq' || s === 'failed' || s === 'bounced') return 'destructive';
  if (s === 'complained') return 'destructive';
  if (s === 'suppressed') return 'outline';
  return 'secondary';
};

const EmailDeliverabilityPanel: React.FC = () => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [suppressed, setSuppressed] = useState<Suppressed[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [windowDays, setWindowDays] = useState<1 | 7 | 30>(7);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [logRes, supRes] = await Promise.all([
      supabase
        .from('email_send_log')
        .select('id,message_id,template_name,recipient_email,status,error_message,created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000),
      supabase.from('suppressed_emails').select('*').order('created_at', { ascending: false }).limit(1000),
    ]);
    if (logRes.error) toast.error(logRes.error.message);
    else setRows((logRes.data as LogRow[]) || []);
    if (supRes.error) toast.error(supRes.error.message);
    else setSuppressed((supRes.data as Suppressed[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Deduplicate by message_id - keep latest status
  const dedupRows = useMemo(() => {
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    const map = new Map<string, LogRow>();
    for (const r of rows) {
      if (new Date(r.created_at).getTime() < cutoff) continue;
      const k = r.message_id ?? r.id;
      const cur = map.get(k);
      if (!cur || cur.created_at < r.created_at) map.set(k, r);
    }
    return [...map.values()];
  }, [rows, windowDays]);

  const stats = useMemo(() => {
    const total = dedupRows.length;
    const sent = dedupRows.filter((r) => r.status === 'sent').length;
    const failed = dedupRows.filter((r) => ['dlq', 'failed', 'bounced'].includes(r.status ?? '')).length;
    const complained = dedupRows.filter((r) => r.status === 'complained').length;
    const supr = dedupRows.filter((r) => r.status === 'suppressed').length;
    return {
      total,
      sent,
      failed,
      complained,
      suppressed: supr,
      deliveryRate: total ? (sent / total) * 100 : 0,
      failureRate: total ? (failed / total) * 100 : 0,
    };
  }, [dedupRows]);

  const failingTemplates = useMemo(() => {
    const map = new Map<string, { sent: number; failed: number; lastErr: string | null }>();
    for (const r of dedupRows) {
      const k = r.template_name ?? 'unknown';
      const cur = map.get(k) ?? { sent: 0, failed: 0, lastErr: null };
      if (r.status === 'sent') cur.sent++;
      else if (['dlq', 'failed', 'bounced'].includes(r.status ?? '')) {
        cur.failed++;
        if (!cur.lastErr) cur.lastErr = r.error_message;
      }
      map.set(k, cur);
    }
    return [...map.entries()]
      .map(([template, v]) => ({ template, ...v, total: v.sent + v.failed, rate: v.sent + v.failed ? (v.failed / (v.sent + v.failed)) * 100 : 0 }))
      .filter((x) => x.failed > 0)
      .sort((a, b) => b.rate - a.rate);
  }, [dedupRows]);

  const failedRows = useMemo(
    () =>
      dedupRows
        .filter((r) => ['dlq', 'failed', 'bounced', 'complained'].includes(r.status ?? ''))
        .filter((r) => !search || r.recipient_email?.toLowerCase().includes(search.toLowerCase())),
    [dedupRows, search]
  );

  const filteredSuppressed = useMemo(
    () => suppressed.filter((s) => !search || s.email.toLowerCase().includes(search.toLowerCase())),
    [suppressed, search]
  );

  const removeSuppression = async (email: string) => {
    if (!confirm(`Remove ${email} from the suppression list? They will receive emails again.`)) return;
    const { error } = await supabase.functions.invoke('admin-email-suppression', {
      body: { action: 'remove', email },
    });
    if (error) toast.error(error.message);
    else {
      toast.success('Removed');
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Deliverability</h2>
          <p className="text-sm text-white/60">Bounces, complaints, suppressions, and failing templates</p>
        </div>
        <div className="flex gap-2 items-center">
          <Tabs value={String(windowDays)} onValueChange={(v) => setWindowDays(Number(v) as 1 | 7 | 30)}>
            <TabsList>
              <TabsTrigger value="1">24h</TabsTrigger>
              <TabsTrigger value="7">7d</TabsTrigger>
              <TabsTrigger value="30">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={load} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4">
          <div className="text-xs text-white/60">Delivery Rate</div>
          <div className="text-2xl font-bold text-mansagold mt-1">{stats.deliveryRate.toFixed(1)}%</div>
          <div className="text-xs text-white/40 mt-1">{stats.sent} of {stats.total}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-1 text-xs text-white/60"><TrendingDown className="h-3 w-3" /> Failure Rate</div>
          <div className="text-2xl font-bold text-red-400 mt-1">{stats.failureRate.toFixed(1)}%</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-1 text-xs text-white/60"><AlertOctagon className="h-3 w-3" /> Failed/Bounced</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.failed}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-1 text-xs text-white/60"><MailX className="h-3 w-3" /> Complaints</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats.complained}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-1 text-xs text-white/60"><ShieldOff className="h-3 w-3" /> Suppression List</div>
          <div className="text-2xl font-bold text-white mt-1">{suppressed.length}</div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="failing">
        <TabsList>
          <TabsTrigger value="failing">Failing Templates</TabsTrigger>
          <TabsTrigger value="failures">Recent Failures</TabsTrigger>
          <TabsTrigger value="suppressed">Suppression List</TabsTrigger>
        </TabsList>

        <TabsContent value="failing">
          <Card>
            <CardHeader><CardTitle className="text-base">Templates with Failures</CardTitle></CardHeader>
            <CardContent>
              {failingTemplates.length === 0 ? (
                <p className="text-sm text-white/50">No template failures in the selected window.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Failure Rate</TableHead>
                    <TableHead>Last Error</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {failingTemplates.map((t) => (
                      <TableRow key={t.template}>
                        <TableCell className="font-medium">{t.template}</TableCell>
                        <TableCell>{t.sent}</TableCell>
                        <TableCell className="text-red-400">{t.failed}</TableCell>
                        <TableCell><Badge variant={t.rate > 10 ? 'destructive' : 'secondary'}>{t.rate.toFixed(1)}%</Badge></TableCell>
                        <TableCell className="text-xs text-white/60 max-w-md truncate">{t.lastErr ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failures">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Failures ({failedRows.length})</CardTitle>
                <Input placeholder="Search recipient…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {failedRows.slice(0, 200).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs">{new Date(r.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{r.template_name}</TableCell>
                      <TableCell className="text-xs">{r.recipient_email}</TableCell>
                      <TableCell><Badge variant={statusColor(r.status) as any}>{r.status}</Badge></TableCell>
                      <TableCell className="text-xs text-white/60 max-w-md truncate">{r.error_message ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppressed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Suppression List ({suppressed.length})</CardTitle>
                <Input placeholder="Search email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filteredSuppressed.slice(0, 200).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.email}</TableCell>
                      <TableCell><Badge variant="outline">{s.reason ?? '—'}</Badge></TableCell>
                      <TableCell className="text-xs">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => removeSuppression(s.email)}>
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailDeliverabilityPanel;
