import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { AlertTriangle, CalendarDays, FlaskConical, Inbox, MessageSquare, Pill, Send, UserPlus, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db, Row, useRows } from './hc';
import DataLoadErrors from './DataLoadErrors';
import { usePilotPrivacy } from './PilotPrivacy';
import {
  MESSAGE_MAX, PATIENT_TOPICS, PORTAL_TEST_NOTICE, TOPIC_LABELS, unreadFor, validatePortalEmail, validatePortalMessage, type PortalTopic,
} from '@/lib/clinical/patient-portal';
import { APPT_STATUS_LABELS, VISIT_TYPE_LABELS, type ApptStatus, type VisitType } from '@/lib/clinical/scheduling';
import { LAB_FLAG_LABELS, type LabFlag } from '@/lib/clinical/real-patient-chart';
import type { PilotPermissions } from '@/lib/clinical/pilot-roles';

const gold = 'bg-mansagold text-mansablue hover:bg-mansagold-dark';
const fmt = (d?: string | null) => (d ? format(parseISO(d), 'MMM d, yyyy') : '—');
const Notice = ({ children }: { children: React.ReactNode }) => (
  <p role="note" className="flex gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-xs text-muted-foreground"><AlertTriangle className="h-4 w-4 shrink-0 text-mansagold" />{children}</p>
);

/* ---------------- Shared message thread ---------------- */

function Thread({ messages, side }: { messages: Row[]; side: 'clinic' | 'patient' }) {
  if (messages.length === 0) return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  return (
    <ol className="space-y-2" aria-label="Messages">
      {messages.map((m) => {
        const mine = m.sender_kind === side;
        return (
          <li key={m.id} className={`max-w-[85%] rounded-lg border p-3 text-sm ${mine ? 'ml-auto border-mansagold/40 bg-mansagold/10' : 'bg-card'}`}>
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <b className="text-foreground">{m.sender_kind === 'clinic' ? 'Care team' : 'Patient'}</b>
              <Badge variant="outline">{TOPIC_LABELS[m.topic as PortalTopic] ?? m.topic}</Badge>
              <span>{format(new Date(m.created_at), 'MMM d, h:mm a')}</span>
            </div>
            <p className="whitespace-pre-wrap">{m.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Composer({ onSend, topics, placeholder }: { onSend: (body: string, topic: PortalTopic) => Promise<boolean>; topics: PortalTopic[]; placeholder: string }) {
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState<PortalTopic>(topics[0]);
  const [sending, setSending] = useState(false);
  const send = async () => {
    const p = validatePortalMessage(body);
    if (p) { toast.error(p); return; }
    setSending(true);
    const ok = await onSend(body.trim(), topic);
    setSending(false);
    if (ok) setBody('');
  };
  return (
    <div className="space-y-2 border-t pt-3">
      {topics.length > 1 && (
        <Select value={topic} onValueChange={(v) => setTopic(v as PortalTopic)}>
          <SelectTrigger className="w-64" aria-label="Message topic"><SelectValue /></SelectTrigger>
          <SelectContent>{topics.map((t) => <SelectItem key={t} value={t}>{TOPIC_LABELS[t]}</SelectItem>)}</SelectContent>
        </Select>
      )}
      <Textarea rows={3} maxLength={MESSAGE_MAX} value={body} onChange={(e) => setBody(e.target.value)} placeholder={placeholder} aria-label="Message" />
      <Button className={gold} disabled={sending} onClick={() => void send()}><Send className="mr-1 h-4 w-4" />{sending ? 'Sending…' : 'Send message'}</Button>
    </div>
  );
}

/* ---------------- Clinic side: chart tab ---------------- */

export function PortalTeamPanel({ clinicId, patient, perms }: { clinicId: string; patient: Row; perms: PilotPermissions }) {
  const links = useRows('hc_pilot_portal_links', perms.portalTeam ? clinicId : null, { eq: ['patient_id', patient.id] });
  const messages = useRows('hc_pilot_portal_messages', perms.portalTeam ? clinicId : null, { eq: ['patient_id', patient.id], order: 'created_at', asc: true });
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const unread = unreadFor('clinic', messages.rows);
  useEffect(() => {
    if (unread > 0) void db.rpc('hc_pilot_portal_mark_read', { _patient: patient.id, _side: 'clinic' });
  }, [unread, patient.id]);

  if (!perms.portalTeam) return <p className="text-sm text-muted-foreground">The patient portal is handled by doctors, nurses and the front desk.</p>;
  if (patient.is_real) return <Notice>The patient portal is for made-up test patients only until go-live review.</Notice>;

  const invite = async () => {
    const p = validatePortalEmail(email);
    if (p) { toast.error(p); return; }
    setBusy(true);
    try {
      const { data, error } = await db.rpc('hc_pilot_portal_invite', { _patient: patient.id, _email: email.trim() });
      if (error) throw new Error(error.message);
      if (data === 'not_found') { toast.error('No 1325 account uses that email yet. Ask the tester to create an account first, then try again.'); return; }
      toast.success('Portal access given. The tester signs in at health.1325.ai/health/app?view=portal');
      setEmail(''); await links.reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Portal access could not be given.'); }
    finally { setBusy(false); }
  };
  const revoke = async (id: string) => {
    setBusy(true);
    const { error } = await db.rpc('hc_pilot_portal_revoke', { _link: id });
    setBusy(false);
    if (error) { toast.error('Access could not be removed. Try again.'); return; }
    toast.success('Portal access removed'); await links.reload();
  };
  const reply = async (body: string, topic: PortalTopic) => {
    const { data: auth } = await db.auth.getUser();
    const { data, error } = await db.from('hc_pilot_portal_messages').insert({ clinic_id: clinicId, patient_id: patient.id, sender_kind: 'clinic', topic, body, sender_id: auth?.user?.id }).select('id').single();
    if (error || !data?.id) { toast.error(error?.message ?? 'Message could not be sent.'); return false; }
    toast.success('Reply sent to the portal'); await messages.reload(); return true;
  };
  const active = links.rows.filter((l) => l.active);

  return (
    <div className="space-y-4">
      <Notice>{PORTAL_TEST_NOTICE}</Notice>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Who can open this test patient’s portal</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <DataLoadErrors sources={[links]} />
          {active.length === 0 ? <p className="text-sm text-muted-foreground">Nobody yet. Give a tester access with the email of their 1325 account.</p>
            : <ul className="space-y-2">{active.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2 text-sm"><span>{l.email} · since {fmt(String(l.created_at).slice(0, 10))}</span>
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => void revoke(l.id)}><UserX className="mr-1 h-4 w-4" />Remove access</Button></li>
            ))}</ul>}
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[16rem] flex-1 space-y-1"><Label htmlFor="portal-email">Tester’s email</Label><Input id="portal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tester@example.com" /></div>
            <Button className={gold} disabled={busy} onClick={() => void invite()}><UserPlus className="mr-1 h-4 w-4" />Give portal access</Button>
          </div>
          <p className="text-xs text-muted-foreground">The tester also needs approved 1325 Clinical viewing. They open health.1325.ai/health/app?view=portal and sign in with this email.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="h-4 w-4" />Portal messages</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <DataLoadErrors sources={[messages]} />
          {messages.loading ? <p role="status" className="text-sm text-muted-foreground">Loading messages…</p> : <Thread messages={messages.rows} side="clinic" />}
          <Composer onSend={reply} topics={['reply']} placeholder="Write a reply the patient will see in their portal" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Clinic side: inbox ---------------- */

export function PortalInbox({ clinicId, patients, perms, onOpenPatient }: { clinicId: string; patients: Row[]; perms: PilotPermissions; onOpenPatient: (id: string) => void }) {
  const { name } = usePilotPrivacy();
  const messages = useRows('hc_pilot_portal_messages', perms.portalTeam ? clinicId : null, { order: 'created_at', asc: false });
  const byPatient = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of messages.rows) m.set(r.patient_id, [...(m.get(r.patient_id) ?? []), r]);
    return [...m.entries()].map(([pid, rows]) => ({ pid, rows, unread: unreadFor('clinic', rows), last: rows[0] }))
      .sort((a, b) => (b.unread - a.unread) || String(b.last.created_at).localeCompare(String(a.last.created_at)));
  }, [messages.rows]);
  const patientById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);
  if (!perms.portalTeam) return <p className="text-sm text-muted-foreground">The portal inbox is for doctors, nurses and the front desk.</p>;
  return (
    <div className="space-y-4">
      <Notice>{PORTAL_TEST_NOTICE}</Notice>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Inbox className="h-4 w-4" />Patient portal inbox</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <DataLoadErrors sources={[messages]} />
          {messages.loading ? <p role="status" className="text-sm text-muted-foreground">Loading…</p>
            : byPatient.length === 0 ? <p className="text-sm text-muted-foreground">No portal messages yet. Open a test patient’s chart → Patient portal to give a tester access.</p>
            : byPatient.map(({ pid, rows, unread, last }) => (
              <button key={pid} type="button" onClick={() => onOpenPatient(pid)} className="flex w-full flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-left text-sm hover:bg-muted">
                <span><b>{patientById.get(pid) ? name(patientById.get(pid)!) : 'Test patient'}</b> · {TOPIC_LABELS[last.topic as PortalTopic] ?? last.topic}<span className="block text-xs text-muted-foreground line-clamp-1">{last.body}</span></span>
                <span className="flex items-center gap-2">{unread > 0 && <Badge variant="destructive">{unread} new</Badge>}<span className="text-xs text-muted-foreground">{rows.length} message{rows.length === 1 ? '' : 's'} · {format(new Date(last.created_at), 'MMM d, h:mm a')}</span></span>
              </button>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Patient side: the portal itself ---------------- */

export default function PatientPortal({ onBackToClinic }: { onBackToClinic?: () => void }) {
  const [mine, setMine] = useState<Row[] | null>(null);
  const [error, setError] = useState('');
  const [pid, setPid] = useState('');
  useEffect(() => {
    let live = true;
    void (async () => {
      const { data, error: e } = await db.rpc('hc_portal_my_patients');
      if (!live) return;
      if (e) { setError('Your portal could not be loaded. Check your approved viewing and try again.'); setMine([]); return; }
      setMine(data ?? []); if (data?.[0]) setPid(data[0].patient_id);
    })();
    return () => { live = false; };
  }, []);
  const current = mine?.find((m) => m.patient_id === pid);
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-8">
      {onBackToClinic && <Button variant="link" className="px-0" onClick={onBackToClinic}>← Back to my clinic</Button>}
      <h1 className="text-2xl font-semibold">My health · patient portal</h1>
      <Notice>{PORTAL_TEST_NOTICE}</Notice>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {mine === null ? <p role="status" className="text-sm text-muted-foreground">Loading your portal…</p>
        : mine.length === 0 ? <p className="text-sm text-muted-foreground">No clinic has given this account portal access yet. Ask the clinic to add your email on a test patient’s chart.</p>
        : <>
          {mine.length > 1 && (
            <Select value={pid} onValueChange={setPid}><SelectTrigger className="w-80" aria-label="Choose portal"><SelectValue /></SelectTrigger>
              <SelectContent>{mine.map((m) => <SelectItem key={m.patient_id} value={m.patient_id}>{m.first_name} {m.last_name} · {m.clinic_name}</SelectItem>)}</SelectContent></Select>
          )}
          {current && <PortalBody key={current.patient_id} link={current} />}
        </>}
    </div>
  );
}

function PortalBody({ link }: { link: Row }) {
  const { patient_id: pid, clinic_id: cid } = link;
  const [data, setData] = useState<{ appts: Row[]; rx: Row[]; records: Row[]; notes: Row[] } | null>(null);
  const [loadError, setLoadError] = useState('');
  const messages = useRows('hc_pilot_portal_messages', cid, { eq: ['patient_id', pid], order: 'created_at', asc: true });
  const [tab, setTab] = useState('home');
  const load = useCallback(async () => {
    const q = (t: string, order: string, asc = false) => db.from(t).select('*').eq('clinic_id', cid).eq('patient_id', pid).order(order, { ascending: asc });
    const [a, r, rec, n] = await Promise.all([q('hc_pilot_appointments', 'starts_at', true), q('hc_pilot_prescriptions', 'prescribed_on'), q('hc_pilot_records', 'recorded_on'), q('hc_pilot_visit_notes', 'visit_date')]);
    if (a.error || r.error || rec.error || n.error) { setLoadError('Part of your portal could not be loaded. Try again.'); }
    setData({ appts: a.data ?? [], rx: r.data ?? [], records: rec.data ?? [], notes: n.data ?? [] });
  }, [cid, pid]);
  useEffect(() => { void load(); }, [load]);
  const unread = unreadFor('patient', messages.rows);
  const marked = useRef(false);
  useEffect(() => {
    if (tab === 'messages' && unread > 0 && !marked.current) { marked.current = true; void db.rpc('hc_pilot_portal_mark_read', { _patient: pid, _side: 'patient' }).then(() => { marked.current = false; void messages.reload(); }); }
  }, [tab, unread, pid, messages]);
  const send = async (body: string, topic: PortalTopic) => {
    const { data: auth } = await db.auth.getUser();
    const { data: saved, error } = await db.from('hc_pilot_portal_messages').insert({ clinic_id: cid, patient_id: pid, sender_kind: 'patient', topic, body, sender_id: auth?.user?.id }).select('id').single();
    if (error || !saved?.id) { toast.error(error?.message ?? 'Message could not be sent.'); return false; }
    toast.success('Message sent to your care team'); await messages.reload(); return true;
  };

  if (!data) return <p role="status" className="text-sm text-muted-foreground">Loading…</p>;
  const upcoming = data.appts.filter((a) => new Date(a.starts_at) >= startOfDay(new Date()) && (a.status === 'scheduled' || a.status === 'checked_in'));
  const past = data.appts.filter((a) => !upcoming.includes(a)).reverse();
  const activeRx = data.rx.filter((r) => r.status === 'active');
  const allergies = data.records.filter((r) => r.record_type === 'allergy' && r.status === 'active');
  const labs = data.records.filter((r) => r.record_type === 'lab_result');
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg">{link.first_name} {link.last_name}<Badge variant="outline"><FlaskConical className="mr-1 h-3 w-3" />Test patient</Badge></CardTitle>
        <p className="text-sm text-muted-foreground">{link.clinic_name}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loadError && <p role="alert" className="text-sm text-destructive">{loadError}</p>}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="home">Overview</TabsTrigger>
            <TabsTrigger value="visits">Appointments</TabsTrigger>
            <TabsTrigger value="meds">Medicines</TabsTrigger>
            <TabsTrigger value="labs">Test results</TabsTrigger>
            <TabsTrigger value="notes">Visit summaries</TabsTrigger>
            <TabsTrigger value="messages">Messages{unread > 0 ? ` (${unread})` : ''}</TabsTrigger>
          </TabsList>
          <TabsContent value="home" className="grid gap-3 md:grid-cols-2">
            <Card><CardHeader className="pb-1"><CardTitle className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" />Next appointment</CardTitle></CardHeader>
              <CardContent className="text-sm">{upcoming[0] ? `${format(new Date(upcoming[0].starts_at), 'EEEE, MMM d · h:mm a')} · ${VISIT_TYPE_LABELS[upcoming[0].visit_type as VisitType] ?? ''}` : 'None booked. Send an appointment request in Messages.'}</CardContent></Card>
            <Card><CardHeader className="pb-1"><CardTitle className="flex items-center gap-2 text-sm"><Pill className="h-4 w-4" />Current medicines</CardTitle></CardHeader>
              <CardContent className="text-sm">{activeRx.length ? activeRx.map((r) => r.drug_name).join(', ') : 'None on file'}</CardContent></Card>
            <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Allergies</CardTitle></CardHeader>
              <CardContent className="text-sm">{allergies.length ? allergies.map((r) => r.title).join(', ') : 'None on file'}</CardContent></Card>
            <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Unread messages</CardTitle></CardHeader>
              <CardContent className="text-sm">{unread ? `${unread} new from your care team` : 'You’re all caught up'}</CardContent></Card>
          </TabsContent>
          <TabsContent value="visits" className="space-y-2">
            <h3 className="font-medium">Upcoming</h3>
            {upcoming.length ? upcoming.map((a) => <p key={a.id} className="rounded-md border p-2 text-sm">{format(new Date(a.starts_at), 'EEE, MMM d · h:mm a')} · {VISIT_TYPE_LABELS[a.visit_type as VisitType] ?? a.visit_type}{a.reason ? ` · ${a.reason}` : ''}</p>) : <p className="text-sm text-muted-foreground">No upcoming appointments.</p>}
            <h3 className="pt-2 font-medium">Past</h3>
            {past.length ? past.map((a) => <p key={a.id} className="text-sm text-muted-foreground">{format(new Date(a.starts_at), 'MMM d, yyyy')} · {APPT_STATUS_LABELS[a.status as ApptStatus] ?? a.status}</p>) : <p className="text-sm text-muted-foreground">None yet.</p>}
          </TabsContent>
          <TabsContent value="meds" className="space-y-2">
            {data.rx.length === 0 ? <p className="text-sm text-muted-foreground">No prescriptions on file.</p> : data.rx.map((r) => (
              <div key={r.id} className="rounded-md border p-3 text-sm"><b>{r.drug_name}</b>{r.strength ? ` ${r.strength}` : ''} <Badge variant={r.status === 'active' ? 'default' : 'outline'} className="ml-1 capitalize">{r.status}</Badge>
                <p className="text-muted-foreground">{r.instructions}</p><p className="text-xs text-muted-foreground">Prescribed {fmt(r.prescribed_on)} · {r.refills} refill{r.refills === 1 ? '' : 's'}</p></div>
            ))}
            <p className="text-xs text-muted-foreground">Need a refill? Send a refill request in Messages.</p>
          </TabsContent>
          <TabsContent value="labs" className="space-y-2">
            {labs.length === 0 ? <p className="text-sm text-muted-foreground">No test results yet.</p> : labs.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-2 rounded-md border p-2 text-sm"><b>{r.title}</b>{r.lab_value && <span>{r.lab_value}{r.lab_unit ? ` ${r.lab_unit}` : ''}</span>}
                {r.lab_ref_range && <span className="text-muted-foreground">(normal {r.lab_ref_range})</span>}{r.lab_flag && r.lab_flag !== 'normal' && <Badge variant="destructive">{LAB_FLAG_LABELS[r.lab_flag as LabFlag] ?? r.lab_flag}</Badge>}<span className="text-xs text-muted-foreground">{fmt(r.recorded_on)}</span></div>
            ))}
            <p className="text-xs text-muted-foreground">Questions about a result? Message your care team.</p>
          </TabsContent>
          <TabsContent value="notes" className="space-y-2">
            {data.notes.length === 0 ? <p className="text-sm text-muted-foreground">No signed visit summaries yet.</p> : data.notes.map((n) => (
              <div key={n.id} className="space-y-1 rounded-md border p-3 text-sm"><p><b>{n.visit_reason}</b> · {fmt(n.visit_date)}</p>
                <p><span className="text-muted-foreground">What we found:</span> {n.assessment}</p><p><span className="text-muted-foreground">Your plan:</span> {n.plan}</p></div>
            ))}
          </TabsContent>
          <TabsContent value="messages" className="space-y-3">
            <p className="text-xs text-muted-foreground">For emergencies call 911. Messages are not monitored around the clock.</p>
            <DataLoadErrors sources={[messages]} />
            <Thread messages={messages.rows} side="patient" />
            <Composer onSend={send} topics={[...PATIENT_TOPICS]} placeholder="Write to your care team" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
