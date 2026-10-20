import { useRef, useState } from 'react';
import { BrainCircuit, Check, FileText, FolderLock, Loader2, Lock, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Row, useRows } from './hc';
import PilotReadiness from './PilotReadiness';
import { cmeCaseStatus, cmePortalAccess } from './cme-portal-policy';
import DataLoadErrors from './DataLoadErrors';

const statusLabels = {
  awaiting_review: 'Awaiting doctor review',
  revision_requested: 'Revision requested',
  reviewed: 'Sample reviewed',
  source_links_missing: 'Source links unavailable',
};

export default function RecordReview({ clinicId, clinicRole }: { clinicId: string; clinicRole: string }) {
  if (!cmePortalAccess(clinicId, clinicRole).clinicMember) return <section role="alert" className="border-y py-8"><h2 className="text-xl font-semibold">Clinic access required</h2><p className="mt-2 text-sm text-muted-foreground">CME files are available only to registered clinic members. Patient uploads remain locked.</p><Button variant="outline" asChild className="mt-4"><Link to="/health/app">Return to clinic sign-in</Link></Button></section>;
  return <ClinicRecordReview key={clinicId} clinicId={clinicId} clinicRole={clinicRole} />;
}

function ClinicRecordReview({ clinicId, clinicRole }: { clinicId: string; clinicRole: string }) {
  const docs = useRows('hc_documents', clinicId);
  const reviews = useRows('hc_reviews', clinicId);
  const decisions = useRows('hc_review_decisions', clinicId);
  const [selected, setSelected] = useState<string | null>(null);
  const [sourcePage, setSourcePage] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const active = reviews.rows.find(r => r.document_id === selected && r.result?.sample_case_id === 'fictional-cme-v1');
  const result = active?.result;
  const decision = decisions.rows.filter(d => d.review_id === active?.id).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
  const sources: Row[] = result?.source_pages ?? [];
  const source = sources.find(s => s.page === sourcePage);
  const access = cmePortalAccess(clinicId, clinicRole);
  const canDecide = access.canReview;

  const generate = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-review', { body: { action: 'generate', clinic_id: clinicId, sample_case_id: 'fictional-cme-v1' } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Review failed');
      const [savedDocs, savedReviews] = await Promise.all([docs.reload(), reviews.reload()]);
      if (!savedDocs?.some(d => d.id === data?.review?.document_id) || !savedReviews?.some(r => r.id === data?.review?.id)) throw new Error('The request completed, but the saved review could not be confirmed. Refresh records before trying again.');
      setSelected(data.review.document_id); setSourcePage(null);
      toast.success('Source-linked draft saved for physician review');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Review failed'); }
    finally { pending.current = false; setBusy(false); }
  };
  const recordDecision = async (value: 'accepted' | 'revision_requested') => {
    if (!active || decision || pending.current || decisions.loading || decisions.error) return;
    pending.current = true;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-review', { body: { action: 'decision', review_id: active.id, decision: value } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Could not save decision');
      const saved = await decisions.reload();
      if (!saved?.some(d => d.review_id === active.id && d.decision === value)) throw new Error('The request completed, but the saved decision could not be confirmed. Refresh records before trying again.');
      toast.success('Sample review decision saved');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not save decision'); }
    finally { pending.current = false; setSaving(false); }
  };

  return <div className="space-y-6">
    <DataLoadErrors sources={[docs, reviews, decisions]} />
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
      <div><Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Phase 1 · Fictional records</Badge>
        <h2 className="text-xl font-semibold">CME files & doctor review</h2>
        <p className="mt-1 text-sm text-muted-foreground">Compulsory Medical Examination · Drafts for physician review</p></div>
      <Button disabled={busy} onClick={generate} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
        {busy ? 'Kayla is reviewing…' : 'Review built-in fictional case'}
      </Button>
    </div>
    <section aria-label="CME upload status" className="border-y py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3"><FolderLock className="mt-1 h-6 w-6 shrink-0 text-mansagold" /><div className="min-w-0"><h3 className="font-semibold">Patient file intake · Locked</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">No files can be selected, dropped, previewed or uploaded here. The fictional case below is supplied by 1325 Clinical EMR / EHR, not uploaded by your clinic.</p></div></div>
        <Button disabled={!access.uploadsAllowed}><Lock className="mr-2 h-4 w-4" />Upload CME files · Locked</Button>
      </div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        <div><dt className="text-muted-foreground">Clinic access</dt><dd className="mt-1 font-medium">Registered member · Sample workspace only</dd></div>
        <div><dt className="text-muted-foreground">Agreement & vendor coverage</dt><dd className="mt-1 font-medium">Not independently verified</dd></div>
        <div><dt className="text-muted-foreground">Patient uploads</dt><dd className="mt-1 font-medium text-mansagold">Blocked</dd></div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">A signed attorney-approved Business Associate Agreement (BAA), confirmed coverage for every service handling records, and independently verified healthcare safeguards are all required. Clinic checklist reports do not grant approval.</p>
      <Button asChild variant="link" className="mt-2 h-auto px-0"><Link to="/health/intake">View clinic intake & agreement requirements</Link></Button>
    </section>
    <ol aria-label="Case review stages" className="grid gap-4 border-b pb-6 text-sm sm:grid-cols-3">
      <li><span className="font-semibold">01 · File intake</span><p className="mt-1 text-muted-foreground">Real uploads locked · Built-in fictional case available</p></li>
      <li><span className="font-semibold">02 · Source-linked draft</span><p className="mt-1 text-muted-foreground">Timeline, contradictions and missing records</p></li>
      <li><span className="font-semibold">03 · Doctor review</span><p className="mt-1 text-muted-foreground">Check cited pages · Accept or request revision</p></li>
    </ol>
    <div className="flex items-start gap-3 rounded-md border border-mansagold/30 bg-mansagold/5 p-4 text-sm">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
      <div><p className="font-medium">Real record uploads and patient calls are blocked.</p>
        <p className="mt-1 text-muted-foreground">Only the built-in six-page fictional case is available. Real records require healthcare attorney and vendor clearance; calls also require approved consent safeguards.</p></div>
    </div>
    <PilotReadiness clinicId={clinicId} clinicRole={clinicRole} />
    <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <section className="min-w-0 space-y-3"><h3 className="text-sm font-semibold">Review files</h3>
        {docs.loading && <p className="text-sm text-muted-foreground">Loading files…</p>}
        {!docs.loading && docs.rows.length === 0 && <p className="text-sm text-muted-foreground">No drafts yet.</p>}
        {docs.rows.map(d => {
          const review = reviews.rows.find(r => r.document_id === d.id && r.result?.sample_case_id === 'fictional-cme-v1');
          const status = cmeCaseStatus(Boolean(review?.result?.source_pages?.length), decisions.rows.filter(item => item.review_id === review?.id).map(item => ({ decision: item.decision, created_at: item.created_at })));
          return <Button key={d.id} variant="outline" className={`h-auto w-full justify-start whitespace-normal p-3 text-left ${selected === d.id ? 'border-mansagold' : ''}`} onClick={() => { setSelected(d.id); setSourcePage(null); }}>
            <FileText className="mr-2 h-4 w-4 shrink-0" /><span className="min-w-0"><span className="block break-words">{d.file_name}</span><span className="mt-1 block text-xs text-muted-foreground">{d.pages} pages · Fictional sample</span><span className="mt-2 block text-xs text-mansagold">{statusLabels[status]}</span></span>
          </Button>;
        })}
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
            {canDecide ? <div className="flex flex-wrap gap-2"><Button variant="outline" disabled={saving || busy || decisions.loading || Boolean(decisions.error) || Boolean(decision)} onClick={() => recordDecision('revision_requested')}><RotateCcw className="mr-2 h-4 w-4" />Request revision</Button><Button disabled={saving || busy || decisions.loading || Boolean(decisions.error) || Boolean(decision)} onClick={() => recordDecision('accepted')}><Check className="mr-2 h-4 w-4" />Accept sample draft</Button></div> : <p className="text-sm text-muted-foreground">A clinic doctor or owner must record the review decision.</p>}
          </section>
        </div>}
      </section>
    </div>
  </div>;
}