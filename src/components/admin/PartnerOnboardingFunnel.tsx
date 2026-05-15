import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Loader2, RefreshCw, TrendingDown, Users, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const STEP_ORDER = ['welcome', 'profile', 'goals', 'resources', 'first_link'] as const;
const STEP_LABELS: Record<string, string> = {
  welcome: 'Welcome', profile: 'Profile', goals: 'Goals', resources: 'Resources', first_link: 'First Link',
};

interface ProgressRow {
  user_id: string;
  current_step: number;
  steps_completed: string[];
  step_timestamps: Record<string, string>;
  profile_completed: boolean;
  resources_viewed: boolean;
  first_link_generated: boolean;
  completed_at: string | null;
  started_at: string;
}

const PartnerOnboardingFunnel: React.FC = () => {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('partner_onboarding_progress')
      .select('user_id,current_step,steps_completed,step_timestamps,profile_completed,resources_viewed,first_link_generated,completed_at,started_at')
      .order('started_at', { ascending: false })
      .limit(500);
    setRows((data || []) as unknown as ProgressRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const completed = rows.filter((r) => r.completed_at).length;
    const inProgress = rows.filter((r) => !r.completed_at && r.steps_completed.length > 0).length;
    const stepCounts = STEP_ORDER.map((step) => ({
      step,
      count: rows.filter((r) => r.steps_completed.includes(step)).length,
    }));

    // Average time to first referral link
    const completionTimes = rows
      .filter((r) => r.step_timestamps?.first_link)
      .map((r) => new Date(r.step_timestamps.first_link).getTime() - new Date(r.started_at).getTime());
    const avgMs = completionTimes.length
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;
    const avgHours = Math.round((avgMs / 3600000) * 10) / 10;

    return { total, completed, inProgress, stepCounts, avgHours };
  }, [rows]);

  const dropoffSteps = useMemo(() => {
    if (stats.total === 0) return [];
    return STEP_ORDER.map((step, i) => {
      const reached = rows.filter((r) => r.steps_completed.includes(step)).length;
      const previousReached = i === 0 ? stats.total : rows.filter((r) => r.steps_completed.includes(STEP_ORDER[i - 1])).length;
      const dropoff = previousReached > 0 ? Math.round(((previousReached - reached) / previousReached) * 100) : 0;
      return { step, reached, dropoff };
    });
  }, [rows, stats.total]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Partner Onboarding Funnel</h2>
          <p className="text-sm text-muted-foreground">How partners progress through setup and where they drop off.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Link</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHours}h</div>
            <p className="text-xs text-muted-foreground">from start to first link</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Step Funnel</CardTitle>
          <CardDescription>How many partners reached each step (and where they fell off).</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : stats.total === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No partner onboarding data yet.</div>
          ) : (
            <div className="space-y-3">
              {dropoffSteps.map((s, i) => {
                const pct = stats.total > 0 ? Math.round((s.reached / stats.total) * 100) : 0;
                return (
                  <div key={s.step}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{i + 1}. {STEP_LABELS[s.step]}</span>
                        {i > 0 && s.dropoff > 30 && (
                          <Badge variant="destructive" className="text-[10px]">-{s.dropoff}% drop</Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">{s.reached} / {stats.total} ({pct}%)</span>
                    </div>
                    <Progress value={pct} />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent partners */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Partners</CardTitle>
          <CardDescription>Latest 50 partners and their current step.</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No data yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Current Step</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 50).map((r) => {
                  const pct = Math.round((r.steps_completed.length / STEP_ORDER.length) * 100);
                  return (
                    <TableRow key={r.user_id}>
                      <TableCell className="text-xs font-mono">{r.user_id.slice(0, 8)}…</TableCell>
                      <TableCell className="text-xs">{format(new Date(r.started_at), 'MMM d, p')}</TableCell>
                      <TableCell className="text-xs">{STEP_LABELS[STEP_ORDER[Math.min(r.current_step - 1, STEP_ORDER.length - 1)]] || '—'}</TableCell>
                      <TableCell className="text-xs w-32"><Progress value={pct} className="h-2" /></TableCell>
                      <TableCell>
                        {r.completed_at
                          ? <Badge variant="default">Completed</Badge>
                          : r.steps_completed.length === 0
                            ? <Badge variant="outline">Not started</Badge>
                            : <Badge variant="secondary">In progress</Badge>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerOnboardingFunnel;
