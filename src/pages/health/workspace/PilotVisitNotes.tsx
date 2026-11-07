import React, { useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { FilePen, Lock, Mic, Plus } from 'lucide-react';
import { DICTATION_REMINDER, appendDictation } from '@/lib/clinical/dictation';
import DictationButton from './DictationButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { validateErrorReason } from '@/lib/clinical/pilot-records';
import {
  NOTE_SECTIONS, NOTE_STATUS_LABELS, canAddAddendum, canEditNote, validateAddendum, validateVisitNote,
  type NoteStatus, type VisitNoteInput,
} from '@/lib/clinical/pilot-visit-notes';
import DataLoadErrors from './DataLoadErrors';
import { db, Row, useRows } from './hc';

type Props = { clinicId: string; patientId: string; userId: string | null; onChanged?: () => void };
const todayIso = () => format(new Date(), 'yyyy-MM-dd');
const blank = (): VisitNoteInput => ({ visit_date: todayIso(), visit_reason: '', subjective: '', objective: '', assessment: '', plan: '' });
const clean = (v?: string | null) => (v && v.trim() ? v.trim() : null);

export default function PilotVisitNotes({ clinicId, patientId, userId, onChanged }: Props) {
  const notes = useRows('hc_pilot_visit_notes', clinicId, { order: 'visit_date', asc: false, eq: ['patient_id', patientId] });
  const addenda = useRows('hc_pilot_note_addenda', clinicId, { order: 'created_at', asc: true });
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const reload = async () => { await Promise.all([notes.reload(), addenda.reload()]); onChanged?.(); };

  return (
    <div className="space-y-4">
      {editing ? (
        <NoteEditor clinicId={clinicId} patientId={patientId} note={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload(); }} />
      ) : (
        <Button onClick={() => setEditing('new')} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Plus className="mr-1 h-4 w-4" />New visit note</Button>
      )}
      <DataLoadErrors sources={[notes, addenda]} />
      {notes.loading ? <p role="status" className="text-sm text-muted-foreground">Loading visit notes…</p>
        : !notes.error && notes.rows.length === 0 ? <p className="text-sm text-muted-foreground">No visit notes yet. Start one with “New visit note”.</p>
        : notes.rows.map((n) => (
          <NoteCard key={n.id} note={n} userId={userId} addenda={addenda.rows.filter((a) => a.note_id === n.id)}
            onEdit={() => setEditing(n)} onChanged={reload} clinicId={clinicId} />
        ))}
    </div>
  );
}

