import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Download, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Row } from './hc';
import {
  HANDOFF_NOTICE, HANDOFF_PARTNER, HANDOFF_PARTNER_STATUS, PLACES_OF_SERVICE, SAMPLE_STAMP, buildHandoffPreview, type PlaceOfService,
} from '@/lib/clinical/claim-handoff';

type Props = { claim: Row; patient: Row | null; patientName: string; clinicName?: string; visit?: Row };

/** Box-by-box CMS-1500 preview for a billing partner. Never sent anywhere; download is a stamped local sample. */
export default function ClaimHandoffPreview({ claim, patient, patientName, clinicName, visit }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PlaceOfService>('11');
  const [busy, setBusy] = useState(false);
  const preview = useMemo(() => buildHandoffPreview({
    claim: claim as never, patient: patient as never, patientName, clinicName, signerEmail: visit?.signer_email ?? null, signedAt: visit?.signed_at ?? null, pos,
  }), [claim, patient, patientName, clinicName, visit, pos]);
  const serviceDate = claim.service_date ? format(parseISO(claim.service_date), 'MMM d, yyyy') : '—';

  const download = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { buildHandoffPdf } = await import('./claim-handoff-pdf');
      const doc = buildHandoffPdf(preview, { patientName, serviceDate, clinicName });
      doc.save(`1325-handoff-SAMPLE-${String(claim.service_date ?? 'claim')}.pdf`);
      toast.success('Sample downloaded to this device — nothing was sent.');
    } catch { toast.error('The sample PDF could not be made. Try again.'); }
    finally { setBusy(false); }
  };

  return (
    <Card className="border-mansagold/40">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base"><Handshake className="h-4 w-4 text-mansagold" />Billing partner hand-off
          <Badge variant="outline">{HANDOFF_PARTNER} — {HANDOFF_PARTNER_STATUS}</Badge></CardTitle>
        <Button size="sm" variant={open ? 'ghost' : 'outline'} onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide preview' : 'Show hand-off preview'}</Button>
      </CardHeader>
      {open && (
        <CardContent className="space-y-4">
          <p role="note" className="rounded-md border border-mansagold/40 bg-mansagold/10 p-3 text-xs text-muted-foreground">{HANDOFF_NOTICE}</p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1"><Label>Place of service (box 24B)</Label>
              <Select value={pos} onValueChange={(v) => setPos(v as PlaceOfService)}>
                <SelectTrigger className="w-80" aria-label="Place of service"><SelectValue /></SelectTrigger>
                <SelectContent>{PLACES_OF_SERVICE.map((p) => <SelectItem key={p.code} value={p.code}>{p.code} · {p.label}</SelectItem>)}</SelectContent>
              </Select></div>
            <Button className="bg-mansagold text-mansablue hover:bg-mansagold-dark" disabled={busy} onClick={() => void download()}>
              <Download className="mr-1 h-4 w-4" />{busy ? 'Making sample…' : 'Download sample PDF'}</Button>
            <span className="text-xs text-muted-foreground">Stamped “{SAMPLE_STAMP}”. Saved to this device only.</span>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead className="w-16">Box</TableHead><TableHead>What it is</TableHead><TableHead>Filled from 1325</TableHead></TableRow></TableHeader>
            <TableBody>{preview.boxes.map((b) => (
              <TableRow key={b.box}><TableCell className="font-semibold">{b.box}</TableCell><TableCell>{b.label}</TableCell>
                <TableCell className={b.missing ? 'text-muted-foreground italic' : undefined}>{b.value}</TableCell></TableRow>
            ))}</TableBody>
          </Table>
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Box 24 · service lines</h4>
            {preview.lines.length === 0 ? <p className="text-sm text-muted-foreground">Add charge lines above to see them here.</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>#</TableHead><TableHead>24A Date</TableHead><TableHead>24B Place</TableHead><TableHead>24D Code</TableHead><TableHead>Mod</TableHead><TableHead>24E Dx</TableHead><TableHead>24F Charge</TableHead><TableHead>24G Units</TableHead><TableHead>24J NPI</TableHead></TableRow></TableHeader>
                <TableBody>{preview.lines.map((l) => (
                  <TableRow key={l.n}><TableCell>{l.n}</TableCell><TableCell>{l.date}</TableCell><TableCell>{l.pos}</TableCell><TableCell className="font-medium">{l.code}</TableCell><TableCell>{l.modifier || '—'}</TableCell>
                    <TableCell>{l.pointers}</TableCell><TableCell>{l.charge}</TableCell><TableCell>{l.units}</TableCell><TableCell className="italic text-muted-foreground">{l.npi}</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{preview.missing} item{preview.missing === 1 ? '' : 's'} marked in grey are for the clinic or billing partner to supply (for example NPI and tax ID). Saved claim changes show here after you save.</p>
        </CardContent>
      )}
    </Card>
  );
}
