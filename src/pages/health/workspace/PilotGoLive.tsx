import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, Lock, ShieldAlert, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { db } from './hc';
import { STATUS_LABELS } from '@/lib/clinical/vendor-baa';
import {
  buildGoLiveStatus, CONSENT_DRAFT_LABEL, CONSENT_DRAFT_SECTIONS, REAL_PATIENT_FIELDS, validateRealPatient, validateUnlock,
  type GoLiveServerStatus, type RealPatientInput, type UnlockInput,
} from '@/lib/clinical/go-live';

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function PilotGoLive({ clinicId, onPatientSaved }: { clinicId: string; onPatientSaved?: (id: string) => void | Promise<void> }) {
  const [server, setServer] = useState<GoLiveServerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);

  const load = useCallback(async () => {
    const n = ++request.current;
    setError(null);
    const { data, error: e } = await db.rpc('hc_go_live_status', { _clinic: clinicId });
    if (n !== request.current) return;
    if (e || !data) { setServer(null); setError('The go-live status could not be loaded. Refresh to try again.'); return; }
    setServer(data as GoLiveServerStatus);
  }, [clinicId]);
  useEffect(() => { void load(); return () => { ++request.current; }; }, [load]);

  const status = server ? buildGoLiveStatus(server.vendors ?? [], server.active_unlock, server.real_patients_allowed) : null;
  const allowed = status?.realPatientsAllowed === true;

  return (
    <div className="space-y-5">
      {allowed ? (
        <div role="note" className="flex gap-3 rounded-lg border border-primary/50 bg-primary/10 p-4 text-sm">
          <Unlock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div><b className="text-foreground">Real patients: unlocked for this clinic.</b>{' '}
            <span className="text-muted-foreground">Unlocked {server?.active_unlock?.unlocked_at ? new Date(server.active_unlock.unlocked_at).toLocaleDateString() : ''} under attorney approval from {server?.active_unlock?.attorney_name}. If any outside company's agreement changes on the tracker, saving stops automatically.</span></div>
        </div>
      ) : (
        <div role="note" className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div><b className="text-foreground">Real patients: locked.</b>{' '}
            <span className="text-muted-foreground">Real patients can be saved only after every step below is done and an administrator records the attorney's written go-live approval. The database enforces this, not just the screen.</span></div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-lg">Go-live checklist</CardTitle>
          {status && <Badge variant="outline">{status.doneCount} of {status.items.length} done</Badge>}
        </CardHeader>
        <CardContent className="space-y-3">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {!status && !error && <p role="status" className="text-sm text-muted-foreground">Loading checklist…</p>}
          {status && (
            <ul className="space-y-3">
              {status.items.map((i) => (
                <li key={i.key} className="flex gap-3">
                  {i.done ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> : <Lock className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
                  <div><p className="font-medium text-foreground">{i.title}</p><p className="text-sm text-muted-foreground">{i.detail}</p></div>
                </li>
              ))}
            </ul>
          )}
          {server && server.vendors.length > 0 && (
            <div className="rounded-md border p-3">
              <p className="mb-2 text-sm font-medium text-foreground">Outside company agreements (live from the Vendor BAA Tracker)</p>
              <div className="flex flex-wrap gap-2">
                {server.vendors.map((v) => (
                  <Badge key={v.vendor_name} variant={v.status === 'signed' && v.attorney_approved ? 'default' : v.status === 'vendor_declined' ? 'destructive' : 'outline'}>
                    {v.vendor_name}: {STATUS_LABELS[v.status]}{v.status === 'signed' && !v.attorney_approved ? ' (attorney not yet)' : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {server && !server.active_unlock && server.can_unlock && (
        <UnlockForm clinicId={clinicId} vendorsCleared={status?.allVendorsCleared === true} blocked={status?.vendorsBlocked ?? []} onDone={load} />
      )}
      {server?.active_unlock && <UnlockRecord server={server} clinicId={clinicId} onDone={load} />}

      <RealPatientForm clinicId={clinicId} allowed={allowed} onSaved={async (id) => { await load(); await onPatientSaved?.(id); }} />

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Patient consent and agreement</CardTitle>
          <Badge variant="outline" className="border-mansagold text-mansagold">{CONSENT_DRAFT_LABEL}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div role="note" className="flex gap-2 rounded-md border border-mansagold/50 bg-mansagold/10 p-3 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
            This is a plain-language starting outline for your healthcare attorney, not a legal document. Patients sign the attorney-approved version; the clinic records the signing date on the form above.
          </div>
          {CONSENT_DRAFT_SECTIONS.map((s) => (
            <div key={s.title}><p className="font-medium text-foreground">{s.title}</p><p className="text-sm text-muted-foreground">{s.body}</p></div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const emptyUnlock: UnlockInput = {
  attorney_name: '', attorney_approved_on: '', approval_letter_ref: '', consent_form_version: '',
  lovable_ruling: '', risk_assessment_ref: '', clinic_agreement_signed_on: '', clinic_agreement_ref: '',
};

function UnlockForm({ clinicId, vendorsCleared, blocked, onDone }: { clinicId: string; vendorsCleared: boolean; blocked: string[]; onDone: () => Promise<void> }) {
  const [f, setF] = useState<UnlockInput>(emptyUnlock);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const pending = useRef(false);
  const set = (k: keyof UnlockInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    if (pending.current) return;
    const problem = validateUnlock(f, vendorsCleared);
    if (problem) { setErr(problem); return; }
    pending.current = true; setSaving(true); setErr('');
    try {
      const { data, error } = await db.rpc('hc_go_live_unlock', {
        _clinic: clinicId, _attorney_name: f.attorney_name, _attorney_approved_on: f.attorney_approved_on,
        _approval_letter_ref: f.approval_letter_ref, _consent_form_version: f.consent_form_version,
        _lovable_ruling: f.lovable_ruling, _risk_assessment_ref: f.risk_assessment_ref,
        _clinic_agreement_signed_on: f.clinic_agreement_signed_on, _clinic_agreement_ref: f.clinic_agreement_ref,
      });
      if (error) throw new Error(error.message);
      if (!data) throw new Error('The unlock could not be confirmed. Refresh to check.');
      toast.success('Real patients unlocked for this clinic.');
      setF(emptyUnlock);
      await onDone();
    } catch (e) { setErr(e instanceof Error ? e.message : 'The unlock could not be saved.'); }
    finally { pending.current = false; setSaving(false); }
  };

  const text = (k: keyof UnlockInput, label: string, placeholder: string) => (
    <div className="space-y-1"><Label htmlFor={`gl-${k}`}>{label} *</Label><Input id={`gl-${k}`} value={f[k]} onChange={set(k)} placeholder={placeholder} maxLength={200} disabled={!vendorsCleared} /></div>
  );
  const date = (k: keyof UnlockInput, label: string) => (
    <div className="space-y-1"><Label htmlFor={`gl-${k}`}>{label} *</Label><Input id={`gl-${k}`} type="date" value={f[k]} onChange={set(k)} max={todayIso()} disabled={!vendorsCleared} /></div>
  );

  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Unlock className="h-5 w-5" />Unlock real patients (administrators only)</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {!vendorsCleared && (
          <p role="note" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-muted-foreground">
            This switch can't be used yet. Still not cleared on the Vendor BAA Tracker: <b className="text-foreground">{blocked.join(', ')}</b>.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {text('attorney_name', 'Attorney full name', 'Douglas Morrison')}
          {date('attorney_approved_on', 'Date of written go-live approval')}
          {text('approval_letter_ref', 'Go-live letter reference', 'e.g. Letter dated Nov 20, 2026, filed in legal folder')}
          {text('consent_form_version', 'Approved consent form version', 'e.g. Patient Consent v1.0')}
          {text('risk_assessment_ref', 'Security risk assessment reference', 'e.g. Risk assessment report, Dec 2026')}
          {date('clinic_agreement_signed_on', 'Clinic agreement signed on')}
          {text('clinic_agreement_ref', 'Clinic agreement reference', 'e.g. Clinic BAA signed copy')}
        </div>
        <div className="space-y-1">
          <Label htmlFor="gl-lovable_ruling">Attorney's written ruling on Lovable *</Label>
          <Textarea id="gl-lovable_ruling" value={f.lovable_ruling} onChange={set('lovable_ruling')} maxLength={1000} disabled={!vendorsCleared}
            placeholder="Copy the attorney's exact wording on how real patient data is kept away from Lovable." />
        </div>
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={!vendorsCleared || saving} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Unlock className="mr-1 h-4 w-4" />{saving ? 'Unlocking…' : 'Unlock real patients'}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlock real patients for this clinic?</AlertDialogTitle>
              <AlertDialogDescription>Only continue if you hold the attorney's signed go-live letter and every detail above is true. This is recorded with your name in the activity log.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void submit()}>Unlock</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

function UnlockRecord({ server, clinicId, onDone }: { server: GoLiveServerStatus; clinicId: string; onDone: () => Promise<void> }) {
  const u = server.active_unlock!;
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = async () => {
    if (busy) return;
    if (reason.trim().length < 3) { toast.error('Give a reason (at least 3 characters).'); return; }
    setBusy(true);
    try {
      const { data, error } = await db.rpc('hc_go_live_lock', { _clinic: clinicId, _reason: reason });
      if (error) throw new Error(error.message);
      if (data !== true) throw new Error('The lock could not be confirmed. Refresh to check.');
      toast.success('Real patients locked again.');
      setReason('');
      await onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not lock.'); }
    finally { setBusy(false); }
  };
  const rows: [string, string][] = [
    ['Attorney', `${u.attorney_name} · approved ${u.attorney_approved_on}`],
    ['Go-live letter', u.approval_letter_ref],
    ['Consent form', u.consent_form_version],
    ['Lovable ruling', u.lovable_ruling],
    ['Risk assessment', u.risk_assessment_ref],
    ['Clinic agreement', `${u.clinic_agreement_ref} · signed ${u.clinic_agreement_signed_on}`],
    ['Unlocked by', u.unlocked_by_email ?? 'Administrator'],
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Go-live approval on record</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <dl className="grid gap-2 text-sm sm:grid-cols-[180px_1fr]">
          {rows.map(([k, v]) => (<><dt key={`${k}-t`} className="text-muted-foreground">{k}</dt><dd key={`${k}-d`} className="text-foreground">{v}</dd></>))}
        </dl>
        {server.can_lock && (
          <div className="flex flex-wrap items-end gap-2 border-t pt-3">
            <div className="min-w-[240px] flex-1 space-y-1"><Label htmlFor="gl-lock-reason">Reason for locking</Label><Input id="gl-lock-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} /></div>
            <Button variant="destructive" onClick={() => void lock()} disabled={busy}><Lock className="mr-1 h-4 w-4" />{busy ? 'Locking…' : 'Lock again now'}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const emptyPatient: RealPatientInput = {
  first_name: '', last_name: '', date_of_birth: '', phone: '', consent_signed_on: '',
  insurance_company: '', insurance_plan: '', insurance_member_id: '', insurance_group: '', policy_holder: '',
};

function RealPatientForm({ clinicId, allowed, onSaved }: { clinicId: string; allowed: boolean; onSaved: (id: string) => Promise<void> }) {
  const [f, setF] = useState<RealPatientInput>(emptyPatient);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const pending = useRef(false);
  const blank = (v?: string | null) => (v && v.trim() ? v.trim() : null);

  const save = async () => {
    if (pending.current) return;
    const problem = validateRealPatient(f, allowed);
    if (problem) { setErr(problem); return; }
    pending.current = true; setSaving(true); setErr('');
    try {
      const { data, error } = await db.from('hc_pilot_patients').insert({
        clinic_id: clinicId, is_real: true, test_patient_confirmed: false,
        first_name: f.first_name.trim(), last_name: f.last_name.trim(), date_of_birth: f.date_of_birth,
        phone: blank(f.phone), consent_signed_on: f.consent_signed_on,
        insurance_company: blank(f.insurance_company), insurance_plan: blank(f.insurance_plan),
        insurance_member_id: blank(f.insurance_member_id), insurance_group: blank(f.insurance_group), policy_holder: blank(f.policy_holder),
      }).select('id').single();
      if (error) throw new Error(error.message);
      if (!data?.id) throw new Error('The patient could not be confirmed as saved. Refresh before trying again.');
      toast.success('Real patient saved.');
      setF(emptyPatient);
      await onSaved(data.id);
    } catch (e) { setErr(e instanceof Error ? e.message : 'The patient could not be saved.'); }
    finally { pending.current = false; setSaving(false); }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-lg">Real-patient setup form</CardTitle>
        {allowed ? <Badge><Unlock className="mr-1 h-3 w-3" />Unlocked</Badge> : <Badge variant="destructive"><Lock className="mr-1 h-3 w-3" />Locked</Badge>}
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); void save(); }} aria-label="Real-patient setup form">
          <fieldset disabled={!allowed || saving} className={`space-y-5 ${allowed ? '' : 'opacity-70'}`}>
            {REAL_PATIENT_FIELDS.map((s) => (
              <div key={s.section}>
                <p className="mb-2 text-sm font-semibold text-foreground">{s.section}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {s.fields.map((fld) => (
                    <div key={fld.key} className="space-y-1">
                      <Label htmlFor={`rp-${fld.key}`}>{fld.label}{fld.required ? ' *' : ''}</Label>
                      <Input id={`rp-${fld.key}`} type={fld.type ?? 'text'} maxLength={fld.max} max={fld.type === 'date' ? todayIso() : undefined}
                        placeholder={allowed ? '' : 'Locked until go-live'} value={(f[fld.key] as string) ?? ''}
                        onChange={(e) => setF({ ...f, [fld.key]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <Button type="submit">{allowed ? (saving ? 'Saving…' : 'Save real patient') : <><Lock className="mr-1 h-4 w-4" />Save real patient (locked)</>}</Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
