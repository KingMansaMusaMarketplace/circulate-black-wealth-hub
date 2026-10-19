import { useState } from 'react';
import logo1325 from '@/assets/1325-ai-logo.png';
import { AlertTriangle, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SAMPLE_VISITS } from './workspace/sample-visits';
import { clinicalSafety } from './workspace/clinical-safety';

function SafetyContent() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [sourceLine, setSourceLine] = useState<number | null>(null);
  const safety = clinicalSafety(visitId);
  return <div className="mt-6 space-y-6">
    <section className="space-y-2 border-l-2 border-mansagold pl-4"><p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 shrink-0 text-mansagold" />Advisory documentation review only</p><p className="text-sm leading-relaxed text-muted-foreground">Kayla is an AI assistant, not a licensed clinician. This panel does not diagnose, triage, screen medicine safety or certify a case as safe. Doctors retain every medical decision.</p></section>
    <section aria-label="Safety review sample selection" className="space-y-3"><h3 className="text-sm font-semibold">Fictional case</h3><div className="flex flex-col gap-2">{SAMPLE_VISITS.map((visit) => <Button key={visit.id} variant="outline" aria-pressed={visitId === visit.id} className={`h-auto justify-start whitespace-normal py-3 text-left ${visitId === visit.id ? 'border-mansagold/60 bg-mansagold/10 text-mansagold' : ''}`} onClick={() => { setVisitId(visit.id); setSourceLine(null); }}>{visit.title}</Button>)}</div></section>
    <section aria-label="Unperformed clinical checks" className="space-y-3 border-t border-border pt-5"><h3 className="font-semibold">Review boundaries</h3><dl className="divide-y divide-border text-sm">{[
      { title: 'Allergy history', value: safety.allergyStatus === 'unknown' ? 'Unknown' : 'Requires review' },
      { title: 'Medicine reconciliation', value: safety.reconciliation === 'not_completed' ? 'Not completed' : 'Requires review' },
      { title: 'Drug interaction screening', value: safety.interactionStatus === 'not_checked' ? 'Not performed' : 'Requires review' },
      { title: 'Dose safety screening', value: safety.doseSafetyStatus === 'not_checked' ? 'Not performed' : 'Requires review' },
      { title: 'Independent clinical validation', value: safety.clinicalValidation === 'not_verified' ? 'Not verified' : 'Requires review' },
    ].map((item) => <div key={item.title} className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-muted-foreground">{item.title}</dt><dd className="font-medium">{item.value}</dd></div>)}</dl><p className="text-xs leading-relaxed text-muted-foreground">No risk score or “all clear” result is assigned. Missing information is not evidence of safety.</p></section>
    <section aria-label="Source-linked safety context" className="space-y-3 border-t border-border pt-5"><h3 className="font-semibold">Source-linked review context</h3><p className="text-xs text-muted-foreground">Historical fictional statements—not current findings or new recommendations.</p>{safety.evidence.map((item) => <Button key={item.line} variant="outline" className="h-auto w-full flex-col items-start gap-2 whitespace-normal p-3 text-left" aria-expanded={sourceLine === item.line} onClick={() => setSourceLine(sourceLine === item.line ? null : item.line)}><span className="text-sm font-medium">{item.title}</span><span className="text-xs text-mansagold">Transcript line {item.line}</span><span className="text-sm leading-relaxed text-muted-foreground">{item.text}</span></Button>)}
      {sourceLine !== null && <section aria-label="Safety source transcript" className="space-y-3 border-l-2 border-mansagold pl-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold">Original fictional transcript</h4><Button variant="ghost" size="sm" onClick={() => setSourceLine(null)}>Close source</Button></div><ol className="space-y-2">{safety.lines.map((line, index) => <li key={index} className={`flex gap-3 rounded-md p-2 text-sm ${sourceLine === index + 1 ? 'bg-mansagold/10' : ''}`}><span className="w-5 shrink-0 text-mansagold">{index + 1}</span><span className="min-w-0 leading-relaxed">{line}</span></li>)}</ol></section>}
    </section>
    <section aria-label="Documentation gaps" className="space-y-3 border-t border-border pt-5"><h3 className="font-semibold">Information still missing</h3><ul className="space-y-3">{safety.gaps.map((gap) => <li key={gap} className="flex gap-2 text-sm leading-relaxed text-muted-foreground"><AlertTriangle className="mt-1 h-3.5 w-3.5 shrink-0 text-mansagold" /><span>{gap}</span></li>)}</ul></section>
    <section aria-label="Physician review boundary" className="space-y-3 border-t border-border pt-5"><h3 className="font-semibold">Physician review remains separate</h3><Badge variant="outline" className="border-mansagold/40 text-mansagold">Awaiting clinician review</Badge><p className="text-sm leading-relaxed text-muted-foreground">This panel does not read or change saved note decisions. Sample note signatures stay in the existing doctor-review workflow and do not approve medication safety, prescriptions, patient delivery or real-record processing.</p></section>
    <section aria-label="Safety panel service restrictions" className="space-y-3 border-t border-border pt-5"><h3 className="flex items-center gap-2 font-semibold"><Lock className="h-4 w-4 text-mansagold" />Real services remain locked</h3><dl className="space-y-3 text-sm">{[{ title: 'Real patient uploads', allowed: safety.intake.cmeUpload }, { title: 'Patient calls', allowed: safety.intake.patientCalls }, { title: 'Agreement uploads', allowed: safety.intake.agreementUpload }].map((item) => <div key={item.title} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{item.title}</dt><dd>{item.allowed ? 'Requires independent verification' : 'Locked'}</dd></div>)}</dl><p className="text-xs leading-relaxed text-muted-foreground">Attorney-approved agreements, written vendor coverage and independently verified safeguards are required. This panel cannot approve, sign, prescribe, export, send or activate services.</p></section>
  </div>;
}

export default function ClinicalSafetyPanel() {
  const [open, setOpen] = useState(false);
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild><Button variant="outline" size="sm" className="gap-2 border-mansagold/40"><ShieldCheck className="h-4 w-4 text-mansagold" />Clinical safety</Button></SheetTrigger>
    <SheetContent side="right" className="theme-clinical dark w-full overflow-y-auto border-mansagold/30 bg-background text-foreground sm:max-w-xl motion-reduce:animate-none">
      <SheetHeader className="pr-6 text-left"><div className="mb-3 flex items-center gap-3"><img src={logo1325} alt="1325.AI logo" className="h-10 w-10 object-contain" /><span className="text-sm font-semibold text-mansagold">1325 Clinical EMR / EHR · Enterprise Edition</span></div><SheetTitle className="text-xl">Clinical safety & physician review</SheetTitle><SheetDescription>Fictional documentation context · No clinical safety clearance</SheetDescription></SheetHeader>
      {open && <SafetyContent />}
    </SheetContent>
  </Sheet>;
}