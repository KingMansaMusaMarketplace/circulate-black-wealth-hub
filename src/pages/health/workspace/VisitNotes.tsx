import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Download, Loader2, Lock, Mic, NotebookPen, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Row, useRows } from './hc';
import { canSign, SAMPLE_VISITS } from './sample-visits';
import { buildReviewedReport } from './reviewed-report';
import logo1325 from '@/assets/1325-ai-logo.png';
import DataLoadErrors from './DataLoadErrors';

const logoImg = typeof Image !== 'undefined' ? Object.assign(new Image(), { src: logo1325 }) : undefined;
const SECTIONS = [
  ['subjective', 'Patient\u2019s story'],
  ['objective', 'Exam findings'],
  ['assessment', 'Assessment'],
  ['plan', 'Plan'],
] as const;

export default function VisitNotes({ clinicId, clinicRole, selectedVisitId }: { clinicId: string; clinicRole: string; selectedVisitId?: string }) {
  const notes = useRows('hc_visit_notes', clinicId);
  const signoffs = useRows('hc_note_signoffs', clinicId);
  const [localVisitId, setVisitId] = useState<string>(SAMPLE_VISITS[0].id);
  const visitId = selectedVisitId ?? localVisitId;
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const [hl, setHl] = useState<number[]>([]);
  const visit = SAMPLE_VISITS.find((v) => v.id === visitId);
  const note: Row | undefined = notes.rows.find((n) => n.sample_visit_id === visitId);
  const signoff = signoffs.rows.find((s) => s.note_id === note?.id);
  const doctor = canSign(clinicRole);
  const { user } = useAuth();
  const members = useRows('hc_members', clinicId);
  const myName = members.rows.find((m) => m.user_id === user?.id)?.display_name ?? '';
  const [signerName, setSignerName] = useState('');
  useEffect(() => { setSignerName(myName); }, [myName, user?.id, clinicId]);
  useEffect(() => { setHl([]); }, [visitId, clinicId]);

  const draft = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-notes', { body: { action: 'generate', clinic_id: clinicId, sample_visit_id: visitId } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Draft failed');
      await notes.reload(); setHl([]);
      toast.success('Draft note ready for doctor review');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Draft failed'); }
    finally { pending.current = false; setBusy(false); }
  };
  const decide = async (decision: 'signed' | 'rejected') => {
    if (!note || pending.current || notes.error || signoffs.error || signoffs.loading) return;
    pending.current = true;
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-kayla-notes', { body: { action: 'decision', note_id: note.id, decision, signer_name: signerName.trim() } });
      if (error || data?.error) throw new Error(data?.error ?? error?.message ?? 'Could not save');
      await signoffs.reload(); toast.success(decision === 'signed' ? 'Note signed' : 'Note sent back');
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save'); }
    finally { pending.current = false; setSaving(false); }
  };

  const status = !note ? null : signoffs.loading || signoffs.error ? 'Decision not verified' : signoff ? (signoff.decision === 'signed' ? 'Sample signing recorded' : 'Sample rejection recorded') : 'Draft — AI selected · awaiting review';

  if (!visit) return <p role="alert">Only built-in fictional visits are available.</p>;

  return <div className="space-y-6">
    <DataLoadErrors sources={[notes, signoffs, members]} />
    <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
      <div>
        <Badge variant="outline" className="mb-2 border-mansagold/40 text-mansagold">Fictional sample visits only</Badge>
        <h2 className="text-xl font-semibold">AI note-taking</h2>
        <p className="mt-1 text-sm text-muted-foreground">Kayla organizes exact fictional transcript excerpts. A clinic doctor or owner reviews the sample.</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Button variant="outline" disabled aria-disabled><Lock className="mr-2 h-4 w-4" /><Mic className="mr-2 h-4 w-4" />Record live visit</Button>
        <span className="text-xs text-muted-foreground">Live visit recording unlocks after HIPAA clearance.</span>
      </div>
    </div>

    {!selectedVisitId && <div className="flex flex-wrap gap-2">
      {SAMPLE_VISITS.map((v) => <Button key={v.id} size="sm" variant={v.id === visitId ? 'default' : 'outline'} onClick={() => { setVisitId(v.id); setHl([]); }}>{v.title}</Button>)}
    </div>}

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
            {!signoff && (doctor ? <div className="space-y-2 border-t pt-3">
              <label className="block text-xs font-medium" htmlFor="signer-name">Your name as it should appear on the signed report</label>
              <Input id="signer-name" value={signerName} maxLength={100} placeholder="Your sample reviewer display name" onChange={(e) => setSignerName(e.target.value)} />
              <p className="text-xs text-muted-foreground">This records your account’s sample-role attestation. Entered names and team roles do not verify physician identity, qualifications or licensure.</p>
              <div className="flex gap-2">
              <Button size="sm" disabled={saving || busy || signoffs.loading || Boolean(signoffs.error) || signerName.trim().length < 2} onClick={() => decide('signed')}><Check className="mr-1 h-4 w-4" />Sign sample note</Button>
              <Button size="sm" variant="outline" disabled={saving || busy || signoffs.loading || Boolean(signoffs.error) || signerName.trim().length < 2} onClick={() => decide('rejected')}><X className="mr-1 h-4 w-4" />Reject</Button>
              </div>
            </div> : <p className="border-t pt-3 text-xs text-muted-foreground">Only a clinic doctor or owner can sign this note.</p>)}
            {signoff?.signer_name && <p className="text-xs text-muted-foreground">Decision by {signoff.signer_name}</p>}
            {signoff?.decision === 'rejected' && <Button size="sm" variant="outline" disabled={busy} onClick={draft}>Draft a new version</Button>}
            {signoff?.decision === 'signed' && <Button size="sm" variant="outline" onClick={() => {
              try {
                if (signoffs.loading || signoffs.error || notes.error) throw new Error('Saved signing status must be verified before export. Retry loading.');
                const doc = buildReviewedReport({ visitTitle: visit.title, transcript: visit.lines, note: note.note, decision: signoff.decision, signedAt: signoff.created_at, signerName: signoff.signer_name ?? undefined }, logoImg?.complete ? logoImg : undefined);
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
