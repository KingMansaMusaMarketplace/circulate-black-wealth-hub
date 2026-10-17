import { useState } from 'react';
import { BookOpen, FileSearch, Lock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_VISITS, findVisit } from './sample-visits';
import { buildSampleCareGuide, GuideLanguage, SampleCareGuide } from './care-guide';

export default function CareGuide() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [language, setLanguage] = useState<GuideLanguage>('en');
  const [guide, setGuide] = useState<SampleCareGuide | null>(null);
  const [sourceLine, setSourceLine] = useState<number | null>(null);
  const visit = findVisit(visitId);
  if (!visit) return <p role="alert">Sample visit unavailable.</p>;
  const showSource = (line: number) => {
    setSourceLine(line);
    document.getElementById(`care-source-${line}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };
  const changeLanguage = (next: GuideLanguage) => {
    setLanguage(next); setSourceLine(null);
    if (guide) setGuide(buildSampleCareGuide(visitId, next));
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional records only</Badge><h2 className="text-xl font-semibold">Plain-language care guide</h2><p className="mt-1 text-sm text-muted-foreground">Sample visit plan · unapproved draft · not for patient use</p></div>
      <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Send to patient</Button>
    </div>
    <fieldset><legend className="mb-3 text-sm font-medium">Fictional visit</legend><div className="flex flex-wrap gap-2">{SAMPLE_VISITS.map((sample) => <Button key={sample.id} variant={visitId === sample.id ? 'default' : 'outline'} aria-pressed={visitId === sample.id} className="h-auto whitespace-normal text-left" onClick={() => { setVisitId(sample.id); setGuide(null); setSourceLine(null); }}>{sample.title}</Button>)}</div></fieldset>
    <div className="flex flex-wrap items-center gap-4">
      <fieldset className="flex gap-2"><legend className="sr-only">Guide language</legend><Button variant={language === 'en' ? 'default' : 'outline'} aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>English</Button><Button variant={language === 'es' ? 'default' : 'outline'} aria-pressed={language === 'es'} onClick={() => changeLanguage('es')}>Español</Button></fieldset>
      <Button onClick={() => { setGuide(buildSampleCareGuide(visitId, language)); setSourceLine(null); }}><BookOpen className="mr-2 h-4 w-4" />Prepare sample guide</Button>
      {guide && <Button variant="ghost" size="icon" aria-label="Clear guide" title="Clear guide" onClick={() => { setGuide(null); setSourceLine(null); }}><RotateCcw className="h-4 w-4" /></Button>}
    </div>
    <div className="grid items-start gap-8 xl:grid-cols-2">
      <section aria-label="Care guide draft" lang={language} className="min-w-0 space-y-5">
        {!guide ? <p className="text-sm text-muted-foreground">No guide prepared for this sample.</p> : <>
          <div role="status" className="space-y-1 border-l-2 border-mansagold pl-3 text-sm"><p className="font-medium">{language === 'en' ? 'Draft — awaiting doctor review' : 'Borrador — pendiente de revisión médica'}</p><p className="text-muted-foreground">{language === 'en' ? 'Fictional example only. Not a signed visit note or approved care plan. Nothing is saved or sent.' : 'Solo un ejemplo ficticio. No es una nota firmada ni un plan de atención aprobado. No se guarda ni se envía nada.'}</p></div>
          {[{ title: language === 'en' ? 'What the doctor said' : 'Lo que dijo el médico', items: [guide.summary] }, { title: language === 'en' ? 'Your next steps' : 'Sus próximos pasos', items: guide.plan }].map((section) => <div key={section.title} className="space-y-2 border-b pb-4"><h3 className="text-sm font-semibold text-mansagold">{section.title}</h3><ul className="space-y-2">{section.items.map((item) => <li key={item.line}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal px-2 py-2 text-left text-sm font-normal" aria-label={`View source line ${item.line}: ${item.text}`} onClick={() => showSource(item.line)}><span className="min-w-0 flex-1">{item.text}</span><span className="ml-3 shrink-0 text-xs text-muted-foreground">L{item.line}</span></Button></li>)}</ul></div>)}
          <div className="space-y-2"><h3 className="font-semibold">{language === 'en' ? 'Missing instructions — doctor review required' : 'Instrucciones faltantes — requieren revisión médica'}</h3><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{guide.gaps.map((gap) => <li key={gap.code}>{gap.text}</li>)}</ul></div>
          {language === 'es' && <p className="text-xs text-muted-foreground">Traducción de muestra no validada para uso clínico; requiere revisión de un profesional bilingüe.</p>}
        </>}
      </section>
      <section aria-label="Care guide source" className="min-w-0 space-y-3 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h3 className="flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4 text-mansagold" />Original sample transcript</h3><p className="text-xs text-muted-foreground">English source · fictional · no visit date supplied</p><ol className="space-y-2 text-sm">{visit.lines.map((line, index) => <li id={`care-source-${index + 1}`} key={index} aria-current={sourceLine === index + 1 ? 'true' : undefined} className={`scroll-mt-6 rounded-md border-l-2 px-3 py-2 ${sourceLine === index + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{index + 1}</span>{line}</li>)}</ol></section>
    </div>
  </div>;
}