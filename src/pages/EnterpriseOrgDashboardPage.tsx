import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Loader2,
  MapPin,
  Users,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  useEnterpriseOrg,
  useOrgDashboard,
  useOrgLeader,
  useToggleOrgTask,
} from '@/hooks/use-enterprise-org';
import { AGENT_DIVISIONS, TOTAL_AGENTS } from '@/lib/enterprise/agent-divisions';

const money = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const EnterpriseOrgDashboardPage: React.FC = () => {
  const { slug = 'aames' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { data: org, isLoading: orgLoading } = useEnterpriseOrg(slug);
  const { data: leader, isLoading: leaderLoading } = useOrgLeader(org?.id);
  const { data, isLoading: dataLoading } = useOrgDashboard(org?.id, !!leader);
  const toggleTask = useToggleOrgTask(org?.id);

  if (authLoading || orgLoading || (user && leaderLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        <Button onClick={() => navigate('/')}>Go to 1325.AI</Button>
      </div>
    );
  }

  if (!user || !leader) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712] px-6 text-center">
        <Helmet>
          <title>Leadership access required — 1325.AI</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-2xl font-bold text-white">Leadership access required</h1>
        <p className="max-w-md text-slate-400">
          This dashboard is limited to named {org.short_name ?? org.name} leadership seats. If you
          should have access, ask your 1325.AI contact to add your seat.
        </p>
        <div className="flex gap-3">
          {!user && <Button onClick={() => navigate('/login')}>Sign in</Button>}
          <Button variant="outline" onClick={() => navigate(`/${slug === 'aames' ? 'aames' : `enterprise/${slug}`}`)}>
            Back to partner page
          </Button>
        </div>
      </div>
    );
  }

  const tasks = data?.tasks ?? [];
  const doneCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const businessCount = (data?.members ?? []).filter((m: any) => m.member_type === 'business_owner').length;
  const totalShare = (data?.revenue ?? []).reduce((s, r) => s + (r.share_amount_cents ?? 0), 0);
  const totalGross = (data?.revenue ?? []).reduce((s, r) => s + (r.gross_amount_cents ?? 0), 0);

  const stats = [
    { label: 'Registered members', value: (data?.members ?? []).length.toLocaleString(), icon: Users },
    { label: 'Member businesses', value: businessCount.toLocaleString(), icon: Building2 },
    { label: 'Chapters', value: (data?.chapters ?? []).length.toLocaleString(), icon: MapPin },
    { label: `Revenue share (${org.revenue_share_pct}%)`, value: money(totalShare), icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712] pb-20">
      <Helmet>
        <title>{`${org.short_name ?? org.name} Leadership Dashboard — 1325.AI`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container mx-auto max-w-6xl px-4 pt-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span
                className="rounded-lg border px-3 py-1 text-sm font-bold text-white"
                style={{ borderColor: org.accent_color, backgroundColor: `${org.primary_color}33` }}
              >
                {org.short_name ?? org.name}
              </span>
              <span className="text-white/40">×</span>
              <span className="font-mono text-sm tracking-wider text-mansagold">1325.AI</span>
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Leadership Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              {leader.title ? `${leader.title} · ` : ''}
              {org.term_years}-year partnership · {org.revenue_share_pct}% revenue share
            </p>
          </div>
          <Badge variant="outline" className="border-mansagold/40 bg-mansagold/10 capitalize text-mansagold">
            {org.status}
          </Badge>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="border-white/10 bg-white/[0.03] p-5">
              <s.icon className="mb-3 h-5 w-5 text-mansagold" />
              <p className="text-2xl font-bold text-white">{dataLoading ? '—' : s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="onboarding">
          <TabsList className="mb-6 bg-white/5">
            <TabsTrigger value="onboarding">60-Day Onboarding</TabsTrigger>
            <TabsTrigger value="divisions">Agentic Divisions</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Share</TabsTrigger>
          </TabsList>

          {/* Onboarding */}
          <TabsContent value="onboarding">
            <Card className="border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-semibold text-white">Onboarding progress</h2>
                  <span className="text-sm text-slate-400">
                    {doneCount} of {tasks.length} complete
                  </span>
                </div>
                <Progress value={progressPct} className="h-2" />
              </div>

              {dataLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-mansagold" />
              ) : tasks.length === 0 ? (
                <p className="text-sm text-slate-400">No onboarding tasks scheduled yet.</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((t) => {
                    const done = t.status === 'completed';
                    const active = t.status === 'in_progress';
                    return (
                      <div
                        key={t.id}
                        className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-4"
                      >
                        {t.owner_side !== '1325' ? (
                          <button
                            type="button"
                            aria-label={done ? 'Mark task as not done' : 'Mark task complete'}
                            disabled={toggleTask.isPending}
                            onClick={() => toggleTask.mutate({ id: t.id, complete: !done })}
                            className="mt-0.5 shrink-0"
                          >
                            {done ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-500 hover:text-mansagold" />
                            )}
                          </button>
                        ) : done ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        ) : active ? (
                          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-mansagold" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">{t.title}</p>
                            <Badge variant="outline" className="border-white/15 text-xs text-slate-400">
                              Week {t.week_number}
                            </Badge>
                            {t.division && (
                              <Badge variant="outline" className="border-mansagold/30 text-xs text-mansagold/90">
                                {t.division}
                              </Badge>
                            )}
                          </div>
                          {t.description && (
                            <p className="mt-1 text-sm text-slate-400">{t.description}</p>
                          )}
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                            Owner: {t.owner_side === 'both' ? 'Joint' : t.owner_side === '1325' ? '1325.AI' : org.short_name ?? org.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Divisions */}
          <TabsContent value="divisions">
            <p className="mb-5 text-sm text-slate-400">
              {TOTAL_AGENTS} Agentic AI Employees across seven divisions.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AGENT_DIVISIONS.map((d) => (
                <Card key={d.name} className="border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <d.icon className="h-5 w-5 text-mansagold" />
                    <Badge variant="outline" className="border-white/15 text-xs text-slate-300">
                      {d.headcount} agents
                    </Badge>
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{d.name}</h3>
                  <ul className="space-y-1.5">
                    {d.duties.map((duty) => (
                      <li key={duty} className="flex gap-2 text-sm text-slate-400">
                        <span className="text-mansagold">·</span>
                        {duty}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex items-center gap-1.5 text-xs uppercase tracking-wide text-mansagold/80">
                    <CalendarCheck className="h-3.5 w-3.5" />
                    Live {d.onboardingWeek}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Revenue */}
          <TabsContent value="revenue">
            <Card className="border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Gross attributed revenue
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">{money(totalGross)}</p>
                </div>
                <div className="rounded-lg border border-mansagold/25 bg-mansagold/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-mansagold/80">
                    {org.short_name ?? org.name} share ({org.revenue_share_pct}%)
                  </p>
                  <p className="mt-1 text-2xl font-bold text-mansagold">{money(totalShare)}</p>
                </div>
              </div>

              {dataLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-mansagold" />
              ) : (data?.revenue ?? []).length === 0 ? (
                <p className="text-sm text-slate-400">
                  No revenue events yet. The revenue share begins on Day 60 of onboarding.
                </p>
              ) : (
                <div className="space-y-2">
                  {(data?.revenue ?? []).map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">
                          {r.description || r.event_type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(r.occurred_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-mansagold">
                          {money(r.share_amount_cents)}
                        </p>
                        <p className="text-xs text-slate-500">of {money(r.gross_amount_cents)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterpriseOrgDashboardPage;
