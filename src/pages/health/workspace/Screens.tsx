import React, { useMemo, useState } from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { BrainCircuit, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db, fullName, money, Row, useRows } from './hc';
import PriorAuthorization from './PriorAuthorization';
import DataLoadErrors from './DataLoadErrors';
import { scheduleDay } from './schedule-date';
import { registrationSource } from './registration-source';
import SamplePatientChart from './SamplePatientChart';
import ClinicalOperationsTiles from './ClinicalOperationsTiles';

type P = { clinicId: string; patients: Row[]; reloadPatients?: () => void; isOwner?: boolean };

/* ---------- small helpers ---------- */
const statusTone = (s: string) =>
  /approved|paid|completed|reviewed|checked/i.test(s) ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
  : /denied|failed|cancel|no.show/i.test(s) ? 'bg-destructive/10 text-destructive border-destructive/30'
  : /pending|submitted|reviewing|scheduled/i.test(s) ? 'bg-mansagold/15 text-mansagold-dark border-mansagold/40'
  : 'bg-muted text-muted-foreground';
export const StatusBadge = ({ s }: { s: string }) => <Badge variant="outline" className={statusTone(s)}>{s}</Badge>;

function StatusPicker({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
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
    { l: 'Unpaid claims', v: money(claims.rows.filter((c) => c.status !== 'Paid').reduce((s, c) => s + Number(c.amount), 0)), k: 'claims' },
  ];
  return (
    <div className="space-y-6">
      <DataLoadErrors sources={[appts, auths, claims, docs]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Button variant="ghost" key={s.l} onClick={() => go(s.k)} className="rounded-xl border bg-card h-auto flex-col items-start p-5 text-left transition hover:border-mansagold/60">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-3xl font-semibold text-mansagold">{s.v}</div>
          </Button>
        ))}
      </div>
      <ClinicalOperationsTiles />
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
export function Patients({ clinicId, patients }: P) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const list = patients.filter((p) => `${fullName(p)} ${p.mrn}`.toLowerCase().includes(q.toLowerCase()));
  const selected = patients.find(p => p.id === open);
  if (selected) return <Chart clinicId={clinicId} patient={selected} back={() => setOpen(null)} />;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <Input placeholder="Search sample patients" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Button disabled variant="outline">Patient entry · Locked</Button>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">Source-linked identities open the original fictional transcript. Older samples are retained but their clinical and billing details are unverified.</p>
        <Table>
          <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>MRN</TableHead><TableHead>Insurance</TableHead><TableHead>Conditions</TableHead><TableHead>Risk</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.id} className="cursor-pointer" onClick={() => setOpen(p.id)}>
                <TableCell className="font-medium">{fullName(p)}<span className="mt-1 block text-xs text-muted-foreground">{registrationSource(p) ? 'Fictional transcript identity' : 'Legacy sample · Evidence unverified'}</span></TableCell><TableCell>Unknown</TableCell><TableCell>Unknown</TableCell>
                <TableCell>See fictional source; current status unknown</TableCell>
                <TableCell><Badge variant="outline">Unknown</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Chart({ clinicId, patient, back }: { clinicId: string; patient: Row; back: () => void; reload?: () => void }) {
  const source = registrationSource(patient);
  return <div className="space-y-5"><Button variant="link" onClick={back}>← All patients</Button>{source ? <SamplePatientChart selectedVisitId={source.id} /> : <section role="status" className="space-y-3 border-y py-6"><h2 className="text-xl font-semibold">{fullName(patient)} · Legacy fictional sample</h2><p className="text-sm text-muted-foreground">This older sample has not been checked against the approved fictional transcripts. Stored details are preserved, but are not presented as supported medical or billing facts.</p><p className="text-sm text-muted-foreground">Demographics, allergies, medicines, risk, results and current clinical status remain unverified. Use Expanded Sample Chart for source-linked rehearsal.</p><Button disabled variant="outline">Patient records · Locked</Button></section>}</div>;
}

