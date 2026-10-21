import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const WORKDAYS_PER_MONTH = 20;

export function estimateHours(doctors: number, adminHoursPerDay: number, goalPercent: number) {
  const current = doctors * adminHoursPerDay * WORKDAYS_PER_MONTH;
  return { current, returned: Math.round(current * goalPercent / 100) };
}

function Wrap({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-6 py-16">
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
    </div>
    {children}
  </section>;
}

function Range({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void }) {
  return <div>
    <div className="mb-3 flex justify-between text-sm"><span>{label}</span><span className="font-semibold text-primary">{value} {unit}</span></div>
    <Slider aria-label={label} value={[value]} min={min} max={max} step={step} onValueChange={v => onChange(v[0])} />
  </div>;
}

export function TimeCalculator() {
  const [doctors, setDoctors] = useState(5);
  const [hours, setHours] = useState(2);
  const [goal, setGoal] = useState(30);
  const { current, returned } = estimateHours(doctors, hours, goal);
  return <Wrap eyebrow="Time calculator" title="How much doctor time goes to paperwork?" intro="Enter your own numbers. This is a planning estimate, not a promise or a measured result.">
    <div className="grid gap-8 rounded-lg border border-border bg-card p-8 md:grid-cols-2">
      <div className="space-y-8">
        <Range label="Doctors" value={doctors} min={1} max={50} unit="" onChange={setDoctors} />
        <Range label="Paperwork hours per doctor, per day" value={hours} min={0.5} max={4} step={0.5} unit="hrs" onChange={setHours} />
        <Range label="Share you hope to hand back (your goal)" value={goal} min={5} max={60} step={5} unit="%" onChange={setGoal} />
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border border-border p-6"><p className="text-sm text-muted-foreground">Paperwork hours per month today</p><p className="mt-2 text-4xl font-semibold">{current.toLocaleString()}</p></div>
        <div className="rounded-lg border border-primary/50 p-6"><p className="text-sm text-muted-foreground">Hours back to patients at your goal</p><p className="mt-2 text-4xl font-semibold text-primary">{returned.toLocaleString()}</p></div>
        <p className="text-xs text-muted-foreground">Based on {WORKDAYS_PER_MONTH} workdays a month. A supervised pilot is how real results would be measured.</p>
      </div>
    </div>
  </Wrap>;
}

const rows = [
  ['Orders', 'Doctor clicks through each order screen by hand.', 'Doctor says it once; drafts wait for batch review and signature.'],
  ['Visit notes', 'Notes typed after the visit, often at night.', 'Draft note linked to what was said; the doctor signs or rejects.'],
  ['Inbox', 'Every message and result lands on the doctor.', 'Rules the doctor approves route routine items to staff.'],
  ['Missing facts', 'Gaps can be filled by assumption.', 'Missing information is marked “Unknown” — never guessed.'],
];

export function WorkflowComparison() {
  return <Wrap eyebrow="Side by side" title="Typical workflow today vs. 1325 Clinical." intro="The article we reference describes doctors spending 14 to 62 clicks on tasks staff once handled. Here is the different approach we are building.">
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-3 bg-secondary/40 p-4 text-sm font-semibold md:grid"><span>Task</span><span>Typical today</span><span className="text-primary">1325 Clinical (preview)</span></div>
      {rows.map(([task, old, next]) => <div key={task} className="grid gap-2 border-t border-border p-4 md:grid-cols-3">
        <span className="font-semibold">{task}</span><span className="text-muted-foreground">{old}</span><span>{next}</span>
      </div>)}
    </div>
    <p className="mt-4 text-xs text-muted-foreground">Shown with fictional data. Sending orders or messages stays locked in the preview.</p>
  </Wrap>;
}

const steps = [
  ['Confidential preview', 'A personally approved, watermarked 20-minute tour using fictional patients.'],
  ['Workflow mapping', 'We map your specialty’s daily work against sample charts.'],
  ['Supervised trial', 'A physician-reviewed trial — only after legal, vendor and security clearance.'],
  ['Staged rollout', 'Expand step by step, only where results justify it.'],
];

export function PilotRoadmap() {
  return <Wrap eyebrow="Pilot roadmap" title="Four steps. No overnight switch." intro="1325 Clinical is designed to work alongside your current records system, not rip it out.">
    <ol className="grid gap-6 md:grid-cols-4">
      {steps.map(([t, d], i) => <li key={t} className="rounded-lg border border-border bg-card p-6">
        <span className="text-3xl font-semibold text-primary">{i + 1}</span>
        <h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p>
      </li>)}
    </ol>
    <p className="mt-4 text-xs text-muted-foreground">Steps 3 and 4 are not available yet. Real patient records are not used until clearance is confirmed.</p>
  </Wrap>;
}

const faqs = [
  ['Does this replace our current records system?', 'No. It is being designed as a workflow layer that sits alongside existing systems. Live connections are not active in the preview.'],
  ['How is patient safety protected?', 'Nothing is final until a physician reviews and signs it. Every AI statement links to its source, and missing facts stay “Unknown.”'],
  ['What is the HIPAA and regulatory status?', 'It is a private preview using fictional data only. It is not HIPAA-certified or a complete records system. Real records will only be used after legal agreements, vendor coverage and safeguards are confirmed.'],
  ['What do the 42 Agentic AI Employees do?', 'They are the Agentic AI workforce across the 1325.AI platform, led by Kayla. In this clinical preview, only sample workflows run — none make medical decisions.'],
  ['How can we join an early pilot?', 'Request a confidential preview. Each request is personally reviewed, and pilot terms are discussed after the preview.'],
];

export function ExecutiveFaq() {
  return <Wrap eyebrow="Executive FAQ" title="Straight answers for decision-makers." intro="The questions clinic owners and hospital leaders ask first.">
    <Accordion type="single" collapsible className="rounded-lg border border-border bg-card px-6">
      {faqs.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger className="text-left">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>)}
    </Accordion>
  </Wrap>;
}

