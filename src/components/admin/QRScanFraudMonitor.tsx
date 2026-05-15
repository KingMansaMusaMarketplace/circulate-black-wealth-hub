import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertTriangle, ShieldOff, Undo2, RefreshCw, Activity, Users, Building2 } from 'lucide-react';

type Scan = {
  id: string;
  qr_code_id: string | null;
  customer_id: string | null;
  business_id: string | null;
  points_awarded: number | null;
  discount_applied: number | null;
  scan_date: string;
  location_lat: number | null;
  location_lng: number | null;
  is_flagged: boolean;
  flag_reason: string | null;
  reversed: boolean;
};

const WINDOW_HOURS = 24;
const VELOCITY_THRESHOLD = 10; // scans per user in window
const BIZ_REPEAT_THRESHOLD = 3; // same user → same biz in window

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const QRScanFraudMonitor: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [flagDialog, setFlagDialog] = useState<{ scan: Scan | null; reason: string }>({ scan: null, reason: '' });

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('qr_scans')
      .select('*')
      .gte('scan_date', since)
      .order('scan_date', { ascending: false })
      .limit(1000);
    if (error) {
      toast.error('Failed to load scans: ' + error.message);
    } else {
      setScans((data as Scan[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Anomaly computation
  const { perUser, perUserBiz, impossibleTravel, topUsers, topBiz } = useMemo(() => {
    const perUserMap = new Map<string, Scan[]>();
    const perUserBizMap = new Map<string, Scan[]>();
    const bizMap = new Map<string, number>();

    for (const s of scans) {
      if (s.customer_id) {
        const arr = perUserMap.get(s.customer_id) ?? [];
        arr.push(s);
        perUserMap.set(s.customer_id, arr);
      }
      if (s.customer_id && s.business_id) {
        const k = `${s.customer_id}|${s.business_id}`;
        const arr = perUserBizMap.get(k) ?? [];
        arr.push(s);
        perUserBizMap.set(k, arr);
      }
      if (s.business_id) bizMap.set(s.business_id, (bizMap.get(s.business_id) ?? 0) + 1);
    }

    // impossible travel: 2 scans within 1h but >200km apart
    const impossible: Scan[] = [];
    for (const arr of perUserMap.values()) {
      const sorted = [...arr].sort((a, b) => a.scan_date.localeCompare(b.scan_date));
      for (let i = 1; i < sorted.length; i++) {
        const a = sorted[i - 1];
        const b = sorted[i];
        if (a.location_lat == null || b.location_lat == null) continue;
        const minutes = (new Date(b.scan_date).getTime() - new Date(a.scan_date).getTime()) / 60000;
        if (minutes > 60) continue;
        const km = haversineKm(
          { lat: Number(a.location_lat), lng: Number(a.location_lng) },
          { lat: Number(b.location_lat), lng: Number(b.location_lng) }
        );
        if (km > 200) impossible.push(b);
      }
    }

    const topUsers = [...perUserMap.entries()]
      .map(([id, arr]) => ({ id, count: arr.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    const topBiz = [...bizMap.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { perUser: perUserMap, perUserBiz: perUserBizMap, impossibleTravel: impossible, topUsers, topBiz };
  }, [scans]);

  const velocityAbusers = useMemo(
    () => [...perUser.entries()].filter(([, arr]) => arr.length >= VELOCITY_THRESHOLD),
    [perUser]
  );
  const cooldownAbusers = useMemo(
    () => [...perUserBiz.entries()].filter(([, arr]) => arr.length >= BIZ_REPEAT_THRESHOLD),
    [perUserBiz]
  );

  const filteredScans = useMemo(() => {
    if (!search) return scans;
    const q = search.toLowerCase();
    return scans.filter(
      (s) =>
        s.customer_id?.toLowerCase().includes(q) ||
        s.business_id?.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }, [scans, search]);

  const flagScan = async () => {
    if (!flagDialog.scan || !flagDialog.reason.trim()) {
      toast.error('Reason is required');
      return;
    }
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('qr_scans')
      .update({
        is_flagged: true,
        flag_reason: flagDialog.reason.trim(),
        flagged_by: u.user?.id,
        flagged_at: new Date().toISOString(),
      })
      .eq('id', flagDialog.scan.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Scan flagged');
      setFlagDialog({ scan: null, reason: '' });
      load();
    }
  };

  const reverseScan = async (s: Scan) => {
    if (!confirm(`Reverse this scan and deduct ${s.points_awarded ?? 0} points? This cannot be undone.`))
      return;

    // deduct points if any
    if (s.points_awarded && s.customer_id && s.business_id) {
      const { data: lp } = await supabase
        .from('loyalty_points')
        .select('id, points')
        .eq('customer_id', s.customer_id)
        .eq('business_id', s.business_id)
        .maybeSingle();
      if (lp) {
        await supabase
          .from('loyalty_points')
          .update({ points: Math.max(0, (lp.points ?? 0) - (s.points_awarded ?? 0)) })
          .eq('id', lp.id);
      }
    }

    const { error } = await supabase
      .from('qr_scans')
      .update({ reversed: true, reversed_at: new Date().toISOString(), is_flagged: true })
      .eq('id', s.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Scan reversed');
      load();
    }
  };

  const totalFlagged = scans.filter((s) => s.is_flagged).length;
  const totalReversed = scans.filter((s) => s.reversed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">QR Scan Fraud Monitor</h2>
          <p className="text-sm text-white/60">Last {WINDOW_HOURS}h · {scans.length} scans</p>
        </div>
        <Button onClick={load} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><Activity className="h-3 w-3" /> Total Scans</div>
            <div className="text-2xl font-bold text-white mt-1">{scans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><AlertTriangle className="h-3 w-3" /> Velocity Abusers</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{velocityAbusers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><ShieldOff className="h-3 w-3" /> Flagged</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{totalFlagged}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><Undo2 className="h-3 w-3" /> Reversed</div>
            <div className="text-2xl font-bold text-white mt-1">{totalReversed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="anomalies">
        <TabsList>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="leaderboard">Top Activity</TabsTrigger>
          <TabsTrigger value="all">All Scans</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Velocity Abuse (≥{VELOCITY_THRESHOLD} scans / {WINDOW_HOURS}h)</CardTitle></CardHeader>
            <CardContent>
              {velocityAbusers.length === 0 ? <p className="text-sm text-white/50">None detected.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Scans</TableHead><TableHead>Points Earned</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {velocityAbusers.map(([uid, arr]) => (
                      <TableRow key={uid}>
                        <TableCell className="font-mono text-xs">{uid}</TableCell>
                        <TableCell><Badge variant="destructive">{arr.length}</Badge></TableCell>
                        <TableCell>{arr.reduce((s, x) => s + (x.points_awarded ?? 0), 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Cooldown Bypass (≥{BIZ_REPEAT_THRESHOLD}× same business)</CardTitle></CardHeader>
            <CardContent>
              {cooldownAbusers.length === 0 ? <p className="text-sm text-white/50">None detected.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Business</TableHead><TableHead>Repeat Scans</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cooldownAbusers.slice(0, 50).map(([key, arr]) => {
                      const [c, b] = key.split('|');
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-mono text-xs">{c}</TableCell>
                          <TableCell className="font-mono text-xs">{b}</TableCell>
                          <TableCell><Badge variant="destructive">{arr.length}</Badge></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Impossible Travel (&gt;200km in &lt;1h)</CardTitle></CardHeader>
            <CardContent>
              {impossibleTravel.length === 0 ? <p className="text-sm text-white/50">None detected.</p> : (
                <Table>
                  <TableHeader><TableRow><TableHead>Scan ID</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {impossibleTravel.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">{s.id.slice(0, 8)}</TableCell>
                        <TableCell className="font-mono text-xs">{s.customer_id}</TableCell>
                        <TableCell>{new Date(s.scan_date).toLocaleString()}</TableCell>
                        <TableCell><Button size="sm" variant="outline" onClick={() => setFlagDialog({ scan: s, reason: 'Impossible travel' })}>Flag</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Top Scanners</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Scans</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topUsers.map((u) => (
                    <TableRow key={u.id}><TableCell className="font-mono text-xs">{u.id}</TableCell><TableCell>{u.count}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Top Businesses</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Scans</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topBiz.map((b) => (
                    <TableRow key={b.id}><TableCell className="font-mono text-xs">{b.id}</TableCell><TableCell>{b.count}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Scans</CardTitle>
                <Input placeholder="Search by id…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Pts</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScans.slice(0, 200).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-xs">{new Date(s.scan_date).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{s.customer_id?.slice(0, 8)}</TableCell>
                      <TableCell className="font-mono text-xs">{s.business_id?.slice(0, 8)}</TableCell>
                      <TableCell>{s.points_awarded ?? 0}</TableCell>
                      <TableCell>
                        {s.reversed && <Badge variant="outline">Reversed</Badge>}
                        {s.is_flagged && !s.reversed && <Badge variant="destructive">Flagged</Badge>}
                        {!s.is_flagged && !s.reversed && <Badge variant="secondary">OK</Badge>}
                      </TableCell>
                      <TableCell className="space-x-2">
                        {!s.is_flagged && (
                          <Button size="sm" variant="outline" onClick={() => setFlagDialog({ scan: s, reason: '' })}>Flag</Button>
                        )}
                        {!s.reversed && (
                          <Button size="sm" variant="destructive" onClick={() => reverseScan(s)}>Reverse</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!flagDialog.scan} onOpenChange={(o) => !o && setFlagDialog({ scan: null, reason: '' })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Flag Scan</DialogTitle></DialogHeader>
          <Textarea
            placeholder="Reason (e.g. velocity abuse, spoofed location)…"
            value={flagDialog.reason}
            onChange={(e) => setFlagDialog((p) => ({ ...p, reason: e.target.value }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialog({ scan: null, reason: '' })}>Cancel</Button>
            <Button onClick={flagScan}>Flag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRScanFraudMonitor;
