import React, { useMemo, useState } from 'react';
import logo1325 from '@/assets/1325-ai-logo.png';
import kaylaCall0 from '@/assets/health-call/kayla-0.mp3';
import kaylaCall1 from '@/assets/health-call/kayla-1.mp3';
import kaylaCall2 from '@/assets/health-call/kayla-2.mp3';
import kaylaCall3 from '@/assets/health-call/kayla-3.mp3';
import kaylaCall4 from '@/assets/health-call/kayla-4.mp3';
import patientCall0 from '@/assets/health-call/patient-0.mp3';
import patientCall1 from '@/assets/health-call/patient-1.mp3';
import patientCall2 from '@/assets/health-call/patient-2.mp3';
import patientCall3 from '@/assets/health-call/patient-3.mp3';
import { Helmet } from 'react-helmet-async';
import ProprietaryNotice from './ProprietaryNotice';
import AskKayla from './AskKayla';
import {
  Activity, AlertTriangle, BrainCircuit, Calendar, ClipboardCheck, FileSearch, FileText,
  HeartPulse, FlaskConical, History, Send, Award, Video, Smartphone, Mic, MicOff, PhoneOff, MessageSquare, Network, Inbox, LayoutDashboard, TrendingUp, Target, Lock, Pill, Receipt, Search, ShieldCheck, Stethoscope, Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { EndPrivateSessionButton } from './PrivateSession';
import ExecutiveWalkthrough from './ExecutiveWalkthrough';
import ExecutiveNotePreview from './ExecutiveNotePreview';
import ChartPrep from './workspace/ChartPrep';
import CareGuide from './workspace/CareGuide';
import PriorAuthorization from './workspace/PriorAuthorization';
import PracticeImpact from './workspace/PracticeImpact';
import SpecialtyExamples from './workspace/SpecialtyExamples';
import EnterpriseReadiness from './EnterpriseReadiness';
import ClinicalSafetyPanel from './ClinicalSafetyPanel';
import DoctorDay from './workspace/DoctorDay';
import SamplePatientChart from './workspace/SamplePatientChart';
import MedicationReview from './workspace/MedicationReview';
import ClinicalDataExplorer from './workspace/ClinicalDataExplorer';
import ConnectionPreparation from './workspace/ConnectionPreparation';
import PatientCommunication from './workspace/PatientCommunication';
import BillingPreparation from './workspace/BillingPreparation';
import EnterpriseReliability from './workspace/EnterpriseReliability';
import DoctorEvaluation from './workspace/DoctorEvaluation';
import ExecutiveQuality from './workspace/ExecutiveQuality';
import FacilitySelector from './FacilitySelector';
import { DEFAULT_FACILITY_CONTEXT, resolveFacilityContext, type FacilityContext } from './workspace/facility-context';

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
  { key: 'ask-kayla', label: 'Ask Kayla', icon: MessageSquare },
  { key: 'doctor-day', label: 'Connected Doctor Day', icon: Calendar },
  { key: 'sample-chart', label: 'Expanded Sample Chart', icon: FileText },
  { key: 'medication-review', label: 'Medication Review Assistance', icon: Pill },
  { key: 'data-explorer', label: 'Clinical Data Explorer', icon: Search },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'inbox', label: 'Inbox & Tasks', icon: Inbox },
  { key: 'patients', label: 'Patient Charts', icon: Users },
  { key: 'labs', label: 'Lab Orders & Results', icon: FlaskConical },
  { key: 'rx', label: 'e-Prescriptions', icon: Pill },
  { key: 'video', label: 'Video Visits', icon: Video },
  { key: 'portal', label: 'Patient Communication', icon: Smartphone },
  { key: 'cme', label: 'CME Record Review', icon: FileSearch },
  { key: 'rpm', label: 'Remote Monitoring', icon: HeartPulse },
  { key: 'careplans', label: 'Chronic Care Plans', icon: Target },
  { key: 'voice', label: 'Kayla Voice Outreach', icon: MessageSquare },
  { key: 'referrals', label: 'Referrals', icon: Send },
  { key: 'auth', label: 'Prior Authorization', icon: ClipboardCheck },
  { key: 'billing', label: 'Billing Preparation', icon: Receipt },
  { key: 'reliability', label: 'Backup, Recovery & Migration', icon: ShieldCheck },
  { key: 'evaluation', label: 'Doctor Evaluation', icon: ClipboardCheck },
  { key: 'revenue', label: 'Practice Revenue', icon: TrendingUp },
  { key: 'impact', label: 'Practice Impact', icon: TrendingUp },
  { key: 'specialties', label: 'Specialty Examples', icon: Stethoscope },
  { key: 'quality', label: 'Executive Quality Overview', icon: Award },
  { key: 'interop', label: 'Clinical Connections', icon: Network },
  { key: 'audit', label: 'Activity Log', icon: History },
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

const PriorAuth = PriorAuthorization;

const Billing = BillingPreparation;

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

