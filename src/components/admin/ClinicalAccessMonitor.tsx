import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Activity, Check, X, ShieldOff } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { allowedDecision, type Decision } from '../../../supabase/functions/health-access/admin-decision';

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
  const [decision, setDecision] = useState<{ request: Req; action: Decision } | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; warning: boolean } | null>(null);
  const pending = useRef(false);
  const fetching = useRef(false);

  const load = useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;
    setLoading(true);
    try {
    const [a, b] = await Promise.all([
      supabase.from('hc_access_requests').select('id,full_name,organization,role,work_email,phone,status,created_at,decided_at,nda_accepted_at,expires_at,first_entered_at,viewing_expires_at,revoked_at,device_id,user_agent').order('created_at', { ascending: false }).limit(500),
      supabase.from('hc_access_views').select('id,request_id,path,user_agent,created_at').order('created_at', { ascending: true }).limit(1000),
    ]);
    const error = a.error || b.error;
    if (error) setErr(error.message);
    else { setErr(null); setReqs(a.data as Req[]); setViews(b.data as View[]); }
    } catch { setErr('Please retry. Visitor information could not be refreshed.'); }
    finally { fetching.current = false; setLoading(false); }
  }, []);
  useEffect(() => {
    void load();
    const timer = setInterval(() => { if (!document.hidden) void load(); }, 15000);
    const focus = () => { void load(); };
    window.addEventListener('focus', focus);
    return () => { clearInterval(timer); window.removeEventListener('focus', focus); };
  }, [load]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const byReq = useMemo(() => { const m: Record<string, View[]> = {}; views.forEach(v => (m[v.request_id] ||= []).push(v)); return m; }, [views]);
  const list = reqs.filter(r => !q || `${r.full_name} ${r.work_email} ${r.organization}`.toLowerCase().includes(q.toLowerCase()));
  const count = (s: string) => reqs.filter(r => visitState(r, now) === s).length;
  const totalMs = reqs.reduce((t, r) => t + (timeOnSite(r, now) ?? 0), 0);

  const confirmDecision = async () => {
    if (!decision || pending.current) return;
    pending.current = true; setSaving(true); setNotice(null);
    try {
      const { data, error } = await supabase.functions.invoke('health-access', { body: {
        action: 'admin_decision', request_id: decision.request.id, decision: decision.action,
        expected_status: decision.request.status, confirmed: true,
      } });
      if (error) {
        let message = 'Decision not confirmed. Refresh and check the status before retrying.';
        if (error.context instanceof Response) {
          const payload = await error.context.json().catch(() => null);
          if (typeof payload?.error === 'string') message = payload.error;
        }
        throw new Error(message);
      }
      if (!data?.ok) throw new Error('Decision not confirmed. Refresh before retrying.');
      const failedEmail = (decision.action === 'approve' || decision.action === 'reopen') && data.email_accepted !== true;
      setNotice({ warning: failedEmail, text: failedEmail
        ? `Approval saved for ${decision.request.full_name}, but the invitation email was not confirmed sent. Do not approve again; check email sending before retrying delivery.`
        : decision.action === 'extend' ? `${decision.request.full_name} now has 20 minutes on their screen. A gold message tells them within about 15 seconds.`
        : decision.action === 'reopen' ? `40 more minutes approved for ${decision.request.full_name}. A new link was sent to ${decision.request.work_email}; the time starts when they open it.`
        : decision.action === 'approve' ? `Approval saved for ${decision.request.full_name}. The email provider accepted the invitation to ${decision.request.work_email}; inbox delivery is not yet confirmed.`
        : decision.action === 'deny' ? `Request denied for ${decision.request.full_name}.`
        : `Access revoked for ${decision.request.full_name}. An open preview locks at its next check, normally within 15 seconds.` });
      setDecision(null);
    } catch (error) { setNotice({ warning: true, text: error instanceof Error ? error.message : 'Decision not confirmed.' }); }
    finally { pending.current = false; setSaving(false); void load(); }
  };

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
      {notice && <p role="status" className={notice.warning ? 'text-destructive' : 'text-foreground'}>{notice.text}</p>}
      {err && <p role="alert" className="text-destructive">Could not refresh visitors: {err}. Displayed information may be out of date.</p>}
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
                <div className="flex flex-wrap gap-2 mb-2">
                  {allowedDecision(r.status, 'approve') && <Button size="sm" disabled={saving || !!err} onClick={() => { setNotice(null); setDecision({ request: r, action: 'approve' }); }}><Check className="h-4 w-4 mr-1" />Approve</Button>}
                  {allowedDecision(r.status, 'deny') && <Button size="sm" variant="outline" disabled={saving || !!err} onClick={() => { setNotice(null); setDecision({ request: r, action: 'deny' }); }}><X className="h-4 w-4 mr-1" />Deny</Button>}
                  {allowedDecision(r.status, 'revoke') && !r.revoked_at && <Button size="sm" variant="destructive" disabled={saving || !!err} onClick={() => { setNotice(null); setDecision({ request: r, action: 'revoke' }); }}><ShieldOff className="h-4 w-4 mr-1" />Revoke</Button>}
                  {st === 'Viewing now' && allowedDecision(r.status, 'extend') && !r.revoked_at && <Button size="sm" disabled={saving || !!err} onClick={() => { setNotice(null); setDecision({ request: r, action: 'extend' }); }}><RefreshCw className="h-4 w-4 mr-1" />Add 20 minutes now</Button>}
                  {allowedDecision(r.status, 'reopen') && (r.status === 'expired' || st === 'Visit finished') && !r.revoked_at && <Button size="sm" disabled={saving || !!err} onClick={() => { setNotice(null); setDecision({ request: r, action: 'reopen' }); }}><RefreshCw className="h-4 w-4 mr-1" />Give 40 more minutes</Button>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? 'Hide' : 'Show'} screens viewed ({pv.length})</Button>
                {open === r.id && (pv.length ? <ul className="mt-2 space-y-1">{pv.map(v => <li key={v.id}>{fmt(v.created_at)} — {v.path || 'unknown screen'} <span className="text-slate-500">({device(v.user_agent)})</span></li>)}</ul> : <p className="mt-2 text-slate-500">No screens recorded.</p>)}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <AlertDialog open={!!decision} onOpenChange={open => { if (!open && !pending.current) setDecision(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{decision?.action === 'extend' ? 'Add 20 minutes now?' : decision?.action === 'reopen' ? 'Give 40 more minutes?' : `Confirm ${decision?.action}`}</AlertDialogTitle>
            <AlertDialogDescription>
              {decision?.request.full_name} · {decision?.request.work_email}<br />
              {decision?.action === 'extend' ? 'Reset this visitor\'s timer to twenty minutes on the same device. A gold message appears on their screen; no new email is needed.' : decision?.action === 'reopen' ? 'Send a new link from Thomas@1325.ai for another forty-minute viewing on one device. The timer begins when they open the new link.' : decision?.action === 'approve' ? 'Send an invitation from Thomas@1325.ai for one forty-minute viewing on one device. The timer begins on first entry.' : decision?.action === 'deny' ? 'Deny this request without sending an access link.' : 'Disable this approval and its access link. An open preview locks at its next access check.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {notice?.warning && <p role="alert" className="text-destructive text-sm">{notice.text}</p>}
          <AlertDialogFooter>
            <Button variant="outline" disabled={saving} onClick={() => setDecision(null)}>Cancel</Button>
            <Button variant={decision?.action === 'approve' || decision?.action === 'reopen' || decision?.action === 'extend' ? 'default' : 'destructive'} disabled={saving} onClick={confirmDecision}>{saving ? 'Saving…' : decision?.action === 'extend' ? 'Confirm add 20 minutes' : decision?.action === 'reopen' ? 'Confirm 40 more minutes' : `Confirm ${decision?.action ?? 'decision'}`}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default ClinicalAccessMonitor;