function NoteEditor({ clinicId, patientId, note, onCancel, onSaved }: { clinicId: string; patientId: string; note: Row | null; onCancel: () => void; onSaved: () => void | Promise<void> }) {
  const [f, setF] = useState<VisitNoteInput>(note ? {
    visit_date: note.visit_date, visit_reason: note.visit_reason, subjective: note.subjective ?? '',
    objective: note.objective ?? '', assessment: note.assessment ?? '', plan: note.plan ?? '',
  } : blank());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmSign, setConfirmSign] = useState(false);
  const [dictating, setDictating] = useState<string | null>(null);
  const pending = useRef(false);

  const save = async (sign: boolean) => {
    if (pending.current) return;
    if (dictating) { setError('Finish talk-to-type first, then save.'); setConfirmSign(false); return; }
    const problem = validateVisitNote(f, { forSigning: sign });
    if (problem) { setError(problem); setConfirmSign(false); return; }
    pending.current = true; setSaving(true); setError('');
    const payload = {
      visit_date: f.visit_date, visit_reason: f.visit_reason.trim(), subjective: clean(f.subjective),
      objective: clean(f.objective), assessment: clean(f.assessment), plan: clean(f.plan),
    };
    try {
      let id: string | undefined = note?.id;
      if (!note) {
        const { data, error: e } = await db.from('hc_pilot_visit_notes').insert({ ...payload, clinic_id: clinicId, patient_id: patientId }).select('id').single();
        if (e) throw new Error(e.message);
        id = data?.id;
        if (!id) throw new Error('The note could not be confirmed as saved. Refresh before trying again.');
      } else {
        const { data, error: e } = await db.from('hc_pilot_visit_notes').update(payload).eq('id', note.id).eq('status', 'draft').select('id');
        if (e) throw new Error(e.message);
        if (!data?.length) throw new Error('This draft changed or was signed elsewhere. Refresh and try again.');
      }
      if (sign) {
        const { data, error: e } = await db.from('hc_pilot_visit_notes').update({ status: 'signed' }).eq('id', id).eq('status', 'draft').select('id, status');
        if (e) throw new Error(`Draft saved, but signing failed: ${e.message}`);
        if (data?.[0]?.status !== 'signed') throw new Error('Draft saved, but the signature could not be confirmed. Refresh and check.');
        toast.success('Visit note signed and locked');
      } else toast.success('Draft saved');
      await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'The note could not be saved.'); }
    finally { pending.current = false; setSaving(false); setConfirmSign(false); }
  };

  return (
    <Card className="border-mansagold/40">
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FilePen className="h-4 w-4" />{note ? 'Edit draft visit note' : 'New visit note'}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label htmlFor="vn-date">Visit date</Label><Input id="vn-date" type="date" value={f.visit_date} max={todayIso()} onChange={(e) => setF({ ...f, visit_date: e.target.value })} /></div>
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="vn-reason">Reason for visit *</Label><Input id="vn-reason" value={f.visit_reason} maxLength={140} placeholder="Blood pressure follow-up" onChange={(e) => setF({ ...f, visit_reason: e.target.value })} /></div>
        </div>
        <p className="flex items-center gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 px-3 py-2 text-xs text-foreground"><Mic className="h-3.5 w-3.5 shrink-0 text-mansagold" />Talk to type: {DICTATION_REMINDER} Check every word before you sign. Recordings are not kept.</p>
        {NOTE_SECTIONS.map((s) => (
          <div key={s.key} className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor={`vn-${s.key}`}>{s.label}{s.key === 'assessment' || s.key === 'plan' ? ' (needed to sign)' : ''}</Label>
              <DictationButton clinicId={clinicId} sectionLabel={s.label} disabled={saving || (dictating !== null && dictating !== s.key)}
                onBusyChange={(busy) => setDictating((cur) => (busy ? s.key : cur === s.key ? null : cur))}
                onError={(m) => toast.error(m)}
                onText={(spoken) => setF((cur) => {
                  const next = appendDictation(cur[s.key] ?? '', spoken);
                  if (next.truncated) toast.warning(`${s.label} reached the 5,000-character limit, so the end was cut off.`);
                  return { ...cur, [s.key]: next.text };
                })} />
            </div>
            <Textarea id={`vn-${s.key}`} rows={3} maxLength={5000} placeholder={s.hint} value={f[s.key] ?? ''} onChange={(e) => setF({ ...f, [s.key]: e.target.value })} />
          </div>
        ))}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>{saving ? 'Saving…' : 'Save draft'}</Button>
          <Button onClick={() => setConfirmSign(true)} disabled={saving} className="bg-mansagold text-mansablue hover:bg-mansagold-dark"><Lock className="mr-1 h-4 w-4" />Sign & lock</Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </CardContent>
      <AlertDialog open={confirmSign} onOpenChange={setConfirmSign}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign and lock this note?</AlertDialogTitle>
            <AlertDialogDescription>Once signed, nobody can change this note — including you. Later changes go on as dated addenda. This is a pilot note for a made-up test patient.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Keep editing</AlertDialogCancel>
            <AlertDialogAction disabled={saving} onClick={(e) => { e.preventDefault(); void save(true); }}>{saving ? 'Signing…' : 'Sign & lock'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function NoteCard({ note: n, userId, addenda, onEdit, onChanged, clinicId }: { note: Row; userId: string | null; addenda: Row[]; onEdit: () => void; onChanged: () => Promise<unknown>; clinicId: string }) {
  const [mode, setMode] = useState<'none' | 'addendum' | 'error'>('none');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const status = n.status as NoteStatus;
  const errored = status === 'entered_in_error';

  const submit = async () => {
    if (pending.current) return;
    const problem = mode === 'addendum' ? validateAddendum(text) : validateErrorReason(text);
    if (problem) { toast.error(problem); return; }
    pending.current = true; setSaving(true);
    try {
      if (mode === 'addendum') {
        const { data, error } = await db.from('hc_pilot_note_addenda').insert({ clinic_id: clinicId, note_id: n.id, body: text.trim() }).select('id').single();
        if (error) throw new Error(error.message);
        if (!data?.id) throw new Error('The addendum could not be confirmed as saved.');
        toast.success('Addendum added');
      } else {
        const { data, error } = await db.from('hc_pilot_visit_notes').update({ status: 'entered_in_error', error_reason: text.trim() }).eq('id', n.id).eq('status', n.status).select('id');
        if (error) throw new Error(error.message);
        if (!data?.length) throw new Error('The note changed before your update. Refresh and try again.');
        toast.success('Note marked as entered in error');
      }
      setMode('none'); setText(''); await onChanged();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not save.'); }
    finally { pending.current = false; setSaving(false); }
  };

  const canErr = status === 'signed' || canEditNote(n as { status: string; created_by: string }, userId);

  return (
    <article className={`rounded-lg border bg-card p-4 ${errored ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-semibold ${errored ? 'line-through' : ''}`}>{n.visit_reason}</span>
            <Badge variant={status === 'signed' ? 'default' : 'outline'}>{status === 'signed' && <Lock className="mr-1 h-3 w-3" />}{NOTE_STATUS_LABELS[status] ?? status}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Visit {format(parseISO(n.visit_date), 'MMM d, yyyy')} · written by {n.author_email ?? 'team member'}
            {n.signed_at && <> · signed {format(parseISO(n.signed_at), 'MMM d, yyyy h:mm a')} by {n.signer_email ?? 'author'}</>}
          </p>
        </div>
        {canEditNote(n as { status: string; created_by: string }, userId) && <Button size="sm" variant="outline" onClick={onEdit}>Edit draft</Button>}
      </div>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {NOTE_SECTIONS.map((s) => (
          <div key={s.key}>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</dt>
            <dd className="whitespace-pre-wrap text-sm">{n[s.key] || <span className="text-muted-foreground">—</span>}</dd>
          </div>
        ))}
      </dl>
      {errored && <p className="mt-3 text-xs text-destructive">Entered in error: {n.error_reason}</p>}
      {addenda.length > 0 && (
        <div className="mt-4 space-y-2 border-t pt-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Addenda</div>
          {addenda.map((a) => (
            <div key={a.id} className="rounded-md bg-muted/50 p-3 text-sm">
              <p className="whitespace-pre-wrap">{a.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{format(parseISO(a.created_at), 'MMM d, yyyy h:mm a')} · {a.author_email ?? 'team member'}</p>
            </div>
          ))}
        </div>
      )}
      {!errored && (mode === 'none' ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {canAddAddendum(n as { status: string }) && <Button size="sm" variant="outline" onClick={() => setMode('addendum')}><Plus className="mr-1 h-3 w-3" />Add addendum</Button>}
          {canErr && <Button size="sm" variant="ghost" className="text-xs" onClick={() => setMode('error')}>{status === 'draft' ? 'Discard draft' : 'Mark as entered in error'}</Button>}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {mode === 'addendum'
            ? <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={5000} placeholder="Addendum (for example: lab results reviewed, normal)" aria-label="Addendum" />
            : <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={300} placeholder="Reason (e.g. wrong patient)" aria-label="Reason for marking in error" />}
          <div className="flex gap-2">
            <Button size="sm" variant={mode === 'error' ? 'destructive' : 'default'} onClick={submit} disabled={saving}>{saving ? 'Saving…' : mode === 'addendum' ? 'Save addendum' : 'Confirm'}</Button>
            <Button size="sm" variant="ghost" onClick={() => { setMode('none'); setText(''); }} disabled={saving}>Cancel</Button>
          </div>
        </div>
      ))}
    </article>
  );
}
