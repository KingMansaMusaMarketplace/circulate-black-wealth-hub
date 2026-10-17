import { useState } from 'react';
import { ArrowUpRight, FileSearch, Lock, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { executiveQuality } from './executive-quality';
import { DEFAULT_FACILITY_CONTEXT, resolveFacilityContext, type FacilityContext } from './facility-context';

type Destination = 'evaluation' | 'reliability' | 'impact' | 'sample-chart';
type Props = { facilityContext?: FacilityContext; onNavigate?: (destination: Destination) => void };

export default function ExecutiveQuality({ facilityContext = DEFAULT_FACILITY_CONTEXT, onNavigate }: Props) {
  const overview = executiveQuality();
  const { facility } = resolveFacilityContext(facilityContext);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const source = overview.cases.find((item) => item.id === sourceId);
  const metrics = [
    { title: 'Clinical accuracy', value: overview.metrics.accuracyPercent, evidence: 'Independent doctor evaluation required' },
    { title: 'Review time', value: overview.metrics.reviewTimeMinutes, evidence: 'Approved timed study required' },
    { title: 'Monthly savings', value: overview.metrics.monthlySavings, evidence: 'No measured financial results' },
    { title: 'Service availability', value: overview.metrics.uptimePercent, evidence: 'Production monitoring evidence required' },
  ];
  return <div className="space-y-8">
    <section className="space-y-3 border-b border-border pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-medium text-mansagold">1325 Clinical · Executive quality overview</p><Badge variant="outline" className="border-mansagold/40 text-mansagold">Fictional evaluation only</Badge></div>
      <h2 className="text-xl font-semibold">Evidence before outcomes</h2>
      <p className="text-sm text-muted-foreground">{facility.name} · {facilityContext.department} · Illustrative location, not a connected facility.</p>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">Sample evidence is available for review. Clinical quality, savings and production reliability have not been independently verified. No overall quality score is assigned.</p>
    </section>
    <section aria-label="Unverified performance results" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => <div key={metric.title} className="border-l-2 border-mansagold/40 pl-4"><h3 className="text-sm text-muted-foreground">{metric.title}</h3><p className="mt-2 text-xl font-semibold">{metric.value ?? 'Not measured'}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{metric.evidence}</p></div>)}
    </section>
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <section aria-label="Fictional evidence inventory" className="min-w-0 space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><FileSearch className="h-5 w-5 text-mansagold" />Source evidence inventory</h2>
        <p className="text-sm text-muted-foreground">{overview.cases.length} built-in fictional transcripts—not patients served, completed reviews or measured outcomes. Sources are shared across the illustrative facilities.</p>
        {overview.cases.map((item) => <article key={item.id} className="space-y-3 rounded-md border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.lineCount} numbered source lines · Independent evaluation not verified</p></div><Button variant="outline" size="sm" aria-expanded={sourceId === item.id} onClick={() => setSourceId(sourceId === item.id ? null : item.id)}>View source</Button></div>
          <p className="text-xs text-muted-foreground">Allergies, demographics and medication reconciliation remain undocumented or uncompleted.</p>
        </article>)}
        {source && <section aria-label="Selected fictional transcript" className="space-y-3 border-l-2 border-mansagold pl-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">{source.title}</h3><Button variant="ghost" size="sm" onClick={() => setSourceId(null)}>Close source</Button></div><ol className="space-y-2 text-sm">{source.lines.map((line, index) => <li key={index} className="flex gap-3"><span className="w-5 shrink-0 text-mansagold">{index + 1}</span><span className="min-w-0 leading-relaxed">{line}</span></li>)}</ol></section>}
      </section>
      <section aria-label="Healthcare release status" className="space-y-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><ShieldCheck className="h-5 w-5 text-mansagold" />Release readiness</h2>
        <div className="space-y-2 border-l-2 border-mansagold pl-4"><p className="font-semibold">Independent clearance not verified</p><p className="text-sm leading-relaxed text-muted-foreground">Attorney-approved agreements, written vendor coverage and verified healthcare safeguards are still required. Visitor access and sample note signatures do not approve live services.</p></div>
        <dl className="divide-y divide-border text-sm">{[{ label: 'Real patient records', allowed: overview.live.records }, { label: 'Patient calls', allowed: overview.live.calls }, { label: 'Agreement uploads', allowed: overview.live.agreements }].map((item) => <div key={item.label} className="flex flex-wrap justify-between gap-2 py-3"><dt className="text-muted-foreground">{item.label}</dt><dd className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-mansagold" />{item.allowed ? 'Requires independent verification' : 'Locked'}</dd></div>)}</dl>
        {onNavigate && <div className="space-y-2 border-t border-border pt-4">{[{ destination: 'evaluation', label: 'Doctor evaluation' }, { destination: 'reliability', label: 'Backup, recovery & migration' }, { destination: 'impact', label: 'Practice impact assumptions' }, { destination: 'sample-chart', label: 'Expanded sample chart' }].map((item) => <Button key={item.destination} variant="ghost" className="h-auto w-full justify-between gap-3 whitespace-normal text-left" onClick={() => onNavigate(item.destination as Destination)}>{item.label}<ArrowUpRight className="h-4 w-4 shrink-0 text-mansagold" /></Button>)}</div>}
      </section>
    </div>
  </div>;
}