/* ---------- Schedule ---------- */
export function Schedule({ clinicId, patients }: P) {
  const appts = useRows('hc_appointments', clinicId, { order: 'starts_at', asc: true });
  const byId = Object.fromEntries(patients.map((p) => [p.id, p]));

  const groups = useMemo(() => {
    const g: Record<string, Row[]> = {};
    appts.rows.forEach((a) => { const d = scheduleDay(a.starts_at); (g[d] ||= []).push(a); });
    return g;
  }, [appts.rows]);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Appointments</CardTitle></CardHeader>
        <CardContent className="space-y-5"><DataLoadErrors sources={[appts]} />
          {Object.entries(groups).map(([d, list]) => (
            <div key={d}><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-mansagold">{d}</div>
              {list.map((a) => (
                <div key={a.id} className="mb-2 flex items-center justify-between gap-2 rounded-lg border p-3">
                  <div><div className="font-medium">{format(parseISO(a.starts_at), 'h:mm a')} · {a.duration_min} min · {fullName(byId[a.patient_id])}</div><div className="text-sm text-muted-foreground">{a.reason}</div></div>
                  <StatusBadge s={a.status} />
                </div>
              ))}
            </div>
          ))}
        </CardContent></Card>
      <section className="space-y-3 border-l pl-5"><h3 className="font-semibold">Scheduling · Read-only sample</h3><p className="text-sm text-muted-foreground">Patient entry, booking and encounter status changes remain unavailable.</p><Button disabled variant="outline">Book visit · Locked</Button></section>
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
  const billed = rows.rows.reduce((s, c) => s + Number(c.amount), 0);
  const paid = rows.rows.reduce((s, c) => s + Number(c.paid_amount), 0);
  return (
    <div className="space-y-6">
      <DataLoadErrors sources={[rows]} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Billed', money(billed)], ['Collected', money(paid)], ['Denied claims', rows.rows.filter((c) => c.status === 'Denied').length]].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border bg-card p-5"><div className="text-xs uppercase tracking-wide text-muted-foreground">{l}</div><div className="mt-2 text-2xl font-semibold text-mansagold">{v}</div></div>
        ))}
      </div>
      <Button disabled variant="outline">Claim creation · Locked</Button>
      <Card><CardContent className="pt-6"><Table>
        <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>CPT</TableHead><TableHead>ICD-10</TableHead><TableHead>Amount</TableHead><TableHead>Paid</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>{rows.rows.map((c) => (
          <TableRow key={c.id}><TableCell>{fullName(byId[c.patient_id])}</TableCell><TableCell>{c.cpt_code}</TableCell><TableCell>{c.icd10_code}</TableCell><TableCell>{money(c.amount)}</TableCell><TableCell>{money(c.paid_amount)}</TableCell>
            <TableCell><StatusBadge s={c.status} /></TableCell></TableRow>
        ))}</TableBody></Table></CardContent></Card>
    </div>
  );
}

/* ---------- Team ---------- */
export function Team({ clinicId, isOwner }: P) {
  const rows = useRows('hc_members', clinicId, { asc: true });
  const [email, setEmail] = useState(''); const [role, setRole] = useState('doctor');
  const [saving, setSaving] = useState(false);
  const pending = React.useRef(false);
  return (
    <Card><CardHeader><CardTitle className="text-base">Clinic team</CardTitle></CardHeader>
      <CardContent className="space-y-4"><DataLoadErrors sources={[rows]} />
        <p className="text-xs text-muted-foreground">Team roles are sample access permissions, not independently verified physician credentials.</p>
        {isOwner && (
          <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
            <Input placeholder="Team member's email (they must have a 1325.AI account)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <StatusPicker value={role} options={['doctor', 'staff']} onChange={setRole} />
            <Button disabled={saving} className="bg-mansagold text-mansablue hover:bg-mansagold-dark" onClick={async () => {
              if (pending.current) return; pending.current = true; setSaving(true);
              try {
              const { data, error } = await db.rpc('hc_add_member', { _clinic: clinicId, _email: email, _role: role });
              if (error) return toast.error(error.message);
              if (data === 'not_found') return toast.error('No account with that email yet — ask them to sign up first.');
              toast.success('Added to the clinic'); setEmail(''); await rows.reload();
              } catch { toast.error('Team member could not be saved.'); } finally { pending.current = false; setSaving(false); }
            }}><UserPlus className="mr-1 h-4 w-4" /> Add</Button>
          </div>
        )}
        <Table><TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{rows.rows.map((m) => (
            <TableRow key={m.id}><TableCell>{m.email}</TableCell><TableCell className="capitalize">{m.role}</TableCell>
              <TableCell className="text-right">{isOwner && m.role !== 'owner' && <Button size="sm" variant="ghost" disabled={saving} onClick={async () => { if (pending.current) return; pending.current = true; setSaving(true); try { const { error } = await db.from('hc_members').delete().eq('id', m.id); if (error) throw error; await rows.reload(); } catch { toast.error('Team member could not be removed.'); } finally { pending.current = false; setSaving(false); } }}>Remove</Button>}</TableCell></TableRow>
          ))}</TableBody></Table>
      </CardContent></Card>
  );
}
