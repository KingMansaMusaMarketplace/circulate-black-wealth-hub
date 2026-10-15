import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Activity, AlertTriangle, BrainCircuit, Calendar, ClipboardCheck, FileSearch, FileText,
  HeartPulse, LayoutDashboard, Lock, Pill, Receipt, Search, ShieldCheck, Stethoscope, Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

/* ------------------------------------------------------------------ */
/* ALL DATA BELOW IS FICTIONAL SAMPLE DATA FOR INVESTOR DEMONSTRATION. */
/* No real patient information is collected, stored, or sent anywhere. */
/* ------------------------------------------------------------------ */

type Patient = {
  id: string; name: string; age: number; sex: string; mrn: string; payer: string;
  conditions: string[]; allergies: string[]; risk: 'Low' | 'Moderate' | 'High';
  vitals: { date: string; bp: string; hr: number; a1c?: number; weight: number }[];
  meds: { name: string; dose: string; status: string }[];
  timeline: { date: string; type: string; note: string }[];
};

const PATIENTS: Patient[] = [
  {
    id: 'p1', name: 'Jordan Sample', age: 54, sex: 'M', mrn: 'DEMO-10021', payer: 'Sample Health PPO',
    conditions: ['Type 2 diabetes', 'Hypertension', 'Lumbar disc herniation L4-L5'], allergies: ['Penicillin'], risk: 'High',
    vitals: [
      { date: '2026-07-02', bp: '148/94', hr: 82, a1c: 8.4, weight: 231 },
      { date: '2026-08-14', bp: '139/88', hr: 78, a1c: 7.9, weight: 226 },
      { date: '2026-09-25', bp: '131/84', hr: 74, a1c: 7.3, weight: 221 },
    ],
    meds: [
      { name: 'Metformin', dose: '1000 mg twice daily', status: 'Active' },
      { name: 'Lisinopril', dose: '20 mg daily', status: 'Active' },
      { name: 'Gabapentin', dose: '300 mg nightly', status: 'Review' },
    ],
    timeline: [
      { date: '2025-11-03', type: 'ER visit', note: 'Low back pain after motor-vehicle collision (sample).' },
      { date: '2025-12-10', type: 'MRI', note: 'L4-L5 disc protrusion, mild nerve contact (sample).' },
      { date: '2026-02-18', type: 'Surgery', note: 'Microdiscectomy L4-L5 (sample).' },
      { date: '2026-05-01', type: 'Physical therapy', note: '12 of 16 sessions completed (sample).' },
    ],
  },
  {
    id: 'p2', name: 'Avery Example', age: 67, sex: 'F', mrn: 'DEMO-10044', payer: 'Sample Medicare Advantage',
    conditions: ['Congestive heart failure', 'Chronic kidney disease stage 3'], allergies: ['None known'], risk: 'High',
    vitals: [
      { date: '2026-08-01', bp: '136/80', hr: 88, weight: 172 },
      { date: '2026-09-01', bp: '128/78', hr: 80, weight: 168 },
      { date: '2026-10-01', bp: '124/76', hr: 76, weight: 166 },
    ],
    meds: [
      { name: 'Furosemide', dose: '40 mg daily', status: 'Active' },
      { name: 'Carvedilol', dose: '12.5 mg twice daily', status: 'Active' },
    ],
    timeline: [
      { date: '2026-06-12', type: 'Hospital stay', note: 'Fluid overload, 3 nights (sample).' },
      { date: '2026-07-01', type: 'Enrolled', note: 'Remote monitoring program started (sample).' },
    ],
  },
  {
    id: 'p3', name: 'Morgan Placeholder', age: 41, sex: 'F', mrn: 'DEMO-10087', payer: 'Sample Commercial HMO',
    conditions: ['Asthma', 'Shoulder strain'], allergies: ['Latex'], risk: 'Low',
    vitals: [
      { date: '2026-09-10', bp: '118/74', hr: 70, weight: 149 },
      { date: '2026-10-08', bp: '116/72', hr: 68, weight: 148 },
    ],
    meds: [{ name: 'Albuterol inhaler', dose: 'As needed', status: 'Active' }],
    timeline: [{ date: '2026-09-10', type: 'Office visit', note: 'Work-related shoulder strain (sample).' }],
  },
];

const APPOINTMENTS = [
  { time: '8:30 AM', patient: 'Jordan Sample', type: 'CME exam', room: 'Room 2' },
  { time: '10:00 AM', patient: 'Avery Example', type: 'Heart-failure follow-up', room: 'Telehealth' },
  { time: '1:15 PM', patient: 'Morgan Placeholder', type: 'Shoulder recheck', room: 'Room 1' },
];

