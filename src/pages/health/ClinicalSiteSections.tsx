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
