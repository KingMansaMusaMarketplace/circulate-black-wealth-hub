import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Copy, Lock, Pencil, ShieldCheck, ShieldAlert, FileSignature } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  isVendorCleared,
  summarizeBaaReadiness,
  type BaaStatus,
  type VendorBaa,
} from '@/lib/clinical/vendor-baa';
import { BAA_REQUEST_EMAILS } from '@/lib/clinical/vendor-baa-emails';

// The generated database types don't include this new table yet.
const vendorTable = () => (supabase as any).from('hc_vendor_baas');

const statusVariant = (v: VendorBaa): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (isVendorCleared(v)) return 'default';
  if (v.status === 'vendor_declined') return 'destructive';
  if (v.status === 'not_requested') return 'outline';
  return 'secondary';
};

const formatDate = (d: string | null) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString() : '—');

type EditState = Pick<
  VendorBaa,
  'status' | 'vendor_contact' | 'requested_on' | 'signed_on' | 'signed_by' | 'attorney_approved' | 'plan_and_cost' | 'notes'
>;

const VendorBaaTrackerPage: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<VendorBaa[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [editing, setEditing] = useState<VendorBaa | null>(null);
  const [form, setForm] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await vendorTable().select('*').order('sort_order', { ascending: true });
    if (error) {
      setLoadFailed(true);
    } else {
      setRows((data as VendorBaa[]) || []);
      setLoadFailed(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const readiness = useMemo(() => summarizeBaaReadiness(rows), [rows]);
  const required = rows.filter((r) => r.baa_category === 'requires_baa');
  const keepAway = rows.filter((r) => r.baa_category === 'keep_phi_away');

  const openEdit = (v: VendorBaa) => {
    setEditing(v);
    setForm({
      status: v.status,
      vendor_contact: v.vendor_contact,
      requested_on: v.requested_on,
      signed_on: v.signed_on,
      signed_by: v.signed_by,
      attorney_approved: v.attorney_approved,
      plan_and_cost: v.plan_and_cost,
      notes: v.notes,
    });
  };

  const save = async () => {
    if (!editing || !form) return;
    setSaving(true);
    const payload = {
      ...form,
      vendor_contact: form.vendor_contact?.trim() || null,
      signed_by: form.signed_by?.trim() || null,
      plan_and_cost: form.plan_and_cost?.trim() || null,
      notes: form.notes?.trim() || null,
      requested_on: form.requested_on || null,
      signed_on: form.signed_on || null,
      attorney_approved: form.status === 'signed' ? form.attorney_approved : false,
    };
    const { error } = await vendorTable().update(payload).eq('id', editing.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save', description: 'Your changes were not saved. Please try again.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Saved', description: `${editing.vendor_name} updated.` });
    setEditing(null);
    setForm(null);
    load();
  };

  const copyEmail = async (vendor: string) => {
    const email = BAA_REQUEST_EMAILS.find((e) => e.vendor === vendor);
    if (!email) return;
    try {
      await navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
      toast({ title: 'Email copied', description: `Send to: ${email.sendTo}` });
    } catch {
      toast({ title: 'Could not copy', description: 'Your browser blocked copying. Use the PDF instead.', variant: 'destructive' });
    }
  };

  const VendorCard = ({ v }: { v: VendorBaa }) => {
    const hasEmail = BAA_REQUEST_EMAILS.some((e) => e.vendor === v.vendor_name);
    return (
      <Card className="p-5 bg-card border-border">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{v.vendor_name}</h3>
            <p className="text-sm text-muted-foreground">{v.service_used_for}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant(v)}>{STATUS_LABELS[v.status]}</Badge>
            {v.status === 'signed' && (
              <Badge variant={v.attorney_approved ? 'default' : 'destructive'}>
                {v.attorney_approved ? 'Attorney approved' : 'Needs attorney approval'}
              </Badge>
            )}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div><dt className="text-muted-foreground">Where to ask</dt><dd className="text-foreground">{v.vendor_contact || '—'}</dd></div>
          <div><dt className="text-muted-foreground">Plan and cost</dt><dd className="text-foreground">{v.plan_and_cost || '—'}</dd></div>
          <div><dt className="text-muted-foreground">Requested on</dt><dd className="text-foreground">{formatDate(v.requested_on)}</dd></div>
          <div><dt className="text-muted-foreground">Signed</dt><dd className="text-foreground">{v.signed_on ? `${formatDate(v.signed_on)} by ${v.signed_by || 'unknown'}` : '—'}</dd></div>
        </dl>
        {v.notes && <p className="mt-3 text-sm text-muted-foreground border-l-2 border-primary/50 pl-3">{v.notes}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(v)}>
            <Pencil className="h-4 w-4 mr-1" /> Update
          </Button>
          {hasEmail && (
            <Button size="sm" variant="secondary" onClick={() => copyEmail(v.vendor_name)}>
              <Copy className="h-4 w-4 mr-1" /> Copy request email
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Vendor BAA Tracker | 1325.AI Admin</title>
        <meta name="description" content="Track Business Associate Agreements with every service 1325 Clinical depends on." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>

        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileSignature className="h-7 w-7 text-primary" /> Vendor BAA Tracker
        </h1>
        <p className="mt-2 text-muted-foreground max-w-3xl">
          A Business Associate Agreement (BAA) is the contract a company signs promising to protect patient information.
          Every service below needs one, or must be kept completely away from patient data, before 1325 Clinical can accept real records.
        </p>

        <Card className="mt-6 p-5 border-destructive/60 bg-destructive/10">
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Real patient data: Locked</p>
              <p className="text-sm text-muted-foreground">
                This page only tracks paperwork. It cannot unlock real patient data, even when every vendor is cleared.
                Going live also needs your healthcare attorney's written approval, a security officer, written policies and an outside security review.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-card border-border">
            <p className="text-sm text-muted-foreground">Cleared</p>
            <p className="text-3xl font-bold text-foreground">{readiness.cleared} <span className="text-base font-normal text-muted-foreground">of {readiness.total}</span></p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <p className="text-sm text-muted-foreground">Still to do</p>
            <p className="text-3xl font-bold text-foreground">{readiness.remaining}</p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <p className="text-sm text-muted-foreground">Required vendors that won't sign</p>
            <p className={`text-3xl font-bold ${readiness.declinedRequired ? 'text-destructive' : 'text-foreground'}`}>{readiness.declinedRequired}</p>
          </Card>
        </div>

        {loading && <p className="mt-8 text-muted-foreground">Loading vendors…</p>}
        {loadFailed && !loading && (
          <p className="mt-8 text-destructive">Could not load the vendor list. Make sure you're signed in as an admin, then refresh.</p>
        )}

        {!loading && !loadFailed && (
          <>
            <section className="mt-10">
              <h2 className="text-xl font-semibold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Must have a signed BAA</h2>
              <p className="text-sm text-muted-foreground mt-1">Cleared only when signed and approved by your attorney.</p>
              <div className="mt-4 grid gap-4">{required.map((v) => <VendorCard key={v.id} v={v} />)}</div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-primary" /> Keep away from patient data</h2>
              <p className="text-sm text-muted-foreground mt-1">Cleared once confirmed these services never receive patient information.</p>
              <div className="mt-4 grid gap-4">{keepAway.map((v) => <VendorCard key={v.id} v={v} />)}</div>
            </section>
          </>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setForm(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update {editing?.vendor_name}</DialogTitle>
            <DialogDescription>Record what has happened with this vendor's agreement.</DialogDescription>
          </DialogHeader>
          {editing && form && (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(s) => setForm({ ...form, status: s as BaaStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS[editing.baa_category].map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="baa-contact">Where to ask</Label>
                <Input id="baa-contact" value={form.vendor_contact ?? ''} onChange={(e) => setForm({ ...form, vendor_contact: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="baa-requested">Requested on</Label>
                  <Input id="baa-requested" type="date" value={form.requested_on ?? ''} onChange={(e) => setForm({ ...form, requested_on: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="baa-signed">Signed on</Label>
                  <Input id="baa-signed" type="date" value={form.signed_on ?? ''} onChange={(e) => setForm({ ...form, signed_on: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="baa-signer">Signed by</Label>
                <Input id="baa-signer" placeholder="Name and title" value={form.signed_by ?? ''} onChange={(e) => setForm({ ...form, signed_by: e.target.value })} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div>
                  <Label htmlFor="baa-attorney">Attorney approved</Label>
                  <p className="text-xs text-muted-foreground">Only available once the status is Signed.</p>
                </div>
                <Switch
                  id="baa-attorney"
                  checked={form.status === 'signed' && form.attorney_approved}
                  disabled={form.status !== 'signed'}
                  onCheckedChange={(c) => setForm({ ...form, attorney_approved: c })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="baa-plan">Plan and cost</Label>
                <Input id="baa-plan" value={form.plan_and_cost ?? ''} onChange={(e) => setForm({ ...form, plan_and_cost: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="baa-notes">Notes</Label>
                <Textarea id="baa-notes" rows={3} value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setForm(null); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorBaaTrackerPage;
