import { useState } from 'react';
import { Check, Download, Loader2, Lock, Mic, NotebookPen, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Row, useRows } from './hc';
import { canSign, SAMPLE_VISITS } from './sample-visits';
import { buildReviewedReport } from './reviewed-report';
import logo1325 from '@/assets/1325-ai-logo.png';

const logoImg = typeof Image !== 'undefined' ? Object.assign(new Image(), { src: logo1325 }) : undefined;
const SECTIONS = [
  ['subjective', 'Patient\u2019s story'],
  ['objective', 'Exam findings'],
  ['assessment', 'Assessment'],
  ['plan', 'Plan'],
] as const;

export default function VisitNotes({ clinicId, clinicRole }: { clinicId: string; clinicRole: string }) {
  const notes = useRows('hc_visit_notes', clinicId);
  const signoffs = useRows('hc_note_signoffs', clinicId);
  const [visitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hl, setHl] = useState<number[]>([]);
  const visit = SAMPLE_VISITS.find((v) => v.id === visitId)!;
  const note: Row | undefined = notes.rows.find((n) => n.sample_visit_id === visitId);
  const signoff = signoffs.rows.find((s) => s.note_id === note?.id);
  const doctor = canSign(clinicRole);

  const draft = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-notes', { body: { action: 'generate', clinic_id: clinicId, sample_visit_id: visitId } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Draft failed');
      await notes.reload(); setHl([]);
      toast.success('Draft note ready for doctor review');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Draft failed'); }
    finally { setBusy(false); }
  };
  const decide = async (decision: 'signed' | 'rejected') => {
    if (!note) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-notes', { body: { action: 'decision', note_id: note.id, decision } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Could not save');
      await signoffs.reload(); toast.success(decision === 'signed' ? 'Note signed' : 'Note sent back');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save'); }
    finally { setSaving(false); }
  };

  const status = !note ? null : signoff ? (signoff.decision === 'signed' ? 'Signed by doctor' : 'Rejected by doctor') : 'Draft — AI generated · awaiting doctor';

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
      <div>
        <Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional sample visits only</Badge>
        <h2 className="text-xl font-semibold">AI note-taking</h2>
        <p className="mt-1 text-sm text-muted-foreground">Kayla drafts a visit note from the transcript. A doctor signs every note.</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Button variant="outline" disabled aria-disabled><Lock className="mr-2 h-4 w-4" /><Mic className="mr-2 h-4 w-4" />Record live visit</Button>
        <span className="text-xs text-muted-foreground">Live visit recording unlocks after HIPAA clearance.</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {SAMPLE_VISITS.map((v) => <Button key={v.id} size="sm" variant={v.id === visitId ? 'default' : 'outline'} onClick={() => { setVisitId(v.id); setHl([]); }}>{v.title}</Button>)}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-label="Sample transcript" className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 font-semibold">Transcript (fictional)</h3>
        <ol className="space-y-1 text-sm">
          {visit.lines.map((l, i) => <li key={i} className={`rounded px-2 py-1 ${hl.includes(i + 1) ? 'bg-mansagold/20' : ''}`}><span className="mr-2 text-xs text-muted-foreground">L{i + 1}</span>{l}</li>)}
        </ol>
      </section>

      <section aria-label="Draft note" className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Visit note</h3>
          {status && <Badge variant={signoff?.decision === 'signed' ? 'default' : 'outline'}>{status}</Badge>}
        </div>
        {notes.loading ? <p className="text-sm text-muted-foreground">Loading…</p> : !note ? (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>No note yet for this visit.</p>
            <Button onClick={draft} disabled={busy} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <NotebookPen className="mr-2 h-4 w-4" />}
              {busy ? 'Kayla is writing…' : 'Draft note with Kayla'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            {SECTIONS.map(([k, label]) => <div key={k}>
              <h4 className="mb-1 font-medium text-mansagold">{label}</h4>
              {(note.note[k] ?? []).length === 0 ? <p className="text-muted-foreground">Not stated in the visit.</p> :
                <ul className="space-y-1">{note.note[k].map((it: Row, i: number) => <li key={i}>
                  <button type="button" onClick={() => setHl(it.lines)} className="text-left hover:underline">{it.text}</button>
                  <span className="ml-1 text-xs text-muted-foreground">({it.lines.map((n: number) => `L${n}`).join(', ')})</span>
                </li>)}</ul>}
            </div>)}
            {(note.note.flags ?? []).length > 0 && <div className="rounded border border-mansagold/40 bg-mansagold/5 p-3">
              <h4 className="mb-1 font-medium">Needs physician review</h4>
              <ul className="list-disc space-y-1 pl-5">{note.note.flags.map((f: Row, i: number) => <li key={i}>{f.text}</li>)}</ul>
            </div>}
            {!signoff && (doctor ? <div className="flex gap-2 border-t pt-3">
              <Button size="sm" disabled={saving} onClick={() => decide('signed')}><Check className="mr-1 h-4 w-4" />Sign note</Button>
              <Button size="sm" variant="outline" disabled={saving} onClick={() => decide('rejected')}><X className="mr-1 h-4 w-4" />Reject</Button>
            </div> : <p className="border-t pt-3 text-xs text-muted-foreground">Only a clinic doctor or owner can sign this note.</p>)}
            {signoff?.decision === 'rejected' && <Button size="sm" variant="outline" disabled={busy} onClick={draft}>Draft a new version</Button>}
            {signoff?.decision === 'signed' && <Button size="sm" variant="outline" onClick={() => {
              try {
                
                const doc = buildReviewedReport({ visitTitle: visit.title, transcript: visit.lines, note: note.note, decision: signoff.decision, signedAt: signoff.created_at }, logoImg?.complete ? logoImg : undefined);
                doc.save(`1325-clinical-reviewed-note-${visit.id}.pdf`);
              } catch (e) { toast.error((e as Error).message); }
            }}><Download className="mr-1 h-4 w-4" />Download signed report (PDF)</Button>}
            <p className="text-xs text-muted-foreground">Tap any line to see where it came from in the transcript. Kayla supports clinicians; she does not diagnose.</p>
          </div>
        )}
      </section>
    </div>
  </div>;
}
