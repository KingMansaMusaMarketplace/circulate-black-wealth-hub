import { useState } from 'react';
import { BrainCircuit, Check, FileText, Loader2, Lock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Row, useRows } from './hc';

export default function RecordReview({ clinicId, clinicRole }: { clinicId: string; clinicRole: string }) {
  const docs = useRows('hc_documents', clinicId);
  const reviews = useRows('hc_reviews', clinicId);
  const decisions = useRows('hc_review_decisions', clinicId);
  const [selected, setSelected] = useState<string | null>(null);
  const [sourcePage, setSourcePage] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const active = reviews.rows.find(r => r.document_id === selected && r.result?.sample_case_id === 'fictional-cme-v1');
  const result = active?.result;
  const decision = decisions.rows.find(d => d.review_id === active?.id);
  const sources: Row[] = result?.source_pages ?? [];
  const source = sources.find(s => s.page === sourcePage);
  const canDecide = clinicRole === 'doctor' || clinicRole === 'owner';

  const generate = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-review', { body: { action: 'generate', clinic_id: clinicId, sample_case_id: 'fictional-cme-v1' } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Review failed');
      await Promise.all([docs.reload(), reviews.reload()]);
      setSelected(data.review.document_id); setSourcePage(null);
      toast.success('Source-linked draft saved for physician review');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Review failed'); }
    finally { setBusy(false); }
  };
  const recordDecision = async (value: 'accepted' | 'revision_requested') => {
    if (!active) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-review', { body: { action: 'decision', review_id: active.id, decision: value } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Could not save decision');
      await decisions.reload(); toast.success('Sample review decision saved');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not save decision'); }
    finally { setSaving(false); }
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Phase 1 · Fictional records</Badge>
        <h2 className="text-xl font-semibold">CME record-review service</h2>
        <p className="mt-1 text-sm text-muted-foreground">Compulsory Medical Examination · Drafts for physician review</p></div>
      <Button disabled={busy} onClick={generate} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
        {busy ? 'Kayla is reviewing…' : 'Review built-in fictional case'}
      </Button>
    </div>
    <div className="flex items-start gap-3 rounded-md border border-mansagold/30 bg-mansagold/5 p-4 text-sm">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
      <div><p className="font-medium">Real record uploads and patient calls are blocked.</p>
        <p className="mt-1 text-muted-foreground">Only the built-in six-page fictional case is available. Real records require healthcare attorney and vendor clearance; calls also require approved consent safeguards.</p></div>
    </div>
    <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <section className="min-w-0 space-y-3"><h3 className="text-sm font-semibold">Review files</h3>
        {docs.loading && <p className="text-sm text-muted-foreground">Loading files…</p>}
        {!docs.loading && docs.rows.length === 0 && <p className="text-sm text-muted-foreground">No drafts yet.</p>}
        {docs.rows.map(d => <Button key={d.id} variant="outline" className={`h-auto w-full justify-start whitespace-normal p-3 text-left ${selected === d.id ? 'border-mansagold' : ''}`} onClick={() => { setSelected(d.id); setSourcePage(null); }}>
          <FileText className="mr-2 h-4 w-4 shrink-0" /><span className="min-w-0"><span className="block break-words">{d.file_name}</span><span className="mt-1 block text-xs text-muted-foreground">{d.pages} pages · {d.status === 'draft_ready' ? 'Draft ready' : 'Legacy sample file'}</span></span>
        </Button>)}
      </section>
      <section className="min-w-0">
        {!result ? <div className="border-y py-12 text-center text-sm text-muted-foreground">{selected ? 'This older review has no verified source links. Generate the built-in fictional case to begin.' : 'Choose a draft or review the fictional case.'}</div> : <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-semibold">Kayla’s source-linked draft</h3><p className="text-xs text-muted-foreground">{new Date(active.created_at).toLocaleString()} · Fictional sample</p></div>
            <Badge variant="outline">{decision?.decision === 'accepted' ? 'Sample review accepted' : decision?.decision === 'revision_requested' ? 'Revision requested' : 'Awaiting physician review'}</Badge></div>
          <p className="text-xs text-muted-foreground">{result.citation_check}</p>
          {['timeline', 'pre_existing', 'conflict', 'gap'].map(category => <section key={category} className="space-y-3 border-t pt-4">
            <h4 className="font-semibold">{{ timeline: 'Treatment timeline', pre_existing: 'Before the incident', conflict: 'Differences to reconcile', gap: 'Missing records & gaps' }[category]}</h4>
            {(result.findings ?? []).filter((f: Row) => f.category === category).map((f: Row, i: number) => <div key={i} className="border-l-2 border-mansagold/40 pl-3 text-sm"><p className="mb-1 text-xs text-muted-foreground">{f.date}</p><p className="break-words">{f.finding}</p>
              <div className="mt-2 flex flex-wrap gap-2">{f.sources.map((s: Row, n: number) => <Button key={n} variant="link" size="sm" className="h-auto px-0 text-mansagold" onClick={() => setSourcePage(s.page)}>Source · page {s.page}</Button>)}</div>
            </div>)}
          </section>)}
          {source && <section aria-label="Source page" className="rounded-md border border-mansagold/40 bg-muted/30 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold">Page {source.page} · {source.file}</h4><Button variant="ghost" size="sm" onClick={() => setSourcePage(null)}>Close source</Button></div>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{source.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">{sources.map(p => <Button key={p.page} size="sm" variant={sourcePage === p.page ? 'default' : 'outline'} aria-label={`Open source page ${p.page}`} onClick={() => setSourcePage(p.page)}>{p.page}</Button>)}</div>
          </section>}
          <section className="border-t pt-4"><h4 className="mb-2 font-semibold">Questions for physician review</h4><ul className="list-disc space-y-2 pl-5 text-sm">{(result.questions_for_exam ?? []).map((q: string, i: number) => <li key={i}>{q}</li>)}</ul></section>
          <section className="border-t pt-4"><h4 className="mb-2 font-semibold">Suggested report outline</h4><ol className="list-decimal space-y-2 pl-5 text-sm">{(result.report_outline ?? []).map((q: string, i: number) => <li key={i}>{q}</li>)}</ol></section>
          <section className="space-y-3 border-t pt-4"><h4 className="font-semibold">Physician review · Sample only</h4>
            <p className="text-sm text-muted-foreground">Acceptance records a sample workflow decision, not clinical validation or a signed medical report. Medical and legal conclusions remain with the physician.</p>
            {decision && <p className="text-xs text-muted-foreground">Decision recorded {new Date(decision.created_at).toLocaleString()}</p>}
            {canDecide ? <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={saving} onClick={() => recordDecision('revision_requested')}><RotateCcw className="mr-2 h-4 w-4" />Request revision</Button><Button disabled={saving} onClick={() => recordDecision('accepted')}><Check className="mr-2 h-4 w-4" />Accept sample draft</Button></div> : <p className="text-sm text-muted-foreground">A clinic doctor or owner must record the review decision.</p>}
          </section>
        </div>}
      </section>
    </div>
  </div>;
}