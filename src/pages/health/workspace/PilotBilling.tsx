import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { AlertTriangle, FilePlus2, Plus, Receipt, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db, Row, useRows } from './hc';
import DataLoadErrors from './DataLoadErrors';
import { usePilotPrivacy } from './PilotPrivacy';
import {
  CLAIM_NOT_SENT_NOTICE, CLAIM_STATUS_LABELS, MAX_DX, MAX_LINES, claimTotalCents, dollarsToCents, formatCents, isClosedClaim, normalizeDx,
  summarizeClaims, validateClaimDraft, validateClaimReason, validatePaidAmount, type ClaimLine, type ClaimStatus,
} from '@/lib/clinical/practice-billing';
import type { PilotPermissions } from '@/lib/clinical/pilot-roles';

const gold = 'bg-mansagold text-mansablue hover:bg-mansagold-dark';
const fmt = (d?: string | null) => (d ? format(parseISO(d), 'MMM d, yyyy') : '—');
const statusVariant = (s: string) => (s === 'practice_denied' || s === 'void' ? 'destructive' : s === 'practice_paid' ? 'default' : s === 'draft' ? 'outline' : 'secondary') as 'destructive' | 'default' | 'outline' | 'secondary';

type Props = { clinicId: string; patients: Row[]; perms: PilotPermissions };