export function LostTeamStory({ photo }: { photo: string }) {
  return <Wrap eyebrow="Why doctors became typists" title="Imagine a head chef forced to wash the dishes." intro="Hospitals once had unit clerks who turned a doctor's spoken decision into routed orders, calls and forms. When computer order entry arrived, many of those roles disappeared — and the clerical work landed on the doctor.">
    <div className="grid items-center gap-8 md:grid-cols-2">
      <img src={photo} alt="Illustrative unit clerk handing prepared order forms to a physician" width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
      <ul className="space-y-4 text-muted-foreground">
        <li><strong className="text-foreground">Then:</strong> the doctor decided; the team prepared the paperwork.</li>
        <li><strong className="text-foreground">Now:</strong> the doctor clicks, routes, answers the inbox and charts at night.</li>
        <li><strong className="text-foreground">1325 Clinical's goal:</strong> rebuild that team digitally — staff and Kayla, an Agentic AI assistant, prepare; the doctor reviews and signs.</li>
      </ul>
    </div>
  </Wrap>;
}

const NOTE = [
  { text: 'Low back pain improved since last visit.', line: 2 },
  { text: 'Strength is 5 out of 5 in both legs.', line: 4 },
  { text: 'Continue home stretching program.', line: 5 },
];
const TRANSCRIPT = ['Doctor: How is your back doing?', 'Patient: Much better than last time.', 'Doctor: Push against my hands with both legs.', 'Doctor: Strength is five out of five in both legs.', 'Doctor: Keep doing the stretches at home.'];