const CLAIMS = [
  { id: 'CLM-5001', patient: 'Jordan Sample', amount: 2850, status: 'Denied', reason: 'Missing prior authorization' },
  { id: 'CLM-5002', patient: 'Avery Example', amount: 420, status: 'Paid', reason: '' },
  { id: 'CLM-5003', patient: 'Morgan Placeholder', amount: 190, status: 'Submitted', reason: '' },
  { id: 'CLM-5004', patient: 'Avery Example', amount: 1310, status: 'Appeal drafted', reason: 'Medical necessity' },
];

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'patients', label: 'Patient Charts', icon: Users },
  { key: 'cme', label: 'CME Record Review', icon: FileSearch },
  { key: 'rpm', label: 'Remote Monitoring', icon: HeartPulse },
  { key: 'auth', label: 'Prior Authorization', icon: ClipboardCheck },
  { key: 'billing', label: 'Billing & Claims', icon: Receipt },
  { key: 'compliance', label: 'Compliance', icon: ShieldCheck },
] as const;
type ModuleKey = typeof MODULES[number]['key'];

const riskVariant = (r: Patient['risk']) => (r === 'High' ? 'destructive' : r === 'Moderate' ? 'secondary' : 'outline');

const Stat = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
  <Card><CardContent className="flex items-center gap-4 p-5">
    <div className="rounded-lg bg-mansagold/15 p-3"><Icon className="h-5 w-5 text-mansagold" /></div>
    <div><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>
  </CardContent></Card>
);

const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Active sample patients" value="3" icon={Users} />
      <Stat label="Today's appointments" value="3" icon={Calendar} />
      <Stat label="Pages reviewed by Kayla" value="4,000" icon={FileText} />
      <Stat label="Claims needing action" value="2" icon={Receipt} />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-base">Today's schedule</CardTitle></CardHeader>
        <CardContent className="space-y-3">{APPOINTMENTS.map((a) => (
          <div key={a.time} className="flex items-center justify-between rounded-md border border-border p-3">
            <div><p className="font-medium">{a.patient}</p><p className="text-sm text-muted-foreground">{a.type} · {a.room}</p></div>
            <Badge variant="outline">{a.time}</Badge>
          </div>))}
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-4 w-4 text-mansagold" />Kayla's morning brief</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>• <b>Jordan Sample</b>: CME exam at 8:30. Record summary and fault timeline are ready.</p>
          <p>• <b>Avery Example</b>: weight is down 6 lb over 60 days. Heart-failure plan is working.</p>
          <p>• <b>Claim CLM-5001</b> was denied for a missing prior authorization. Kayla has drafted the request.</p>
          <p>• 1 medicine flagged for review: Gabapentin for Jordan Sample.</p>
        </CardContent></Card>
    </div>
  </div>
);

const Patients = () => {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(PATIENTS[0]);
  const list = useMemo(() => PATIENTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <Card><CardContent className="space-y-2 p-4">
        <div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search sample patients" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {list.map((p) => (
          <button key={p.id} onClick={() => setSel(p)}
            className={`w-full rounded-md border p-3 text-left transition-colors ${sel.id === p.id ? 'border-mansagold bg-mansagold/10' : 'border-border hover:bg-muted'}`}>
            <p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.mrn} · {p.age}{p.sex}</p>
          </button>))}
      </CardContent></Card>
      <div className="space-y-6">
        <Card><CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div><h3 className="text-xl font-semibold">{sel.name}</h3>
            <p className="text-sm text-muted-foreground">{sel.age} yrs · {sel.sex} · {sel.mrn} · {sel.payer}</p></div>
          <div className="flex gap-2"><Badge variant={riskVariant(sel.risk)}>{sel.risk} risk</Badge>
            <Badge variant="outline">Allergies: {sel.allergies.join(', ')}</Badge></div>
        </CardContent></Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Stethoscope className="h-4 w-4" />Problems</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">{sel.conditions.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Pill className="h-4 w-4" />Medicines</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">{sel.meds.map((m) => (
              <div key={m.name} className="flex justify-between"><span>{m.name} — {m.dose}</span>
                <Badge variant={m.status === 'Review' ? 'destructive' : 'outline'}>{m.status}</Badge></div>))}</CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" />Vitals trend</CardTitle></CardHeader>
          <CardContent><table className="w-full text-sm"><thead className="text-left text-muted-foreground">
            <tr><th className="py-1">Date</th><th>Blood pressure</th><th>Heart rate</th><th>A1C</th><th>Weight</th></tr></thead>
            <tbody>{sel.vitals.map((v) => (<tr key={v.date} className="border-t border-border">
              <td className="py-2">{v.date}</td><td>{v.bp}</td><td>{v.hr}</td><td>{v.a1c ?? '—'}</td><td>{v.weight} lb</td></tr>))}</tbody></table></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Care timeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">{sel.timeline.map((t) => (
            <div key={t.date} className="border-l-2 border-mansagold pl-4"><p className="text-xs text-muted-foreground">{t.date} · {t.type}</p><p className="text-sm">{t.note}</p></div>))}
          </CardContent></Card>
      </div>
    </div>
  );
};