const INBOX = [
  { kind: 'Lab result', pri: 'Urgent', patient: 'Avery Example', text: 'Potassium 5.6 mmol/L (high). Kayla: on lisinopril + spironolactone — consider repeat BMP and dose review.', due: 'Today' },
  { kind: 'Refill request', pri: 'Normal', patient: 'Jordan Sample', text: 'Gabapentin 300 mg — flagged: 3rd early refill in 90 days. Review before signing.', due: 'Today' },
  { kind: 'Note to sign', pri: 'Normal', patient: 'Morgan Placeholder', text: 'Shoulder follow-up note drafted by Kayla from the visit. Ready for signature.', due: 'Today' },
  { kind: 'Patient message', pri: 'Normal', patient: 'Avery Example', text: '"My ankles are a little swollen this week." Kayla matched it to a 3 lb weight gain from home scale.', due: 'Today' },
  { kind: 'Lab result', pri: 'Routine', patient: 'Jordan Sample', text: 'A1c 6.9% (down from 7.4%). Within goal range — no action needed.', due: 'This week' },
  { kind: 'Prior auth update', pri: 'Routine', patient: 'Morgan Placeholder', text: 'Shoulder PT, 8 sessions — approved by Sample Commercial HMO.', due: 'This week' },
];
const priVariant = (p: string) => (p === 'Urgent' ? 'destructive' : p === 'Normal' ? 'secondary' : 'outline');

const InboxView = () => {
  const [done, setDone] = useState<number[]>([]);
  const open = INBOX.filter((_, i) => !done.includes(i)).length;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open items" value={String(open)} icon={Inbox} />
        <Stat label="Urgent" value="1" icon={AlertTriangle} />
        <Stat label="Notes to sign" value="1" icon={FileText} />
        <Stat label="Pre-sorted by Kayla" value="100%" icon={BrainCircuit} />
      </div>
      <Card><CardHeader><CardTitle className="text-base">Doctor's inbox — sorted by Kayla, most urgent first</CardTitle></CardHeader>
        <CardContent className="space-y-3">{INBOX.map((m, i) => (
          <div key={i} className={`flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between ${done.includes(i) ? 'opacity-40' : ''}`}>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2"><Badge variant={priVariant(m.pri)}>{m.pri}</Badge><span className="text-sm font-medium">{m.kind}</span><span className="text-sm text-muted-foreground">· {m.patient} · {m.due}</span></div>
              <p className="text-sm text-muted-foreground">{m.text}</p>
            </div>
            <Button size="sm" variant={done.includes(i) ? 'outline' : 'default'} onClick={() => setDone((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i])}>
              {done.includes(i) ? 'Undo' : 'Sign off'}</Button>
          </div>))}
        </CardContent></Card>
    </div>
  );
};

const CARE_PLANS = [
  { patient: 'Avery Example', program: 'CCM + RPM', conditions: 'Heart failure, Type 2 diabetes', minutes: 41, goal: 20, code: 'CPT 99490 + 99439',
    goals: [['Daily weight logged', 90], ['Sodium under 2 g/day', 70], ['A1c under 7.5%', 100]], next: 'Call Friday to review swelling and weight trend.' },
  { patient: 'Jordan Sample', program: 'CCM', conditions: 'Hypertension, Type 2 diabetes, chronic back pain', minutes: 24, goal: 20, code: 'CPT 99490',
    goals: [['Blood pressure under 130/80', 55], ['Walk 20 min, 5 days/week', 40], ['Reduce gabapentin use', 30]], next: 'Pain-management referral pending after CME exam.' },
  { patient: 'Morgan Placeholder', program: 'Not enrolled', conditions: 'Hypothyroidism', minutes: 0, goal: 20, code: '—',
    goals: [['TSH in normal range', 80]], next: 'Kayla: qualifies only with 2+ chronic conditions — not eligible yet.' },
];

const CarePlans = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Enrolled patients" value="2" icon={Users} />
      <Stat label="Care minutes this month" value="65" icon={Activity} />
      <Stat label="Billable this month" value="2 of 2" icon={Receipt} />
      <Stat label="Est. monthly CCM revenue" value="$186" icon={TrendingUp} />
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      {CARE_PLANS.map((c) => (
        <Card key={c.patient}><CardHeader className="space-y-1">
          <CardTitle className="text-base">{c.patient}</CardTitle>
          <div className="flex flex-wrap gap-2"><Badge variant={c.program === 'Not enrolled' ? 'outline' : 'secondary'}>{c.program}</Badge><span className="text-xs text-muted-foreground">{c.conditions}</span></div>
        </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><div className="mb-1 flex justify-between"><span>Care-team minutes</span><b>{c.minutes} / {c.goal} min</b></div>
              <Progress value={Math.min(100, (c.minutes / c.goal) * 100)} /></div>
            <div className="space-y-2"><p className="font-medium">Care-plan goals</p>
              {c.goals.map(([g, v]) => (<div key={g as string}><div className="mb-1 flex justify-between text-xs"><span>{g}</span><span>{v}%</span></div><Progress value={v as number} /></div>))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground"><span>Billing code</span><span>{c.code}</span></div>
            <p className="rounded-md border border-border p-2 text-xs"><BrainCircuit className="mr-1 inline h-3.5 w-3.5 text-mansagold" />{c.next}</p>
          </CardContent></Card>))}
    </div>
    <p className="text-xs text-muted-foreground">Sample figures for demonstration. Real reimbursement depends on payer, location and current-year fee schedules.</p>
  </div>
);

const REVENUE_MONTHS = [['May', 48], ['Jun', 52], ['Jul', 55], ['Aug', 51], ['Sep', 58], ['Oct', 62]] as const;

