import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { BellRing, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Row } from './hc';
import { CARE_REMINDER_NOTICE, QUALITY_NOTICE, careReminders, qualitySnapshot } from '@/lib/clinical/care-reminders';

const fmt = (d: string | null) => (d ? format(parseISO(d), 'MMM d, yyyy') : '');

/** "Due for care" suggestions for one chart. Display only — never orders anything. */
export function CareRemindersCard({ patient, records }: { patient: Row; records: Row[] }) {
  const items = useMemo(() => careReminders(patient as never, records as never), [patient, records]);
  const due = items.filter((i) => i.status === 'due').length;
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="flex flex-wrap items-center gap-2 text-base"><BellRing className="h-4 w-4 text-mansagold" />Due for care
        {items.length > 0 && <Badge variant={due ? 'default' : 'secondary'}>{due ? `${due} due` : 'All up to date'}</Badge>}</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        {!patient.date_of_birth ? <p className="text-muted-foreground">Add a date of birth to see screening reminders.</p>
          : items.length === 0 ? <p className="text-muted-foreground">No screening reminders apply at this age.</p>
          : <ul className="space-y-2">{items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-start justify-between gap-2 rounded-md border p-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-medium">{i.status === 'due' ? <BellRing className="h-4 w-4 shrink-0 text-mansagold" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}{i.title}</div>
                <p className="text-xs text-muted-foreground">{i.why} · {i.source}</p>
              </div>
              <span className="text-xs text-muted-foreground">{i.status === 'due' ? 'Due — no record in this chart'
                : `Done ${fmt(i.lastDone)}${i.dueAgain ? ` · next ${fmt(i.dueAgain)}` : ''}`}</span>
            </li>
          ))}</ul>}
        <p className="text-xs text-muted-foreground">{CARE_REMINDER_NOTICE}</p>
      </CardContent>
    </Card>
  );
}

/** Clinic-wide counts of the same reminders. Practice numbers only. */
export function QualitySnapshot({ patients, records, loading }: { patients: Row[]; records: Row[]; loading?: boolean }) {
  const rows = useMemo(() => qualitySnapshot(patients as never, records as never), [patients, records]);
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><ClipboardCheck className="h-4 w-4 text-mansagold" />Quality snapshot</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        {loading ? <p role="status" className="text-muted-foreground">Loading…</p>
          : rows.length === 0 ? <p className="text-muted-foreground">No screening measures apply to the current test patients yet. Add birth dates to include them.</p>
          : <ul className="space-y-2">{rows.map((r) => {
            const pct = Math.round((r.upToDate / r.eligible) * 100);
            return (
              <li key={r.id} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2"><span>{r.title} <span className="text-xs text-muted-foreground">· {r.source}</span></span>
                  <span className="tabular-nums"><b>{r.upToDate}</b> of {r.eligible} up to date</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${pct} percent up to date`}><div className="h-full rounded-full bg-mansagold" style={{ width: `${pct}%` }} /></div>
              </li>
            );
          })}</ul>}
        <p className="text-xs text-muted-foreground">{QUALITY_NOTICE}</p>
      </CardContent>
    </Card>
  );
}
