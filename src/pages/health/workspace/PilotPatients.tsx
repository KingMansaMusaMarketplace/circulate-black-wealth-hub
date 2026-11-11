import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { AlertTriangle, ArrowLeft, CalendarDays, Eye, FlaskConical, History, Inbox, LayoutDashboard, Lock, Plus, Receipt, Rocket, ShieldCheck, RotateCcw, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { db, Row, useRows } from './hc';
import DataLoadErrors from './DataLoadErrors';
import {
  AUDIT_LABELS, RECORD_TYPE_LABELS, RECORD_TYPES, SAMPLE_BADGE_LABEL, SAMPLE_PATIENT_COUNT, SEX_OPTIONS, shouldLoadSamples, splitList,
  validateErrorReason, validatePilotPatient, validatePilotRecord, type PilotRecordType,
} from '@/lib/clinical/pilot-records';
import { vitalsSeries } from '@/lib/clinical/pilot-visit-notes';
import {
  ALLERGY_SEVERITIES, ALLERGY_SEVERITY_LABELS, LAB_FLAGS, LAB_FLAG_LABELS, REAL_PATIENT_IDLE_LOCK_MINUTES,
  chartWritable, isFlaggedLab, latestLabs, validateStopMedicine, type AllergySeverity, type LabFlag,
} from '@/lib/clinical/real-patient-chart';
import { PilotPrivacyShell, usePilotPrivacy, useRealPatientTimer } from './PilotPrivacy';
import PilotDashboard from './PilotDashboard';
import PilotChartLog from './PilotChartLog';
import PilotVisitNotes from './PilotVisitNotes';
import PilotGoLive from './PilotGoLive';
import { EmergencyAccessCard, KidneyFunctionCard, LabOrdersPanel, PrescriptionsPanel, PrintChartButton, SocialNeedsPanel } from './PilotOrders';
import { pilotPermissions, roleLabel } from '@/lib/clinical/pilot-roles';
import PilotSchedule, { UpcomingAppointments } from './PilotSchedule';
import PilotBilling from './PilotBilling';
import PilotBoost from './PilotBoost';
import { PortalInbox, PortalTeamPanel } from './PilotPortal';

export type PilotView = 'dashboard' | 'patients' | 'schedule' | 'inbox' | 'billing' | 'boost' | 'chartlog' | 'activity' | 'golive';
type View = PilotView;
type Props = { clinicId: string; isOwner?: boolean; userId?: string | null; role?: string | null; clinicName?: string; initialView?: PilotView };

const TestOnlyNotice = () => (
  <div role="note" className="flex gap-3 rounded-lg border border-mansagold/50 bg-mansagold/10 p-4 text-sm">
    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-mansagold" />
    <div><b className="text-foreground">Pilot · made-up test patients only.</b> <span className="text-muted-foreground">Entries are really saved so your team can test the whole system. These screens use HIPAA-style safeguards, but the system is not HIPAA-compliant yet. Do not enter real people, real names, birthdays, phone numbers or Social Security numbers until the HIPAA agreements are signed and your attorney approves go-live.</span></div>
  </div>
);

const RealPatientNotice = ({ allowed }: { allowed: boolean | null }) => (
  allowed === true ? (
    <div role="note" className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div><b className="text-foreground">Real patient · protected health information.</b> <span className="text-muted-foreground">Go-live is unlocked for this clinic. Open this chart only for this patient’s care. The screen hides itself after {REAL_PATIENT_IDLE_LOCK_MINUTES} idle minutes, signing a note asks for your password, and nothing here can be deleted.</span></div>
    </div>
  ) : (
    <div role="note" className="flex gap-3 rounded-lg border border-mansagold/50 bg-mansagold/10 p-4 text-sm">
      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-mansagold" />
      <div><b className="text-foreground">{allowed === null ? 'Checking go-live status…' : 'Real patients are locked — read only.'}</b> <span className="text-muted-foreground">{allowed === null ? 'Adding entries is paused until the check finishes.' : 'You can read this chart, but nothing can be added, stopped or signed until an administrator unlocks go-live again.'}</span></div>
    </div>
  )
);

const flagVariant = (flag?: string | null) => (flag === 'critical' || flag === 'high' || flag === 'low' || flag === 'abnormal' ? 'destructive' : 'outline') as 'destructive' | 'outline';
const severityVariant = (s?: string | null) => (s === 'severe' ? 'destructive' : s === 'moderate' ? 'default' : 'outline') as 'destructive' | 'default' | 'outline';

const num = (v: string) => (v.trim() === '' ? null : Number(v));
const todayIso = () => format(new Date(), 'yyyy-MM-dd');

export default function PilotPatients(props: Props) {
  return <PilotPrivacyShell><PilotPatientsInner {...props} /></PilotPrivacyShell>;
}

function PilotPatientsInner({ clinicId, isOwner, userId = null, role = null, clinicName, initialView }: Props) {
  const myRole = role ?? (isOwner ? 'owner' : null);
  const perms = pilotPermissions(myRole);
  const patients = useRows('hc_pilot_patients', clinicId, { order: 'last_name', asc: true });
  // Only clinic owners may read the activity log (database rule); members never request it.
  const audit = useRows('hc_pilot_audit', isOwner ? clinicId : null, { order: 'created_at', asc: false });
  const { name } = usePilotPrivacy();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState<View>(initialView ?? 'dashboard');
  const [openTab, setOpenTab] = useState<string | undefined>(undefined);
  const openPatient = (id: string, tab?: string) => { setOpenTab(tab); setOpenId(id); };
  const [q, setQ] = useState('');
  const active = patients.rows.filter((p) => !p.archived_at);
  const list = active.filter((p) => `${p.first_name} ${p.last_name}`.toLowerCase().includes(q.toLowerCase()));
  const selected = patients.rows.find((p) => p.id === openId);
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const seedTried = useRef(false);
  useEffect(() => {
    if (!shouldLoadSamples({ loading: patients.loading, error: patients.error, totalPatients: patients.rows.length, alreadyTried: seedTried.current })) return;
    seedTried.current = true;
    setSeeding(true);
    void (async () => {
      const { error } = await db.rpc('hc_pilot_seed_samples', { _clinic: clinicId });
      if (error) toast.error('Sample patients could not be loaded. You can still add your own test patients.');
      await patients.reload();
      if (isOwner) await audit.reload();
      setSeeding(false);
    })();
  }, [patients.loading, patients.error, patients.rows.length, clinicId, isOwner, patients, audit]);

  const resetPilot = async () => {
    if (resetting) return;
    setResetting(true);
    try {
      const { data, error } = await db.rpc('hc_pilot_reset', { _clinic: clinicId });
      if (error) throw new Error(error.message);
      if (data !== SAMPLE_PATIENT_COUNT) throw new Error('The reset could not be confirmed. Refresh to check.');
      setOpenId(null); setView('dashboard');
      await patients.reload(); if (isOwner) await audit.reload();
      toast.success(`Pilot reset. ${SAMPLE_PATIENT_COUNT} fresh sample patients are loaded.`);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'The pilot could not be reset.'); }
    finally { setResetting(false); }
  };

  if (selected) {
    return <PilotChart clinicId={clinicId} patient={selected} userId={userId} role={myRole} clinicName={clinicName} initialTab={openTab}
      back={() => { setOpenId(null); setOpenTab(undefined); void patients.reload(); if (isOwner) void audit.reload(); }} />;
  }

  const nav: { k: View; l: string; i: typeof Users; owner?: boolean; show?: boolean }[] = [
    { k: 'dashboard', l: 'Dashboard', i: LayoutDashboard },
    { k: 'patients', l: 'Test patients', i: Users },
    { k: 'schedule', l: 'Schedule', i: CalendarDays },
    { k: 'inbox', l: 'Portal inbox', i: Inbox, show: perms.portalTeam },
    { k: 'billing', l: 'Practice billing', i: Receipt, show: perms.workClaims },
    { k: 'boost', l: 'BOOST (connect an EHR)', i: Rocket, show: perms.useBoost },
    { k: 'chartlog', l: 'Chart-opened log', i: Eye, owner: true },
    { k: 'activity', l: 'Full activity log', i: History, owner: true },
    { k: 'golive', l: 'Go-live setup', i: Lock },
  ];

  return (
    <div className="space-y-5">
      <TestOnlyNotice />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pilot Patients sections">
        {nav.filter((n) => (!n.owner || isOwner) && n.show !== false).map((n) => (
          <Button key={n.k} role="tab" aria-selected={view === n.k} size="sm" variant={view === n.k ? 'default' : 'outline'} onClick={() => { setView(n.k); if (n.k !== 'patients' && isOwner) void audit.reload(); }}>
            <n.i className="mr-1 h-4 w-4" />{n.l}
          </Button>
        ))}
        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="ml-auto" disabled={resetting || seeding || patients.rows.some((p) => p.is_real)} title={patients.rows.some((p) => p.is_real) ? 'Reset is off once a clinic has real patients' : undefined}><RotateCcw className="mr-1 h-4 w-4" />{resetting ? 'Resetting…' : 'Reset my pilot'}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset your pilot?</AlertDialogTitle>
                <AlertDialogDescription>This erases every test patient, record, visit note and activity entry in this clinic, then loads {SAMPLE_PATIENT_COUNT} fresh sample patients. Use it to start each demo clean. It can't be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => void resetPilot()}>Reset pilot</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {seeding && <p role="status" className="text-sm text-muted-foreground">Loading {SAMPLE_PATIENT_COUNT} made-up sample patients…</p>}
      {view === 'dashboard' && (
        <PilotDashboard clinicId={clinicId} isOwner={isOwner} patients={patients.rows} audit={isOwner ? audit.rows : null}
          onOpenPatient={(id, tab) => openPatient(id, tab)} onOpenLog={() => setView('chartlog')} />
      )}
      {view === 'chartlog' && isOwner && <><DataLoadErrors sources={[audit]} /><PilotChartLog audit={audit.rows} patients={patients.rows} loading={audit.loading} /></>}
      {view === 'activity' && isOwner && <ActivityLog audit={audit} patients={patients.rows} />}
      {view === 'schedule' && <PilotSchedule clinicId={clinicId} patients={patients.rows} perms={perms} onOpenPatient={(id) => openPatient(id)} />}
      {view === 'inbox' && <PortalInbox clinicId={clinicId} patients={patients.rows} perms={perms} onOpenPatient={(id) => openPatient(id, 'portal')} />}
      {view === 'billing' && <PilotBilling clinicId={clinicId} patients={patients.rows} perms={perms} />}
      {view === 'boost' && perms.useBoost && <PilotBoost />}
      {view === 'golive' && <PilotGoLive clinicId={clinicId} onPatientSaved={async (id) => { await patients.reload(); setOpenId(id); }} />}
      {view === 'patients' && (
        <>
          {adding && <AddPatientForm clinicId={clinicId} onCancel={() => setAdding(false)} onSaved={async (id) => { setAdding(false); await patients.reload(); setOpenId(id); }} />}
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
              <Input placeholder="Search test patients" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" aria-label="Search test patients" />
              <span className="text-xs text-muted-foreground">Your role: <b className="text-foreground">{roleLabel(myRole)}</b></span>
              {!adding && perms.addPatients && <Button onClick={() => setAdding(true)} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Plus className="mr-1 h-4 w-4" />Add test patient</Button>}
            </CardHeader>
            <CardContent>
              <DataLoadErrors sources={[patients]} />
              {patients.loading ? <p role="status" className="text-sm text-muted-foreground">Loading test patients…</p>
                : !patients.error && list.length === 0 ? <p className="text-sm text-muted-foreground">{active.length === 0 ? 'No test patients yet. Add your first made-up patient to start the pilot.' : 'No test patients match your search.'}</p>
                : list.length > 0 && (
                  <Table>
                    <TableHeader><TableRow><TableHead>Test patient</TableHead><TableHead>Date of birth</TableHead><TableHead>Allergies</TableHead><TableHead>Conditions</TableHead></TableRow></TableHeader>
                    <TableBody>{list.map((p) => (
                      <TableRow key={p.id} className="cursor-pointer" onClick={() => setOpenId(p.id)}>
                        <TableCell className="font-medium">{name(p)}{p.is_real
                          ? <Badge variant="destructive" className="ml-2"><ShieldCheck className="mr-1 h-3 w-3" />Real patient</Badge>
                          : <Badge variant="outline" className="ml-2"><FlaskConical className="mr-1 h-3 w-3" />{p.is_sample ? SAMPLE_BADGE_LABEL : 'Test'}</Badge>}</TableCell>
                        <TableCell>{p.date_of_birth ? format(parseISO(p.date_of_birth), 'MMM d, yyyy') : '—'}</TableCell>
                        <TableCell>{p.allergies?.length ? p.allergies.join(', ') : 'None recorded'}</TableCell>
                        <TableCell>{p.conditions?.length ? p.conditions.join(', ') : 'None recorded'}</TableCell>
                      </TableRow>
                    ))}</TableBody>
                  </Table>
                )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function AddPatientForm({ clinicId, onCancel, onSaved }: { clinicId: string; onCancel: () => void; onSaved: (id: string) => void | Promise<void> }) {
  const [f, setF] = useState({ first_name: '', last_name: '', date_of_birth: '', sex: '', phone: '', allergies: '', conditions: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    if (pending.current) return;
    const input = {
      first_name: f.first_name, last_name: f.last_name, date_of_birth: f.date_of_birth || null, sex: f.sex || null,
      phone: f.phone.trim() || null, allergies: splitList(f.allergies), conditions: splitList(f.conditions), test_patient_confirmed: confirmed,
    };
    const problem = validatePilotPatient(input);
    if (problem) { setError(problem); return; }
    pending.current = true; setSaving(true); setError('');
    try {
      const { data, error: e } = await db.from('hc_pilot_patients').insert({ ...input, clinic_id: clinicId, first_name: input.first_name.trim(), last_name: input.last_name.trim() }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The patient could not be confirmed as saved. Refresh before trying again.');
      toast.success('Test patient saved');
      await onSaved(data.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Test patient could not be saved.'); }
    finally { pending.current = false; setSaving(false); }
  };

  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="text-base">Add a made-up test patient</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1"><Label htmlFor="pp-first">First name *</Label><Input id="pp-first" value={f.first_name} onChange={set('first_name')} maxLength={80} /></div>
          <div className="space-y-1"><Label htmlFor="pp-last">Last name *</Label><Input id="pp-last" value={f.last_name} onChange={set('last_name')} maxLength={80} /></div>
          <div className="space-y-1"><Label htmlFor="pp-dob">Date of birth</Label><Input id="pp-dob" type="date" value={f.date_of_birth} onChange={set('date_of_birth')} max={todayIso()} /></div>
          <div className="space-y-1"><Label>Sex</Label>
            <Select value={f.sex} onValueChange={(v) => setF({ ...f, sex: v })}><SelectTrigger aria-label="Sex"><SelectValue placeholder="Choose" /></SelectTrigger>
              <SelectContent>{SEX_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="pp-phone">Phone (made-up)</Label><Input id="pp-phone" value={f.phone} onChange={set('phone')} maxLength={30} placeholder="555-0100" /></div>
          <div className="space-y-1"><Label htmlFor="pp-all">Allergies (comma-separated)</Label><Input id="pp-all" value={f.allergies} onChange={set('allergies')} placeholder="Penicillin, Peanuts" /></div>
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="pp-cond">Conditions (comma-separated)</Label><Input id="pp-cond" value={f.conditions} onChange={set('conditions')} placeholder="High blood pressure, Type 2 diabetes" /></div>
        </div>
        <div className="flex items-start gap-2 rounded-md border p-3">
          <Checkbox id="pp-confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
          <Label htmlFor="pp-confirm" className="text-sm leading-snug">I confirm this is a <b>made-up test patient</b>, not a real person, and contains no real health information.</Label>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving || !confirmed} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">{saving ? 'Saving…' : 'Save test patient'}</Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const vitalsConfig = {
  systolic: { label: 'BP top', color: 'hsl(var(--destructive))' },
  diastolic: { label: 'BP bottom', color: 'hsl(var(--mansagold))' },
  heartRate: { label: 'Heart rate', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;
const weightConfig = { weight: { label: 'Weight (lb)', color: 'hsl(var(--mansagold))' } } satisfies ChartConfig;

function PilotChart({ clinicId, patient, back, userId, role, clinicName, initialTab }: { clinicId: string; patient: Row; back: () => void; userId: string | null; role: string | null; clinicName?: string; initialTab?: string }) {
  const records = useRows('hc_pilot_records', clinicId, { order: 'recorded_on', asc: false, eq: ['patient_id', patient.id] });
  const notes = useRows('hc_pilot_visit_notes', clinicId, { order: 'visit_date', asc: false, eq: ['patient_id', patient.id] });
  // Emergency "break the glass" access for front desk / billing (database-enforced, 30 minutes).
  const [emergencyUntil, setEmergencyUntil] = useState<string | null>(null);
  const basePerms = pilotPermissions(role);
  useEffect(() => {
    if (!basePerms.needsEmergencyAccess || !userId) return;
    let live = true;
    void (async () => {
      const { data } = await db.from('hc_pilot_glass_breaks').select('expires_at').eq('patient_id', patient.id).eq('user_id', userId)
        .gt('expires_at', new Date().toISOString()).order('expires_at', { ascending: false }).limit(1).maybeSingle();
      if (live && data?.expires_at) setEmergencyUntil(String(data.expires_at));
    })();
    return () => { live = false; };
  }, [basePerms.needsEmergencyAccess, patient.id, userId]);
  useEffect(() => {
    if (!emergencyUntil) return;
    const ms = new Date(emergencyUntil).getTime() - Date.now();
    const t = window.setTimeout(() => { setEmergencyUntil(null); void records.reload(); void notes.reload(); }, Math.max(ms, 0));
    return () => window.clearTimeout(t);
  }, [emergencyUntil]); // eslint-disable-line react-hooks/exhaustive-deps
  const perms = pilotPermissions(role, !!emergencyUntil);
  const { name } = usePilotPrivacy();
  const real = patient.is_real === true;
  useRealPatientTimer(real);
  const [realAllowed, setRealAllowed] = useState<boolean | null>(real ? null : true);
  const statusRequest = useRef(0);
  const checkGoLive = React.useCallback(async () => {
    if (!real) { setRealAllowed(true); return; }
    const n = ++statusRequest.current;
    const { data, error } = await db.rpc('hc_go_live_status', { _clinic: clinicId });
    if (n !== statusRequest.current) return;
    setRealAllowed(!error && data?.real_patients_allowed === true ? true : false);
  }, [real, clinicId]);
  useEffect(() => {
    void checkGoLive();
    if (!real) return;
    // Recheck regularly so a lock made elsewhere turns this chart read-only without a refresh.
    const t = window.setInterval(() => void checkGoLive(), 60_000);
    return () => { window.clearInterval(t); ++statusRequest.current; };
  }, [checkGoLive, real]);
  const writable = chartWritable(real, realAllowed);
  const [adding, setAdding] = useState<string | null>(null);
  const [tab, setTab] = useState(initialTab ?? 'summary');
  const logged = useRef<string | null>(null);
  useEffect(() => {
    if (logged.current === patient.id) return;
    logged.current = patient.id;
    void db.rpc('hc_pilot_log_chart_view', { _patient: patient.id });
  }, [patient.id]);
  useEffect(() => { if (!writable) setAdding(null); }, [writable]);

  const byType = (t: PilotRecordType) => records.rows.filter((r) => r.record_type === t && r.status === 'active');
  const latestVitals = byType('vitals')[0];
  const vitals = useMemo(() => vitalsSeries(records.rows).map((v) => ({ ...v, label: format(parseISO(v.date), 'M/d') })), [records.rows]);
  const labs = useMemo(() => latestLabs(records.rows), [records.rows]);
  const allergyRecords = byType('allergy');
  const signedNotes = notes.rows.filter((n) => n.status === 'signed');
  const onWriteFailed = () => void checkGoLive();
  const canAdd = writable && perms.addRecords;
  const addRecord = (t: PilotRecordType, label = `Add ${RECORD_TYPE_LABELS[t].toLowerCase()}`, key: string = t) => (!canAdd ? null : adding === key
    ? <AddRecordForm clinicId={clinicId} patientId={patient.id} real={real} initialType={t} onCancel={() => setAdding(null)} onFailed={onWriteFailed} onSaved={async () => { setAdding(null); await records.reload(); }} />
    : <Button onClick={() => setAdding(key)} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Plus className="mr-1 h-4 w-4" />{label}</Button>);
  const recordList = (rows: Row[], empty: string) => (
    <div className="space-y-3">
      {records.loading ? <p role="status" className="text-sm text-muted-foreground">Loading…</p>
        : rows.length === 0 ? <p className="text-sm text-muted-foreground">{empty}</p>
        : rows.map((r) => <RecordItem key={r.id} record={r} writable={canAdd} onFailed={onWriteFailed} onChanged={() => records.reload()} />)}
    </div>
  );

  return (
    <div className="space-y-5">
      <Button variant="link" className="px-0" onClick={back}><ArrowLeft className="mr-1 h-4 w-4" />Back to Pilot Patients</Button>
      {real ? <RealPatientNotice allowed={realAllowed} /> : <TestOnlyNotice />}
      <Card className={real ? 'border-destructive/40' : undefined}>
        <CardHeader className="pb-3"><CardTitle className="flex flex-wrap items-center gap-2 text-xl">{name(patient)}{real
          ? <Badge variant="destructive"><ShieldCheck className="mr-1 h-3 w-3" />Real patient</Badge>
          : <Badge variant="outline"><FlaskConical className="mr-1 h-3 w-3" />{patient.is_sample ? SAMPLE_BADGE_LABEL : 'Test patient'}</Badge>}</CardTitle>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">Opening this chart was recorded in the clinic’s chart-opened log{real ? ' under real patients' : ''}. Your role: {roleLabel(role)}{emergencyUntil ? ` · emergency access until ${format(new Date(emergencyUntil), 'h:mm a')}` : ''}.</p>
            {perms.readChart && <PrintChartButton patient={patient} records={records.rows} notes={notes.rows} clinicName={clinicName} disabled={real} />}
          </div></CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-4">
          <div><div className="text-xs uppercase text-muted-foreground">Date of birth</div>{patient.date_of_birth ? format(parseISO(patient.date_of_birth), 'MMM d, yyyy') : '—'}</div>
          <div><div className="text-xs uppercase text-muted-foreground">Sex</div><span className="capitalize">{patient.sex ?? '—'}</span></div>
          <div><div className="text-xs uppercase text-muted-foreground">Allergies</div>{allergyRecords.length
            ? allergyRecords.map((r) => `${r.title}${r.allergy_severity ? ` (${ALLERGY_SEVERITY_LABELS[r.allergy_severity as AllergySeverity] ?? r.allergy_severity})` : ''}`).join(', ')
            : patient.allergies?.length ? patient.allergies.join(', ') : 'None recorded'}</div>
          <div><div className="text-xs uppercase text-muted-foreground">Latest vitals</div>{latestVitals ? `${latestVitals.bp_sys ?? '—'}/${latestVitals.bp_dia ?? '—'} · HR ${latestVitals.heart_rate ?? '—'}` : 'None recorded'}</div>
          {real && <>
            <div><div className="text-xs uppercase text-muted-foreground">Insurance</div>{patient.insurance_company ? `${patient.insurance_company}${patient.insurance_plan ? ` · ${patient.insurance_plan}` : ''}` : '—'}</div>
            <div><div className="text-xs uppercase text-muted-foreground">Member ID</div>{patient.insurance_member_id ?? '—'}</div>
            <div><div className="text-xs uppercase text-muted-foreground">Consent signed</div>{patient.consent_signed_on ? format(parseISO(patient.consent_signed_on), 'MMM d, yyyy') : '—'}</div>
            <div><div className="text-xs uppercase text-muted-foreground">Chart status</div>{writable ? 'Open for entries' : 'Read only'}</div>
          </>}
        </CardContent>
      </Card>
      {!perms.readChart && (
        <>
          <EmergencyAccessCard patientId={patient.id} onGranted={(until) => { setEmergencyUntil(until); void records.reload(); void notes.reload(); }} />
          <SocialNeedsPanel clinicId={clinicId} patient={patient} perms={perms} writable={writable} onFailed={onWriteFailed} canRead={false} />
          {perms.portalTeam && <PortalTeamPanel clinicId={clinicId} patient={patient} perms={perms} />}
        </>
      )}
      {perms.readChart && <>
      <DataLoadErrors sources={[records, notes]} />
      <Tabs value={tab} onValueChange={(v) => { setTab(v); setAdding(null); }}>
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="notes">Visit notes</TabsTrigger>
          <TabsTrigger value="rx">Prescriptions</TabsTrigger>
          <TabsTrigger value="orders">Lab orders</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="meds">Medicines</TabsTrigger>
          <TabsTrigger value="problems">Allergies & problems</TabsTrigger>
          <TabsTrigger value="labs">Lab results</TabsTrigger>
          <TabsTrigger value="social">Social needs</TabsTrigger>
          {perms.portalTeam && <TabsTrigger value="portal">Patient portal</TabsTrigger>}
          <TabsTrigger value="all">All records</TabsTrigger>
        </TabsList>

        <TabsContent value="rx"><PrescriptionsPanel clinicId={clinicId} patient={patient} perms={perms} writable={writable} onFailed={onWriteFailed} records={records.rows} /></TabsContent>
        <TabsContent value="orders"><LabOrdersPanel clinicId={clinicId} patient={patient} perms={perms} writable={writable} onFailed={onWriteFailed} real={real} onResulted={() => records.reload()} /></TabsContent>
        <TabsContent value="portal"><PortalTeamPanel clinicId={clinicId} patient={patient} perms={perms} /></TabsContent>
        <TabsContent value="social"><SocialNeedsPanel clinicId={clinicId} patient={patient} perms={perms} writable={writable} onFailed={onWriteFailed} canRead /></TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Conditions</CardTitle></CardHeader>
              <CardContent className="text-sm">{patient.conditions?.length ? patient.conditions.join(', ') : 'None recorded'}
                {byType('problem').length > 0 && <ul className="mt-2 list-disc pl-5">{byType('problem').map((r) => <li key={r.id}>{r.title}</li>)}</ul>}</CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Current medicines</CardTitle></CardHeader>
              <CardContent className="text-sm">{byType('medication').length ? <ul className="list-disc pl-5">{byType('medication').map((r) => <li key={r.id}>{r.medication_name}{r.dose ? ` · ${r.dose}` : ''}{r.med_frequency ? ` · ${r.med_frequency}` : ''}</li>)}</ul> : 'None recorded'}</CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Allergies</CardTitle></CardHeader>
              <CardContent className="text-sm">{allergyRecords.length ? <ul className="space-y-1">{allergyRecords.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2"><span>{r.title}</span>{r.allergy_severity && <Badge variant={severityVariant(r.allergy_severity)}>{ALLERGY_SEVERITY_LABELS[r.allergy_severity as AllergySeverity] ?? r.allergy_severity}</Badge>}{r.allergy_reaction && <span className="text-muted-foreground">· {r.allergy_reaction}</span>}</li>
              ))}</ul> : patient.allergies?.length ? patient.allergies.join(', ') : 'None recorded'}</CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Upcoming appointments</CardTitle></CardHeader>
              <CardContent><UpcomingAppointments clinicId={clinicId} patientId={patient.id} /></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-base">Latest lab results</CardTitle></CardHeader>
              <CardContent className="text-sm">{labs.length ? <ul className="space-y-1">{labs.slice(0, 6).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2"><span>{r.title}</span>{r.lab_value && <b>{r.lab_value}{r.lab_unit ? ` ${r.lab_unit}` : ''}</b>}{r.lab_flag && <Badge variant={flagVariant(r.lab_flag)}>{LAB_FLAG_LABELS[r.lab_flag as LabFlag] ?? r.lab_flag}</Badge>}<span className="text-xs text-muted-foreground">{format(parseISO(r.recorded_on), 'MMM d, yyyy')}</span></li>
              ))}</ul> : 'None recorded'}</CardContent></Card>
          </div>
          <Card><CardHeader className="pb-2"><CardTitle className="text-base">Latest signed visit</CardTitle></CardHeader>
            <CardContent className="text-sm">{signedNotes[0] ? (
              <div className="space-y-1">
                <p><b>{signedNotes[0].visit_reason}</b> · {format(parseISO(signedNotes[0].visit_date), 'MMM d, yyyy')}</p>
                <p><span className="text-muted-foreground">Assessment:</span> {signedNotes[0].assessment}</p>
                <p><span className="text-muted-foreground">Plan:</span> {signedNotes[0].plan}</p>
                <Button size="sm" variant="link" className="px-0" onClick={() => setTab('notes')}>Open visit notes</Button>
              </div>) : <>No signed visit notes yet. {writable && <Button size="sm" variant="link" className="px-1" onClick={() => setTab('notes')}>Write one</Button>}</>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="notes"><PilotVisitNotes clinicId={clinicId} patientId={patient.id} userId={userId} real={real} writable={writable && perms.draftNotes} canSign={perms.signNotes} onFailed={onWriteFailed} onChanged={() => void notes.reload()} /></TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          {vitals.length >= 2 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card><CardHeader className="pb-2"><CardTitle className="text-base">Blood pressure & heart rate</CardTitle></CardHeader><CardContent>
                <ChartContainer config={vitalsConfig} className="aspect-auto h-56 w-full">
                  <LineChart data={vitals} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="systolic" stroke="var(--color-systolic)" strokeWidth={2} connectNulls />
                    <Line dataKey="diastolic" stroke="var(--color-diastolic)" strokeWidth={2} connectNulls />
                    <Line dataKey="heartRate" stroke="var(--color-heartRate)" strokeWidth={2} strokeDasharray="4 3" connectNulls />
                  </LineChart>
                </ChartContainer></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-base">Weight</CardTitle></CardHeader><CardContent>
                <ChartContainer config={weightConfig} className="aspect-auto h-56 w-full">
                  <LineChart data={vitals} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} connectNulls />
                  </LineChart>
                </ChartContainer></CardContent></Card>
            </div>
          ) : <p className="text-sm text-muted-foreground">Trend graphs appear after two or more vital-sign entries.</p>}
          {addRecord('vitals')}
          {recordList(records.rows.filter((r) => r.record_type === 'vitals'), 'No vital signs yet.')}
        </TabsContent>

        <TabsContent value="meds" className="space-y-4">{addRecord('medication')}{recordList(records.rows.filter((r) => r.record_type === 'medication'), 'No medicines recorded.')}</TabsContent>
        <TabsContent value="problems" className="space-y-4">
          <div className="flex flex-wrap gap-2">{addRecord('allergy')}{adding !== 'allergy' && addRecord('problem')}</div>
          {real && <p className="text-xs text-muted-foreground">Real-patient allergies need a severity. Choose “Unknown” if the patient isn’t sure.</p>}
          {recordList(records.rows.filter((r) => r.record_type === 'allergy' || r.record_type === 'problem'), 'No allergies or problems recorded.')}
        </TabsContent>
        <TabsContent value="labs" className="space-y-4"><KidneyFunctionCard patient={patient} records={records.rows} />{addRecord('lab_result')}{recordList(records.rows.filter((r) => r.record_type === 'lab_result'), 'No lab results recorded.')}</TabsContent>
        <TabsContent value="all" className="space-y-4">
          {addRecord('problem', 'Add any record', 'all')}
          {recordList(records.rows, 'No records yet.')}
        </TabsContent>
      </Tabs>
      </>}
    </div>
  );
}

function RecordItem({ record: r, onChanged, writable = true, onFailed }: { record: Row; onChanged: () => Promise<unknown>; writable?: boolean; onFailed?: () => void }) {
  const [marking, setMarking] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [stopDate, setStopDate] = useState(todayIso());
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const errored = r.status === 'entered_in_error';
  const stopped = r.status === 'stopped';
  const stopMedicine = async () => {
    if (pending.current) return;
    const problem = validateStopMedicine({ started_on: r.recorded_on, stopped_on: stopDate, reason });
    if (problem) { toast.error(problem); return; }
    pending.current = true; setSaving(true);
    try {
      const { data, error } = await db.from('hc_pilot_records').update({ status: 'stopped', stopped_on: stopDate, stop_reason: reason.trim() }).eq('id', r.id).eq('status', 'active').select('id, status');
      if (error) throw new Error(error.message);
      if (data?.[0]?.status !== 'stopped') throw new Error('The medicine changed before your update. Refresh and try again.');
      toast.success('Medicine stopped'); setStopping(false); setReason(''); await onChanged();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Medicine could not be stopped.'); onFailed?.(); }
    finally { pending.current = false; setSaving(false); }
  };
  const markError = async () => {
    if (pending.current) return;
    const problem = validateErrorReason(reason);
    if (problem) { toast.error(problem); return; }
    pending.current = true; setSaving(true);
    try {
      const { data, error } = await db.from('hc_pilot_records').update({ status: 'entered_in_error', error_reason: reason.trim() }).eq('id', r.id).eq('status', 'active').select('id');
      if (error) throw new Error(error.message);
      if (!data?.length) throw new Error('The record changed before your update. Refresh and try again.');
      toast.success('Record marked as entered in error'); setMarking(false); await onChanged();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Record could not be updated.'); onFailed?.(); }
    finally { pending.current = false; setSaving(false); }
  };
  return (
    <article className={`rounded-lg border p-4 ${errored ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{RECORD_TYPE_LABELS[r.record_type as PilotRecordType] ?? r.record_type}</Badge>
          <span className={`font-medium ${errored ? 'line-through' : ''}`}>{r.title}</span>
          {stopped && <Badge variant="secondary">Stopped</Badge>}
          {r.record_type === 'lab_result' && r.lab_flag && <Badge variant={flagVariant(r.lab_flag)}>{LAB_FLAG_LABELS[r.lab_flag as LabFlag] ?? r.lab_flag}</Badge>}
          {r.record_type === 'allergy' && r.allergy_severity && <Badge variant={severityVariant(r.allergy_severity)}>{ALLERGY_SEVERITY_LABELS[r.allergy_severity as AllergySeverity] ?? r.allergy_severity}</Badge>}
        </div>
        <span className="text-xs text-muted-foreground">{format(parseISO(r.recorded_on), 'MMM d, yyyy')} · {r.author_email ?? 'Team member'}</span>
      </div>
      {r.record_type === 'vitals' && <p className="mt-2 text-sm">BP {r.bp_sys ?? '—'}/{r.bp_dia ?? '—'} · Heart rate {r.heart_rate ?? '—'} · Weight {r.weight_lb ?? '—'} lb · Temp {r.temperature_f ?? '—'} °F</p>}
      {r.record_type === 'medication' && <p className="mt-2 text-sm">{r.medication_name}{r.dose ? ` · ${r.dose}` : ''}{r.med_frequency ? ` · ${r.med_frequency}` : ''}{r.med_route ? ` · ${r.med_route}` : ''}</p>}
      {r.record_type === 'allergy' && r.allergy_reaction && <p className="mt-2 text-sm">Reaction: {r.allergy_reaction}</p>}
      {r.record_type === 'lab_result' && (r.lab_value || r.lab_ref_range) && (
        <p className={`mt-2 text-sm ${isFlaggedLab(r.lab_flag) ? 'font-semibold text-destructive' : ''}`}>Result: {r.lab_value ?? '—'}{r.lab_unit ? ` ${r.lab_unit}` : ''}{r.lab_ref_range ? <span className="font-normal text-muted-foreground"> · normal range {r.lab_ref_range}</span> : null}</p>
      )}
      {r.details && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{r.details}</p>}
      {stopped && <p className="mt-2 text-xs text-muted-foreground">Stopped {r.stopped_on ? format(parseISO(r.stopped_on), 'MMM d, yyyy') : ''}: {r.stop_reason}</p>}
      {errored && <p className="mt-2 text-xs text-destructive">Entered in error: {r.error_reason}</p>}
      {!errored && writable && (marking || stopping ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {stopping && <Input type="date" value={stopDate} min={r.recorded_on} max={todayIso()} onChange={(e) => setStopDate(e.target.value)} className="w-44" aria-label="Date stopped" />}
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={stopping ? 'Why stopped (e.g. side effects)' : 'Reason (e.g. wrong patient)'} className="max-w-sm" maxLength={300} aria-label={stopping ? 'Reason for stopping' : 'Reason for marking in error'} />
          <Button size="sm" variant="destructive" onClick={stopping ? stopMedicine : markError} disabled={saving}>{saving ? 'Saving…' : stopping ? 'Stop medicine' : 'Confirm'}</Button>
          <Button size="sm" variant="ghost" onClick={() => { setMarking(false); setStopping(false); setReason(''); }} disabled={saving}>Cancel</Button>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-3">
          {r.record_type === 'medication' && r.status === 'active' && <Button size="sm" variant="ghost" className="px-0 text-xs" onClick={() => setStopping(true)}>Stop this medicine</Button>}
          <Button size="sm" variant="ghost" className="px-0 text-xs" onClick={() => setMarking(true)}>Mark as entered in error</Button>
        </div>
      ))}
    </article>
  );
}

function AddRecordForm({ clinicId, patientId, initialType, onCancel, onSaved, real = false, onFailed }: { clinicId: string; patientId: string; initialType: PilotRecordType; onCancel: () => void; onSaved: () => void | Promise<void>; real?: boolean; onFailed?: () => void }) {
  const [type, setType] = useState<PilotRecordType>(initialType);
  const [f, setF] = useState({
    recorded_on: todayIso(), title: initialType === 'vitals' ? 'Vital signs' : '', details: '', bp_sys: '', bp_dia: '', heart_rate: '', weight_lb: '', temperature_f: '',
    medication_name: '', dose: '', med_frequency: '', med_route: '', allergy_reaction: '', allergy_severity: '', lab_value: '', lab_unit: '', lab_ref_range: '', lab_flag: '',
  });
  const opt = (v: string) => v.trim() || null;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const save = async () => {
    if (pending.current) return;
    const input = {
      record_type: type, recorded_on: f.recorded_on, title: f.title.trim() || (type === 'medication' ? f.medication_name.trim() : ''), details: f.details.trim() || null,
      ...(type === 'vitals' ? { bp_sys: num(f.bp_sys), bp_dia: num(f.bp_dia), heart_rate: num(f.heart_rate), weight_lb: num(f.weight_lb), temperature_f: num(f.temperature_f) } : {}),
      ...(type === 'medication' ? { medication_name: opt(f.medication_name), dose: opt(f.dose), med_frequency: opt(f.med_frequency), med_route: opt(f.med_route) } : {}),
      ...(type === 'allergy' ? { allergy_reaction: opt(f.allergy_reaction), allergy_severity: opt(f.allergy_severity) } : {}),
      ...(type === 'lab_result' ? { lab_value: opt(f.lab_value), lab_unit: opt(f.lab_unit), lab_ref_range: opt(f.lab_ref_range), lab_flag: opt(f.lab_flag) } : {}),
    };
    const problem = validatePilotRecord(input, new Date(), { real });
    if (problem) { setError(problem); return; }
    pending.current = true; setSaving(true); setError('');
    try {
      const { data, error: e } = await db.from('hc_pilot_records').insert({ ...input, title: input.title.trim(), clinic_id: clinicId, patient_id: patientId }).select('id').single();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The record could not be confirmed as saved. Refresh before trying again.');
      toast.success('Record saved');
      await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'Record could not be saved.'); onFailed?.(); }
    finally { pending.current = false; setSaving(false); }
  };

  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="text-base">Add a record</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Record type</Label>
            <Select value={type} onValueChange={(v) => setType(v as PilotRecordType)}><SelectTrigger aria-label="Record type"><SelectValue /></SelectTrigger>
              <SelectContent>{RECORD_TYPES.map((t) => <SelectItem key={t} value={t}>{RECORD_TYPE_LABELS[t]}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="pr-date">Date</Label><Input id="pr-date" type="date" value={f.recorded_on} onChange={set('recorded_on')} max={todayIso()} /></div>
          <div className="space-y-1"><Label htmlFor="pr-title">Title *</Label><Input id="pr-title" value={f.title} onChange={set('title')} maxLength={140} placeholder="Follow-up visit" /></div>
        </div>
        {type === 'vitals' && (
          <div className="grid gap-3 sm:grid-cols-5">
            {([['bp_sys', 'BP top'], ['bp_dia', 'BP bottom'], ['heart_rate', 'Heart rate'], ['weight_lb', 'Weight (lb)'], ['temperature_f', 'Temp (°F)']] as const).map(([k, l]) => (
              <div key={k} className="space-y-1"><Label htmlFor={`pr-${k}`}>{l}</Label><Input id={`pr-${k}`} type="number" inputMode="decimal" value={f[k]} onChange={set(k)} /></div>
            ))}
          </div>
        )}
        {type === 'medication' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label htmlFor="pr-med">Medicine name *</Label><Input id="pr-med" value={f.medication_name} onChange={set('medication_name')} maxLength={140} /></div>
            <div className="space-y-1"><Label htmlFor="pr-dose">Dose</Label><Input id="pr-dose" value={f.dose} onChange={set('dose')} maxLength={140} placeholder="10 mg" /></div>
            <div className="space-y-1"><Label htmlFor="pr-freq">How often</Label><Input id="pr-freq" value={f.med_frequency} onChange={set('med_frequency')} maxLength={140} placeholder="Once daily" /></div>
            <div className="space-y-1"><Label htmlFor="pr-route">How taken</Label><Input id="pr-route" value={f.med_route} onChange={set('med_route')} maxLength={60} placeholder="By mouth" /></div>
          </div>
        )}
        {type === 'allergy' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label>Severity{real ? ' *' : ''}</Label>
              <Select value={f.allergy_severity} onValueChange={(v) => setF({ ...f, allergy_severity: v })}><SelectTrigger aria-label="Allergy severity"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>{ALLERGY_SEVERITIES.map((s) => <SelectItem key={s} value={s}>{ALLERGY_SEVERITY_LABELS[s]}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1"><Label htmlFor="pr-reaction">Reaction</Label><Input id="pr-reaction" value={f.allergy_reaction} onChange={set('allergy_reaction')} maxLength={200} placeholder="Hives, swelling" /></div>
          </div>
        )}
        {type === 'lab_result' && (
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1"><Label htmlFor="pr-labval">Result{real ? ' *' : ''}</Label><Input id="pr-labval" value={f.lab_value} onChange={set('lab_value')} maxLength={60} placeholder="7.2" /></div>
            <div className="space-y-1"><Label htmlFor="pr-labunit">Units</Label><Input id="pr-labunit" value={f.lab_unit} onChange={set('lab_unit')} maxLength={30} placeholder="%" /></div>
            <div className="space-y-1"><Label htmlFor="pr-labrange">Normal range</Label><Input id="pr-labrange" value={f.lab_ref_range} onChange={set('lab_ref_range')} maxLength={60} placeholder="4.0–5.6" /></div>
            <div className="space-y-1"><Label>Flag</Label>
              <Select value={f.lab_flag} onValueChange={(v) => setF({ ...f, lab_flag: v })}><SelectTrigger aria-label="Lab result flag"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>{LAB_FLAGS.map((s) => <SelectItem key={s} value={s}>{LAB_FLAG_LABELS[s]}</SelectItem>)}</SelectContent></Select></div>
          </div>
        )}
        <div className="space-y-1"><Label htmlFor="pr-details">Details</Label><Textarea id="pr-details" value={f.details} onChange={set('details')} maxLength={5000} rows={4} placeholder={real ? 'Notes for this patient' : 'Notes for this made-up test patient'} /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">{saving ? 'Saving…' : 'Save record'}</Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityLog({ audit, patients }: { audit: { rows: Row[]; loading: boolean; error: string; reload: () => Promise<unknown> }; patients: Row[] }) {
  const { name } = usePilotPrivacy();
  const byId = Object.fromEntries(patients.map((p) => [p.id, p]));
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Full activity log · who added, changed, signed or opened each chart</CardTitle></CardHeader>
      <CardContent>
        <DataLoadErrors sources={[audit]} />
        {audit.loading ? <p role="status" className="text-sm text-muted-foreground">Loading activity…</p>
          : !audit.error && audit.rows.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p>
          : audit.rows.length > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Who</TableHead><TableHead>What</TableHead><TableHead>Test patient</TableHead></TableRow></TableHeader>
              <TableBody>{audit.rows.slice(0, 300).map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap">{format(parseISO(a.created_at), 'MMM d, h:mm a')}</TableCell>
                  <TableCell>{a.actor_email ?? '—'}</TableCell>
                  <TableCell>{AUDIT_LABELS[a.action] ?? a.action}</TableCell>
                  <TableCell>{a.patient_id ? name(byId[a.patient_id]) : '—'}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          )}
      </CardContent>
    </Card>
  );
}