const CME = () => {
  const [run, setRun] = useState(false);
  return (
    <div className="space-y-6">
      <Card><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div><h3 className="text-lg font-semibold">Case: Jordan Sample v. Sample Insurance Co.</h3>
          <p className="text-sm text-muted-foreground">Compulsory Medical Examination · 4,000 pages · 38 providers · 14 imaging studies (sample)</p></div>
        <Button onClick={() => setRun(true)} className="bg-mansagold text-foreground hover:bg-mansagold-dark"><BrainCircuit className="mr-2 h-4 w-4" />Have Kayla review</Button>
      </CardContent></Card>
      {run && (<>
        <Card><CardHeader><CardTitle className="text-base">Review progress</CardTitle></CardHeader>
          <CardContent className="space-y-2"><Progress value={100} /><p className="text-sm text-muted-foreground">4,000 of 4,000 pages read · every finding links to its page number</p></CardContent></Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="text-base">Key findings</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Back pain first recorded at the ER on 2025-11-03, the same day as the collision <span className="text-muted-foreground">(p. 112)</span>.</p>
              <p>• Earlier record from 2023 shows <b>mild back stiffness</b>, so a pre-existing condition question exists <span className="text-muted-foreground">(p. 1,904)</span>.</p>
              <p>• MRI on 2025-12-10 shows a new L4-L5 protrusion not seen on the 2023 X-ray <span className="text-muted-foreground">(p. 640)</span>.</p>
              <p>• Physical therapy stopped at 12 of 16 sessions <span className="text-muted-foreground">(p. 3,277)</span>.</p>
            </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-mansagold" />Conflicts for the doctor</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Two providers list different injury dates (p. 88 vs p. 2,415).</p>
              <p>• Pain score reported as 3/10 and 8/10 on the same day (p. 1,120, p. 1,122).</p>
              <p>• 214 pages are duplicates and were set aside.</p>
              <p className="pt-2 text-muted-foreground">Kayla organizes the records. The examining doctor makes every medical and fault decision.</p>
            </CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle className="text-base">Draft report outline</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm"><p>1. History of the incident</p><p>2. Records reviewed (index of 4,000 pages)</p>
            <p>3. Prior medical history</p><p>4. Exam findings (doctor fills in)</p><p>5. Causation discussion (doctor decides)</p><p>6. Opinions and signature</p></CardContent></Card>
      </>)}
    </div>
  );
};

const RPM = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {PATIENTS.slice(0, 2).map((p) => (
      <Card key={p.id}><CardHeader><CardTitle className="text-base">{p.name}</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Readings this month</span><b>{p.id === 'p1' ? 22 : 27} of 16 needed</b></div>
          <div className="flex justify-between"><span>Latest blood pressure</span><b>{p.vitals[p.vitals.length - 1].bp}</b></div>
          <div className="flex justify-between"><span>Care-team minutes</span><b>{p.id === 'p1' ? 24 : 41} min</b></div>
          <Badge variant="outline">Billable this month (sample)</Badge>
        </CardContent></Card>))}
  </div>
);

const PriorAuth = () => (
  <Card><CardHeader><CardTitle className="text-base">Prior authorization requests</CardTitle></CardHeader>
    <CardContent className="space-y-3 text-sm">
      {[['Lumbar MRI follow-up', 'Jordan Sample', 'Draft ready'], ['Cardiac rehab, 12 sessions', 'Avery Example', 'Submitted'], ['Shoulder PT, 8 sessions', 'Morgan Placeholder', 'Approved']].map(([s, p, st]) => (
        <div key={s} className="flex items-center justify-between rounded-md border border-border p-3">
          <div><p className="font-medium">{s}</p><p className="text-muted-foreground">{p}</p></div><Badge variant={st === 'Approved' ? 'outline' : 'secondary'}>{st}</Badge></div>))}
      <p className="text-muted-foreground">Kayla pulls the supporting notes from the chart and writes the request. Staff review and send it.</p>
    </CardContent></Card>
);