export function EvidenceDemo() {
  const [line, setLine] = useState<number | null>(null);
  return <Wrap eyebrow="Try it" title="Click a sentence. See where it came from." intro="Every line of a draft note links back to the exact words in the visit. Doctors check the evidence instead of trusting the AI.">
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Draft visit note (fictional)</h3>
        <ul className="space-y-2">{NOTE.map(n => <li key={n.line}><button type="button" onClick={() => setLine(n.line)} className={`w-full rounded-md border p-3 text-left text-sm transition-colors ${line === n.line ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>{n.text} <span className="ml-1 text-xs text-primary">Source L{n.line}</span></button></li>)}</ul>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Visit transcript (fictional)</h3>
        <ol className="space-y-2 text-sm">{TRANSCRIPT.map((t, i) => <li key={t} className={`rounded p-2 ${line === i + 1 ? 'bg-primary/15' : ''}`}><span className="mr-2 text-primary">L{i + 1}</span>{t}</li>)}</ol>
        {line === null && <p className="mt-4 text-xs text-muted-foreground">Select a sentence on the left.</p>}
      </div>
    </div>
  </Wrap>;
}

export function UnknownExample() {
  return <Wrap eyebrow="Missing means Unknown" title="The absence of evidence is not evidence of absence." intro="Many AI tools fill gaps to make a summary look complete. 1325 Clinical flags them so the doctor addresses them.">
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-border p-6"><p className="text-sm text-muted-foreground">A guessing summary might say</p><p className="mt-2 text-lg line-through decoration-destructive">Allergies: No known allergies</p></div>
      <div className="rounded-lg border border-primary/50 p-6"><p className="text-sm text-muted-foreground">1325 Clinical says</p><p className="mt-2 text-lg font-semibold text-primary">Allergies: Unknown — not found in the record</p></div>
    </div>
    <p className="mt-4 text-sm text-muted-foreground">Undated items are listed separately at the end of the timeline instead of being given a guessed date.</p>
  </Wrap>;
}

export function NoRipAndReplace({ photo }: { photo: string }) {
  const risks = ['Downtime and paper fallback', 'Retraining every department', 'Billing disruption', 'Data migration risk', 'Rebuilding outside connections'];
  return <Wrap eyebrow="For hospital leaders" title="Why not just replace your records system?" intro="Replacing a hospital's records system has been compared to changing the engines on a plane mid-flight. 1325 Clinical is designed to sit alongside your current system instead.">
    <div className="grid items-center gap-8 md:grid-cols-2">
      <img src={photo} alt="Illustrative hospital leadership team reviewing plans in an operations center" width={1536} height={1024} loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
      <div>
        <h3 className="font-semibold">Risks a full replacement brings</h3>
        <ul className="mt-3 space-y-2 text-muted-foreground">{risks.map(r => <li key={r}>• {r}</li>)}</ul>
        <p className="mt-5 text-muted-foreground">Your current system keeps billing, registration and beds. 1325 Clinical is being built to take on the preparation work — so leaders can test whether it helps before taking on bigger risks.</p>
      </div>
    </div>
    <p className="mt-4 text-xs text-muted-foreground">Live connections and inpatient workflows are not available in the preview.</p>
  </Wrap>;
}

export function TraceabilityNotSafety() {
  return <Wrap eyebrow="An honest line" title="Proving the source is not a safety check." intro="A source label proves where a fact came from. It does not check drug interactions, doses or risk.">
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-6"><h3 className="font-semibold">What source labels do</h3><p className="mt-2 text-sm text-muted-foreground">Show the exact transcript line or record excerpt behind every statement.</p></div>
      <div className="rounded-lg border border-border bg-card p-6"><h3 className="font-semibold">What they don't do</h3><p className="mt-2 text-sm text-muted-foreground">No risk scores, interaction screening or clinical clearance. Medical judgment stays 100% with the physician.</p></div>
    </div>
  </Wrap>;
}

const ROAD = ['Signed patient-privacy agreements (BAAs) with each vendor', 'Independent security and backup/recovery reviews', 'Attorney approval of terms', 'Independent testing with practicing physicians', 'A process to report and contain harmful output'];

export function RoadToRealPatients() {
  return <Wrap eyebrow="The road to real patients" title="What must happen before real patient data is used." intro="None of these are complete today. Until they are, the preview uses fictional data only.">
    <ol className="grid gap-4 md:grid-cols-5">{ROAD.map((r, i) => <li key={r} className="rounded-lg border border-border bg-card p-5"><span className="text-2xl font-semibold text-primary">{i + 1}</span><p className="mt-2 text-sm">{r}</p><p className="mt-3 text-xs text-muted-foreground">Status: not yet complete</p></li>)}</ol>
    <p className="mt-4 text-xs text-muted-foreground">A finished checklist alone does not authorize real records. BAA = business associate agreement under HIPAA.</p>
  </Wrap>;
}

export function EpicComparison() {
  const rows = [
    ['Autonomous Delegation vs. Manual Clicking', 'In many large legacy records systems, doctors enter orders and notes field by field.', 'The doctor says it once; Kayla and the team prepare drafts the doctor reviews and signs.'],
    ['Instant Cloud vs. Overnight Syncs', 'Many legacy setups share data through scheduled batch exports, often overnight.', 'Cloud-based by design, so updates are planned to appear as soon as they are reviewed.'],
  ];
  return <Wrap eyebrow="Comparison" title="Epic vs. 1325 Clinical" intro="Two differences clinic leaders ask about most.">
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="hidden grid-cols-3 gap-4 border-b border-border bg-card/60 p-4 text-sm font-semibold md:grid"><span /><span>Typical legacy records system</span><span className="text-primary">1325 Clinical</span></div>
      {rows.map(([title, legacy, ours]) => <div key={title} className="grid gap-3 border-b border-border p-4 last:border-b-0 md:grid-cols-3 md:gap-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground"><span className="font-medium md:hidden">Legacy: </span>{legacy}</p>
        <p className="text-sm"><span className="font-medium text-primary md:hidden">1325 Clinical: </span>{ours}</p>
      </div>)}
    </div>
    <p className="mt-4 text-xs text-muted-foreground">General industry patterns, not a review of any specific installation. Epic is a trademark of its owner; 1325.AI is not affiliated with Epic Systems. 1325 Clinical features shown are fictional-sample demonstrations.</p>
  </Wrap>;
}

export function OpenStandards() {
  const points = [
    ['Designed around FHIR', 'FHIR (Fast Healthcare Interoperability Resources) is the open standard medical software uses to share records.'],
    ['Built to avoid vendor lock-in', 'Your clinic’s data is planned to be exportable in standard formats.'],
    ['Standard, documented connections', 'Planned connections follow published standards rather than private, custom formats.'],
  ];
  return <Wrap eyebrow="Interoperability" title="Open standards. No lock-in." intro="How 1325 Clinical is being built to work with labs, pharmacies and other records systems.">
    <dl className="grid gap-6 md:grid-cols-3">{points.map(([t, d]) => <div key={t} className="rounded-lg border border-border bg-card p-6"><dt className="font-semibold">{t}</dt><dd className="mt-2 text-sm text-muted-foreground">{d}</dd></div>)}</dl>
    <p className="mt-4 text-xs text-muted-foreground">Planned for after healthcare clearance. No live connections today, and no FHIR certification or vendor partnership is claimed.</p>
  </Wrap>;
}