const Revenue = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Collected this month" value="$62,400" icon={TrendingUp} />
      <Stat label="Denial rate" value="7.8%" icon={AlertTriangle} />
      <Stat label="Days to get paid" value="31" icon={Calendar} />
      <Stat label="Recovered by Kayla appeals" value="$4,160" icon={BrainCircuit} />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-base">Monthly collections (thousands)</CardTitle></CardHeader>
        <CardContent><div className="flex h-48 items-end gap-3">
          {REVENUE_MONTHS.map(([m, v]) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">${v}k</span>
              <div className="w-full rounded-t-md bg-mansagold" style={{ height: `${(v / 62) * 100}%` }} />
              <span className="text-xs">{m}</span>
            </div>))}
        </div></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Top denial reasons</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[['Missing prior authorization', 42], ['Medical necessity', 27], ['Coding mismatch', 18], ['Eligibility / coverage', 13]].map(([r, v]) => (
            <div key={r as string}><div className="mb-1 flex justify-between"><span>{r}</span><span>{v}%</span></div><Progress value={v as number} /></div>))}
          <p className="text-muted-foreground">Kayla's suggestion: auto-checking prior authorization before scheduling could prevent about 4 in 10 denials.</p>
        </CardContent></Card>
    </div>
    <Card><CardHeader><CardTitle className="text-base">Money waiting to be collected</CardTitle></CardHeader>
      <CardContent><div className="grid gap-3 sm:grid-cols-4 text-sm">
        {[['0–30 days', '$38,900'], ['31–60 days', '$12,300'], ['61–90 days', '$5,100'], ['90+ days', '$2,750']].map(([b, v]) => (
          <div key={b} className="rounded-md border border-border p-3"><p className="text-muted-foreground">{b}</p><p className="text-lg font-semibold">{v}</p></div>))}
      </div><p className="mt-3 text-xs text-muted-foreground">All figures are fictional sample data for demonstration.</p></CardContent></Card>
  </div>
);

type LabRow = { test: string; value: string; range: string; flag: 'H' | 'L' | '' };
const LAB_PANELS: { patient: string; panel: string; date: string; status: string; rows: LabRow[]; kayla: string }[] = [
  { patient: 'Avery Example', panel: 'Basic Metabolic Panel (BMP)', date: 'Oct 14', status: 'Resulted', kayla: 'Potassium is high and kidney function dipped slightly. Likely related to lisinopril + spironolactone. Consider repeat BMP in 3–5 days and dose review.',
    rows: [{ test: 'Potassium', value: '5.6 mmol/L', range: '3.5–5.1', flag: 'H' }, { test: 'Sodium', value: '138 mmol/L', range: '135–145', flag: '' }, { test: 'Creatinine', value: '1.4 mg/dL', range: '0.6–1.2', flag: 'H' }, { test: 'Glucose', value: '128 mg/dL', range: '70–99', flag: 'H' }] },
  { patient: 'Jordan Sample', panel: 'Hemoglobin A1c', date: 'Oct 10', status: 'Resulted', kayla: 'A1c improved from 7.4% to 6.9% over 3 months. At goal — continue current plan.',
    rows: [{ test: 'Hemoglobin A1c', value: '6.9 %', range: '< 7.0 goal', flag: '' }] },
  { patient: 'Morgan Placeholder', panel: 'Thyroid Panel (TSH, Free T4)', date: 'Oct 15', status: 'Pending', kayla: 'Sample collected this morning. Results expected within 24 hours.', rows: [] },
];
const LAB_TESTS = ['Complete Blood Count (CBC)', 'Basic Metabolic Panel (BMP)', 'Lipid Panel', 'Hemoglobin A1c', 'Thyroid Panel (TSH)', 'Urinalysis'];

