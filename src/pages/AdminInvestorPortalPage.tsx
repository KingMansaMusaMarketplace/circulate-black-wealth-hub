import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Download, RefreshCw, Shield, Users, FileText, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

type AccessLog = {
  id: string;
  investor_name: string | null;
  investor_email: string | null;
  investor_firm: string | null;
  action_type: string | null;
  document_requested: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

type Nda = {
  id: string;
  team_member_name: string | null;
  team_member_email: string | null;
  role: string | null;
  nda_type: string | null;
  status: string | null;
  sent_at: string | null;
  signed_at: string | null;
  signature_method: string | null;
};

const AdminInvestorPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [ndas, setNdas] = useState<Nda[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const [logsRes, ndaRes] = await Promise.all([
      supabase.from('investor_access_log').select('*').order('created_at', { ascending: false }).limit(2000),
      supabase.from('nda_signatures').select('*').order('created_at', { ascending: false }).limit(500),
    ]);
    if (logsRes.error) toast.error(logsRes.error.message);
    else setLogs((logsRes.data as AccessLog[]) || []);
    if (ndaRes.error) toast.error(ndaRes.error.message);
    else setNdas((ndaRes.data as Nda[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.investor_name?.toLowerCase().includes(q) ||
        l.investor_email?.toLowerCase().includes(q) ||
        l.investor_firm?.toLowerCase().includes(q) ||
        l.action_type?.toLowerCase().includes(q) ||
        l.document_requested?.toLowerCase().includes(q)
    );
  }, [logs, search]);

  // Derive unique investors from access log
  const investors = useMemo(() => {
    const map = new Map<string, { email: string; name: string; firm: string; visits: number; lastSeen: string; documents: Set<string>; signed: boolean }>();
    for (const l of logs) {
      if (!l.investor_email) continue;
      const k = l.investor_email.toLowerCase();
      const cur = map.get(k) ?? {
        email: l.investor_email,
        name: l.investor_name ?? '',
        firm: l.investor_firm ?? '',
        visits: 0,
        lastSeen: l.created_at,
        documents: new Set<string>(),
        signed: false,
      };
      cur.visits++;
      if (l.created_at > cur.lastSeen) cur.lastSeen = l.created_at;
      if (l.document_requested) cur.documents.add(l.document_requested);
      if (l.action_type === 'nda_signed') cur.signed = true;
      map.set(k, cur);
    }
    return [...map.values()].sort((a, b) => b.lastSeen.localeCompare(a.lastSeen));
  }, [logs]);

  const stats = useMemo(() => {
    const today = Date.now() - 24 * 60 * 60 * 1000;
    return {
      uniqueInvestors: investors.length,
      signed: investors.filter((i) => i.signed).length,
      visitsToday: logs.filter((l) => new Date(l.created_at).getTime() >= today).length,
      ndaSignatures: ndas.filter((n) => n.signed_at).length,
    };
  }, [investors, logs, ndas]);

  const exportCsv = (rows: any[], filename: string) => {
    if (rows.length === 0) return;
    const cols = Object.keys(rows[0]);
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { icon: Users, label: 'Unique Investors', value: stats.uniqueInvestors, gold: false },
    { icon: FileText, label: 'NDA Signed', value: stats.signed, gold: true },
    { icon: Activity, label: 'Visits (24h)', value: stats.visitsToday, gold: false },
    { icon: Shield, label: 'Internal NDAs', value: stats.ndaSignatures, gold: false },
  ];

  const tabTriggerClass =
    'flex items-center gap-2 data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70';

  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden text-white">
      <Helmet>
        <title>Investor Portal - Admin Dashboard</title>
        <meta name="description" content="Manage investor access, NDAs, and data room activity" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-mansagold/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mansagold/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-white/60 hover:text-white mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30 shrink-0">
                <Shield className="h-7 w-7 text-mansagold" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-display">Investor Portal</h1>
                <p className="text-white/70 text-sm mt-1">
                  U.S. Provisional Patent Application No. 63/969,202 — 27 claims pending · Illinois law · NDA-first access
                </p>
              </div>
            </div>
            <Button
              onClick={load}
              disabled={loading}
              className="bg-mansagold text-mansablue hover:bg-mansagold/90 shrink-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          {statCards.map(({ icon: Icon, label, value, gold }) => (
            <div
              key={label}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl hover:bg-white/[0.14] transition-colors"
            >
              <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-wide">
                <Icon className="h-3.5 w-3.5 text-mansagold" /> {label}
              </div>
              <div className={`text-3xl font-bold mt-2 ${gold ? 'text-mansagold' : 'text-white'}`}>{value}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="investors" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <TabsList className="backdrop-blur-xl bg-white/10 border border-white/20 mb-6">
            <TabsTrigger value="investors" className={tabTriggerClass}>
              <Users className="h-4 w-4" /> Investors
            </TabsTrigger>
            <TabsTrigger value="activity" className={tabTriggerClass}>
              <Activity className="h-4 w-4" /> Activity Log
            </TabsTrigger>
            <TabsTrigger value="ndas" className={tabTriggerClass}>
              <FileText className="h-4 w-4" /> Internal NDAs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Investor Roster</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => exportCsv(investors.map((i) => ({ ...i, documents: [...i.documents].join('|') })), 'investors.csv')}>
                    <Download className="h-3 w-3 mr-1" /> Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {investors.length === 0 ? (
                  <p className="text-sm text-white/50">No investor activity yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Firm</TableHead>
                        <TableHead>NDA</TableHead>
                        <TableHead>Visits</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Last Seen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investors.map((i) => (
                        <TableRow key={i.email}>
                          <TableCell className="font-medium">{i.name || '—'}</TableCell>
                          <TableCell className="text-xs">{i.email}</TableCell>
                          <TableCell>{i.firm || '—'}</TableCell>
                          <TableCell>
                            {i.signed ? <Badge className="bg-mansagold text-slate-900">Signed</Badge> : <Badge variant="outline">Pending</Badge>}
                          </TableCell>
                          <TableCell>{i.visits}</TableCell>
                          <TableCell className="text-xs">{i.documents.size}</TableCell>
                          <TableCell className="text-xs">{new Date(i.lastSeen).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base">Access Log</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                    <Button size="sm" variant="outline" onClick={() => exportCsv(filteredLogs, 'investor-access-log.csv')}>
                      <Download className="h-3 w-3 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Investor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.slice(0, 200).map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="text-xs">{new Date(l.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="text-sm">{l.investor_name || l.investor_email}</div>
                          <div className="text-xs text-white/40">{l.investor_firm}</div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{l.action_type}</Badge></TableCell>
                        <TableCell className="text-xs">{l.document_requested || '—'}</TableCell>
                        <TableCell className="text-xs font-mono">{l.ip_address || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ndas">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Team NDA Signatures</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => exportCsv(ndas, 'nda-signatures.csv')}>
                    <Download className="h-3 w-3 mr-1" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ndas.length === 0 ? (
                  <p className="text-sm text-white/50">No NDAs on file.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Signed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ndas.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell>{n.team_member_name}</TableCell>
                          <TableCell className="text-xs">{n.team_member_email}</TableCell>
                          <TableCell>{n.role}</TableCell>
                          <TableCell>{n.nda_type}</TableCell>
                          <TableCell>
                            <Badge variant={n.status === 'signed' ? 'default' : 'outline'}>{n.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">{n.signed_at ? new Date(n.signed_at).toLocaleDateString() : '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminInvestorPortalPage;