export default function PilotBilling({ clinicId, patients, perms }: Props) {
  const { name } = usePilotPrivacy();
  const claims = useRows('hc_pilot_claims', perms.workClaims ? clinicId : null, { order: 'service_date', asc: false });
  const [visits, setVisits] = useState<Row[]>([]);
  const [visitsError, setVisitsError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [starting, setStarting] = useState<string | null>(null);
  const loadVisits = useCallback(async () => {
    const { data, error } = await db.rpc('hc_pilot_billable_visits', { _clinic: clinicId });
    if (error) { setVisits([]); setVisitsError('Signed visits could not be loaded. Try again.'); return; }
    setVisitsError(''); setVisits(data ?? []);
  }, [clinicId]);
  useEffect(() => { if (perms.workClaims) void loadVisits(); }, [loadVisits, perms.workClaims]);
  const patientById = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);
  const summary = useMemo(() => summarizeClaims(claims.rows as never[]), [claims.rows]);
  const unbilled = visits.filter((v) => !v.has_claim);
  const open = claims.rows.find((c) => c.id === openId);

  if (!perms.workClaims) return <p className="text-sm text-muted-foreground">Practice billing is for the clinic owner, doctors and billers.</p>;

  const start = async (v: Row) => {
    if (starting) return;
    setStarting(v.note_id);
    try {
      const p = patientById.get(v.patient_id);
      const { data: auth } = await db.auth.getUser();
      const { data, error } = await db.from('hc_pilot_claims').insert({
        clinic_id: clinicId, patient_id: v.patient_id, visit_note_id: v.note_id, service_date: v.visit_date,
        payer_name: p?.insurance_company || 'Self-pay', member_id: p?.insurance_member_id || null, diagnosis_codes: [], lines: [], created_by: auth?.user?.id,
      }).select('id').single();
      if (error) throw new Error(error.message);
      if (!data?.id) throw new Error('The claim could not be confirmed as saved. Refresh before trying again.');
      toast.success('Practice claim started');
      await claims.reload(); await loadVisits(); setOpenId(data.id);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Claim could not be started.'); }
    finally { setStarting(null); }
  };

  if (open) {
    const visit = visits.find((v) => v.note_id === open.visit_note_id);
    return <ClaimEditor claim={open} patientName={patientById.get(open.patient_id) ? name(patientById.get(open.patient_id)!) : 'Test patient'} visit={visit}
      onClose={() => setOpenId(null)} onChanged={async () => { await claims.reload(); await loadVisits(); }} />;
  }

  return (
    <div className="space-y-4">
      <p role="note" className="flex gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-xs text-muted-foreground"><AlertTriangle className="h-4 w-4 shrink-0 text-mansagold" />{CLAIM_NOT_SENT_NOTICE}</p>
      <div className="grid gap-3 sm:grid-cols-4">
        {[['Billed (practice)', summary.billed], ['Waiting on payer', summary.waiting], ['Paid (practice)', summary.paid], ['Denied', summary.denied]].map(([l, v]) => (
          <Card key={l as string}><CardContent className="pt-5"><div className="text-xs uppercase text-muted-foreground">{l}</div><div className="text-2xl font-semibold">{formatCents(v as number)}</div></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Signed visits not billed yet</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {visitsError && <p role="alert" className="text-sm text-destructive">{visitsError}</p>}
          {unbilled.length === 0 ? <p className="text-sm text-muted-foreground">Every signed visit has a claim. A visit appears here after the doctor signs its note.</p>
            : unbilled.map((v) => (
              <div key={v.note_id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3 text-sm">
                <div><b>{patientById.get(v.patient_id) ? name(patientById.get(v.patient_id)!) : 'Test patient'}</b> · {fmt(v.visit_date)} · {v.visit_reason}
                  {v.assessment && <p className="text-xs text-muted-foreground">Doctor’s assessment: {v.assessment}</p>}</div>
                <Button size="sm" className={gold} disabled={!!starting} onClick={() => void start(v)}><FilePlus2 className="mr-1 h-4 w-4" />{starting === v.note_id ? 'Starting…' : 'Start claim'}</Button>
              </div>
            ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-4 w-4" />Practice claims</CardTitle></CardHeader>
        <CardContent>
          <DataLoadErrors sources={[claims]} />
          {claims.loading ? <p role="status" className="text-sm text-muted-foreground">Loading claims…</p>
            : claims.rows.length === 0 ? <p className="text-sm text-muted-foreground">No practice claims yet.</p>
            : (
              <Table>
                <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Visit date</TableHead><TableHead>Payer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>{claims.rows.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => setOpenId(c.id)}>
                    <TableCell className="font-medium">{patientById.get(c.patient_id) ? name(patientById.get(c.patient_id)!) : 'Test patient'}</TableCell>
                    <TableCell>{fmt(c.service_date)}</TableCell><TableCell>{c.payer_name}</TableCell><TableCell>{formatCents(c.total_cents)}</TableCell>
                    <TableCell><Badge variant={statusVariant(c.status)}>{CLAIM_STATUS_LABELS[c.status as ClaimStatus] ?? c.status}</Badge></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

type LineForm = { code: string; modifier: string; units: string; charge: string; dx: number[] };
const toForm = (l: ClaimLine): LineForm => ({ code: l.code, modifier: l.modifier ?? '', units: String(l.units), charge: (l.charge_cents / 100).toFixed(2), dx: l.dx_pointers });
const fromForm = (l: LineForm): ClaimLine => ({
  code: l.code.trim().toUpperCase(), modifier: l.modifier.trim() ? l.modifier.trim().toUpperCase() : null,
  units: Number(l.units), charge_cents: dollarsToCents(l.charge) ?? -1, dx_pointers: [...l.dx].sort((a, b) => a - b),
});

function ClaimEditor({ claim: c, patientName, visit, onClose, onChanged }: { claim: Row; patientName: string; visit?: Row; onClose: () => void; onChanged: () => Promise<unknown> }) {
  const draft = c.status === 'draft';
  const [payer, setPayer] = useState<string>(c.payer_name ?? '');
  const [member, setMember] = useState<string>(c.member_id ?? '');
  const [dx, setDx] = useState<string[]>(c.diagnosis_codes?.length ? c.diagnosis_codes : ['']);
  const [lines, setLines] = useState<LineForm[]>(((c.lines ?? []) as ClaimLine[]).map(toForm));
  const [reason, setReason] = useState('');
  const [paid, setPaid] = useState('');
  const [mode, setMode] = useState<'pay' | 'deny' | 'void' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const dxList = normalizeDx(dx);
  const built = lines.map(fromForm);
  const total = claimTotalCents(built.map((l) => ({ ...l, charge_cents: Math.max(l.charge_cents, 0), units: Number.isFinite(l.units) ? l.units : 0 })));

  const update = async (patch: Row, ok: string) => {
    if (pending.current) return;
    pending.current = true; setSaving(true); setError('');
    try {
      const { data, error: e } = await db.from('hc_pilot_claims').update(patch).eq('id', c.id).eq('status', c.status).select('id, status');
      if (e) throw new Error(e.message);
      if (!data?.length) throw new Error('The claim changed before your update. Refresh and try again.');
      toast.success(ok); setMode(null); setReason(''); setPaid(''); await onChanged();
      if (patch.status && patch.status !== 'draft') onClose();
    } catch (e) { setError(e instanceof Error ? e.message : 'The claim could not be updated.'); }
    finally { pending.current = false; setSaving(false); }
  };
  const saveDraft = (ready: boolean) => {
    const input = { payer_name: payer, member_id: member.trim() || null, diagnosis_codes: dxList, lines: built };
    const p = validateClaimDraft(input, { ready });
    if (p) { setError(p); return; }
    void update({ ...input, payer_name: payer.trim(), status: ready ? 'ready' : 'draft' }, ready ? 'Claim marked ready' : 'Draft saved');
  };
  const removeDx = (i: number) => {
    const n = i + 1;
    setDx(dx.filter((_, j) => j !== i).length ? dx.filter((_, j) => j !== i) : ['']);
    setLines(lines.map((l) => ({ ...l, dx: l.dx.filter((p) => p !== n).map((p) => (p > n ? p - 1 : p)) })));
  };
  const setLine = (i: number, patch: Partial<LineForm>) => setLines(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  return (
    <div className="space-y-4">
      <Button variant="link" className="px-0" onClick={onClose}>← Back to practice claims</Button>
      <p role="note" className="flex gap-2 rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-xs text-muted-foreground"><AlertTriangle className="h-4 w-4 shrink-0 text-mansagold" />{CLAIM_NOT_SENT_NOTICE}</p>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg">Practice claim · {patientName}<Badge variant={statusVariant(c.status)}>{CLAIM_STATUS_LABELS[c.status as ClaimStatus] ?? c.status}</Badge></CardTitle>
          <p className="text-sm text-muted-foreground">Visit {fmt(c.service_date)}{visit ? ` · ${visit.visit_reason}` : ''}{visit?.signer_email ? ` · signed by ${visit.signer_email}` : ''}</p>
          {visit?.assessment && <p className="text-sm"><span className="text-muted-foreground">Doctor’s assessment:</span> {visit.assessment}</p>}
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1"><Label htmlFor="cl-payer">Payer (insurance) *</Label><Input id="cl-payer" value={payer} maxLength={120} disabled={!draft} onChange={(e) => setPayer(e.target.value)} placeholder="Self-pay" /></div>
            <div className="space-y-1"><Label htmlFor="cl-member">Member ID (made-up)</Label><Input id="cl-member" value={member} maxLength={40} disabled={!draft} onChange={(e) => setMember(e.target.value)} /></div>
          </div>

          <section className="space-y-2">
            <h3 className="font-medium">Diagnosis codes (ICD-10)</h3>
            <p className="text-xs text-muted-foreground">Type the codes the doctor chose — 1325 doesn’t suggest codes.</p>
            {dx.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-right text-sm text-muted-foreground">{i + 1}.</span>
                <Input aria-label={`Diagnosis code ${i + 1}`} className="w-40 uppercase" value={d} maxLength={8} disabled={!draft} onChange={(e) => setDx(dx.map((x, j) => (j === i ? e.target.value : x)))} placeholder="E11.9" />
                {draft && <Button size="icon" variant="ghost" aria-label={`Remove diagnosis ${i + 1}`} onClick={() => removeDx(i)}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            ))}
            {draft && dx.length < MAX_DX && <Button size="sm" variant="outline" onClick={() => setDx([...dx, ''])}><Plus className="mr-1 h-4 w-4" />Add diagnosis</Button>}
          </section>

          <section className="space-y-2">
            <h3 className="font-medium">Charge lines (CPT / HCPCS)</h3>
            {lines.length === 0 && <p className="text-sm text-muted-foreground">No charge lines yet.</p>}
            {lines.map((l, i) => (
              <div key={i} className="grid items-end gap-2 rounded-md border p-3 sm:grid-cols-[8rem_5rem_5rem_8rem_1fr_auto]">
                <div className="space-y-1"><Label htmlFor={`ln-c-${i}`}>Code *</Label><Input id={`ln-c-${i}`} className="uppercase" value={l.code} maxLength={5} disabled={!draft} onChange={(e) => setLine(i, { code: e.target.value })} placeholder="99213" /></div>
                <div className="space-y-1"><Label htmlFor={`ln-m-${i}`}>Modifier</Label><Input id={`ln-m-${i}`} className="uppercase" value={l.modifier} maxLength={2} disabled={!draft} onChange={(e) => setLine(i, { modifier: e.target.value })} /></div>
                <div className="space-y-1"><Label htmlFor={`ln-u-${i}`}>Units *</Label><Input id={`ln-u-${i}`} type="number" min={1} max={99} value={l.units} disabled={!draft} onChange={(e) => setLine(i, { units: e.target.value })} /></div>
                <div className="space-y-1"><Label htmlFor={`ln-p-${i}`}>Charge ($) *</Label><Input id={`ln-p-${i}`} inputMode="decimal" value={l.charge} disabled={!draft} onChange={(e) => setLine(i, { charge: e.target.value })} placeholder="125.00" /></div>
                <fieldset className="space-y-1"><legend className="text-sm font-medium">Links to diagnosis *</legend>
                  <div className="flex flex-wrap gap-3">{dxList.map((code, j) => (
                    <label key={j} className="flex items-center gap-1 text-sm"><Checkbox checked={l.dx.includes(j + 1)} disabled={!draft}
                      onCheckedChange={(v) => setLine(i, { dx: v === true ? [...l.dx, j + 1].slice(0, 4) : l.dx.filter((p) => p !== j + 1) })} />{j + 1} · {code}</label>
                  ))}{dxList.length === 0 && <span className="text-xs text-muted-foreground">Add a diagnosis first</span>}</div></fieldset>
                {draft && <Button size="icon" variant="ghost" aria-label={`Remove charge line ${i + 1}`} onClick={() => setLines(lines.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            ))}
            {draft && lines.length < MAX_LINES && <Button size="sm" variant="outline" onClick={() => setLines([...lines, { code: '', modifier: '', units: '1', charge: '', dx: dxList.length ? [1] : [] }])}><Plus className="mr-1 h-4 w-4" />Add charge line</Button>}
            <p className="text-right text-lg font-semibold">Total: {formatCents(draft ? total : c.total_cents)}</p>
          </section>

          {c.status === 'practice_paid' && <p className="text-sm">Paid (practice): <b>{formatCents(c.paid_cents)}</b> of {formatCents(c.total_cents)}</p>}
          {c.denial_reason && <p className="text-sm text-destructive">Last denial: {c.denial_reason}</p>}
          {c.status === 'void' && c.void_reason && <p className="text-sm text-muted-foreground">Voided: {c.void_reason}</p>}
          {c.submitted_at && <p className="text-xs text-muted-foreground">Marked sent {format(new Date(c.submitted_at), 'MMM d, yyyy h:mm a')} — practice only, nothing was transmitted.</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          {!isClosedClaim(c.status) && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {draft && <><Button variant="outline" disabled={saving} onClick={() => saveDraft(false)}>Save draft</Button>
                <Button className={gold} disabled={saving} onClick={() => saveDraft(true)}>Save & mark ready</Button></>}
              {c.status === 'ready' && <><Button variant="outline" disabled={saving} onClick={() => void update({ status: 'draft' }, 'Back to draft')}>Back to draft</Button>
                <Button className={gold} disabled={saving} onClick={() => void update({ status: 'practice_submitted' }, 'Marked sent (practice — nothing transmitted)')}>Mark sent (practice)</Button></>}
              {c.status === 'practice_submitted' && <><Button className={gold} disabled={saving} onClick={() => setMode('pay')}>Record payment</Button>
                <Button variant="outline" disabled={saving} onClick={() => setMode('deny')}>Record denial</Button></>}
              {c.status === 'practice_denied' && <Button className={gold} disabled={saving} onClick={() => void update({ status: 'draft' }, 'Claim reopened to fix and resend')}>Fix and resend</Button>}
              <Button variant="ghost" className="text-destructive" disabled={saving} onClick={() => setMode('void')}>Void claim</Button>
            </div>
          )}
          {mode === 'pay' && (
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1"><Label htmlFor="cl-paid">Amount paid ($)</Label><Input id="cl-paid" inputMode="decimal" value={paid} onChange={(e) => setPaid(e.target.value)} placeholder={(Number(c.total_cents) / 100).toFixed(2)} /></div>
              <Button className={gold} disabled={saving} onClick={() => { const cents = dollarsToCents(paid); const p = validatePaidAmount(cents, Number(c.total_cents)); if (p) { setError(p); return; } void update({ status: 'practice_paid', paid_cents: cents }, 'Practice payment recorded'); }}>Save payment</Button>
              <Button variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
            </div>
          )}
          {(mode === 'deny' || mode === 'void') && (
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[16rem] flex-1 space-y-1"><Label htmlFor="cl-reason">{mode === 'deny' ? 'Denial reason *' : 'Why void it? *'}</Label><Input id="cl-reason" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder={mode === 'deny' ? 'Missing modifier 25' : 'Started on the wrong visit'} /></div>
              <Button variant={mode === 'void' ? 'destructive' : 'default'} disabled={saving} onClick={() => {
                const p = validateClaimReason(reason, mode === 'deny' ? 'denial' : 'void'); if (p) { setError(p); return; }
                void update(mode === 'deny' ? { status: 'practice_denied', denial_reason: reason.trim() } : { status: 'void', void_reason: reason.trim() }, mode === 'deny' ? 'Practice denial recorded' : 'Claim voided');
              }}>{mode === 'deny' ? 'Save denial' : 'Void claim'}</Button>
              <Button variant="ghost" onClick={() => setMode(null)}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
