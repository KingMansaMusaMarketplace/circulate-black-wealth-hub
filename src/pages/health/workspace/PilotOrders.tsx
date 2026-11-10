import React, { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { AlertTriangle, FlaskConical, HeartHandshake, Pill, Printer, RefreshCw, Siren, Square, Volume2 } from 'lucide-react';
import { labReadBack, prescriptionReadBack, speakOnDevice } from '@/lib/clinical/kayla-workspace-voice';
import { DeviceVoiceOnly, SILENT_AUDIO, kaylaReadBackPart, type ReadBackOrder } from '../kayla-voice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, Row, useRows } from './hc';
import DataLoadErrors from './DataLoadErrors';
import {
  RX_CHECKER_NOTICE, RX_NOT_SENT_NOTICE, RX_ROUTES, RX_STATUS_LABELS, prescriptionWarnings, validatePrescription, validateRxStop, warningLabel,
} from '@/lib/clinical/prescriptions';
import {
  COMMON_LAB_TESTS, LAB_NOT_SENT_NOTICE, LAB_ORDER_STATUS_LABELS, LAB_PRIORITIES, LAB_PRIORITY_LABELS, nextLabSteps, sortOpenOrders,
  validateLabOrder, type LabOrderStatus, type LabPriority,
} from '@/lib/clinical/lab-orders';
import {
  EGFR_NOTE, SOCIAL_ANSWERS, SOCIAL_ANSWER_LABELS, SOCIAL_DOMAINS, SOCIAL_QUESTIONS, SOCIAL_SOURCE_NOTE, egfrFromChart, positiveDomains,
  validateSocialScreening, type SocialAnswer, type SocialDomain,
} from '@/lib/clinical/fairness';
import { EMERGENCY_ACCESS_MINUTES, validateEmergencyReason, type PilotPermissions } from '@/lib/clinical/pilot-roles';
import { LAB_FLAGS, LAB_FLAG_LABELS, validateChartExtras, type LabFlag } from '@/lib/clinical/real-patient-chart';
import { validatePilotRecord } from '@/lib/clinical/pilot-records';
import logo from '@/assets/1325-ai-logo.png';

const todayIso = () => format(new Date(), 'yyyy-MM-dd');
const fmt = (d?: string | null) => (d ? format(parseISO(d), 'MMM d, yyyy') : '—');
const gold = 'bg-mansagold text-mansablue hover:bg-mansagold-dark';
const Notice = ({ children }: { children: React.ReactNode }) => (
  <p role="note" className="flex gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-xs text-muted-foreground"><AlertTriangle className="h-4 w-4 shrink-0 text-mansagold" />{children}</p>
);

type ChartCtx = { clinicId: string; patient: Row; perms: PilotPermissions; writable: boolean; onFailed?: () => void };

export const READBACK_VOICE_PROBLEM = "Kayla's voice couldn't start just now. Please press Kayla read-back again in a moment.";

/** Kayla reads the order back before the doctor saves. Made-up test patients: Kayla's own voice, with
 * the sentence built by her voice service from the checked order fields. Real patients (or a clinic
 * cleared for real patients): this device's voice, so chart words never leave the browser. */
export function ReadBackButton({ clinicId, patientId, real, order, text }: { clinicId: string; patientId: string; real: boolean; order: () => ReadBackOrder; text: () => string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'speaking'>('idle');
  const [problem, setProblem] = useState('');
  const stopDevice = useRef<() => void>(() => {});
  const audio = useRef<HTMLAudioElement | null>(null);
  const token = useRef(0);
  const element = () => { if (!audio.current && typeof Audio !== 'undefined') audio.current = new Audio(); return audio.current; };
  const halt = () => { token.current++; stopDevice.current(); const a = audio.current; if (a) { a.onended = null; a.onerror = null; a.pause(); } };
  React.useEffect(() => () => { halt(); if (audio.current) audio.current.src = ''; }, []);
  const onDevice = () => { setState('speaking'); stopDevice.current = speakOnDevice(text(), { onEnd: () => setState('idle') }); };
  const start = () => {
    halt(); setProblem('');
    if (real) { onDevice(); return; }
    const mine = token.current, live = () => mine === token.current;
    const request = order();
    // Phones only allow later audio from an element that first played during a tap.
    const a = element();
    if (a) { a.muted = true; a.src = SILENT_AUDIO; void Promise.resolve(a.play()).catch(() => undefined).finally(() => { if (live() && a.src === SILENT_AUDIO) { a.pause(); a.muted = false; } }); }
    const playPiece = (url: string) => new Promise<void>((resolve, reject) => {
      const el = element(); if (!el) { reject(new Error('No audio')); return; }
      el.muted = false; el.onended = () => resolve(); el.onerror = () => reject(new Error('Audio failed'));
      el.src = url; Promise.resolve(el.play()).catch(reject);
    });
    setState('loading');
    void (async () => {
      try {
        let current = await kaylaReadBackPart(clinicId, patientId, request, 0);
        for (let n = 0; n < current.parts; n++) {
          if (!live()) return;
          const total = current.parts;
          const next = n + 1 < total ? kaylaReadBackPart(clinicId, patientId, request, n + 1) : null;
          next?.catch(() => undefined);
          setState('speaking');
          await playPiece(current.url);
          if (!next || !live()) break;
          current = { ...(await next), parts: total };
        }
        if (live()) setState('idle');
      } catch (e) {
        if (!live()) return;
        if (e instanceof DeviceVoiceOnly) { onDevice(); return; }
        setState('idle'); setProblem(READBACK_VOICE_PROBLEM);
      }
    })();
  };
  return <span className="inline-flex flex-col gap-1">
    <Button type="button" variant="outline" onClick={() => { if (state === 'idle') start(); else { halt(); setState('idle'); } }}>
      {state === 'idle' ? <Volume2 className="mr-1 h-4 w-4" /> : <Square className="mr-1 h-4 w-4" />}
      {state === 'idle' ? 'Kayla read-back' : state === 'loading' ? 'Kayla is getting ready… (stop)' : 'Stop read-back'}
    </Button>
    {problem && <span role="alert" className="text-xs text-destructive">{problem}</span>}
  </span>;
}

/* ---------------- Prescriptions ---------------- */

export function PrescriptionsPanel({ clinicId, patient, perms, writable, onFailed, records, onChanged }: ChartCtx & { records: Row[]; onChanged?: () => void }) {
  const rx = useRows('hc_pilot_prescriptions', clinicId, { order: 'prescribed_on', asc: false, eq: ['patient_id', patient.id] });
  const [form, setForm] = useState<Row | 'new' | null>(null);
  const canWrite = perms.prescribe && writable;
  const allergies = useMemo(() => [
    ...(patient.allergies ?? []),
    ...records.filter((r) => r.record_type === 'allergy' && r.status === 'active').map((r) => String(r.title)),
  ], [patient.allergies, records]);
  const current = useMemo(() => [
    ...rx.rows.filter((r) => r.status === 'active').map((r) => String(r.drug_name)),
    ...records.filter((r) => r.record_type === 'medication' && r.status === 'active' && r.medication_name).map((r) => String(r.medication_name)),
  ], [rx.rows, records]);
  const reload = async () => { await rx.reload(); onChanged?.(); };

  return (
    <div className="space-y-4">
      <Notice>{RX_NOT_SENT_NOTICE}</Notice>
      {canWrite && (form
        ? <PrescriptionForm clinicId={clinicId} patientId={patient.id} real={patient.is_real === true} renewing={form === 'new' ? null : form} allergies={allergies}
            current={form === 'new' ? current : current.filter((c) => c !== form.drug_name)} onCancel={() => setForm(null)} onFailed={onFailed}
            onSaved={async () => { setForm(null); await reload(); }} />
        : <Button onClick={() => setForm('new')} className={gold}><Pill className="mr-1 h-4 w-4" />Write prescription</Button>)}
      {!perms.prescribe && <p className="text-xs text-muted-foreground">Only a doctor can write, renew or stop prescriptions.</p>}
      <DataLoadErrors sources={[rx]} />
      {rx.loading ? <p role="status" className="text-sm text-muted-foreground">Loading prescriptions…</p>
        : rx.rows.length === 0 ? <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
        : rx.rows.map((r) => <PrescriptionItem key={r.id} rx={r} canChange={canWrite} onRenew={() => setForm(r)} onChanged={reload} onFailed={onFailed} />)}
    </div>
  );
}

function PrescriptionForm({ clinicId, patientId, real, renewing, allergies, current, onCancel, onSaved, onFailed }: {
  clinicId: string; patientId: string; real: boolean; renewing: Row | null; allergies: string[]; current: string[];
  onCancel: () => void; onSaved: () => void | Promise<void>; onFailed?: () => void;
}) {
  const [f, setF] = useState({
    drug_name: renewing?.drug_name ?? '', strength: renewing?.strength ?? '', dose: renewing?.dose ?? '', route: renewing?.route ?? 'by mouth',
    frequency: renewing?.frequency ?? '', quantity: renewing ? String(renewing.quantity) : '30', refills: renewing ? String(renewing.refills) : '0',
    days_supply: renewing?.days_supply ? String(renewing.days_supply) : '', instructions: renewing?.instructions ?? '', indication: renewing?.indication ?? '', override_reason: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const warnings = useMemo(() => prescriptionWarnings(f.drug_name, allergies, current), [f.drug_name, allergies, current]);
  const int = (v: string) => (v.trim() === '' ? null : Number(v));

  const save = async () => {
    if (pending.current) return;
    const input = {
      drug_name: f.drug_name.trim(), strength: f.strength.trim() || null, dose: f.dose.trim(), route: f.route, frequency: f.frequency.trim(),
      quantity: int(f.quantity), refills: int(f.refills), days_supply: int(f.days_supply), instructions: f.instructions.trim(),
      indication: f.indication.trim() || null, override_reason: f.override_reason.trim() || null,
    };
    const problem = validatePrescription(input, warnings);
    if (problem) { setError(problem); return; }
    pending.current = true; setSaving(true); setError('');
    try {
      const { data: auth } = await db.auth.getUser();
      const { data, error: e } = await db.from('hc_pilot_prescriptions').insert({
        ...input, clinic_id: clinicId, patient_id: patientId, warnings, renewed_from: renewing?.id ?? null, prescriber_id: auth?.user?.id,
      }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The prescription could not be confirmed as saved. Refresh before trying again.');
      toast.success(renewing ? 'Prescription renewed (practice only)' : 'Prescription saved (practice only)');
      await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'Prescription could not be saved.'); onFailed?.(); }
    finally { pending.current = false; setSaving(false); }
  };

  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="text-base">{renewing ? `Renew ${renewing.drug_name}` : 'Write a practice prescription'}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="rx-drug">Medicine *</Label><Input id="rx-drug" value={f.drug_name} onChange={set('drug_name')} maxLength={120} placeholder="Lisinopril" disabled={!!renewing} /></div>
          <div className="space-y-1"><Label htmlFor="rx-strength">Strength</Label><Input id="rx-strength" value={f.strength} onChange={set('strength')} maxLength={60} placeholder="10 mg tablet" /></div>
          <div className="space-y-1"><Label htmlFor="rx-dose">Dose *</Label><Input id="rx-dose" value={f.dose} onChange={set('dose')} maxLength={60} placeholder="1 tablet" /></div>
          <div className="space-y-1"><Label>How it’s taken *</Label>
            <Select value={f.route} onValueChange={(v) => setF({ ...f, route: v })}><SelectTrigger aria-label="How it’s taken"><SelectValue /></SelectTrigger>
              <SelectContent>{RX_ROUTES.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="rx-freq">How often *</Label><Input id="rx-freq" value={f.frequency} onChange={set('frequency')} maxLength={60} placeholder="Once a day" /></div>
          <div className="space-y-1"><Label htmlFor="rx-qty">Quantity *</Label><Input id="rx-qty" type="number" min={1} max={1000} value={f.quantity} onChange={set('quantity')} /></div>
          <div className="space-y-1"><Label htmlFor="rx-ref">Refills *</Label><Input id="rx-ref" type="number" min={0} max={11} value={f.refills} onChange={set('refills')} /></div>
          <div className="space-y-1"><Label htmlFor="rx-days">Days supply</Label><Input id="rx-days" type="number" min={1} max={365} value={f.days_supply} onChange={set('days_supply')} /></div>
          <div className="space-y-1 sm:col-span-3"><Label htmlFor="rx-sig">Directions for the patient *</Label><Input id="rx-sig" value={f.instructions} onChange={set('instructions')} maxLength={500} placeholder="Take 1 tablet by mouth once a day" /></div>
          <div className="space-y-1 sm:col-span-3"><Label htmlFor="rx-ind">Reason for the medicine</Label><Input id="rx-ind" value={f.indication} onChange={set('indication')} maxLength={200} placeholder="High blood pressure" /></div>
        </div>
        {warnings.length > 0 && (
          <div role="alert" className="space-y-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
            <p className="font-semibold text-foreground">Safety check found {warnings.length === 1 ? 'a warning' : `${warnings.length} warnings`}</p>
            <ul className="list-disc space-y-1 pl-5 text-foreground">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
            <div className="space-y-1"><Label htmlFor="rx-override">Why is it still right for this patient? *</Label>
              <Textarea id="rx-override" rows={2} maxLength={500} value={f.override_reason} onChange={set('override_reason')} placeholder="Allergist cleared, rash only in childhood" /></div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">{RX_CHECKER_NOTICE}</p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <ReadBackButton clinicId={clinicId} patientId={patientId} real={real} text={() => prescriptionReadBack(f, warnings, allergies)}
            order={() => ({ readback: 'rx', order: { drug_name: f.drug_name, strength: f.strength || null, dose: f.dose, route: f.route, frequency: f.frequency, quantity: f.quantity, refills: f.refills, days_supply: f.days_supply, warnings: warnings.length } })} />
          <Button onClick={save} disabled={saving} className={gold}>{saving ? 'Saving…' : renewing ? 'Save renewal' : 'Save prescription'}</Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PrescriptionItem({ rx: r, canChange, onRenew, onChanged, onFailed }: { rx: Row; canChange: boolean; onRenew: () => void; onChanged: () => Promise<unknown>; onFailed?: () => void }) {
  const [mode, setMode] = useState<'none' | 'stop' | 'error'>('none');
  const [date, setDate] = useState(todayIso());
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const active = r.status === 'active';
  const submit = async () => {
    const problem = mode === 'stop' ? validateRxStop(date, r.prescribed_on, reason) : reason.trim().length < 3 ? 'Give a reason (at least 3 characters).' : null;
    if (problem) { setError(problem); return; }
    setSaving(true); setError('');
    try {
      const patch = mode === 'stop' ? { status: 'stopped', stopped_on: date, stop_reason: reason.trim() } : { status: 'entered_in_error', error_reason: reason.trim() };
      const { data, error: e } = await db.from('hc_pilot_prescriptions').update(patch).eq('id', r.id).select('id, status').single();
      if (e) throw new Error(e.message);
      if (data?.status !== patch.status) throw new Error('The change could not be confirmed. Refresh to check.');
      setMode('none'); setReason(''); await onChanged();
    } catch (e) { setError(e instanceof Error ? e.message : 'The prescription could not be changed.'); onFailed?.(); }
    finally { setSaving(false); }
  };
  return (
    <Card className={r.status === 'entered_in_error' ? 'opacity-60' : undefined}>
      <CardContent className="space-y-2 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <b className={r.status === 'entered_in_error' ? 'line-through' : undefined}>{r.drug_name}{r.strength ? ` ${r.strength}` : ''}</b>
          <Badge variant={active ? 'default' : 'outline'}>{RX_STATUS_LABELS[r.status] ?? r.status}</Badge>
          {r.renewed_from && <Badge variant="outline">Renewal</Badge>}
          <span className="text-xs text-muted-foreground">{fmt(r.prescribed_on)} · {r.prescriber_email ?? 'Doctor'}</span>
        </div>
        <p>{r.dose} · {r.route} · {r.frequency} · Qty {r.quantity} · {r.refills} refill{r.refills === 1 ? '' : 's'}{r.days_supply ? ` · ${r.days_supply} days` : ''}</p>
        <p className="text-muted-foreground">Directions: {r.instructions}{r.indication ? ` · For: ${r.indication}` : ''}</p>
        {r.warnings?.length > 0 && <div className="rounded-md border border-destructive/40 p-2 text-xs"><b>Warnings overridden:</b> {r.warnings.map(warningLabel).join(' ')}{r.override_reason ? <> <b>Reason:</b> {r.override_reason}</> : null}</div>}
        {r.status === 'stopped' && <p className="text-xs text-muted-foreground">Stopped {fmt(r.stopped_on)} · {r.stop_reason}</p>}
        {r.status === 'entered_in_error' && <p className="text-xs text-muted-foreground">Entered in error · {r.error_reason}</p>}
        {canChange && (active || r.status === 'stopped') && mode === 'none' && (
          <div className="flex flex-wrap gap-2">
            {active && <Button size="sm" variant="outline" onClick={onRenew}><RefreshCw className="mr-1 h-3 w-3" />Renew</Button>}
            {active && <Button size="sm" variant="outline" onClick={() => setMode('stop')}>Stop</Button>}
            <Button size="sm" variant="ghost" onClick={() => setMode('error')}>Entered in error</Button>
          </div>
        )}
        {mode !== 'none' && (
          <div className="space-y-2 rounded-md border p-3">
            {mode === 'stop' && <div className="space-y-1"><Label htmlFor={`rxs-${r.id}`}>Stop date</Label><Input id={`rxs-${r.id}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} max={todayIso()} className="max-w-[200px]" /></div>}
            <div className="space-y-1"><Label htmlFor={`rxr-${r.id}`}>Reason</Label><Input id={`rxr-${r.id}`} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} /></div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2"><Button size="sm" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Confirm'}</Button><Button size="sm" variant="ghost" onClick={() => { setMode('none'); setError(''); }}>Cancel</Button></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- Lab orders ---------------- */

export function LabOrdersPanel({ clinicId, patient, perms, writable, onFailed, real, onResulted }: ChartCtx & { real: boolean; onResulted: () => Promise<unknown> }) {
  const orders = useRows('hc_pilot_lab_orders', clinicId, { order: 'ordered_on', asc: false, eq: ['patient_id', patient.id] });
  const [ordering, setOrdering] = useState(false);
  const open = sortOpenOrders(orders.rows as { status: string; priority: string; ordered_on: string; id: string }[]);
  const closed = orders.rows.filter((o) => !open.some((x) => x.id === o.id));
  return (
    <div className="space-y-4">
      <Notice>{LAB_NOT_SENT_NOTICE}</Notice>
      {perms.orderLabs && writable && (ordering
        ? <LabOrderForm clinicId={clinicId} patientId={patient.id} real={real} onCancel={() => setOrdering(false)} onFailed={onFailed} onSaved={async () => { setOrdering(false); await orders.reload(); }} />
        : <Button onClick={() => setOrdering(true)} className={gold}><FlaskConical className="mr-1 h-4 w-4" />Order a lab test</Button>)}
      {!perms.orderLabs && perms.collectAndResultLabs && <p className="text-xs text-muted-foreground">Doctors order tests. You can mark samples collected and enter results.</p>}
      <DataLoadErrors sources={[orders]} />
      {orders.loading ? <p role="status" className="text-sm text-muted-foreground">Loading lab orders…</p>
        : orders.rows.length === 0 ? <p className="text-sm text-muted-foreground">No lab orders yet.</p> : <>
          <h4 className="text-sm font-semibold">Waiting ({open.length})</h4>
          {open.length === 0 && <p className="text-sm text-muted-foreground">Nothing waiting.</p>}
          {open.map((o) => <LabOrderItem key={o.id} order={o as Row} clinicId={clinicId} real={real} perms={perms} writable={writable} onFailed={onFailed} onChanged={async () => { await orders.reload(); await onResulted(); }} />)}
          {closed.length > 0 && <h4 className="pt-2 text-sm font-semibold">Finished</h4>}
          {closed.map((o) => <LabOrderItem key={o.id} order={o} clinicId={clinicId} real={real} perms={perms} writable={false} onChanged={orders.reload} />)}
        </>}
    </div>
  );
}

function LabOrderForm({ clinicId, patientId, real, onCancel, onSaved, onFailed }: { clinicId: string; patientId: string; real: boolean; onCancel: () => void; onSaved: () => void | Promise<void>; onFailed?: () => void }) {
  const [test, setTest] = useState('');
  const [priority, setPriority] = useState<LabPriority>('routine');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const save = async () => {
    const problem = validateLabOrder({ test_name: test, priority, reason });
    if (problem) { setError(problem); return; }
    setSaving(true); setError('');
    try {
      const { data: auth } = await db.auth.getUser();
      const { data, error: e } = await db.from('hc_pilot_lab_orders').insert({ clinic_id: clinicId, patient_id: patientId, test_name: test.trim(), priority, reason: reason.trim() || null, ordered_by: auth?.user?.id }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The order could not be confirmed as saved. Refresh before trying again.');
      toast.success('Lab order saved (practice only)'); await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'The order could not be saved.'); onFailed?.(); }
    finally { setSaving(false); }
  };
  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="text-base">Order a lab test</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">{COMMON_LAB_TESTS.map((t) => <Button key={t} size="sm" type="button" variant={test === t ? 'default' : 'outline'} onClick={() => setTest(t)}>{t}</Button>)}</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="lo-test">Test *</Label><Input id="lo-test" value={test} onChange={(e) => setTest(e.target.value)} maxLength={140} /></div>
          <div className="space-y-1"><Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as LabPriority)}><SelectTrigger aria-label="Priority"><SelectValue /></SelectTrigger>
              <SelectContent>{LAB_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{LAB_PRIORITY_LABELS[p]}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1 sm:col-span-3"><Label htmlFor="lo-reason">Reason</Label><Input id="lo-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="Diabetes follow-up" /></div>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2"><ReadBackButton clinicId={clinicId} patientId={patientId} real={real} text={() => labReadBack(test, LAB_PRIORITY_LABELS[priority], reason)} order={() => ({ readback: 'lab', order: { test_name: test, priority, reason } })} /><Button onClick={save} disabled={saving} className={gold}>{saving ? 'Saving…' : 'Save order'}</Button><Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button></div>
      </CardContent>
    </Card>
  );
}

function LabOrderItem({ order: o, clinicId, real, perms, writable, onChanged, onFailed }: { order: Row; clinicId: string; real: boolean; perms: PilotPermissions; writable: boolean; onChanged: () => Promise<unknown>; onFailed?: () => void }) {
  const [mode, setMode] = useState<'none' | 'result' | 'cancel'>('none');
  const [r, setR] = useState({ lab_value: '', lab_unit: '', lab_ref_range: '', lab_flag: '' });
  const [reason, setReason] = useState('');
  const [savedRecord, setSavedRecord] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const steps = nextLabSteps(o.status);
  const urgent = o.priority !== 'routine';

  const update = async (patch: Row) => {
    const { data, error: e } = await db.from('hc_pilot_lab_orders').update(patch).eq('id', o.id).select('id, status').single();
    if (e) throw new Error(e.message);
    if (data?.status !== patch.status) throw new Error('The change could not be confirmed. Refresh to check.');
  };
  const run = async (fn: () => Promise<void>) => {
    setSaving(true); setError('');
    try { await fn(); setMode('none'); await onChanged(); }
    catch (e) { setError(e instanceof Error ? e.message : 'The lab order could not be changed.'); onFailed?.(); }
    finally { setSaving(false); }
  };
  const saveResult = () => run(async () => {
    let recordId = savedRecord;
    if (!recordId) {
      const input = { record_type: 'lab_result' as const, recorded_on: todayIso(), title: String(o.test_name).slice(0, 140), details: null,
        lab_value: r.lab_value.trim() || null, lab_unit: r.lab_unit.trim() || null, lab_ref_range: r.lab_ref_range.trim() || null, lab_flag: r.lab_flag || null };
      const problem = validatePilotRecord(input, new Date(), { real }) ?? validateChartExtras(input, { real }) ?? (!input.lab_value ? 'Enter the result value.' : null);
      if (problem) throw new Error(problem);
      const { data, error: e } = await db.from('hc_pilot_records').insert({ ...input, clinic_id: clinicId, patient_id: o.patient_id }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The result could not be confirmed as saved. Refresh before trying again.');
      recordId = data.id as string; setSavedRecord(recordId);
    }
    await update({ status: 'resulted', result_record_id: recordId });
    toast.success('Result saved to the chart');
  });

  return (
    <Card className={urgent && steps.length ? 'border-destructive/50' : undefined}>
      <CardContent className="space-y-2 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <b>{o.test_name}</b>
          <Badge variant={urgent ? 'destructive' : 'outline'}>{LAB_PRIORITY_LABELS[o.priority as LabPriority] ?? o.priority}</Badge>
          <Badge variant="outline">{LAB_ORDER_STATUS_LABELS[o.status as LabOrderStatus] ?? o.status}</Badge>
          <span className="text-xs text-muted-foreground">Ordered {fmt(o.ordered_on)} · {o.ordered_by_email ?? 'Doctor'}</span>
        </div>
        {o.reason && <p className="text-muted-foreground">Reason: {o.reason}</p>}
        {o.collected_at && <p className="text-xs text-muted-foreground">Sample collected {format(new Date(o.collected_at), 'MMM d, yyyy h:mm a')}</p>}
        {o.status === 'cancelled' && <p className="text-xs text-muted-foreground">Cancelled · {o.cancel_reason}</p>}
        {o.status === 'resulted' && <p className="text-xs text-muted-foreground">Result is on the Lab results tab.</p>}
        {writable && perms.collectAndResultLabs && steps.length > 0 && mode === 'none' && (
          <div className="flex flex-wrap gap-2">
            {steps.includes('collected') && <Button size="sm" variant="outline" disabled={saving} onClick={() => run(() => update({ status: 'collected' }))}>Mark sample collected</Button>}
            <Button size="sm" className={gold} onClick={() => setMode('result')}>Enter result</Button>
            {perms.cancelLabs && <Button size="sm" variant="ghost" onClick={() => setMode('cancel')}>Cancel order</Button>}
          </div>
        )}
        {mode === 'result' && (
          <div className="space-y-2 rounded-md border p-3">
            <div className="grid gap-2 sm:grid-cols-4">
              <div className="space-y-1"><Label htmlFor={`lv-${o.id}`}>Result *</Label><Input id={`lv-${o.id}`} value={r.lab_value} onChange={(e) => setR({ ...r, lab_value: e.target.value })} maxLength={60} disabled={!!savedRecord} /></div>
              <div className="space-y-1"><Label htmlFor={`lu-${o.id}`}>Units</Label><Input id={`lu-${o.id}`} value={r.lab_unit} onChange={(e) => setR({ ...r, lab_unit: e.target.value })} maxLength={30} placeholder="mg/dL" disabled={!!savedRecord} /></div>
              <div className="space-y-1"><Label htmlFor={`lr-${o.id}`}>Normal range</Label><Input id={`lr-${o.id}`} value={r.lab_ref_range} onChange={(e) => setR({ ...r, lab_ref_range: e.target.value })} maxLength={60} disabled={!!savedRecord} /></div>
              <div className="space-y-1"><Label>Flag</Label>
                <Select value={r.lab_flag} onValueChange={(v) => setR({ ...r, lab_flag: v })} disabled={!!savedRecord}><SelectTrigger aria-label="Result flag"><SelectValue placeholder="Choose" /></SelectTrigger>
                  <SelectContent>{LAB_FLAGS.map((x) => <SelectItem key={x} value={x}>{LAB_FLAG_LABELS[x as LabFlag]}</SelectItem>)}</SelectContent></Select></div>
            </div>
            {savedRecord && <p className="text-xs text-muted-foreground">The result is saved on the chart. Press “Save result” again to close the order.</p>}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2"><Button size="sm" onClick={() => void saveResult()} disabled={saving}>{saving ? 'Saving…' : 'Save result'}</Button><Button size="sm" variant="ghost" onClick={() => { setMode('none'); setError(''); }}>Close</Button></div>
          </div>
        )}
        {mode === 'cancel' && (
          <div className="space-y-2 rounded-md border p-3">
            <div className="space-y-1"><Label htmlFor={`lc-${o.id}`}>Reason for cancelling</Label><Input id={`lc-${o.id}`} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} /></div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2"><Button size="sm" disabled={saving} onClick={() => { if (reason.trim().length < 3) { setError('Give a reason (at least 3 characters).'); return; } void run(() => update({ status: 'cancelled', cancel_reason: reason.trim() })); }}>Confirm cancel</Button><Button size="sm" variant="ghost" onClick={() => { setMode('none'); setError(''); }}>Close</Button></div>
          </div>
        )}
        {mode === 'none' && error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

/* ---------------- Race-free kidney function ---------------- */

export function KidneyFunctionCard({ patient, records }: { patient: Row; records: Row[] }) {
  const res = egfrFromChart(records as never, patient.date_of_birth, patient.sex);
  return (
    <Card><CardHeader className="pb-2"><CardTitle className="text-base">Kidney function (eGFR, race-free)</CardTitle></CardHeader>
      <CardContent className="space-y-1 text-sm">
        {'egfr' in res ? <>
          <p><b className="text-lg">{res.egfr}</b> mL/min/1.73m² · {res.stage}</p>
          <p className="text-xs text-muted-foreground">From creatinine {res.creatinine} mg/dL on {fmt(res.date)}, age {res.age}.</p>
        </> : <>
          <p className="text-muted-foreground">{res.reason}</p>
          {res.both && <p>Female formula: <b>{res.both.female}</b> · Male formula: <b>{res.both.male}</b> mL/min/1.73m²</p>}
        </>}
        <p className="text-xs text-muted-foreground">{EGFR_NOTE} A calculation to support, not replace, your judgment.</p>
      </CardContent></Card>
  );
}

/* ---------------- Social needs ---------------- */

export function SocialNeedsPanel({ clinicId, patient, perms, writable, onFailed, canRead }: ChartCtx & { canRead: boolean }) {
  const rows = useRows('hc_pilot_social_screenings', clinicId, { order: 'screened_on', asc: false, eq: ['patient_id', patient.id] });
  const [adding, setAdding] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{SOCIAL_SOURCE_NOTE} Positive answers help the team connect the patient with community help.</p>
      {perms.screenSocialNeeds && writable && (adding
        ? <SocialForm clinicId={clinicId} patientId={patient.id} onCancel={() => setAdding(false)} onFailed={onFailed} onSaved={async () => { setAdding(false); await rows.reload(); }} />
        : <Button onClick={() => setAdding(true)} className={gold}><HeartHandshake className="mr-1 h-4 w-4" />New social-needs screening</Button>)}
      <DataLoadErrors sources={[rows]} />
      {!canRead && <p className="text-xs text-muted-foreground">You can see screenings you recorded. Doctors and nurses see all of them.</p>}
      {rows.loading ? <p role="status" className="text-sm text-muted-foreground">Loading screenings…</p>
        : rows.rows.length === 0 ? <p className="text-sm text-muted-foreground">No screenings yet.</p>
        : rows.rows.map((s) => (
          <Card key={s.id} className={s.status === 'entered_in_error' ? 'opacity-60' : undefined}><CardContent className="space-y-2 p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2"><b>{fmt(s.screened_on)}</b>
              {s.status === 'entered_in_error' ? <Badge variant="outline">Entered in error</Badge>
                : s.positive_domains?.length ? s.positive_domains.map((d: SocialDomain) => <Badge key={d} variant="destructive">{SOCIAL_QUESTIONS[d]?.label ?? d}</Badge>)
                : <Badge variant="outline">No needs reported</Badge>}
              <span className="text-xs text-muted-foreground">{s.created_by_email}</span></div>
            <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">{SOCIAL_DOMAINS.map((d) => <li key={d}>{SOCIAL_QUESTIONS[d].label}: {SOCIAL_ANSWER_LABELS[s.answers?.[d] as SocialAnswer] ?? '—'}</li>)}</ul>
            {s.notes && <p className="text-xs">Notes: {s.notes}</p>}
          </CardContent></Card>
        ))}
    </div>
  );
}

function SocialForm({ clinicId, patientId, onCancel, onSaved, onFailed }: { clinicId: string; patientId: string; onCancel: () => void; onSaved: () => void | Promise<void>; onFailed?: () => void }) {
  const [answers, setAnswers] = useState<Partial<Record<SocialDomain, SocialAnswer>>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pos = positiveDomains(answers);
  const save = async () => {
    const problem = validateSocialScreening(answers, notes);
    if (problem) { setError(problem); return; }
    setSaving(true); setError('');
    try {
      const { data: auth } = await db.auth.getUser();
      const { data, error: e } = await db.from('hc_pilot_social_screenings').insert({ clinic_id: clinicId, patient_id: patientId, answers, notes: notes.trim() || null, created_by: auth?.user?.id }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The screening could not be confirmed as saved. Refresh before trying again.');
      toast.success('Screening saved'); await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'The screening could not be saved.'); onFailed?.(); }
    finally { setSaving(false); }
  };
  return (
    <Card className="border-mansagold/40"><CardHeader><CardTitle className="text-base">Social-needs screening</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {SOCIAL_DOMAINS.map((d) => (
          <fieldset key={d} className="space-y-1">
            <legend className="text-sm"><b>{SOCIAL_QUESTIONS[d].label}.</b> {SOCIAL_QUESTIONS[d].question}</legend>
            <div className="flex flex-wrap gap-2">{SOCIAL_ANSWERS.map((a) => (
              <Button key={a} type="button" size="sm" aria-pressed={answers[d] === a} variant={answers[d] === a ? 'default' : 'outline'} onClick={() => setAnswers({ ...answers, [d]: a })}>{SOCIAL_ANSWER_LABELS[a]}</Button>
            ))}</div>
          </fieldset>
        ))}
        <div className="space-y-1"><Label htmlFor="sn-notes">Notes (optional)</Label><Textarea id="sn-notes" rows={2} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Referred to food pantry" /></div>
        {pos.length > 0 && <p className="text-sm">Needs found: <b>{pos.map((d) => SOCIAL_QUESTIONS[d].label).join(', ')}</b></p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2"><Button onClick={save} disabled={saving} className={gold}>{saving ? 'Saving…' : 'Save screening'}</Button><Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button></div>
      </CardContent></Card>
  );
}

/* ---------------- Emergency "break the glass" ---------------- */

export function EmergencyAccessCard({ patientId, onGranted }: { patientId: string; onGranted: (until: string) => void }) {
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async () => {
    const problem = validateEmergencyReason(reason);
    if (problem) { setError(problem); return; }
    setSaving(true); setError('');
    try {
      const { data, error: e } = await db.rpc('hc_pilot_break_glass', { _patient: patientId, _reason: reason.trim() });
      if (e) throw new Error(e.message);
      if (!data) throw new Error('Emergency access could not be confirmed.');
      toast.success(`Emergency access open for ${EMERGENCY_ACCESS_MINUTES} minutes`);
      onGranted(String(data));
    } catch (e) { setError(e instanceof Error ? e.message : 'Emergency access could not be opened.'); }
    finally { setSaving(false); }
  };
  return (
    <Card className="border-destructive/50"><CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Siren className="h-4 w-4 text-destructive" />Medical records are limited for your role</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">Front desk and billing staff see patient details, but not medical records. In an emergency you can “break the glass” to open this chart for {EMERGENCY_ACCESS_MINUTES} minutes. Your name, the time and your reason go into the clinic owner’s log.</p>
        <div className="space-y-1"><Label htmlFor="bg-reason">Reason for emergency access *</Label><Input id="bg-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="Patient fainted in the waiting room; need allergy list" /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button variant="destructive" onClick={submit} disabled={saving}>{saving ? 'Opening…' : 'Break the glass'}</Button>
      </CardContent></Card>
  );
}

/* ---------------- Downtime printout ---------------- */

export function PrintChartButton({ patient, records, notes, clinicName, disabled }: { patient: Row; records: Row[]; notes: Row[]; clinicName?: string; disabled?: boolean }) {
  const [printing, setPrinting] = useState(false);
  const rx = useRows('hc_pilot_prescriptions', patient.clinic_id, { order: 'prescribed_on', asc: false, eq: ['patient_id', patient.id] });
  const start = () => {
    setPrinting(true);
    document.body.classList.add('hc-print-chart');
    const done = () => { document.body.classList.remove('hc-print-chart'); setPrinting(false); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.setTimeout(() => window.print(), 600);
  };
  const active = (t: string) => records.filter((r) => r.record_type === t && r.status === 'active');
  const vitals = active('vitals')[0];
  const signed = notes.filter((n) => n.status === 'signed').slice(0, 3);
  return (
    <>
      <Button size="sm" variant="outline" onClick={start} disabled={disabled || printing} title={disabled ? 'Printing real-patient charts turns on after go-live review' : undefined}><Printer className="mr-1 h-4 w-4" />{printing ? 'Preparing…' : 'Print chart summary'}</Button>
      {printing && createPortal(
        <div id="hc-print-root">
          <img src={logo} alt="1325.AI" style={{ height: 40 }} />
          <p className="hc-print-confidential">PRIVATE &amp; CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE</p>
          <h1>Chart summary · {patient.first_name} {patient.last_name}</h1>
          <p>{clinicName ?? '1325 Clinical'} · Printed {format(new Date(), 'MMM d, yyyy h:mm a')} · {patient.is_real ? 'Real patient' : 'Made-up test patient (pilot)'}</p>
          <p>Date of birth: {fmt(patient.date_of_birth)} · Sex: {patient.sex ?? '—'}</p>
          <h2>Allergies</h2><p>{[...(patient.allergies ?? []), ...active('allergy').map((r) => `${r.title}${r.allergy_severity ? ` (${r.allergy_severity})` : ''}`)].join(', ') || 'None recorded'}</p>
          <h2>Conditions</h2><p>{[...(patient.conditions ?? []), ...active('problem').map((r) => r.title)].join(', ') || 'None recorded'}</p>
          <h2>Current prescriptions</h2><ul>{rx.rows.filter((r) => r.status === 'active').map((r) => <li key={r.id}>{r.drug_name}{r.strength ? ` ${r.strength}` : ''} — {r.dose}, {r.route}, {r.frequency}</li>)}{active('medication').map((r) => <li key={r.id}>{r.medication_name}{r.dose ? ` — ${r.dose}` : ''}</li>)}</ul>
          <h2>Latest vital signs</h2><p>{vitals ? `${fmt(vitals.recorded_on)}: BP ${vitals.bp_sys ?? '—'}/${vitals.bp_dia ?? '—'}, HR ${vitals.heart_rate ?? '—'}, Weight ${vitals.weight_lb ?? '—'} lb, Temp ${vitals.temperature_f ?? '—'} °F` : 'None recorded'}</p>
          <h2>Recent lab results</h2><ul>{active('lab_result').slice(0, 8).map((r) => <li key={r.id}>{fmt(r.recorded_on)} · {r.title}: {r.lab_value ?? '—'} {r.lab_unit ?? ''} {r.lab_flag && r.lab_flag !== 'normal' ? `(${r.lab_flag})` : ''}</li>)}</ul>
          <h2>Recent signed visits</h2>{signed.length === 0 ? <p>None</p> : signed.map((n) => <p key={n.id}><b>{fmt(n.visit_date)} · {n.visit_reason}</b><br />Assessment: {n.assessment}<br />Plan: {n.plan}</p>)}
          <p className="hc-print-footer">For use when the system is down. Shred after use. 1325.AI · 1325 Clinical pilot.</p>
        </div>, document.body)}
    </>
  );
}
