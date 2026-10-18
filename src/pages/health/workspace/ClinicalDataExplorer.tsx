import { useState } from 'react';
import { FileSearch, Lock, Search, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cohortCriteriaSchema, DEFAULT_CRITERIA, SEARCH_MEDICINES, SEARCH_QUESTIONS, searchCohort, type CohortCriteria } from './cohort-search';

export default function ClinicalDataExplorer() {
  const [criteria, setCriteria] = useState<CohortCriteria>(DEFAULT_CRITERIA);
  const [threshold, setThreshold] = useState(String(DEFAULT_CRITERIA.threshold));
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof searchCohort> | null>(null);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const change = (next: Partial<CohortCriteria>) => { setCriteria((c) => ({ ...c, ...next })); setConfirmed(false); setResult(null); setSourceId(null); setError(''); };
  const validate = () => {
    const parsed = cohortCriteriaSchema.safeParse({ ...criteria, threshold: threshold.trim() === '' ? NaN : Number(threshold) });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check your search criteria.'); return null; }
    setError(''); return parsed.data;
  };
  const source = result?.cases.find((c) => c.id === sourceId);
  return <div className="space-y-6">
    <header className="space-y-2 border-b border-border pb-4">
      <Badge variant="outline" className="text-mansagold">Independent fictional search rehearsal</Badge>
      <h2 className="text-xl font-semibold">Clinical Data Explorer</h2>
      <p className="text-sm text-muted-foreground">Four synthetic search cases · Not connected to patient charts · No real patient records</p>
    </header>
    <section aria-label="Search criteria" className="space-y-4">
      <div className="space-y-2"><Label>Clinical question</Label><Select value={criteria.medicine} onValueChange={(value) => { const medicine = SEARCH_MEDICINES.find((m) => m === value); if (medicine) change({ medicine }); }}><SelectTrigger aria-label="Clinical question" className="h-auto min-h-10 text-left [&>span]:whitespace-normal"><SelectValue /></SelectTrigger><SelectContent>{SEARCH_QUESTIONS.map((q) => <SelectItem key={q.medicine} value={q.medicine}>{q.text}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2"><Label htmlFor="cohort-threshold">Creatinine greater than (mg/dL)</Label><Input id="cohort-threshold" type="number" min="0" max="20" step="0.1" value={threshold} onChange={(e) => { setThreshold(e.target.value); change({}); }} /></div>
        <div className="space-y-2"><Label htmlFor="cohort-from">Specimen date from</Label><Input id="cohort-from" type="date" value={criteria.from} onChange={(e) => change({ from: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="cohort-to">Specimen date through</Label><Input id="cohort-to" type="date" value={criteria.to} onChange={(e) => change({ to: e.target.value })} /></div>
      </div>
      <p className="text-xs text-muted-foreground">1.2 mg/dL is an illustrative starting threshold, not a universal normal range. These fixed questions search medication snapshots, not verified current use.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { const parsed = validate(); if (parsed) { setCriteria(parsed); setConfirmed(true); setResult(null); setSourceId(null); } }}><FileSearch className="mr-2 h-4 w-4" />Confirm criteria</Button><Button disabled={!confirmed} onClick={() => { const parsed = validate(); if (parsed) setResult(searchCohort(parsed)); }}><Search className="mr-2 h-4 w-4" />Run fictional search</Button><Button variant="ghost" size="icon" aria-label="Reset search" title="Reset search" onClick={() => { setThreshold(String(DEFAULT_CRITERIA.threshold)); change(DEFAULT_CRITERIA); }}><RotateCcw className="h-4 w-4" /></Button></div>
      {confirmed && <p role="status" className="border-l-2 border-mansagold pl-3 text-sm">Confirmed: {criteria.medicine} in the medication snapshot AND creatinine &gt; {criteria.threshold} mg/dL, specimen date {criteria.from} through {criteria.to} inclusive.</p>}
    </section>
    {result && <section aria-label="Fictional search results" className="space-y-5 border-t border-border pt-5">
      <dl className="grid grid-cols-3 gap-3">{(['matched', 'excluded', 'unknown'] as const).map((status) => <div key={status}><dt className="text-sm capitalize text-muted-foreground">{status === 'unknown' ? 'Insufficient information' : status}</dt><dd className="mt-1 text-2xl font-semibold text-mansagold">{result.cases.filter((c) => c.status === status).length}</dd></div>)}</dl>
      <p className="text-xs text-muted-foreground">Counts describe this four-case synthetic packet only. Missing or out-of-window results are unknown, never assumed normal. A failed criterion excludes a case even when another criterion is unknown.</p>
      {(['matched', 'excluded', 'unknown'] as const).map((status) => <div key={status} className="space-y-3"><h3 className="font-semibold capitalize">{status === 'unknown' ? 'Insufficient information' : status}</h3>{!result.cases.some((c) => c.status === status) && <p className="text-sm text-muted-foreground">No fictional cases in this group.</p>}{result.cases.filter((c) => c.status === status).map((c) => <article key={c.id} className="rounded-md border border-border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-medium">{c.title}</h4><Button variant="link" size="sm" onClick={() => setSourceId(c.id)}><FileSearch className="mr-2 h-4 w-4" />View source</Button></div><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{c.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul><p className="mt-2 text-xs">{c.medicineLine ? `Medication source L${c.medicineLine}` : 'Medication status unknown'} · {c.lab ? `Creatinine ${c.lab.value} ${c.lab.unit} · ${c.lab.date} · L${c.lab.line}` : 'Creatinine unknown'}</p></article>)}</div>)}
    </section>}
    {source && <section aria-label="Search source evidence" className="space-y-3 border-t border-border pt-4"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold">{source.title} · Source packet</h3><Button variant="ghost" size="sm" onClick={() => setSourceId(null)}>Close source</Button></div><ol className="space-y-2 text-sm">{source.source.map((text, i) => <li key={text} className="border-l-2 border-mansagold pl-3"><span className="mr-2 text-mansagold">L{i + 1}</span>{text}</li>)}</ol></section>}
    <footer className="space-y-3 border-t border-border pt-4"><p className="text-sm text-muted-foreground">For search rehearsal only. Matches do not establish clinical-trial eligibility, medication safety or validated quality measures. Physician review and a separately approved protocol are required.</p><div className="flex flex-wrap gap-2">{['Search real records', 'Export patient list', 'Recruit trial participants', 'Submit quality report'].map((label) => <Button key={label} variant="outline" disabled className="h-auto whitespace-normal"><Lock className="mr-2 h-4 w-4" />{label}</Button>)}</div></footer>
  </div>;
}