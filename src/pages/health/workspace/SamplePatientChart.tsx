import { useState } from 'react';
import { FileText, History, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SAMPLE_VISITS } from './sample-visits';
import { buildSamplePatientChart } from './sample-chart';

const VIEWS = ['Clinical history', 'Allergies & medicines', 'Results', 'Documents', 'Source history'] as const;
function ChartContents({ visitId, onSource }: { visitId: string; onSource?: (line: number) => void }) {
  const chart = buildSamplePatientChart(visitId);
  const [view, setView] = useState<string>(VIEWS[0]);
  const [line, setLine] = useState<number | null>(null);
  const open = (number: number) => { if (onSource) onSource(number); else setLine(number); };
  const excerpt = (item: { line: number; text: string }) => <Button variant="link" className="h-auto max-w-full justify-start whitespace-normal p-0 text-left text-sm" onClick={() => open(item.line)}>{item.text}<span className="ml-2 shrink-0 text-mansagold">L{item.line}</span></Button>;
  return <div className="space-y-5">
    <div className="flex flex-wrap justify-between gap-3 border-b border-border pb-4"><div><h3 className="font-semibold">{chart.title}</h3><p className="mt-1 text-sm text-muted-foreground">Historical fictional source · Visit date unknown · Current status unverified</p></div><Badge variant="outline">Read-only sample chart</Badge></div>
    <dl className="grid gap-3 text-sm sm:grid-cols-3">{['Date of birth', 'Contact details', 'Allergy reconciliation'].map((label) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">Not documented</dd></div>)}</dl>
    <Tabs value={view} onValueChange={setView}><TabsList aria-label="Sample chart sections" className="h-auto w-full flex-wrap justify-start gap-1">{VIEWS.map((label) => <TabsTrigger key={label} value={label}>{label}</TabsTrigger>)}</TabsList></Tabs>
    <section aria-label={view} className="space-y-4">
      {view === 'Clinical history' && <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-4">{chart.sections.map((section) => <div key={section.label}><h4 className="mb-2 font-medium text-mansagold">{section.label}</h4><ul className="space-y-2">{section.facts.map((fact) => <li key={fact.line}>{excerpt(fact)}</li>)}</ul></div>)}</div><div><h4 className="mb-2 font-medium">Unconfirmed chart information</h4><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{chart.gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul></div></div>}
      {view === 'Allergies & medicines' && <><h4 className="font-medium">Allergies — unknown, not “none”</h4><p className="text-sm text-muted-foreground">No allergy history is included. A clinician must reconcile allergies before care.</p><h4 className="font-medium">Medication reconciliation — not completed</h4><p className="text-sm text-muted-foreground">No complete medicine names, doses or verified active list are available.</p><ul className="space-y-2">{chart.medications.excerpts.map((item) => <li key={item.line}>{excerpt(item)}</li>)}</ul><p className="text-xs text-muted-foreground">A medicine reference is not a verified prescription or a recommendation to change treatment.</p></>}
      {view === 'Results' && <><h4 className="font-medium">Received laboratory and imaging results</h4><p className="text-sm text-muted-foreground">No results are included in this transcript. This does not establish that testing never occurred.</p>{chart.results.planned.length > 0 && <><h4 className="font-medium text-mansagold">Planned imaging — no completed result</h4>{chart.results.planned.map((item) => <div key={item.line}>{excerpt(item)}</div>)}</>}</>}
      {view === 'Documents' && chart.documents.map((document) => <div key={document.id} className="space-y-3 border-b border-border pb-4"><h4 className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-mansagold" />{document.title}</h4><p className="text-sm text-muted-foreground">{document.lines.length} numbered lines · Date not supplied · Not an uploaded patient record</p><Button variant="outline" onClick={() => open(1)}>View original transcript</Button></div>)}
      {view === 'Source history' && <><h4 className="flex items-center gap-2 font-medium"><History className="h-4 w-4 text-mansagold" />Sample source baseline</h4><p className="text-sm text-muted-foreground">Source history is not a live chart-change audit. No staff edits, signatures or visit activity are fabricated.</p>{chart.sourceHistory.map((entry) => <dl key={entry.revision} className="space-y-2 border-l-2 border-mansagold pl-4 text-sm"><div><dt className="text-muted-foreground">Source revision</dt><dd>1 · Built-in fictional baseline</dd></div><div><dt className="text-muted-foreground">Actor / timestamp</dt><dd>Not supplied</dd></div><div><dt className="text-muted-foreground">Record</dt><dd className="break-words">{entry.sourceId}</dd></div><p>{entry.text}</p></dl>)}</>}
    </section>
    {line !== null && <section aria-label="Chart source transcript" className="rounded-md border border-mansagold/40 bg-muted/30 p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold">Original fictional transcript</h4><Button variant="ghost" size="sm" onClick={() => setLine(null)}>Close source</Button></div><ol className="space-y-2 text-sm">{chart.documents[0].lines.map((text, index) => <li key={index} className={`rounded p-2 ${line === index + 1 ? 'bg-mansagold/15' : ''}`}><span className="mr-2 text-mansagold">L{index + 1}</span>{text}</li>)}</ol></section>}
    <div className="flex flex-wrap gap-2 border-t border-border pt-4"><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Edit patient chart</Button><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" />Upload patient records</Button></div>
  </div>;
}

export default function SamplePatientChart({ selectedVisitId, onSource }: { selectedVisitId?: string; onSource?: (line: number) => void }) {
  const [localVisitId, setLocalVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const visitId = selectedVisitId ?? localVisitId;
  return <div className="space-y-5">
    {!selectedVisitId && <><header><Badge variant="outline" className="mb-2 text-mansagold">Fictional source records only</Badge><h2 className="text-xl font-semibold">Expanded Sample Chart</h2></header><div className="flex flex-wrap gap-2">{SAMPLE_VISITS.map((visit) => <Button key={visit.id} className="h-auto whitespace-normal" variant={visit.id === visitId ? 'default' : 'outline'} onClick={() => setLocalVisitId(visit.id)}>{visit.title}</Button>)}</div></>}
    <ChartContents key={visitId} visitId={visitId} onSource={onSource} />
  </div>;
}