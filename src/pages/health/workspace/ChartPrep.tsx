import { useState } from 'react';
import { ClipboardList, FileSearch, Lock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_VISITS, findVisit } from './sample-visits';
import { ChartPrep as PreparedChart, prepareSampleChart } from './chart-prep';

export default function ChartPrep() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [prepared, setPrepared] = useState<PreparedChart | null>(null);
  const [sourceLine, setSourceLine] = useState<number | null>(null);
  const visit = findVisit(visitId);
  if (!visit) return <p role="alert">Sample visit unavailable.</p>;

  const showSource = (line: number) => {
    setSourceLine(line);
    document.getElementById(`prep-source-${line}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div>
        <Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional records only</Badge>
        <h2 className="text-xl font-semibold">Pre-visit handoff</h2>
        <p className="mt-1 text-sm text-muted-foreground">Prior visit findings · current status unverified · clinician review required</p>
      </div>
      <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Import real chart</Button>
    </div>

    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-medium">Prior fictional visit</legend>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_VISITS.map((sample) => <Button key={sample.id} variant={visitId === sample.id ? 'default' : 'outline'} aria-pressed={visitId === sample.id} className="h-auto whitespace-normal text-left" onClick={() => { setVisitId(sample.id); setPrepared(null); setSourceLine(null); }}>{sample.title}</Button>)}
      </div>
    </fieldset>

    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => { setPrepared(prepareSampleChart(visitId)); setSourceLine(null); }}><ClipboardList className="mr-2 h-4 w-4" />Prepare sample handoff</Button>
      {prepared && <Button variant="ghost" size="icon" aria-label="Clear handoff" title="Clear handoff" onClick={() => { setPrepared(null); setSourceLine(null); }}><RotateCcw className="h-4 w-4" /></Button>}
    </div>

    <div className="grid items-start gap-8 xl:grid-cols-2">
      <section aria-label="Pre-visit summary" className="min-w-0 space-y-5">
        <h3 className="flex items-center gap-2 font-semibold"><ClipboardList className="h-4 w-4 text-mansagold" />Chart prep summary</h3>
        {!prepared ? <p className="text-sm text-muted-foreground">No handoff prepared for this sample.</p> : <>
          <div role="status" className="space-y-1 border-l-2 border-mansagold pl-3 text-sm">
            <p className="font-medium">Draft — awaiting clinician review</p>
            <p className="text-muted-foreground">Fixed source excerpts, not a new AI assessment. Nothing is saved to the medical chart.</p>
          </div>
          {prepared.sections.map((section) => <div key={section.label} className="space-y-2 border-b pb-4">
            <h4 className="text-sm font-semibold text-mansagold">{section.label}</h4>
            <ul className="space-y-2">{section.facts.map((fact) => <li key={fact.line}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal px-2 py-2 text-left text-sm font-normal" onClick={() => showSource(fact.line)} aria-label={`View source line ${fact.line}: ${fact.text}`}><span className="min-w-0 flex-1">{fact.text}</span><span className="ml-3 shrink-0 text-xs text-muted-foreground">L{fact.line}</span></Button></li>)}</ul>
          </div>)}
          <div className="space-y-2">
            <h4 className="font-semibold">Gaps for clinician review</h4>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{prepared.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
          </div>
        </>}
      </section>

      <section aria-label="Prior visit source" className="min-w-0 space-y-3 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        <h3 className="flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4 text-mansagold" />Prior visit transcript</h3>
        <p className="text-xs text-muted-foreground">Fictional · no visit date supplied</p>
        <ol className="space-y-2 text-sm">{visit.lines.map((line, index) => <li id={`prep-source-${index + 1}`} key={index} aria-current={sourceLine === index + 1 ? 'true' : undefined} className={`scroll-mt-6 rounded-md border-l-2 px-3 py-2 ${sourceLine === index + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{index + 1}</span>{line}</li>)}</ol>
      </section>
    </div>
  </div>;
}