const Billing = () => (
  <Card><CardHeader><CardTitle className="text-base">Claims</CardTitle></CardHeader>
    <CardContent><table className="w-full text-sm"><thead className="text-left text-muted-foreground">
      <tr><th className="py-1">Claim</th><th>Patient</th><th>Amount</th><th>Status</th><th>Kayla's note</th></tr></thead>
      <tbody>{CLAIMS.map((c) => (<tr key={c.id} className="border-t border-border">
        <td className="py-2">{c.id}</td><td>{c.patient}</td><td>${c.amount.toLocaleString()}</td>
        <td><Badge variant={c.status === 'Denied' ? 'destructive' : 'outline'}>{c.status}</Badge></td>
        <td className="text-muted-foreground">{c.reason ? `Fix: ${c.reason}` : '—'}</td></tr>))}</tbody></table></CardContent></Card>
);

const Compliance = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card><CardHeader><CardTitle className="text-base">Built-in safeguards (planned design)</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>• Every view and edit of a chart is logged with who, what and when.</p>
        <p>• Staff see only the patients they are assigned to.</p>
        <p>• Records encrypted at rest and in transit.</p>
        <p>• Patient records kept on separate healthcare hosting, never on the main 1325.AI system.</p>
      </CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Path to live use</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {['Healthcare attorney review', 'Signed BAA with healthcare hosting (AWS)', 'Signed BAAs with AI and email vendors', 'Independent security review', 'First pilot clinic'].map((s) => (
          <div key={s} className="flex items-center justify-between"><span>{s}</span><Badge variant="secondary">Not started</Badge></div>))}
      </CardContent></Card>
  </div>
);

const VIEWS: Record<ModuleKey, React.FC> = { dashboard: Dashboard, patients: Patients, cme: CME, rpm: RPM, auth: PriorAuth, billing: Billing, compliance: Compliance };

export default function HealthDemoPage() {
  const [mod, setMod] = useState<ModuleKey>('dashboard');
  const View = VIEWS[mod];
  const current = MODULES.find((m) => m.key === mod)!;
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Helmet><title>1325 Clinical — Investor Demo | 1325.AI</title>
        <meta name="description" content="Investor preview of 1325 Clinical, a planned AI-powered health record system by 1325.AI. Sample data only." /></Helmet>
      <div className="flex items-center justify-center gap-2 border-b border-mansagold/30 bg-mansagold/10 px-4 py-1.5 text-center text-xs font-medium tracking-wide text-mansagold">
        <Lock className="h-3.5 w-3.5" /> INVESTOR DEMO · Fictional sample data · Not yet approved for real patient records
      </div>
      <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mansagold"><HeartPulse className="h-5 w-5 text-background" /></div>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight">1325 Clinical</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Enterprise Edition</p>
          </div>
        </div>
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-9 pl-9" placeholder="Search patients, cases, claims…" />
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden gap-1 sm:flex"><ShieldCheck className="h-3 w-3" />Sample workspace</Badge>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold">MD</div>
        </div>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card/50 p-3 md:w-64 md:flex-col md:border-b-0 md:border-r md:p-4">
          <p className="hidden px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:block">Workspace</p>
          {MODULES.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setMod(key)}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${mod === key ? 'border-l-2 border-mansagold bg-mansagold/10 text-foreground' : 'border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Icon className={`h-4 w-4 ${mod === key ? 'text-mansagold' : ''}`} />{label}</button>))}
          <div className="mt-auto hidden rounded-lg border border-border p-3 md:block">
            <p className="flex items-center gap-2 text-xs font-semibold"><BrainCircuit className="h-4 w-4 text-mansagold" />Kayla Clinical AI</p>
            <p className="mt-1 text-xs text-muted-foreground">Organizes records. Doctors make every medical decision.</p>
          </div>
        </nav>
        <main className="flex-1 bg-muted/20 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">health.1325.ai</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{current.label}</h1>
            </div>
            <p className="text-sm text-muted-foreground">Thursday · Sample clinic</p>
          </div>
          <View />
        </main>
      </div>
      <footer className="border-t border-border bg-card px-6 py-4 text-[11px] leading-relaxed text-muted-foreground">
        1325 Clinical is a product in development by 1325.AI (Mansa Musa Marketplace, Inc.). This preview shows planned features with fictional data. It is not a medical device and is not yet certified for protected health information. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.
      </footer>
    </div>
  );
}
