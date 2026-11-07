import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, FileText, Lock, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { db } from './hc';
import { STATUS_LABELS } from '@/lib/clinical/vendor-baa';
import {
  buildGoLiveStatus, CONSENT_DRAFT_LABEL, CONSENT_DRAFT_SECTIONS, REAL_PATIENT_FIELDS, type GoLiveVendor,
} from '@/lib/clinical/go-live';

export default function PilotGoLive({ clinicId }: { clinicId: string }) {
  const [vendors, setVendors] = useState<GoLiveVendor[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const { data, error: e } = await db.rpc('hc_go_live_status', { _clinic: clinicId });
    if (e || !data) { setVendors(null); setError('The agreement checklist could not be loaded. Refresh to try again.'); return; }
    setVendors(((data as { vendors?: GoLiveVendor[] }).vendors) ?? []);
  }, [clinicId]);
  useEffect(() => { void load(); }, [load]);

  const status = vendors ? buildGoLiveStatus(vendors) : null;

  return (
    <div className="space-y-5">
      <div role="note" className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div>
          <b className="text-foreground">Real patients: locked.</b>{' '}
          <span className="text-muted-foreground">This page shows what go-live will look like. Nothing real can be entered or saved here. Real patients unlock only after every step below is done, in a separate protected system.</span>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-lg">Go-live checklist</CardTitle>
          {status && <Badge variant="outline">{status.doneCount} of {status.items.length} done</Badge>}
        </CardHeader>
        <CardContent className="space-y-3">
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {!status && !error && <p role="status" className="text-sm text-muted-foreground">Loading checklist…</p>}
          {status && (
            <ul className="space-y-3">
              {status.items.map((i) => (
                <li key={i.key} className="flex gap-3">
                  {i.done ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> : <Lock className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />}
                  <div>
                    <p className="font-medium text-foreground">{i.title}</p>
                    <p className="text-sm text-muted-foreground">{i.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {vendors && vendors.length > 0 && (
            <div className="rounded-md border p-3">
              <p className="mb-2 text-sm font-medium text-foreground">Outside company agreements (live from the Vendor BAA Tracker)</p>
              <div className="flex flex-wrap gap-2">
                {vendors.map((v) => (
                  <Badge key={v.vendor_name} variant={v.status === 'signed' && v.attorney_approved ? 'default' : v.status === 'vendor_declined' ? 'destructive' : 'outline'}>
                    {v.vendor_name}: {STATUS_LABELS[v.status]}{v.status === 'signed' && !v.attorney_approved ? ' (attorney not yet)' : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-lg">Real-patient setup form</CardTitle>
          <Badge variant="destructive"><Lock className="mr-1 h-3 w-3" />Preview only</Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} aria-label="Real-patient setup form (locked preview)">
            <fieldset disabled className="space-y-5 opacity-70">
              {REAL_PATIENT_FIELDS.map((s) => (
                <div key={s.section}>
                  <p className="mb-2 text-sm font-semibold text-foreground">{s.section}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {s.fields.map((f) => (
                      <div key={f.label} className="space-y-1">
                        <Label>{f.label}</Label>
                        <Input type={f.type ?? 'text'} placeholder={f.placeholder} aria-label={f.label} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <Checkbox id="golive-consent" />
                <Label htmlFor="golive-consent" className="font-normal">Patient has signed the attorney-approved consent form</Label>
              </div>
              <Button type="button"><Lock className="mr-1 h-4 w-4" />Save real patient (locked)</Button>
            </fieldset>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Patient consent and agreement</CardTitle>
          <Badge variant="outline" className="border-mansagold text-mansagold">{CONSENT_DRAFT_LABEL}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div role="note" className="flex gap-2 rounded-md border border-mansagold/50 bg-mansagold/10 p-3 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-mansagold" />
            This is a plain-language starting outline for your healthcare attorney. It is not a legal document, and no one can sign it here.
          </div>
          {CONSENT_DRAFT_SECTIONS.map((s) => (
            <div key={s.title}>
              <p className="font-medium text-foreground">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
          <Button type="button" disabled><Lock className="mr-1 h-4 w-4" />Sign agreement (off until attorney approval)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
