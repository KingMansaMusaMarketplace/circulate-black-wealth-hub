import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BadgeCheck, Lock, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AREA_LABELS, MILESTONE_STATUSES, MILESTONE_STATUS_LABELS, summarizeMilestones, validateMilestoneEdit, type Milestone, type MilestoneArea, type MilestoneStatus,
} from '@/lib/clinical/compliance-milestones';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = () => (supabase as any).from('hc_compliance_milestones');
const variant = (s: MilestoneStatus) => (s === 'passed' ? 'default' : s === 'blocked' ? 'destructive' : s === 'not_started' || s === 'not_needed_yet' ? 'outline' : 'secondary') as 'default' | 'destructive' | 'outline' | 'secondary';
const fmtDate = (d: string | null) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString() : '—');
type Form = { status: MilestoneStatus; owner_name: string; next_step: string; target_date: string; estimated_cost: string; notes: string };

const ClinicalApprovalsTrackerPage: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await table().select('*').order('sort_order', { ascending: true });
    if (error) setFailed(true); else { setRows((data as Milestone[]) || []); setFailed(false); }
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const summary = useMemo(() => summarizeMilestones(rows), [rows]);
  const areas = useMemo(() => [...new Set(rows.map((r) => r.area))], [rows]);

  const open = (m: Milestone) => {
    setEditing(m);
    setForm({ status: m.status, owner_name: m.owner_name ?? '', next_step: m.next_step ?? '', target_date: m.target_date ?? '', estimated_cost: m.estimated_cost ?? '', notes: m.notes ?? '' });
  };
  const save = async () => {
    if (!editing || !form) return;
    const p = validateMilestoneEdit(form);
    if (p) { toast({ title: 'Check the form', description: p, variant: 'destructive' }); return; }
    setSaving(true);
    const { data, error } = await table().update({
      status: form.status, owner_name: form.owner_name.trim() || null, next_step: form.next_step.trim() || null,
      target_date: form.target_date || null, estimated_cost: form.estimated_cost.trim() || null, notes: form.notes.trim() || null,
    }).eq('id', editing.id).select('id');
    setSaving(false);
    if (error || !data?.length) { toast({ title: 'Could not save', description: 'Your changes were not saved. Please try again.', variant: 'destructive' }); return; }
    toast({ title: 'Saved', description: `${editing.title} updated.` });
    setEditing(null); setForm(null); void load();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet><title>Outside Approvals Tracker | 1325.AI Admin</title><meta name="description" content="Track certifications, network contracts and security audits 1325 Clinical needs." /></Helmet>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link to="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to admin</Link>
        <h1 className="flex items-center gap-3 text-3xl font-bold"><BadgeCheck className="h-7 w-7 text-primary" /> Outside Approvals Tracker</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">The certifications, network contracts and audits 1325 Clinical needs from outside organizations before doctors can e-prescribe, connect labs, exchange records, send claims or use real patient data.</p>
        <Card className="mt-6 border-destructive/60 bg-destructive/10 p-5">
          <div className="flex items-start gap-3"><Lock className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
            <div><p className="font-semibold">Paperwork only — nothing here switches anything on</p>
              <p className="text-sm text-muted-foreground">Marking an item “Passed” does not turn on e-prescribing, lab or record connections, claim sending or real patients. Each needs its own contract, testing and the attorney-approved go-live step.</p></div></div>
        </Card>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[['Done', `${summary.done} of ${summary.total}`], ['Still open', summary.active], ['Blocked', summary.blocked], ['Past target date', summary.overdue]].map(([l, v]) => (
            <Card key={l as string} className="p-4"><p className="text-sm text-muted-foreground">{l}</p><p className="text-2xl font-bold">{v}</p></Card>
          ))}
        </div>
        {loading ? <p className="mt-8 text-muted-foreground">Loading…</p> : failed ? <p role="alert" className="mt-8 text-destructive">The tracker could not be loaded. Sign in with an administrator account and try again.</p> : areas.map((a) => (
          <section key={a} className="mt-8">
            <h2 className="mb-3 text-xl font-semibold">{AREA_LABELS[a as MilestoneArea] ?? a}</h2>
            <div className="space-y-3">{rows.filter((r) => r.area === a).map((m) => (
              <Card key={m.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="text-lg font-semibold">{m.title}</h3><p className="text-sm text-muted-foreground">{m.why_it_matters}</p></div>
                  <Badge variant={variant(m.status)}>{MILESTONE_STATUS_LABELS[m.status] ?? m.status}</Badge>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-muted-foreground">Who grants it</dt><dd>{m.who_issues || '—'}</dd></div>
                  <div><dt className="text-muted-foreground">Our owner</dt><dd>{m.owner_name || '—'}</dd></div>
                  <div><dt className="text-muted-foreground">Next step</dt><dd>{m.next_step || '—'}</dd></div>
                  <div><dt className="text-muted-foreground">Target date · cost</dt><dd>{fmtDate(m.target_date)} · {m.estimated_cost || 'not quoted yet'}</dd></div>
                </dl>
                {m.notes && <p className="mt-3 border-l-2 border-primary/50 pl-3 text-sm text-muted-foreground">{m.notes}</p>}
                <Button size="sm" variant="outline" className="mt-3" onClick={() => open(m)}><Pencil className="mr-1 h-4 w-4" /> Update</Button>
              </Card>
            ))}</div>
          </section>
        ))}
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setForm(null); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.title}</DialogTitle><DialogDescription>Record where this approval stands. This never switches anything on.</DialogDescription></DialogHeader>
          {form && (
            <div className="space-y-3">
              <div className="space-y-1"><Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as MilestoneStatus })}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>
                  <SelectContent>{MILESTONE_STATUSES.map((s) => <SelectItem key={s} value={s}>{MILESTONE_STATUS_LABELS[s]}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1"><Label htmlFor="ms-owner">Our owner</Label><Input id="ms-owner" value={form.owner_name} maxLength={120} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} /></div>
              <div className="space-y-1"><Label htmlFor="ms-next">Next step</Label><Textarea id="ms-next" rows={2} value={form.next_step} maxLength={500} onChange={(e) => setForm({ ...form, next_step: e.target.value })} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label htmlFor="ms-date">Target date</Label><Input id="ms-date" type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} /></div>
                <div className="space-y-1"><Label htmlFor="ms-cost">Quoted cost</Label><Input id="ms-cost" value={form.estimated_cost} maxLength={120} onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })} placeholder="From the vendor’s written quote" /></div>
              </div>
              <div className="space-y-1"><Label htmlFor="ms-notes">Notes</Label><Textarea id="ms-notes" rows={3} value={form.notes} maxLength={2000} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => { setEditing(null); setForm(null); }}>Cancel</Button><Button onClick={() => void save()} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicalApprovalsTrackerPage;
