import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addDays, format, startOfDay, startOfWeek } from 'date-fns';
import { toast } from 'sonner';
import { CalendarPlus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, Row } from './hc';
import { usePilotPrivacy } from './PilotPrivacy';
import {
  APPT_LENGTHS, APPT_STATUS_LABELS, APPT_STEP_LABELS, VISIT_TYPES, VISIT_TYPE_LABELS, combineLocal, findConflict, isOpenAppt, nextApptSteps,
  validateAmaReason, validateAppointment, validateCancelReason, type ApptStatus, type VisitType,
} from '@/lib/clinical/scheduling';
import { roleLabel, type PilotPermissions } from '@/lib/clinical/pilot-roles';

const gold = 'bg-mansagold text-mansablue hover:bg-mansagold-dark';
const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');
const statusVariant = (s: string) => (s === 'cancelled' || s === 'no_show' || s === 'left_ama' ? 'destructive' : s === 'completed' || s === 'discharged' ? 'secondary' : s === 'checked_in' ? 'default' : 'outline') as 'destructive' | 'secondary' | 'default' | 'outline';

export function useClinicTeam(clinicId: string) {
  const [team, setTeam] = useState<Row[]>([]);
  useEffect(() => {
    let live = true;
    void (async () => {
      const { data } = await db.from('hc_members').select('user_id, role, email, display_name').eq('clinic_id', clinicId).order('created_at');
      if (live) setTeam(data ?? []);
    })();
    return () => { live = false; };
  }, [clinicId]);
  return team;
}
export const memberName = (m?: Row | null) => (m ? m.display_name || m.email || 'Team member' : 'Unknown');

type Props = { clinicId: string; patients: Row[]; perms: PilotPermissions; onOpenPatient?: (id: string) => void };

export default function PilotSchedule({ clinicId, patients, perms, onOpenPatient }: Props) {
  const { name } = usePilotPrivacy();
  const team = useClinicTeam(clinicId);
  const providers = team.filter((m) => ['owner', 'doctor', 'nurse'].includes(m.role));
  const [day, setDay] = useState(() => startOfDay(new Date()));
  const [provider, setProvider] = useState('all');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);
  const req = useRef(0);
  const weekStart = useMemo(() => startOfWeek(day, { weekStartsOn: 1 }), [day]);

  const load = useCallback(async () => {
    const n = ++req.current;
    setLoading(true); setError('');
    const { data, error: e } = await db.from('hc_pilot_appointments').select('*').eq('clinic_id', clinicId)
      .gte('starts_at', weekStart.toISOString()).lt('starts_at', addDays(weekStart, 7).toISOString()).order('starts_at');
    if (n !== req.current) return;
    if (e) { setRows([]); setError('The schedule could not be loaded. Check your approved viewing and try again.'); }
    else setRows(data ?? []);
    setLoading(false);
  }, [clinicId, weekStart]);
  useEffect(() => { void load(); return () => { ++req.current; }; }, [load]);

  const patientById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);
  const memberById = useMemo(() => new Map(team.map((m) => [m.user_id, m])), [team]);
  const visible = rows.filter((a) => provider === 'all' || a.provider_id === provider);
  const today = visible.filter((a) => dayKey(new Date(a.starts_at)) === dayKey(day));
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="icon" variant="outline" aria-label="Previous day" onClick={() => setDay(addDays(day, -1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Input type="date" aria-label="Schedule date" className="w-44" value={dayKey(day)} onChange={(e) => { const d = combineLocal(e.target.value, '00:00'); if (d) setDay(d); }} />
            <Button size="icon" variant="outline" aria-label="Next day" onClick={() => setDay(addDays(day, 1))}><ChevronRight className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setDay(startOfDay(new Date()))}>Today</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger className="w-52" aria-label="Show provider"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All doctors & nurses</SelectItem>{providers.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{memberName(m)} · {roleLabel(m.role)}</SelectItem>)}</SelectContent>
            </Select>
            {perms.bookAppointments && !booking && <Button className={gold} onClick={() => setBooking(true)}><CalendarPlus className="mr-1 h-4 w-4" />Book appointment</Button>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1" role="list" aria-label="This week">
            {days.map((d) => {
              const count = visible.filter((a) => dayKey(new Date(a.starts_at)) === dayKey(d) && isOpenAppt(a.status)).length;
              const on = dayKey(d) === dayKey(day);
              return (
                <button key={dayKey(d)} role="listitem" type="button" onClick={() => setDay(d)} aria-pressed={on}
                  className={`rounded-md border p-2 text-center text-xs transition ${on ? 'border-mansagold bg-mansagold/10 text-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                  <div className="font-medium">{format(d, 'EEE')}</div><div className="text-base text-foreground">{format(d, 'd')}</div>
                  <div>{count ? `${count} booked` : '—'}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {booking && <BookForm clinicId={clinicId} patients={patients.filter((p) => !p.archived_at)} providers={providers} existing={rows} defaultDate={dayKey(day)}
        onCancel={() => setBooking(false)} onSaved={async (when) => { setBooking(false); setDay(startOfDay(when)); await load(); }} />}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">{format(day, 'EEEE, MMMM d, yyyy')}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {loading ? <p role="status" className="text-sm text-muted-foreground">Loading schedule…</p>
            : today.length === 0 ? <p className="text-sm text-muted-foreground">No appointments this day.{perms.bookAppointments ? ' Use “Book appointment” to add one.' : ''}</p>
            : today.map((a) => (
              <ApptItem key={a.id} appt={a} patient={patientById.get(a.patient_id)} patientName={patientById.get(a.patient_id) ? name(patientById.get(a.patient_id)!) : 'Test patient'}
                provider={memberById.get(a.provider_id)} canChange={perms.bookAppointments} clinicalStaff={perms.dischargePatients} existing={rows}
                onOpenChart={perms.readChart && onOpenPatient ? () => onOpenPatient(a.patient_id) : undefined} onChanged={load} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

function BookForm({ clinicId, patients, providers, existing, defaultDate, onCancel, onSaved }: {
  clinicId: string; patients: Row[]; providers: Row[]; existing: Row[]; defaultDate: string; onCancel: () => void; onSaved: (when: Date) => void | Promise<void>;
}) {
  const { name } = usePilotPrivacy();
  const [f, setF] = useState({ patient_id: '', provider_id: providers.length === 1 ? providers[0].user_id : '', date: defaultDate, time: '09:00', duration_min: 20, visit_type: 'follow_up', reason: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const save = async () => {
    if (pending.current) return;
    const problem = validateAppointment(f);
    if (problem) { setError(problem); return; }
    const start = combineLocal(f.date, f.time)!;
    const clash = findConflict(existing as never[], { provider_id: f.provider_id, starts_at: start.toISOString(), duration_min: f.duration_min, status: 'scheduled' });
    if (clash) { setError(`That time overlaps another appointment at ${format(new Date((clash as Row).starts_at), 'h:mm a')} for this provider.`); return; }
    pending.current = true; setSaving(true); setError('');
    try {
      const { data: auth } = await db.auth.getUser();
      const { data, error: e } = await db.from('hc_pilot_appointments').insert({
        clinic_id: clinicId, patient_id: f.patient_id, provider_id: f.provider_id, starts_at: start.toISOString(), duration_min: f.duration_min,
        visit_type: f.visit_type, reason: f.reason.trim() || null, created_by: auth?.user?.id,
      }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The appointment could not be confirmed as saved. Refresh before trying again.');
      toast.success('Appointment booked');
      await onSaved(start);
    } catch (e) { setError(e instanceof Error ? e.message : 'Appointment could not be booked.'); }
    finally { pending.current = false; setSaving(false); }
  };
  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="text-base">Book an appointment</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-2"><Label>Test patient *</Label>
            <Select value={f.patient_id} onValueChange={(v) => setF({ ...f, patient_id: v })}><SelectTrigger aria-label="Test patient"><SelectValue placeholder="Choose a patient" /></SelectTrigger>
              <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{name(p)}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Doctor or nurse *</Label>
            <Select value={f.provider_id} onValueChange={(v) => setF({ ...f, provider_id: v })}><SelectTrigger aria-label="Doctor or nurse"><SelectValue placeholder="Choose" /></SelectTrigger>
              <SelectContent>{providers.map((m) => <SelectItem key={m.user_id} value={m.user_id}>{memberName(m)} · {roleLabel(m.role)}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="ap-date">Date *</Label><Input id="ap-date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
          <div className="space-y-1"><Label htmlFor="ap-time">Time *</Label><Input id="ap-time" type="time" step={300} value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} /></div>
          <div className="space-y-1"><Label>Length *</Label>
            <Select value={String(f.duration_min)} onValueChange={(v) => setF({ ...f, duration_min: Number(v) })}><SelectTrigger aria-label="Length"><SelectValue /></SelectTrigger>
              <SelectContent>{APPT_LENGTHS.map((m) => <SelectItem key={m} value={String(m)}>{m} minutes</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Visit type *</Label>
            <Select value={f.visit_type} onValueChange={(v) => setF({ ...f, visit_type: v })}><SelectTrigger aria-label="Visit type"><SelectValue /></SelectTrigger>
              <SelectContent>{VISIT_TYPES.map((t) => <SelectItem key={t} value={t}>{VISIT_TYPE_LABELS[t]}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="ap-reason">Reason</Label><Input id="ap-reason" value={f.reason} maxLength={300} onChange={(e) => setF({ ...f, reason: e.target.value })} placeholder="Blood pressure check" /></div>
        </div>
        {providers.length === 0 && <p className="text-sm text-muted-foreground">Add a doctor or nurse on the Team page first.</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button className={gold} onClick={save} disabled={saving}>{saving ? 'Booking…' : 'Book appointment'}</Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ApptItem({ appt: a, patient, patientName, provider, canChange, clinicalStaff, existing, onOpenChart, onChanged }: {
  appt: Row; patient?: Row; patientName: string; provider?: Row; canChange: boolean; clinicalStaff: boolean; existing: Row[]; onOpenChart?: () => void; onChanged: () => Promise<unknown>;
}) {
  const [mode, setMode] = useState<'cancel' | 'move' | 'ama' | null>(null);
  const [reason, setReason] = useState('');
  const start = new Date(a.starts_at);
  const [move, setMove] = useState({ date: dayKey(start), time: format(start, 'HH:mm'), duration_min: Number(a.duration_min) });
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const run = async (patch: Row, okMsg: string) => {
    if (pending.current) return;
    pending.current = true; setSaving(true);
    try {
      const { data, error } = await db.from('hc_pilot_appointments').update(patch).eq('id', a.id).eq('status', a.status).select('id, status');
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error('The appointment changed before your update. Refresh and try again.');
      toast.success(okMsg); setMode(null); setReason(''); await onChanged();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Appointment could not be updated.'); }
    finally { pending.current = false; setSaving(false); }
  };
  const step = (s: ApptStatus) => {
    if (s === 'cancelled') { setMode('cancel'); return; }
    if (s === 'left_ama') { setMode('ama'); return; }
    void run({ status: s }, s === 'discharged' ? 'Patient discharged' : `${APPT_STATUS_LABELS[s]}`);
  };
  const leftAma = () => { const p = validateAmaReason(reason); if (p) { toast.error(p); return; } void run({ status: 'left_ama', status_reason: reason.trim() }, 'Recorded: left against medical advice'); };
  const cancel = () => { const p = validateCancelReason(reason); if (p) { toast.error(p); return; } void run({ status: 'cancelled', status_reason: reason.trim() }, 'Appointment cancelled'); };
  const reschedule = () => {
    const when = combineLocal(move.date, move.time);
    const p = validateAppointment({ patient_id: a.patient_id, provider_id: a.provider_id, date: move.date, time: move.time, duration_min: move.duration_min, visit_type: a.visit_type, reason: a.reason ?? '' });
    if (p || !when) { toast.error(p ?? 'Choose a date and time.'); return; }
    if (findConflict(existing as never[], { id: a.id, provider_id: a.provider_id, starts_at: when.toISOString(), duration_min: move.duration_min, status: 'scheduled' })) { toast.error('That time overlaps another appointment for this provider.'); return; }
    void run({ starts_at: when.toISOString(), duration_min: move.duration_min }, 'Appointment moved');
  };
  const end = new Date(start.getTime() + Number(a.duration_min) * 60_000);
  return (
    <article className="rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-medium"><Clock className="h-4 w-4 text-mansagold" />{format(start, 'h:mm a')}–{format(end, 'h:mm a')}</span>
          <span className="font-medium">{patientName}</span>
          {patient?.is_real && <Badge variant="destructive">Real patient</Badge>}
          <Badge variant="outline">{VISIT_TYPE_LABELS[a.visit_type as VisitType] ?? a.visit_type}</Badge>
          <Badge variant={statusVariant(a.status)}>{APPT_STATUS_LABELS[a.status as ApptStatus] ?? a.status}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">with {memberName(provider) || a.provider_email}</span>
      </div>
      {a.reason && <p className="mt-1 text-sm text-muted-foreground">{a.reason}</p>}
      {a.status === 'cancelled' && a.status_reason && <p className="mt-1 text-xs text-muted-foreground">Cancelled: {a.status_reason}</p>}
      {a.status === 'left_ama' && a.status_reason && <p className="mt-1 text-xs text-muted-foreground">Left against medical advice: {a.status_reason}</p>}
      {(a.status === 'discharged' || a.status === 'left_ama') && <p className="mt-1 text-xs text-muted-foreground">{a.status === 'discharged' ? 'Discharged' : 'Left'} at {format(new Date(a.updated_at), 'h:mm a')}</p>}
      {a.checked_in_at && <p className="mt-1 text-xs text-muted-foreground">Checked in at {format(new Date(a.checked_in_at), 'h:mm a')}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {canChange && nextApptSteps(a.status, clinicalStaff).map((s) => (
          <Button key={s} size="sm" variant={s === 'cancelled' || s === 'no_show' || s === 'left_ama' ? 'outline' : 'default'} disabled={saving} onClick={() => step(s)}>{APPT_STEP_LABELS[s]}</Button>
        ))}
        {canChange && a.status === 'scheduled' && <Button size="sm" variant="ghost" disabled={saving} onClick={() => setMode(mode === 'move' ? null : 'move')}>Reschedule</Button>}
        {onOpenChart && <Button size="sm" variant="link" onClick={onOpenChart}>Open chart</Button>}
      </div>
      {mode === 'cancel' && (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="min-w-[16rem] flex-1 space-y-1"><Label htmlFor={`cx-${a.id}`}>Why is it cancelled? *</Label><Input id={`cx-${a.id}`} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="Patient called to cancel" /></div>
          <Button size="sm" variant="destructive" disabled={saving} onClick={cancel}>Cancel appointment</Button>
          <Button size="sm" variant="ghost" onClick={() => setMode(null)}>Keep it</Button>
        </div>
      )}
      {mode === 'ama' && (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="min-w-[16rem] flex-1 space-y-1"><Label htmlFor={`ama-${a.id}`}>Why did the patient leave against medical advice? *</Label><Input id={`ama-${a.id}`} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="Declined admission after risks were explained" /></div>
          <Button size="sm" variant="destructive" disabled={saving} onClick={leftAma}>Record AMA departure</Button>
          <Button size="sm" variant="ghost" onClick={() => setMode(null)}>Never mind</Button>
        </div>
      )}
      {mode === 'move' && (
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="space-y-1"><Label htmlFor={`mv-d-${a.id}`}>New date</Label><Input id={`mv-d-${a.id}`} type="date" value={move.date} onChange={(e) => setMove({ ...move, date: e.target.value })} /></div>
          <div className="space-y-1"><Label htmlFor={`mv-t-${a.id}`}>New time</Label><Input id={`mv-t-${a.id}`} type="time" step={300} value={move.time} onChange={(e) => setMove({ ...move, time: e.target.value })} /></div>
          <div className="space-y-1"><Label>Length</Label>
            <Select value={String(move.duration_min)} onValueChange={(v) => setMove({ ...move, duration_min: Number(v) })}><SelectTrigger className="w-36" aria-label="New length"><SelectValue /></SelectTrigger>
              <SelectContent>{APPT_LENGTHS.map((m) => <SelectItem key={m} value={String(m)}>{m} minutes</SelectItem>)}</SelectContent></Select></div>
          <Button size="sm" className={gold} disabled={saving} onClick={reschedule}>Move appointment</Button>
          <Button size="sm" variant="ghost" onClick={() => setMode(null)}>Never mind</Button>
        </div>
      )}
    </article>
  );
}

/** Small list of a patient's upcoming appointments for the chart summary. */
export function UpcomingAppointments({ clinicId, patientId }: { clinicId: string; patientId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    let live = true;
    void (async () => {
      const { data, error } = await db.from('hc_pilot_appointments').select('id, starts_at, visit_type, status, reason').eq('clinic_id', clinicId).eq('patient_id', patientId)
        .gte('starts_at', startOfDay(new Date()).toISOString()).in('status', ['scheduled', 'checked_in']).order('starts_at').limit(5);
      if (live) setRows(error ? [] : data ?? []);
    })();
    return () => { live = false; };
  }, [clinicId, patientId]);
  if (rows === null) return <p role="status" className="text-sm text-muted-foreground">Loading…</p>;
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">No upcoming appointments.</p>;
  return <ul className="space-y-1 text-sm">{rows.map((r) => <li key={r.id}>{format(new Date(r.starts_at), 'EEE MMM d · h:mm a')} · {VISIT_TYPE_LABELS[r.visit_type as VisitType] ?? r.visit_type}{r.reason ? ` · ${r.reason}` : ''}</li>)}</ul>;
}
