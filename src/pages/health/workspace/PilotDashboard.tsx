import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Activity, ClipboardList, Eye, FilePen, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { RECORD_TYPE_LABELS, RECORD_TYPES } from '@/lib/clinical/pilot-records';
import { buildDashboardStats, dailySeries } from '@/lib/clinical/pilot-visit-notes';
import DataLoadErrors from './DataLoadErrors';
import { Row, useRows } from './hc';
import { usePilotPrivacy } from './PilotPrivacy';

type Props = { clinicId: string; isOwner?: boolean; patients: Row[]; audit: Row[] | null; onOpenPatient: (id: string, tab?: string) => void; onOpenLog: () => void };

const activityConfig = {
  patients: { label: 'New test patients', color: 'hsl(var(--mansagold))' },
  visits: { label: 'Visit notes', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;
const typeConfig = { count: { label: 'Records', color: 'hsl(var(--mansagold))' } } satisfies ChartConfig;

export default function PilotDashboard({ clinicId, isOwner, patients, audit, onOpenPatient, onOpenLog }: Props) {
  const notes = useRows('hc_pilot_visit_notes', clinicId, { order: 'visit_date', asc: false });
  const records = useRows('hc_pilot_records', clinicId, { order: 'recorded_on', asc: false });
  const { name } = usePilotPrivacy();
  const byId = useMemo(() => Object.fromEntries(patients.map((p) => [p.id, p])), [patients]);

  const stats = buildDashboardStats(patients, notes.rows, isOwner ? audit : null);
  const activity = useMemo(() => {
    const p = dailySeries(patients, 'created_at');
    const v = dailySeries(notes.rows.filter((n) => n.status !== 'entered_in_error'), 'visit_date');
    return p.map((d, i) => ({ label: d.label, patients: d.count, visits: v[i].count }));
  }, [patients, notes.rows]);
  const byType = useMemo(() => RECORD_TYPES.map((t) => ({
    type: RECORD_TYPE_LABELS[t],
    count: records.rows.filter((r) => r.record_type === t && r.status === 'active').length,
  })), [records.rows]);
  const drafts = notes.rows.filter((n) => n.status === 'draft').slice(0, 6);
  const recentOpens = (audit ?? []).filter((a) => a.action === 'chart_opened').slice(0, 6);

  const tiles = [
    { label: 'Active test patients', value: stats.activePatients, icon: Users },
    { label: 'Visits in the last 7 days', value: stats.visitsThisWeek, icon: ClipboardList },
    { label: 'Draft notes to sign', value: stats.draftNotes, icon: FilePen },
    { label: 'Charts opened today', value: stats.chartsOpenedToday ?? '—', icon: Eye, note: stats.chartsOpenedToday === null ? 'Clinic owners only' : undefined },
  ];

  return (
    <div className="space-y-5">
      <DataLoadErrors sources={[notes, records]} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <t.icon className="h-8 w-8 shrink-0 text-mansagold" />
              <div>
                <div className="text-2xl font-semibold tabular-nums">{notes.loading ? '…' : t.value}</div>
                <div className="text-xs text-muted-foreground">{t.label}{t.note ? ` · ${t.note}` : ''}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Clinic activity · last 14 days</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={activityConfig} className="aspect-auto h-56 w-full">
              <LineChart data={activity} margin={{ left: -20, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval={1} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="patients" type="monotone" stroke="var(--color-patients)" strokeWidth={2} dot={false} />
                <Line dataKey="visits" type="monotone" stroke="var(--color-visits)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-mansagold" />New test patients</span>
              <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-primary" />Visit notes</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Chart records by type</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={typeConfig} className="aspect-auto h-56 w-full">
              <BarChart data={byType} layout="vertical" margin={{ left: 10, right: 12 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="type" width={120} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><FilePen className="h-4 w-4" />Drafts waiting for signature</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {notes.loading ? <p role="status" className="text-sm text-muted-foreground">Loading…</p>
              : drafts.length === 0 ? <p className="text-sm text-muted-foreground">No unsigned drafts. Nice work.</p>
              : drafts.map((n) => (
                <button key={n.id} type="button" onClick={() => onOpenPatient(n.patient_id, 'notes')} className="flex w-full items-center justify-between gap-2 rounded-md border p-3 text-left text-sm hover:bg-muted/50">
                  <span><b>{name(byId[n.patient_id])}</b> · {n.visit_reason}</span>
                  <span className="text-xs text-muted-foreground">{format(parseISO(n.visit_date), 'MMM d')}</span>
                </button>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" />Recently opened charts</CardTitle>
            {isOwner && <Button size="sm" variant="ghost" onClick={onOpenLog}>Full log</Button>}
          </CardHeader>
          <CardContent className="space-y-2">
            {!isOwner ? <p className="text-sm text-muted-foreground">Only the clinic owner can see who opened which chart.</p>
              : recentOpens.length === 0 ? <p className="text-sm text-muted-foreground">No charts opened yet.</p>
              : recentOpens.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 rounded-md border p-3 text-sm">
                  <span><b>{name(byId[a.patient_id])}</b> <span className="text-muted-foreground">by {a.actor_email ?? 'team member'}</span></span>
                  <Badge variant="outline">{format(parseISO(a.created_at), 'MMM d, h:mm a')}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
