import React, { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { filterChartLog } from '@/lib/clinical/pilot-visit-notes';
import type { Row } from './hc';
import { usePilotPrivacy } from './PilotPrivacy';

type Props = { audit: Row[]; patients: Row[]; loading: boolean };

/** Owner-only view of every chart opening. Rows come from the trigger-written activity log; nothing here can change it. */
export default function PilotChartLog({ audit, patients, loading }: Props) {
  const { name } = usePilotPrivacy();
  const [person, setPerson] = useState('');
  const [patientId, setPatientId] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const byId = useMemo(() => Object.fromEntries(patients.map((p) => [p.id, p])), [patients]);
  const rows = filterChartLog(audit, { person, patientId: patientId === 'all' ? undefined : patientId, from, to });
  const reset = () => { setPerson(''); setPatientId('all'); setFrom(''); setTo(''); };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4" />Chart-opened log</CardTitle>
        <p className="text-sm text-muted-foreground">Every time someone opens a test patient’s chart, it is written here automatically. Entries cannot be edited or deleted.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-5">
          <div className="space-y-1 sm:col-span-2"><Label htmlFor="cl-person">Staff member</Label><Input id="cl-person" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Search by email" /></div>
          <div className="space-y-1"><Label>Test patient</Label>
            <Select value={patientId} onValueChange={setPatientId}><SelectTrigger aria-label="Test patient"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All patients</SelectItem>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{name(p)}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label htmlFor="cl-from">From</Label><Input id="cl-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="cl-to">To</Label><Input id="cl-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground" role="status">{loading ? 'Loading…' : `${rows.length} chart opening${rows.length === 1 ? '' : 's'}`}</span>
          <Button size="sm" variant="ghost" onClick={reset}>Clear filters</Button>
        </div>
        {!loading && rows.length > 0 && (
          <Table>
            <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Who</TableHead><TableHead>Test patient</TableHead></TableRow></TableHeader>
            <TableBody>{rows.slice(0, 500).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="whitespace-nowrap">{format(parseISO(a.created_at), 'MMM d, yyyy · h:mm:ss a')}</TableCell>
                <TableCell>{a.actor_email ?? '—'}</TableCell>
                <TableCell>{name(byId[a.patient_id])}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
