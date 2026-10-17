import React, { useMemo, useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { BrainCircuit, Plus, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db, fullName, money, Row, useRows } from './hc';
import PriorAuthorization from './PriorAuthorization';

type P = { clinicId: string; patients: Row[]; reloadPatients?: () => void; isOwner?: boolean };

/* ---------- small helpers ---------- */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>
);
const statusTone = (s: string) =>
  /approved|paid|completed|reviewed|checked/i.test(s) ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
  : /denied|failed|cancel|no.show/i.test(s) ? 'bg-destructive/10 text-destructive border-destructive/30'
  : /pending|submitted|reviewing|scheduled/i.test(s) ? 'bg-mansagold/15 text-mansagold-dark border-mansagold/40'
  : 'bg-muted text-muted-foreground';
export const StatusBadge = ({ s }: { s: string }) => <Badge variant="outline" className={statusTone(s)}>{s}</Badge>;

function PatientPicker({ patients, value, onChange }: { patients: Row[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Choose sample patient" /></SelectTrigger>
      <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{fullName(p)} · {p.mrn}</SelectItem>)}</SelectContent>
    </Select>
  );
}
function StatusPicker({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}
async function save(table: string, values: Row, ok: string) {
  const { error } = await db.from(table).insert(values);
  if (error) { toast.error(error.message); return false; }
  toast.success(ok); return true;
}
async function patch(table: string, id: string, values: Row) {
  const { error } = await db.from(table).update(values).eq('id', id);
  if (error) toast.error(error.message);
}

/* ---------- Dashboard ---------- */
export function Dashboard({ clinicId, patients, go }: P & { go: (k: string) => void }) {
  const appts = useRows('hc_appointments', clinicId, { order: 'starts_at', asc: true });
  const auths = useRows('hc_prior_auths', clinicId);
  const claims = useRows('hc_claims', clinicId);
  const docs = useRows('hc_documents', clinicId);
  const today = appts.rows.filter((a) => isToday(parseISO(a.starts_at)));
  const byId = Object.fromEntries(patients.map((p) => [p.id, p]));
  const stats = [
    { l: 'Sample patients', v: patients.length, k: 'patients' },
    { l: "Today's visits", v: today.length, k: 'schedule' },
    { l: 'Pending authorizations', v: auths.rows.filter((a) => a.status === 'Pending').length, k: 'auth' },
    { l: 'Unpaid claims', v: money(claims.rows.filter((c) => c.status !== 'Paid').reduce((s, c) => s + Number(c.amount), 0)), k: 'billing' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button key={s.l} onClick={() => go(s.k)} className="rounded-xl border bg-card p-5 text-left transition hover:border-mansagold/60">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-3xl font-semibold text-mansagold">{s.v}</div>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Today's schedule</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {today.length === 0 && <p className="text-sm text-muted-foreground">No visits today.</p>}
            {today.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                <div><div className="font-medium">{format(parseISO(a.starts_at), 'h:mm a')} · {fullName(byId[a.patient_id])}</div>
                  <div className="text-sm text-muted-foreground">{a.reason}</div></div>
                <StatusBadge s={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-mansagold/40">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-4 w-4 text-mansagold" /> Kayla's brief</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{today.length} visit{today.length === 1 ? '' : 's'} today. {auths.rows.filter((a) => a.status === 'Pending').length} authorization(s) waiting on payers.</p>
            <p>{claims.rows.filter((c) => c.status === 'Denied').length} denied claim(s) may need an appeal.</p>
            <p>{docs.rows.filter((d) => d.status === 'reviewed').length} record file(s) reviewed.</p>
            <Button size="sm" className="mt-2 bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={() => go('review')}>Review records</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Patients ---------- */
export function Patients({ clinicId, patients, reloadPatients }: P) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [f, setF] = useState<Row>({ first_name: '', last_name: '', dob: '', sex: 'F', payer: '', conditions: '', allergies: '', risk: 'Low' });
  const list = patients.filter((p) => `${fullName(p)} ${p.mrn}`.toLowerCase().includes(q.toLowerCase()));
  const add = async () => {
    if (!f.first_name || !f.last_name) return toast.error('Name required');
    const ok = await save('hc_patients', {
      clinic_id: clinicId, first_name: f.first_name, last_name: f.last_name, dob: f.dob || null, sex: f.sex, payer: f.payer,
      mrn: `DEMO-${Math.floor(10000 + Math.random() * 89999)}`, risk: f.risk,
      conditions: f.conditions.split(',').map((s: string) => s.trim()).filter(Boolean),
      allergies: f.allergies.split(',').map((s: string) => s.trim()).filter(Boolean),
    }, 'Sample patient added');
    if (ok) { reloadPatients?.(); setF({ ...f, first_name: '', last_name: '' }); }
  };
  if (open) return <Chart clinicId={clinicId} patient={patients.find((p) => p.id === open)!} back={() => setOpen(null)} reload={reloadPatients} />;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <Input placeholder="Search sample patients" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Dialog>
          <DialogTrigger asChild><Button className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Plus className="mr-1 h-4 w-4" /> New sample patient</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New sample patient</DialogTitle></DialogHeader>
            <p className="rounded-md bg-mansagold/10 p-2 text-xs text-mansagold-dark">Use made-up names only. Real patient information is not allowed.</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name"><Input value={f.first_name} onChange={(e) => setF({ ...f, first_name: e.target.value })} /></Field>
              <Field label="Last name"><Input value={f.last_name} onChange={(e) => setF({ ...f, last_name: e.target.value })} /></Field>
              <Field label="Birth date"><Input type="date" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} /></Field>
              <Field label="Sex"><StatusPicker value={f.sex} options={['F', 'M', 'X']} onChange={(v) => setF({ ...f, sex: v })} /></Field>
              <Field label="Insurance"><Input value={f.payer} onChange={(e) => setF({ ...f, payer: e.target.value })} /></Field>
              <Field label="Risk"><StatusPicker value={f.risk} options={['Low', 'Moderate', 'High']} onChange={(v) => setF({ ...f, risk: v })} /></Field>
            </div>
            <Field label="Conditions (comma separated)"><Input value={f.conditions} onChange={(e) => setF({ ...f, conditions: e.target.value })} /></Field>
            <Field label="Allergies (comma separated)"><Input value={f.allergies} onChange={(e) => setF({ ...f, allergies: e.target.value })} /></Field>
            <Button onClick={add} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">Save</Button>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>MRN</TableHead><TableHead>Insurance</TableHead><TableHead>Conditions</TableHead><TableHead>Risk</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id} className="cursor-pointer" onClick={() => setOpen(p.id)}>
                <TableCell className="font-medium">{fullName(p)}</TableCell><TableCell>{p.mrn}</TableCell><TableCell>{p.payer}</TableCell>
                <TableCell className="max-w-[260px] truncate">{(p.conditions || []).join(', ')}</TableCell>
                <TableCell><Badge variant="outline" className={p.risk === 'High' ? 'border-destructive/40 text-destructive' : ''}>{p.risk}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Chart({ clinicId, patient, back }: { clinicId: string; patient: Row; back: () => void; reload?: () => void }) {
  const eq: [string, string] = ['patient_id', patient.id];
  const vit = useRows('hc_vitals', clinicId, { order: 'recorded_on', asc: true, eq });
  const meds = useRows('hc_medications', clinicId, { eq });
  const enc = useRows('hc_encounters', clinicId, { order: 'visit_date', eq });
  const [note, setNote] = useState({ visit_type: 'Office visit', provider: '', note: '' });
  const [med, setMed] = useState({ name: '', dose: '' });
  const [v, setV] = useState({ bp_sys: '', bp_dia: '', heart_rate: '', weight_lb: '', a1c: '' });
  const num = (s: string) => (s === '' ? null : Number(s));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={back} className="text-sm text-muted-foreground hover:text-foreground">← All patients</button>
          <h2 className="text-2xl font-semibold">{fullName(patient)}</h2>
          <p className="text-sm text-muted-foreground">{patient.mrn} · {patient.sex} · {patient.dob ? `Born ${patient.dob}` : ''} · {patient.payer}</p>
        </div>
        <div className="flex flex-wrap gap-2">{(patient.allergies || []).map((a: string) => <Badge key={a} variant="outline" className="border-destructive/40 text-destructive">Allergy: {a}</Badge>)}</div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-base">Problems</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">{(patient.conditions || []).map((c: string) => <Badge key={c} variant="secondary">{c}</Badge>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Medicines</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {meds.rows.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-2 text-sm">
                <span><b>{m.name}</b> <span className="text-muted-foreground">{m.dose}</span></span>
                <StatusPicker value={m.status} options={['Active', 'Review', 'Stopped']} onChange={async (s) => { await patch('hc_medications', m.id, { status: s }); meds.reload(); }} />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Input placeholder="Medicine" value={med.name} onChange={(e) => setMed({ ...med, name: e.target.value })} />
              <Input placeholder="Dose" value={med.dose} onChange={(e) => setMed({ ...med, dose: e.target.value })} />
              <Button size="icon" variant="outline" onClick={async () => { if (med.name && await save('hc_medications', { clinic_id: clinicId, patient_id: patient.id, ...med }, 'Medicine added')) { setMed({ name: '', dose: '' }); meds.reload(); } }}><Plus className="h-4 w-4" /></Button>
            </div>
          </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Vitals</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            {vit.rows.map((r) => <div key={r.id} className="flex justify-between"><span className="text-muted-foreground">{r.recorded_on}</span><span>{r.bp_sys}/{r.bp_dia} · HR {r.heart_rate} · {r.weight_lb} lb{r.a1c ? ` · A1c ${r.a1c}` : ''}</span></div>)}
            <div className="grid grid-cols-5 gap-1 pt-2">
              {(['bp_sys', 'bp_dia', 'heart_rate', 'weight_lb', 'a1c'] as const).map((k) => <Input key={k} placeholder={{ bp_sys: 'Sys', bp_dia: 'Dia', heart_rate: 'HR', weight_lb: 'Lb', a1c: 'A1c' }[k]} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} className="px-2" />)}
            </div>
            <Button size="sm" variant="outline" className="w-full" onClick={async () => { if (await save('hc_vitals', { clinic_id: clinicId, patient_id: patient.id, bp_sys: num(v.bp_sys), bp_dia: num(v.bp_dia), heart_rate: num(v.heart_rate), weight_lb: num(v.weight_lb), a1c: num(v.a1c) }, 'Vitals saved')) { setV({ bp_sys: '', bp_dia: '', heart_rate: '', weight_lb: '', a1c: '' }); vit.reload(); } }}>Record vitals</Button>
          </CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Visits & notes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-[160px_1fr]">
            <StatusPicker value={note.visit_type} options={['Office visit', 'CME exam', 'ER visit', 'MRI', 'Surgery', 'Physical therapy', 'Telehealth']} onChange={(s) => setNote({ ...note, visit_type: s })} />
            <Input placeholder="Provider / facility" value={note.provider} onChange={(e) => setNote({ ...note, provider: e.target.value })} />
          </div>
          <Textarea placeholder="Visit note (sample)" value={note.note} onChange={(e) => setNote({ ...note, note: e.target.value })} />
          <Button className="bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => { if (note.note && await save('hc_encounters', { clinic_id: clinicId, patient_id: patient.id, ...note }, 'Note saved')) { setNote({ ...note, note: '' }); enc.reload(); } }}>Save note</Button>
          <div className="border-l-2 border-mansagold/50 pl-4">
            {enc.rows.map((e) => <div key={e.id} className="pb-4"><div className="text-xs text-muted-foreground">{e.visit_date} · {e.visit_type} · {e.provider}</div><div className="text-sm">{e.note}</div></div>)}
          </div>
        </CardContent></Card>
    </div>
  );
}

/* ---------- Schedule ---------- */
export function Schedule({ clinicId, patients }: P) {
  const appts = useRows('hc_appointments', clinicId, { order: 'starts_at', asc: true });
  const byId = Object.fromEntries(patients.map((p) => [p.id, p]));
  const [f, setF] = useState({ patient_id: '', when: '', duration_min: '30', reason: '' });
  const groups = useMemo(() => {
    const g: Record<string, Row[]> = {};
    appts.rows.forEach((a) => { const d = format(parseISO(a.starts_at), 'EEEE, MMM d'); (g[d] ||= []).push(a); });
    return g;
  }, [appts.rows]);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Appointments</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {Object.entries(groups).map(([d, list]) => (
            <div key={d}><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-mansagold">{d}</div>
              {list.map((a) => (
                <div key={a.id} className="mb-2 flex items-center justify-between gap-2 rounded-lg border p-3">
                  <div><div className="font-medium">{format(parseISO(a.starts_at), 'h:mm a')} · {a.duration_min} min · {fullName(byId[a.patient_id])}</div><div className="text-sm text-muted-foreground">{a.reason}</div></div>
                  <StatusPicker value={a.status} options={['Scheduled', 'Checked in', 'Completed', 'No-show', 'Cancelled']} onChange={async (s) => { await patch('hc_appointments', a.id, { status: s }); appts.reload(); }} />
                </div>
              ))}
            </div>
          ))}
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Book a visit</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Field label="Patient"><PatientPicker patients={patients} value={f.patient_id} onChange={(v) => setF({ ...f, patient_id: v })} /></Field>
          <Field label="Date & time"><Input type="datetime-local" value={f.when} onChange={(e) => setF({ ...f, when: e.target.value })} /></Field>
          <Field label="Length"><StatusPicker value={f.duration_min} options={['15', '30', '45', '60', '90']} onChange={(v) => setF({ ...f, duration_min: v })} /></Field>
          <Field label="Reason"><Input value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></Field>
          <Button className="w-full bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => {
            if (!f.patient_id || !f.when) return toast.error('Pick a patient and time');
            if (await save('hc_appointments', { clinic_id: clinicId, patient_id: f.patient_id, starts_at: new Date(f.when).toISOString(), duration_min: Number(f.duration_min), reason: f.reason }, 'Visit booked')) appts.reload();
          }}>Book</Button>
        </CardContent></Card>
    </div>
  );
}

/* ---------- Prior authorization ---------- */
export function PriorAuth(_props: P) {
  return <PriorAuthorization />;
}

/* ---------- Billing ---------- */
export function Billing({ clinicId, patients }: P) {
  const rows = useRows('hc_claims', clinicId);
  const byId = Object.fromEntries(patients.map((p) => [p.id, p]));
  const [f, setF] = useState({ patient_id: '', cpt_code: '', icd10_code: '', description: '', amount: '' });
  const billed = rows.rows.reduce((s, c) => s + Number(c.amount), 0);
  const paid = rows.rows.reduce((s, c) => s + Number(c.paid_amount), 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Billed', money(billed)], ['Collected', money(paid)], ['Denied claims', rows.rows.filter((c) => c.status === 'Denied').length]].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border bg-card p-5"><div className="text-xs uppercase tracking-wide text-muted-foreground">{l}</div><div className="mt-2 text-2xl font-semibold text-mansagold">{v}</div></div>
        ))}
      </div>
      <Card><CardHeader><CardTitle className="text-base">New claim</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2"><PatientPicker patients={patients} value={f.patient_id} onChange={(v) => setF({ ...f, patient_id: v })} /></div>
          <Input placeholder="CPT code" value={f.cpt_code} onChange={(e) => setF({ ...f, cpt_code: e.target.value })} />
          <Input placeholder="ICD-10 code" value={f.icd10_code} onChange={(e) => setF({ ...f, icd10_code: e.target.value })} />
          <Input placeholder="Amount $" type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
          <Button className="bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => { if (!f.patient_id || !f.amount) return toast.error('Patient and amount required'); if (await save('hc_claims', { clinic_id: clinicId, ...f, amount: Number(f.amount) }, 'Claim created')) rows.reload(); }}>Create</Button>
        </CardContent></Card>
      <Card><CardContent className="pt-6"><Table>
        <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>CPT</TableHead><TableHead>ICD-10</TableHead><TableHead>Amount</TableHead><TableHead>Paid</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{rows.rows.map((c) => (
          <TableRow key={c.id}><TableCell>{fullName(byId[c.patient_id])}</TableCell><TableCell>{c.cpt_code}</TableCell><TableCell>{c.icd10_code}</TableCell><TableCell>{money(c.amount)}</TableCell><TableCell>{money(c.paid_amount)}</TableCell>
            <TableCell><StatusPicker value={c.status} options={['Draft', 'Submitted', 'Paid', 'Denied', 'Appealed']} onChange={async (s) => { await patch('hc_claims', c.id, { status: s, paid_amount: s === 'Paid' ? c.amount : c.paid_amount, submitted_on: s === 'Submitted' && !c.submitted_on ? new Date().toISOString().slice(0, 10) : c.submitted_on }); rows.reload(); }} /></TableCell></TableRow>
        ))}</TableBody></Table></CardContent></Card>
    </div>
  );
}

