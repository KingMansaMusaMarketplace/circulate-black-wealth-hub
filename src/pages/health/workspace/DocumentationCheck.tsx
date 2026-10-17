import { useState } from 'react';
import { CheckCircle2, FileSearch, Lock, RotateCcw, SearchCheck, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_VISITS, findVisit } from './sample-visits';
import { checkSampleDocumentation, SampleDocumentationCheck } from './documentation-check';

export default function DocumentationCheck() {
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [result, setResult] = useState<SampleDocumentationCheck | null>(null);
  const [sourceLine, setSourceLine] = useState<number | null>(null);
  const visit = findVisit(visitId);
  if (!visit) return <p role="alert">Sample visit unavailable.</p>;
  const showSource = (line: number) => {
    setSourceLine(line);
    document.getElementById(`doc-source-${line}`)?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional records only</Badge><h2 className="text-xl font-semibold">Billing documentation check</h2><p className="mt-1 text-sm text-muted-foreground">Finds missing details · suggests no billing codes · not a billing approval</p></div>
      <Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Submit to insurance</Button>
    </div>
    <fieldset><legend className="mb-3 text-sm font-medium">Fictional visit</legend><div className="flex flex-wrap gap-2">{SAMPLE_VISITS.map((s) => <Button key={s.id} variant={visitId === s.id ? 'default' : 'outline'} aria-pressed={visitId === s.id} className="h-auto whitespace-normal text-left" onClick={() => { setVisitId(s.id); setResult(null); setSourceLine(null); }}>{s.title}</Button>)}</div></fieldset>
    <div className="flex items-center gap-3">
      <Button onClick={() => { setResult(checkSampleDocumentation(visitId)); setSourceLine(null); }}><SearchCheck className="mr-2 h-4 w-4" />Check documentation</Button>
      {result && <Button variant="ghost" size="icon" aria-label="Clear check" title="Clear check" onClick={() => { setResult(null); setSourceLine(null); }}><RotateCcw className="h-4 w-4" /></Button>}
    </div>
    <div className="grid items-start gap-8 xl:grid-cols-2">
      <section aria-label="Documentation findings" className="min-w-0 space-y-5">
        {!result ? <p className="text-sm text-muted-foreground">No check run for this sample.</p> : <>
          <div role="status" className="space-y-1 border-l-2 border-mansagold pl-3 text-sm"><p className="font-medium">Draft findings — awaiting doctor and billing staff review</p><p className="text-muted-foreground">Fictional example. Kayla does not pick billing codes, set visit levels, or say a visit will be paid. Nothing is saved or sent.</p></div>
          <div className="space-y-2 border-b pb-4"><h3 className="flex items-center gap-2 text-sm font-semibold text-mansagold"><CheckCircle2 className="h-4 w-4" />Documented in the transcript</h3><ul className="space-y-1">{result.found.map((f) => <li key={f.line}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal px-2 py-2 text-left text-sm font-normal" aria-label={`View source line ${f.line}: ${f.label}`} onClick={() => showSource(f.line)}><span className="min-w-0 flex-1">{f.label}</span><span className="ml-3 shrink-0 text-xs text-muted-foreground">L{f.line}</span></Button></li>)}</ul></div>
          <div className="space-y-2"><h3 className="flex items-center gap-2 font-semibold"><TriangleAlert className="h-4 w-4 text-mansagold" />Missing or unclear — add before signing</h3><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{result.missing.map((m) => <li key={m.code}>{m.label}</li>)}</ul></div>
        </>}
      </section>
      <section aria-label="Documentation source" className="min-w-0 space-y-3 border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0"><h3 className="flex items-center gap-2 font-semibold"><FileSearch className="h-4 w-4 text-mansagold" />Original sample transcript</h3><ol className="space-y-2 text-sm">{visit.lines.map((line, i) => <li id={`doc-source-${i + 1}`} key={i} aria-current={sourceLine === i + 1 ? 'true' : undefined} className={`scroll-mt-6 rounded-md border-l-2 px-3 py-2 ${sourceLine === i + 1 ? 'border-mansagold bg-mansagold/10' : 'border-transparent'}`}><span className="mr-2 text-xs text-muted-foreground">L{i + 1}</span>{line}</li>)}</ol></section>
    </div>
  </div>;
}
