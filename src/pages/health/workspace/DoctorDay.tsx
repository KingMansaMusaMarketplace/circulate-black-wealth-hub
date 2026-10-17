import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Lock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doctorDayCase, DOCTOR_DAY_CASES, DOCTOR_DAY_STEPS } from './doctor-day';
import { GuideLanguage } from './care-guide';
import VisitNotes from './VisitNotes';
import SamplePatientChart from './SamplePatientChart';

export default function DoctorDay({ clinicId, clinicRole }: { clinicId?: string; clinicRole?: string }) {
  const [visitId, setVisitId] = useState<string>(DOCTOR_DAY_CASES[0].visitId);
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<GuideLanguage>('en');
  const [source, setSource] = useState<number[]>([]);
  const sample = doctorDayCase(visitId, language);
  const navigate = (next: number) => { setStep(next); setSource([]); };
  const cite = (line: number, text: string) => <Button variant="link" className="h-auto max-w-full justify-start whitespace-normal p-0 text-left text-sm" onClick={() => setSource([line])}>{text}<span className="ml-2 shrink-0 text-xs text-mansagold">L{line}</span></Button>;

  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
      <div><Badge variant="outline" className="mb-2 text-mansagold">Fictional doctor-day rehearsal</Badge><h2 className="text-xl font-semibold">One case, from schedule to follow-up</h2><p className="mt-1 text-sm text-muted-foreground">No real appointments, patient records or messages.</p></div>
      <Button variant="outline" size="icon" aria-label="Restart doctor-day rehearsal" title="Restart doctor-day rehearsal" onClick={() => { navigate(0); setLanguage('en'); }}><RotateCcw className="h-4 w-4" /></Button>
    </header>
    <div className="flex flex-wrap gap-2" aria-label="Fictional cases">{DOCTOR_DAY_CASES.map((item) => <Button key={item.visitId} variant={visitId === item.visitId ? 'default' : 'outline'} className="h-auto whitespace-normal text-left" onClick={() => { setVisitId(item.visitId); navigate(0); setLanguage('en'); }}>{item.title}</Button>)}</div>
    <div className="flex flex-wrap items-center justify-between gap-2 border-l-2 border-mansagold pl-4"><div><p className="font-semibold">{sample.visit.title}</p><p className="text-xs text-muted-foreground">{sample.slot.slot} · Illustrative slot · Visit date unknown</p></div><Badge variant="outline">{step + 1} / {DOCTOR_DAY_STEPS.length}</Badge></div>
    <Tabs value={String(step)} onValueChange={(value) => navigate(Number(value))}><TabsList className="h-auto w-full flex-wrap justify-start gap-1">{DOCTOR_DAY_STEPS.map((label, index) => <TabsTrigger key={label} value={String(index)}>{index + 1}. {label}</TabsTrigger>)}</TabsList></Tabs>
    <section aria-label={DOCTOR_DAY_STEPS[step]} className="space-y-4">
      <h3 className="text-lg font-semibold">{DOCTOR_DAY_STEPS[step]}</h3>
      {step === 0 && <><div className="flex items-start gap-3"><Calendar className="mt-1 h-5 w-5 shrink-0 text-mansagold" /><div><p>{sample.slot.slot} — {sample.visit.title}</p><p className="mt-1 text-sm text-muted-foreground">Illustrative schedule only. The transcript is an undated historical sample, not today’s completed visit.</p></div></div><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Book real appointment</Button></>}
      {step === 1 && <SamplePatientChart selectedVisitId={visitId} onSource={(line) => setSource([line])} />}
      {(step === 2 || step === 3) && (clinicId && clinicRole ? <VisitNotes key={visitId} clinicId={clinicId} clinicRole={clinicRole} selectedVisitId={visitId} /> : <div className="space-y-3"><Badge variant="outline">Awaiting doctor review · no saved decision</Badge><p className="text-sm text-muted-foreground">{step === 2 ? 'Historical fictional transcript excerpts. No new visit has been recorded or note generated.' : 'A clinic doctor reviews the source-linked note and saves a separate decision in the clinic workspace.'}</p><ul className="space-y-2">{sample.prep.sections.filter((section) => step === 2 || section.label.includes('assessment') || section.label.includes('plan')).flatMap((section) => section.facts).map((fact) => <li key={fact.line}>{cite(fact.line, fact.text)}</li>)}</ul><div className="flex flex-wrap gap-2"><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Sign note — clinic workspace only</Button><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Signed report unavailable</Button></div></div>)}
      {step === 4 && <><div className="flex flex-wrap items-center justify-between gap-3"><Badge variant="outline">Care instructions draft · independently unapproved</Badge><Tabs value={language} onValueChange={(value) => { if (value === 'en' || value === 'es') setLanguage(value); }}><TabsList><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="es">Español</TabsTrigger></TabsList></Tabs></div><p>{cite(sample.guide.summary.line, sample.guide.summary.text)}</p><ul className="space-y-2">{sample.guide.plan.map((item) => <li key={item.line}>{cite(item.line, item.text)}</li>)}</ul><h4 className="font-medium">Missing instructions for doctor review</h4><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{sample.guide.gaps.map((gap) => <li key={gap.code}>{gap.text}</li>)}</ul><p className="text-sm text-muted-foreground">A planned follow-up is not a booked appointment. Signing a note does not approve this guide or enable delivery.</p><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Send to patient</Button></>}
    </section>
    {source.length > 0 && <section aria-label="Source transcript" className="border-t border-border pt-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Original fictional transcript</h3><Button variant="ghost" size="sm" onClick={() => setSource([])}>Close source</Button></div><ol className="space-y-2 text-sm">{sample.visit.lines.map((text, index) => <li key={index} className={`rounded p-2 ${source.includes(index + 1) ? 'bg-mansagold/15' : ''}`}><span className="mr-2 text-mansagold">L{index + 1}</span>{text}</li>)}</ol></section>}
    <footer className="flex items-center justify-between gap-3 border-t border-border pt-4"><Button variant="outline" disabled={step === 0} onClick={() => navigate(step - 1)}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button><Button onClick={() => navigate(step === 4 ? 0 : step + 1)}>{step === 4 ? 'Return to schedule' : 'Continue'}<ArrowRight className="ml-2 h-4 w-4" /></Button></footer>
  </div>;
}