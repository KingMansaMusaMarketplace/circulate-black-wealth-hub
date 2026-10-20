import { useEffect, useState } from 'react';
import { Check, HelpCircle, Mic } from 'lucide-react';

// Silent, code-drawn rehearsal loop using the fixed fictional Delegation Desk sample. No microphone, no data.
const SPOKEN = 'PET scan in three months, serum PSA before the next visit, ondansetron 4 mg as needed for nausea.';
const DRAFTS = [
  { kind: 'Imaging', text: 'PET scan · about 3 months', note: 'Cardiac device: Unknown — ask the patient', unknown: true },
  { kind: 'Laboratory', text: 'Serum PSA · before next visit', note: 'Reason in chart: Unknown', unknown: true },
  { kind: 'Prescription', text: 'Ondansetron 4 mg · as needed', note: 'Allergies on file: Yes · Source L3', unknown: false },
];
const STEPS = SPOKEN.length + 4 * 8 + 20; // typing, then drafts appear, then a pause

export default function DelegationLoop() {
  const [tick, setTick] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches) { setReduced(true); return; }
    const id = window.setInterval(() => { if (!document.hidden) setTick(t => (t + 1) % STEPS); }, 70);
    return () => window.clearInterval(id);
  }, []);
  const t = reduced ? STEPS - 1 : tick;
  const typed = SPOKEN.slice(0, t);
  const shown = Math.max(0, Math.min(DRAFTS.length, Math.floor((t - SPOKEN.length) / 8)));
  const signed = t > SPOKEN.length + 4 * 8;
  const listening = t < SPOKEN.length;
  return <figure aria-label="Animated sample of the Delegation Desk turning a spoken request into drafts" className="mt-10 overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-7">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm font-semibold">Delegation Desk · voice to draft orders</p>
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Fictional sample · nothing sent or saved</span>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary ${listening && !reduced ? 'animate-pulse' : ''}`}><Mic className="h-4 w-4" /></span>
          <div className="flex h-6 items-end gap-1" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => <span key={i} className="w-1 rounded-full bg-primary/70 transition-all duration-150" style={{ height: listening ? `${6 + ((i * 7 + t * 3) % 18)}px` : '4px' }} />)}
          </div>
          <span className="text-xs text-muted-foreground">{listening ? 'Doctor speaking…' : 'Request captured'}</span>
        </div>
        <p className="min-h-[4.5rem] text-sm italic leading-relaxed">“{typed}{listening && <span className="ml-0.5 inline-block w-2 animate-pulse bg-primary/60">&nbsp;</span>}”</p>
      </div>
      <div className="space-y-2">
        {DRAFTS.map((d, i) => <div key={d.kind} className={`rounded-xl border border-border bg-background p-3 transition-all duration-500 ${i < shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <div className="flex items-center justify-between gap-2 text-sm"><span><span className="mr-2 text-xs font-semibold text-primary">{d.kind}</span>{d.text}</span><span className="text-xs text-muted-foreground">{signed ? 'Sample sign-off' : 'Draft'}</span></div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">{d.unknown ? <HelpCircle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5 text-primary" />}{d.note}</p>
        </div>)}
      </div>
    </div>
    <figcaption className="mt-4 text-xs text-muted-foreground">Illustrative animation with fictional data. The doctor reviews every draft; ordering, prescribing and live microphone use stay locked until healthcare clearance.</figcaption>
  </figure>;
}