const Labs = () => {
  const [orders, setOrders] = useState<{ test: string; patient: string }[]>([]);
  const [test, setTest] = useState(LAB_TESTS[0]);
  const [patient, setPatient] = useState(PATIENTS[0].name);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Results to review" value="2" icon={FlaskConical} />
        <Stat label="Abnormal values" value="3" icon={AlertTriangle} />
        <Stat label="Pending" value={String(1 + orders.length)} icon={Calendar} />
        <Stat label="Explained by Kayla" value="100%" icon={BrainCircuit} />
      </div>
      <Card><CardHeader><CardTitle className="text-base">New lab order</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select value={patient} onChange={(e) => setPatient(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {PATIENTS.map((p) => <option key={p.id}>{p.name}</option>)}</select>
          <select value={test} onChange={(e) => setTest(e.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm">
            {LAB_TESTS.map((t) => <option key={t}>{t}</option>)}</select>
          <Button onClick={() => setOrders((o) => [...o, { test, patient }])}>Send order to lab</Button>
        </CardContent>
        {orders.length > 0 && <CardContent className="space-y-2 pt-0">{orders.map((o, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border border-border p-2 text-sm"><span>{o.test} · {o.patient}</span><Badge variant="secondary">Sent to Sample Lab</Badge></div>))}</CardContent>}
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        {LAB_PANELS.map((l) => (
          <Card key={l.panel}><CardHeader className="space-y-1">
            <CardTitle className="text-base">{l.panel}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{l.patient} · {l.date}</span><Badge variant={l.status === 'Pending' ? 'outline' : 'secondary'}>{l.status}</Badge></div>
          </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {l.rows.length > 0 && <table className="w-full"><thead className="text-left text-xs text-muted-foreground"><tr><th>Test</th><th>Result</th><th>Normal</th></tr></thead>
                <tbody>{l.rows.map((r) => (<tr key={r.test} className="border-t border-border">
                  <td className="py-1.5">{r.test}</td>
                  <td className={r.flag ? 'font-semibold text-destructive' : ''}>{r.value}{r.flag && ` (${r.flag})`}</td>
                  <td className="text-muted-foreground">{r.range}</td></tr>))}</tbody></table>}
              <p className="rounded-md border border-border p-2 text-xs"><BrainCircuit className="mr-1 inline h-3.5 w-3.5 text-mansagold" />{l.kayla}</p>
            </CardContent></Card>))}
      </div>
    </div>
  );
};

const RX = [
  { patient: 'Avery Example', drug: 'Lisinopril', dose: '20 mg, once daily', refills: 2, pharmacy: 'Sample Pharmacy #12', status: 'Active' },
  { patient: 'Avery Example', drug: 'Spironolactone', dose: '25 mg, once daily', refills: 1, pharmacy: 'Sample Pharmacy #12', status: 'Active' },
  { patient: 'Avery Example', drug: 'Metformin', dose: '1000 mg, twice daily', refills: 3, pharmacy: 'Sample Pharmacy #12', status: 'Active' },
  { patient: 'Jordan Sample', drug: 'Gabapentin', dose: '300 mg, three times daily', refills: 0, pharmacy: 'Sample Mail Order', status: 'Refill requested' },
  { patient: 'Jordan Sample', drug: 'Amlodipine', dose: '10 mg, once daily', refills: 4, pharmacy: 'Sample Mail Order', status: 'Active' },
  { patient: 'Morgan Placeholder', drug: 'Levothyroxine', dose: '75 mcg, once daily', refills: 5, pharmacy: 'Sample Pharmacy #3', status: 'Active' },
];
const INTERACTIONS = [
  { level: 'Major', patient: 'Avery Example', text: 'Lisinopril + Spironolactone can raise potassium. Today\'s potassium is 5.6 (high). Review before the next refill.' },
  { level: 'Caution', patient: 'Jordan Sample', text: 'Gabapentin: 3rd early refill request in 90 days. Check the state prescription-monitoring report before approving.' },
  { level: 'Caution', patient: 'Avery Example', text: 'Metformin: creatinine is 1.4. Confirm kidney function (eGFR) supports the current dose.' },
];

const Prescriptions = () => {
  const [sent, setSent] = useState<number[]>([]);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active prescriptions" value="6" icon={Pill} />
        <Stat label="Refill requests" value="1" icon={Inbox} />
        <Stat label="Interaction alerts" value="3" icon={AlertTriangle} />
        <Stat label="Sent to pharmacy today" value={String(sent.length)} icon={Receipt} />
      </div>
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-destructive" />Kayla safety alerts</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">{INTERACTIONS.map((a) => (
          <div key={a.text} className="flex gap-3 rounded-md border border-border p-3">
            <Badge variant={a.level === 'Major' ? 'destructive' : 'secondary'}>{a.level}</Badge>
            <p><b>{a.patient}:</b> {a.text}</p></div>))}
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Medication list</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-muted-foreground">
          <tr><th className="py-1">Patient</th><th>Medicine</th><th>Dose</th><th>Refills left</th><th>Pharmacy</th><th></th></tr></thead>
          <tbody>{RX.map((r, i) => (<tr key={i} className="border-t border-border">
            <td className="py-2">{r.patient}</td><td className="font-medium">{r.drug}</td><td>{r.dose}</td><td>{r.refills}</td>
            <td className="text-muted-foreground">{r.pharmacy}</td>
            <td className="text-right">{sent.includes(i)
              ? <Badge variant="outline">Sent ✓</Badge>
              : <Button size="sm" variant={r.status === 'Refill requested' ? 'default' : 'outline'} onClick={() => setSent((s) => [...s, i])}>
                  {r.status === 'Refill requested' ? 'Review & send refill' : 'Send to pharmacy'}</Button>}</td>
          </tr>))}</tbody></table>
          <p className="mt-3 text-xs text-muted-foreground">Demo only — nothing is sent to a real pharmacy. Live e-prescribing would connect through a certified network such as Surescripts.</p>
        </CardContent></Card>
    </div>
  );
};

const AUDIT = [
  { time: '8:14 AM', user: 'Dr. Sample (Physician)', action: 'Viewed chart', patient: 'Jordan Sample', detail: 'Opened CME record summary', flag: '' },
  { time: '8:21 AM', user: 'Kayla (AI Co-Pilot)', action: 'Generated summary', patient: 'Jordan Sample', detail: 'Built treatment timeline from 412 sample pages', flag: '' },
  { time: '8:40 AM', user: 'R. Example (Nurse)', action: 'Edited vitals', patient: 'Avery Example', detail: 'Weight 182 lb → 185 lb', flag: '' },
  { time: '9:02 AM', user: 'Dr. Sample (Physician)', action: 'Signed note', patient: 'Morgan Placeholder', detail: 'Shoulder follow-up note signed', flag: '' },
  { time: '9:15 AM', user: 'T. Placeholder (Billing)', action: 'Exported claim', patient: 'Avery Example', detail: 'Claim CLM-5004 appeal packet (PDF)', flag: '' },
  { time: '9:48 AM', user: 'J. Demo (Front desk)', action: 'Viewed chart', patient: 'Jordan Sample', detail: 'Opened full chart — not on today\'s assigned list', flag: 'Unusual access' },
  { time: '10:05 AM', user: 'Unknown device', action: 'Failed sign-in', patient: '—', detail: '3 failed attempts for account r.example — account locked', flag: 'Security' },
];

const AuditLog = () => {
  const [q, setQ] = useState('');
  const rows = AUDIT.filter((a) => `${a.user} ${a.action} ${a.patient} ${a.detail}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Events today" value="7" icon={History} />
        <Stat label="Charts opened" value="2" icon={Users} />
        <Stat label="Flagged by Kayla" value="2" icon={AlertTriangle} />
        <Stat label="Log can be edited" value="Never" icon={Lock} />
      </div>
      <Card><CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Who opened what, and when</CardTitle>
        <div className="flex gap-2"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search person, patient or action" className="sm:w-72" />
          <Button variant="outline" size="sm">Export report</Button></div>
      </CardHeader>
        <CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-muted-foreground">
          <tr><th className="py-1">Time</th><th>Person</th><th>Action</th><th>Patient</th><th>Details</th><th></th></tr></thead>
          <tbody>{rows.map((a, i) => (<tr key={i} className="border-t border-border">
            <td className="py-2 whitespace-nowrap">{a.time}</td><td>{a.user}</td><td className="font-medium">{a.action}</td><td>{a.patient}</td>
            <td className="text-muted-foreground">{a.detail}</td>
            <td>{a.flag && <Badge variant="destructive">{a.flag}</Badge>}</td></tr>))}</tbody></table>
          <p className="mt-3 text-xs text-muted-foreground">Sample events. In the live system every view, edit, export and sign-in would be recorded automatically and kept for at least 6 years.</p>
        </CardContent></Card>
    </div>
  );
};

const Interop = ConnectionPreparation;

const VideoVisits = () => {
  const [inCall, setInCall] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const visits = [
    { time: '1:00 PM', patient: 'Avery Example', reason: 'Swelling + weight check (RPM follow-up)', status: 'Waiting room' },
    { time: '1:30 PM', patient: 'Morgan Placeholder', reason: 'Thyroid lab review', status: 'Checked in' },
    { time: '2:15 PM', patient: 'Jordan Sample', reason: 'Medication review', status: 'Scheduled' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Video visits today" value="3" icon={Video} />
        <Stat label="In waiting room" value="1" icon={Users} />
        <Stat label="Avg. wait" value="2 min" icon={Calendar} />
        <Stat label="Notes drafted by Kayla" value="Auto" icon={BrainCircuit} />
      </div>
      {inCall ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2"><CardContent className="p-4">
            <div className="relative flex aspect-video items-center justify-center rounded-lg border border-border bg-muted">
              <div className="text-center"><div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-mansagold/20 text-2xl font-semibold text-mansagold">
                {inCall.split(' ').map((w) => w[0]).join('')}</div>
                <p className="font-medium">{inCall}</p><p className="text-sm text-muted-foreground">Sample video visit · 04:12</p></div>
              <div className="absolute bottom-3 right-3 flex h-20 w-28 items-center justify-center rounded-md border border-border bg-card text-xs text-muted-foreground">You</div>
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setMuted(!muted)} aria-label="Mute">{muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>
              <Button variant="destructive" onClick={() => setInCall(null)}><PhoneOff className="mr-2 h-4 w-4" />End visit</Button>
            </div>
          </CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-4 w-4 text-mansagold" />Kayla live note</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><b>Subjective:</b> Patient reports mild ankle swelling for 5 days.</p>
              <p><b>Objective:</b> Home scale +3 lb in 7 days; BP 132/84 (home cuff).</p>
              <p><b>Assessment:</b> Possible fluid retention, heart failure.</p>
              <p><b>Plan:</b> Doctor to decide — Kayla suggests repeat BMP and diuretic review.</p>
              <p className="text-xs text-muted-foreground">Draft only. The doctor reviews and signs.</p>
            </CardContent></Card>
        </div>
      ) : (
        <Card><CardHeader><CardTitle className="text-base">Today's video visits</CardTitle></CardHeader>
          <CardContent className="space-y-3">{visits.map((v) => (
            <div key={v.time} className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-medium">{v.patient} <span className="text-sm text-muted-foreground">· {v.time}</span></p><p className="text-sm text-muted-foreground">{v.reason}</p></div>
              <div className="flex items-center gap-2"><Badge variant={v.status === 'Waiting room' ? 'destructive' : 'outline'}>{v.status}</Badge>
                <Button size="sm" onClick={() => setInCall(v.patient)}><Video className="mr-2 h-4 w-4" />Start video visit</Button></div>
            </div>))}
            <p className="text-xs text-muted-foreground">Demo only — no camera or real call is used. A live version would use a healthcare-grade video service with a signed agreement.</p>
          </CardContent></Card>
      )}
    </div>
  );
};

const PatientPortal = PatientCommunication;

const REFERRAL_STEPS = ['Sent', 'Received', 'Scheduled', 'Seen', 'Report back'];
const INITIAL_REFERRALS = [
  { patient: 'Jordan Sample', to: 'Pain Management · Dr. Example', reason: 'Chronic low back pain after accident', step: 2, packet: 'MRI, CME summary, med list' },
  { patient: 'Avery Example', to: 'Cardiology · Sample Heart Center', reason: 'Heart failure follow-up', step: 4, packet: 'Echo, BMP, weight trend' },
  { patient: 'Morgan Placeholder', to: 'Physical Therapy · Sample PT', reason: 'Shoulder strain', step: 3, packet: 'Visit note, prior auth approval' },
];
const SPECIALTIES = ['Cardiology', 'Endocrinology', 'Orthopedics', 'Pain Management', 'Neurology', 'Physical Therapy'];

const Referrals = () => {
  const [list, setList] = useState(INITIAL_REFERRALS);
  const [patient, setPatient] = useState(PATIENTS[0].name);
  const [spec, setSpec] = useState(SPECIALTIES[0]);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open referrals" value={String(list.filter((r) => r.step < 4).length)} icon={Send} />
        <Stat label="Waiting on specialist" value="1" icon={Calendar} />
        <Stat label="Reports received" value={String(list.filter((r) => r.step === 4).length)} icon={FileText} />
        <Stat label="Packets built by Kayla" value="Auto" icon={BrainCircuit} />
      </div>
      <Card><CardHeader><CardTitle className="text-base">New referral</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select value={patient} onChange={(e) => setPatient(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">{PATIENTS.map((p) => <option key={p.id}>{p.name}</option>)}</select>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm">{SPECIALTIES.map((x) => <option key={x}>{x}</option>)}</select>
          <Button onClick={() => setList((l) => [{ patient, to: `${spec} · Sample Specialist`, reason: 'New referral', step: 0, packet: 'Kayla attached recent notes, labs and med list' }, ...l])}>Send referral</Button>
        </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Referral tracker</CardTitle></CardHeader>
        <CardContent className="space-y-4">{list.map((r, i) => (
          <div key={i} className="space-y-3 rounded-md border border-border p-3">
            <div className="flex flex-col justify-between gap-1 sm:flex-row"><div><p className="font-medium">{r.patient} → {r.to}</p><p className="text-sm text-muted-foreground">{r.reason}</p></div>
              <p className="text-xs text-muted-foreground">Packet: {r.packet}</p></div>
            <div className="flex gap-1">{REFERRAL_STEPS.map((st, j) => (
              <div key={st} className="flex-1"><div className={`h-1.5 rounded-full ${j <= r.step ? 'bg-mansagold' : 'bg-muted'}`} /><p className={`mt-1 text-[11px] ${j <= r.step ? '' : 'text-muted-foreground'}`}>{st}</p></div>))}</div>
          </div>))}
          <p className="text-xs text-muted-foreground">Demo only — nothing is sent to a real specialist.</p>
        </CardContent></Card>
    </div>
  );
};

const CAMPAIGNS = [
  { name: 'After-hospital check-in calls', who: 'Patients home from the hospital in the last 7 days', calls: 46, done: 91 },
  { name: 'Monthly chronic care calls', who: 'Care-plan patients (counts toward care minutes)', calls: 128, done: 84 },
  { name: 'Overdue screening reminders', who: 'Patients with open care gaps', calls: 97, done: 76 },
  { name: 'Appointment confirmations', who: 'Everyone booked in the next 48 hours', calls: 69, done: 88 },
];

const CALL_SCRIPT: { who: 'Kayla' | 'Patient' | 'Flag'; text: string }[] = [
  { who: 'Kayla', text: "Hi, this is Kayla calling from your doctor's office. Am I speaking with Avery?" },
  { who: 'Patient', text: 'Yes, this is Avery.' },
  { who: 'Kayla', text: 'For your privacy, can you please confirm your date of birth?' },
  { who: 'Patient', text: "Sure. It's March 4th, 1960. (sample)" },
  { who: 'Kayla', text: "Thank you. You came home from the hospital last week. How are you feeling — better, the same, or worse?" },
  { who: 'Patient', text: 'A little better, but my ankles are more swollen than yesterday.' },
  { who: 'Kayla', text: 'Thank you for telling me. Did you weigh yourself this morning?' },
  { who: 'Patient', text: 'Yes — 170 pounds. It was 166 two days ago.' },
  { who: 'Flag', text: 'Safety rule triggered: weight up 4 lb in 2 days + new swelling. Escalating to the nurse.' },
  { who: 'Kayla', text: "That change matters, so I'm connecting you with Nurse Taylor right now. Please stay on the line." },
];

const KAYLA_AUDIO = [kaylaCall0, kaylaCall1, kaylaCall2, kaylaCall3, kaylaCall4];
const PATIENT_AUDIO = [patientCall0, patientCall1, patientCall2, patientCall3];

const VoiceOutreach = () => {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const runId = React.useRef(0);
  const shown = CALL_SCRIPT.slice(0, step);
  const finished = step >= CALL_SCRIPT.length;
  React.useEffect(() => () => { runId.current += 1; audioRef.current?.pause(); }, []);
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const playLine = (src: string) => new Promise<void>((resolve) => {
    const a = new Audio(src); audioRef.current = a;
    a.onended = () => resolve(); a.onerror = () => resolve();
    a.play().catch(() => resolve());
  });
  const start = async () => {
    const id = ++runId.current;
    audioRef.current?.pause();
    setStep(0); setRunning(true);
    let k = 0; let pk = 0;
    await wait(400);
    for (let i = 0; i < CALL_SCRIPT.length; i++) {
      if (runId.current !== id) return;
      setStep(i + 1);
      if (CALL_SCRIPT[i].who === 'Kayla') {
        setSpeaking(true);
        await playLine(KAYLA_AUDIO[k++]);
        setSpeaking(false);
        await wait(500);
      } else if (CALL_SCRIPT[i].who === 'Patient') {
        setSpeaking(true);
        await playLine(PATIENT_AUDIO[pk++]);
        setSpeaking(false);
        await wait(500);
      } else {
        await wait(1600);
      }
    }
    if (runId.current === id) setRunning(false);
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Calls completed this week" value="340" icon={MessageSquare} />
        <Stat label="Handled without staff" value="82%" icon={BrainCircuit} />
        <Stat label="Staff hours saved" value="41 hrs" icon={TrendingUp} />
        <Stat label="Sent to a nurse" value="12" icon={AlertTriangle} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Active call campaigns (sample)</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">{CAMPAIGNS.map((c) => (
            <div key={c.name}>
              <div className="mb-1 flex items-center justify-between gap-2"><span><b>{c.name}</b><span className="block text-xs text-muted-foreground">{c.who}</span></span>
                <span className="text-right"><b>{c.calls}</b> calls<span className="block text-xs text-muted-foreground">{c.done}% reached</span></span></div>
              <Progress value={c.done} /></div>))}
          </CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-mansagold" />Safety rules Kayla always follows</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Confirms identity before sharing anything.</p>
            <p>• Chest pain or trouble breathing → tells patient to call 911 and alerts staff.</p>
            <p>• Weight up 3+ lb in 2 days (heart failure) → nurse transfer.</p>
            <p>• Never diagnoses or changes medicine.</p>
            <p>• Patient can ask for a human at any time.</p>
          </CardContent></Card>
      </div>
      <Card><CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-base">Sample call: Avery Example — after-hospital check-in</CardTitle>
          <Button size="sm" onClick={start} disabled={running}>{running ? 'Call in progress…' : finished ? 'Replay sample call' : 'Simulate patient call'}</Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2 text-sm lg:col-span-2">
            {shown.length === 0 && <p className="text-muted-foreground">Press "Simulate patient call" to watch Kayla make a check-in call.</p>}
            {shown.map((l, i) => l.who === 'Flag'
              ? <p key={i} className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-destructive"><AlertTriangle className="mr-1 inline h-4 w-4" />{l.text}</p>
              : <p key={i}><b className={l.who === 'Kayla' ? 'text-mansagold' : ''}>{l.who}:</b> {l.text}{speaking && i === shown.length - 1 && <span className="ml-2 animate-pulse text-xs text-mansagold">● speaking</span>}</p>)}
          </div>
          <div className="rounded-md border p-3 text-sm">
            <p className="mb-2 font-semibold">Saved to Avery's chart automatically</p>
            {finished ? (<div className="space-y-1">
              <p>• Symptom: new ankle swelling</p><p>• Weight: 170 lb (up 4 lb in 2 days)</p>
              <p>• Medicines: taking as prescribed</p><p>• Action: warm transfer to nurse</p>
              <p>• Task added to doctor's Inbox</p></div>)
              : <p className="text-muted-foreground">Notes appear here when the call ends.</p>}
          </div>
        </CardContent></Card>
      <p className="text-xs text-muted-foreground">Demo only — no real phone calls are made. All patients and numbers are fictional. Live calling would require a healthcare-grade phone service with a signed agreement.</p>
    </div>
  );
};

const VIEWS: Record<Exclude<ModuleKey, 'ask-kayla'>, React.FC> = { 'data-explorer': ClinicalDataExplorer, evaluation: DoctorEvaluation, reliability: EnterpriseReliability, 'medication-review': MedicationReview, 'sample-chart': SamplePatientChart, 'doctor-day': DoctorDay, specialties: SpecialtyExamples, dashboard: Dashboard, inbox: InboxView, labs: Labs, rx: Prescriptions, careplans: CarePlans, revenue: Revenue, impact: PracticeImpact, patients: Patients, cme: CME, rpm: RPM, auth: PriorAuth, billing: Billing, compliance: Compliance, audit: AuditLog, interop: Interop, video: VideoVisits, portal: PatientPortal, referrals: Referrals, quality: ExecutiveQuality, voice: VoiceOutreach };

export default function HealthDemoPage() {
  const [facilityContext, setFacilityContext] = useState<FacilityContext>(DEFAULT_FACILITY_CONTEXT);
  const { facility } = resolveFacilityContext(facilityContext);
  const [mod, setMod] = useState<ModuleKey>('dashboard');
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [tourRevision, setTourRevision] = useState(0);
  const [navigationSearch, setNavigationSearch] = useState('');
  const searchMatches = navigationSearch.trim() ? MODULES.filter(module => module.label.toLowerCase().includes(navigationSearch.trim().toLowerCase())) : [];
  const View = mod === 'ask-kayla' ? null : VIEWS[mod];
  const current = MODULES.find((m) => m.key === mod) ?? MODULES[0];
  return (
    <div className="theme-clinical dark flex min-h-screen flex-col">
      <Helmet><title>1325 Clinical — Investor Demo | 1325.AI</title>
        <meta name="description" content="Investor preview of 1325 Clinical, a planned AI-powered health record system by 1325.AI. Sample data only." /></Helmet>
      <div className="flex items-center justify-center gap-2 border-b border-mansagold/30 bg-mansagold/10 px-4 py-1.5 text-center text-xs font-medium tracking-wide text-mansagold">
        <Lock className="h-3.5 w-3.5" /> INVESTOR DEMO · Fictional sample data · Not yet approved for real patient records
      </div>
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-4 border-b-2 border-mansagold theme-clinical-bar px-6 py-3 shadow-lg text-foreground">
        <div className="flex items-center gap-3">
          <img src={logo1325} alt="1325.AI logo" className="h-10 w-10 rounded-lg object-contain" />
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight text-mansagold">1325 Clinical</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-mansagold/70">Enterprise Edition · by 1325.AI</p>
          </div>
        </div>
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-9 border-mansagold/30 bg-background/40 pl-9" aria-label="Search sample sections" placeholder="Search sample sections…" value={navigationSearch} onChange={event => setNavigationSearch(event.target.value)} />
          {navigationSearch.trim() && <div className="absolute left-0 right-0 top-11 z-50 border bg-card p-2 shadow-lg">
            {searchMatches.length ? searchMatches.map(module => <Button key={module.key} variant="ghost" className="h-auto w-full justify-start whitespace-normal text-left" onClick={() => { setMod(module.key); setTourStep(null); setTourRevision(revision => revision + 1); setNavigationSearch(''); }}>{module.label}</Button>) : <p className="p-2 text-sm text-muted-foreground">No matching sample sections</p>}
          </div>}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden gap-1 border-mansagold/60 text-mansagold sm:flex"><ShieldCheck className="h-3 w-3" />Sample workspace</Badge>
          <EnterpriseReadiness />
          <ClinicalSafetyPanel />
          <a href="/health/app" className="rounded-md bg-mansagold px-3 py-1.5 text-xs font-semibold text-mansablue hover:bg-mansagold-dark">Open live workspace</a>
        </div>
      </header>
      <FacilitySelector value={facilityContext} onChange={(next) => { setFacilityContext(next); setTourStep(null); setTourRevision((revision) => revision + 1); }} />
      <div className="flex flex-1 flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card/80 p-3 backdrop-blur md:w-64 md:flex-col md:border-b-0 md:border-r md:p-4">
          <p className="hidden px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:block">Workspace</p>
          {MODULES.map(({ key, label, icon: Icon }) => (
            <Button variant="ghost" key={key} onClick={() => { setMod(key); setTourStep(null); setTourRevision((revision) => revision + 1); }}
              className={`flex h-auto shrink-0 justify-start gap-3 whitespace-normal rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${mod === key && tourStep === null ? 'border-l-2 border-mansagold bg-mansagold/10 text-foreground' : 'border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              <Icon className={`h-4 w-4 ${mod === key && tourStep === null ? 'text-mansagold' : ''}`} />{label}</Button>))}
          <div className="mt-auto hidden rounded-lg border border-mansagold/40 bg-mansagold/5 p-3 md:block">
            <p className="flex items-center gap-2 text-xs font-semibold"><BrainCircuit className="h-4 w-4 text-mansagold" />Kayla Clinical AI</p>
            <p className="mt-1 text-xs text-muted-foreground">Organizes records. Doctors make every medical decision.</p>
          </div>
          <EndPrivateSessionButton className="hidden w-full justify-start border-t border-border pt-3 md:flex" />
        </nav>
        <main className="min-w-0 flex-1 p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">health.1325.ai</p>
              <h1 className="mt-1 text-2xl font-semibold">{tourStep === null ? current.label : 'Executive walkthrough'}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{facility.name} · {facilityContext.department} · Fictional</p>
          </div>
          <ExecutiveWalkthrough key={tourRevision} onStep={(_, step) => setTourStep(step)} onEnd={() => setTourStep(null)} />
          <div key={`${facilityContext.facilityId}:${facilityContext.department}`}>{tourStep === 0 ? <ChartPrep /> : tourStep === 1 || tourStep === 2 ? <ExecutiveNotePreview review={tourStep === 2} /> : tourStep === 3 ? <CareGuide /> : mod === 'ask-kayla' ? <AskKayla surface="demo" onNavigate={(next) => { const target = MODULES.find(module => module.key === next); if (!target) return; setMod(target.key); setTourStep(null); setTourRevision(revision => revision + 1); }} /> : mod === 'quality' ? <ExecutiveQuality facilityContext={facilityContext} onNavigate={(next) => { setMod(next); setTourStep(null); setTourRevision((revision) => revision + 1); }} /> : View ? <View /> : null}</div>
        </main>
      </div>
      <footer className="space-y-2 border-t border-border bg-card px-6 py-4 text-[11px] leading-relaxed text-muted-foreground">
        <ProprietaryNotice />
        <p>This preview shows planned features with fictional data. It is not a medical device and is not yet approved for protected health information.</p>
      </footer>
    </div>
  );
}
