import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Activity } from 'lucide-react';

type Req = {
  id: string; full_name: string; organization: string; role: string; work_email: string; phone: string | null;
  status: string; created_at: string; decided_at: string | null; nda_accepted_at: string; expires_at: string | null;
  first_entered_at: string | null; viewing_expires_at: string | null; revoked_at: string | null;
  device_id: string | null; user_agent: string | null;
};
type View = { id: string; request_id: string; path: string | null; user_agent: string | null; created_at: string };

const fmt = (s: string | null) => s ? new Date(s).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }) + ' CT' : '—';
const mins = (ms: number) => { const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000); return `${m}m ${s}s`; };
const device = (ua: string | null) => {
  if (!ua) return 'Unknown';
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'Other';
  const br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : /Firefox\//.test(ua) ? 'Firefox' : 'Browser';
  return `${os} · ${br}`;
};

export function visitState(r: Req, now: number) {
  if (r.status === 'pending') return 'Waiting for you';
  if (r.status === 'denied') return 'Denied';
  if (r.revoked_at || r.status === 'revoked') return 'Revoked';
  if (r.first_entered_at && r.viewing_expires_at && Date.parse(r.viewing_expires_at) > now && r.status === 'approved') return 'Viewing now';
  if (r.first_entered_at) return 'Visit finished';
  if (r.status === 'approved' && r.expires_at && Date.parse(r.expires_at) > now) return 'Approved, not opened yet';
  return 'Link expired unused';
}
export function timeOnSite(r: Req, now: number) {
  if (!r.first_entered_at) return null;
  const end = r.viewing_expires_at ? Math.min(Date.parse(r.viewing_expires_at), now) : now;
  return Math.max(0, end - Date.parse(r.first_entered_at));
}

const ClinicalAccessMonitor: React.FC = () => {
  const [reqs, setReqs] = useState<Req[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    setLoading(true); setErr(null);
    const [a, b] = await Promise.all([
      supabase.from('hc_access_requests').select('id,full_name,organization,role,work_email,phone,status,created_at,decided_at,nda_accepted_at,expires_at,first_entered_at,viewing_expires_at,revoked_at,device_id,user_agent').order('created_at', { ascending: false }).limit(500),
      supabase.from('hc_access_views').select('id,request_id,path,user_agent,created_at').order('created_at', { ascending: true }).limit(1000),
    ]);
    if (a.error || b.error) { setErr((a.error || b.error)!.message); setReqs([]); setViews([]); }
    else { setReqs(a.data as Req[]); setViews(b.data as View[]); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const byReq = useMemo(() => { const m: Record<string, View[]> = {}; views.forEach(v => (m[v.request_id] ||= []).push(v)); return m; }, [views]);
  const list = reqs.filter(r => !q || `${r.full_name} ${r.work_email} ${r.organization}`.toLowerCase().includes(q.toLowerCase()));
  const count = (s: string) => reqs.filter(r => visitState(r, now) === s).length;
  const totalMs = reqs.reduce((t, r) => t + (timeOnSite(r, now) ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Activity className="h-6 w-6 text-mansagold" /> Clinical Access & Visitors</h2>
        <Button variant="outline" onClick={load} disabled={loading}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[['Total requests', reqs.length], ['Waiting for you', count('Waiting for you')], ['Viewing now', count('Viewing now')], ['Visits finished', count('Visit finished')], ['Total time viewed', mins(totalMs)]].map(([l, v]) => (
          <Card key={l as string} className="bg-slate-900 border-white/10"><CardContent className="p-4"><p className="text-xs text-slate-400">{l}</p><p className="text-xl font-bold text-mansagold">{v}</p></CardContent></Card>
        ))}
      </div>
      <Input placeholder="Search name, email or organization" value={q} onChange={e => setQ(e.target.value)} />
      {err && <p className="text-red-400">Could not load visitors: {err}</p>}
      {loading && !err && <p className="text-slate-400">Loading…</p>}
      {!loading && !err && list.length === 0 && <p className="text-slate-400">No requests yet.</p>}
      {list.map(r => {
        const st = visitState(r, now), t = timeOnSite(r, now), pv = byReq[r.id] || [];
        const left = st === 'Viewing now' && r.viewing_expires_at ? Date.parse(r.viewing_expires_at) - now : 0;
        return (
          <Card key={r.id} className="bg-slate-900 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex flex-wrap items-center gap-2">
                {r.full_name} <span className="text-slate-400 font-normal text-sm">{r.role} · {r.organization}</span>
                <Badge className={st === 'Waiting for you' ? 'bg-mansagold text-black' : st === 'Viewing now' ? 'bg-green-600' : 'bg-slate-700'}>{st}{left > 0 ? ` · ${mins(left)} left` : ''}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 grid md:grid-cols-3 gap-2">
              <div>Email: {r.work_email}<br />Phone: {r.phone || '—'}</div>
              <div>Requested: {fmt(r.created_at)}<br />Agreement accepted: {fmt(r.nda_accepted_at)}<br />Decided: {fmt(r.decided_at)}</div>
              <div>First entered: {fmt(r.first_entered_at)}<br />Time on site: {t == null ? 'Never entered' : mins(t)}<br />Device: {device(r.user_agent)}{r.device_id ? ' (locked to one device)' : ''}</div>
              <div className="md:col-span-3">
                <Button size="sm" variant="ghost" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? 'Hide' : 'Show'} screens viewed ({pv.length})</Button>
                {open === r.id && (pv.length ? <ul className="mt-2 space-y-1">{pv.map(v => <li key={v.id}>{fmt(v.created_at)} — {v.path || 'unknown screen'} <span className="text-slate-500">({device(v.user_agent)})</span></li>)}</ul> : <p className="mt-2 text-slate-500">No screens recorded.</p>)}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <p className="text-xs text-slate-500">Approve, deny and revoke still happen from the request emails sent to Thomas@1325.ai.</p>
    </div>
  );
};
export default ClinicalAccessMonitor;
