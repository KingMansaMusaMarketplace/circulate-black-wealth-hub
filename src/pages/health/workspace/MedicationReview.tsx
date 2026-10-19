import { useState } from 'react';
import { Lock, Pill, FileSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SAMPLE_VISITS } from './sample-visits';
import { prepareMedicationReview } from './medication-review';

function Review({ visitId }: { visitId: string }) {
  const [prepared, setPrepared] = useState(false);
  const [sourceLine, setSourceLine] = useState<number | null>(null);
  const review = prepareMedicationReview(visitId);
  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
      <div><h3 className="font-semibold">{review.title}</h3><p className="mt-1 text-sm text-muted-foreground">Historical fictional transcript · Current medicines unverified</p></div>
      <Badge variant="outline">Awaiting clinician review</Badge>
    </div>
    <div className="border-l-2 border-mansagold pl-4"><h4 className="font-medium">Medication safety checks — not performed</h4><p className="mt-1 text-sm text-muted-foreground">No drug-interaction, allergy-interaction or dose-safety screening is connected. This sample is not a prescribing tool or a safety clearance.</p></div>
    <Button onClick={() => { setPrepared(true); setSourceLine(null); }} disabled={prepared}><FileSearch className="mr-2 h-4 w-4" />{prepared ? 'Sample review prepared' : 'Prepare sample medication review'}</Button>
    {prepared && <section aria-label="Medication documentation review" className="space-y-5">
      <div><h4 className="mb-3 flex items-center gap-2 font-medium text-mansagold"><Pill className="h-4 w-4" />Medicine references in the source</h4>
        {review.evidence.length ? <ul className="space-y-3">{review.evidence.map((item) => <li key={item.line}><Button variant="link" className="h-auto max-w-full justify-start whitespace-normal p-0 text-left text-sm" onClick={() => setSourceLine(item.line)}>{item.text}<span className="ml-2 shrink-0 text-mansagold">L{item.line}</span></Button></li>)}</ul> : <p className="text-sm text-muted-foreground">No medicine references are included in this transcript. This does not establish that the person takes no medicines.</p>}
        {review.adherence === 'historical_patient_report' && <p className="mt-3 text-sm text-muted-foreground">The missed-dose statement is a historical patient report, not verified current use. The possible future dose adjustment is not a completed change or an instruction from this review.</p>}
      </div>
      <div><h4 className="mb-3 font-medium">Information for clinician review</h4><div className="grid gap-4 sm:grid-cols-3">{review.gaps.map((gap) => <div key={gap.id} className="border-t border-border pt-3"><h5 className="text-sm font-medium">{gap.title}</h5><p className="mt-2 text-sm text-muted-foreground">{gap.detail}</p></div>)}</div></div>
      <dl className="grid gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">{[['Allergy status', 'Unknown'], ['Drug interactions', 'Not checked'], ['Dose safety', 'Not checked']].map(([label, status]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{status}</dd></div>)}</dl>
    </section>}
    {sourceLine !== null && <section aria-label="Medication source transcript" className="space-y-3 border-t border-border pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-medium">Original fictional transcript</h4><Button variant="ghost" size="sm" onClick={() => setSourceLine(null)}>Close source</Button></div><ol className="space-y-2 text-sm">{review.transcript.map((text, index) => <li key={index} className={`rounded p-2 ${index + 1 === sourceLine ? 'bg-mansagold/15' : ''}`}><span className="mr-2 text-mansagold">L{index + 1}</span>{text}</li>)}</ol></section>}
    <div className="flex flex-wrap gap-2 border-t border-border pt-4">{['Prescribe medicine', 'Change dose', 'Sign review', 'Export review', 'Send to patient'].map((label) => <Button key={label} variant="outline" disabled><Lock className="mr-2 h-4 w-4" />{label}</Button>)}</div>
    <p className="text-xs text-muted-foreground">Kayla is an Agentic AI assistant, not a licensed clinician. Qualified clinical validation and healthcare clearance are required before real-patient use. No approval is saved by this rehearsal.</p>
  </div>;
}

export default function MedicationReview() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  return <div className="space-y-5"><header><Badge variant="outline" className="mb-2 text-mansagold">Fictional documentation review only</Badge><h2 className="text-xl font-semibold">Medication Review Assistance</h2></header><div className="flex flex-wrap gap-2">{SAMPLE_VISITS.map((visit) => <Button key={visit.id} variant={visit.id === visitId ? 'default' : 'outline'} className="h-auto whitespace-normal" onClick={() => setVisitId(visit.id)}>{visit.title}</Button>)}</div><Review key={visitId} visitId={visitId} /></div>;
}