/* ---------- Team ---------- */
export function Team({ clinicId, isOwner }: P) {
  const rows = useRows('hc_members', clinicId, { asc: true });
  const [email, setEmail] = useState(''); const [role, setRole] = useState('doctor');
  return (
    <Card><CardHeader><CardTitle className="text-base">Clinic team</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {isOwner && (
          <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
            <Input placeholder="Team member's email (they must have a 1325.AI account)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <StatusPicker value={role} options={['doctor', 'staff']} onChange={setRole} />
            <Button className="bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => {
              const { data, error } = await db.rpc('hc_add_member', { _clinic: clinicId, _email: email, _role: role });
              if (error) return toast.error(error.message);
              if (data === 'not_found') return toast.error('No account with that email yet — ask them to sign up first.');
              toast.success('Added to the clinic'); setEmail(''); rows.reload();
            }}><UserPlus className="mr-1 h-4 w-4" /> Add</Button>
          </div>
        )}
        <Table><TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{rows.rows.map((m) => (
            <TableRow key={m.id}><TableCell>{m.email}</TableCell><TableCell className="capitalize">{m.role}</TableCell>
              <TableCell className="text-right">{isOwner && m.role !== 'owner' && <Button size="sm" variant="ghost" onClick={async () => { await db.from('hc_members').delete().eq('id', m.id); rows.reload(); }}>Remove</Button>}</TableCell></TableRow>
          ))}</TableBody></Table>
      </CardContent></Card>
  );
}
