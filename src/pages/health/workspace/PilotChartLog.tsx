import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Eye, FlaskConical, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { filterChartLog } from '@/lib/clinical/pilot-visit-notes';
import type { Row } from './hc';
import { usePilotPrivacy } from './PilotPrivacy';

type Props = { audit: Row[]; patients: Row[]; loading: boolean };
type Kind = 'all' | 'real' | 'test';

/** Owner-only view of every chart opening. Rows come from the trigger-written activity log; nothing here can change it. */
export default function PilotChartLog({ audit, patients, loading }: Props) {
  const { name } = usePilotPrivacy();
  const [person, setPerson] = useState('');
  const [patientId, setPatientId] = useState('all');
  const [kind, setKind] = useState<Kind>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const byId = useMemo(() => Object.fromEntries(patients.map((p) => [p.id, p])), [patients]);
  const hasReal = patients.some((p) => p.is_real);
  const isReal = (id: string) => byId[id]?.is_real === true;
  const rows = filterChartLog(audit, { person, patientId: patientId === 'all' ? undefined : patientId, from, to, kind, isReal });
  const reset = () => { setPerson(''); setPatientId('all'); setKind('all'); setFrom(''); setTo(''); };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4" />Chart-opened log</CardTitle>
        <p className="text-sm text-muted-foreground">Every time someone opens a patient’s chart, it is written here automatically. Real and test patients are labeled separately. Entries cannot be edited or deleted.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-6">
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="cl-person">Staff member</Label><Input id="cl-person" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Search by email" /></div>
          <div className="space-y-1"><Label>Patient type</Label>
            <Select value={kind} onValueChange={(v) => setKind(v as Kind)}><SelectTrigger aria-label="Patient type"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Real and test</SelectItem><SelectItem value="real">Real patients only</SelectItem><SelectItem value="test">Test patients only</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}><SelectTrigger aria-label="Patient"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All patients</SelectItem>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{name(p)}{p.is_real ? ' · real' : ''}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="cl-from">From</Label><Input id="cl-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="cl-to">To</Label><Input id="cl-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground" role="status">{loading ? 'Loading…' : `${rows.length} chart opening${rows.length === 1 ? '' : 's'}`}{!hasReal && !loading ? ' · no real patients yet' : ''}</span>
          <Button size="sm" variant="ghost" onClick={reset}>Clear filters</Button>
        </div>
        {!loading && rows.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Who</TableHead><TableHead>Patient</TableHead></TableRow></TableHeader>
            <TableBody>{rows.slice(0, 500).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="whitespace-nowrap">{format(parseISO(a.created_at), 'MMM d, yyyy · h:mm:ss a')}</TableCell>
                <TableCell>{a.actor_email ?? '—'}</TableCell>
                <TableCell>{name(byId[a.patient_id])}{isReal(a.patient_id)
                  ? <Badge variant="destructive" className="ml-2"><ShieldCheck className="mr-1 h-3 w-3" />Real</Badge>
                  : <Badge variant="outline" className="ml-2"><FlaskConical className="mr-1 h-3 w-3" />Test</Badge>}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
