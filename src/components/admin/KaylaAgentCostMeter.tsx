import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { DollarSign, Zap, AlertTriangle, RefreshCw, TrendingUp, Bot } from 'lucide-react';

// Estimated USD per 1M tokens — Lovable AI Gateway / Gemini 2.5 Flash defaults
const PRICE_PER_M_INPUT = 0.075;
const PRICE_PER_M_OUTPUT = 0.30;
const estimateCost = (inT: number, outT: number) =>
  (inT / 1_000_000) * PRICE_PER_M_INPUT + (outT / 1_000_000) * PRICE_PER_M_OUTPUT;

type Run = {
  id: string;
  agent_name: string;
  run_status: string;
  started_at: string;
  duration_ms: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  model: string | null;
};

type Threshold = {
  id: string;
  agent_name: string;
  daily_cap_usd: number;
  monthly_cap_usd: number;
  enabled: boolean;
};

const KaylaAgentCostMeter: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowDays, setWindowDays] = useState<1 | 7 | 30>(7);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [runsRes, threshRes] = await Promise.all([
      supabase
        .from('kayla_run_log')
        .select('id, agent_name, run_status, started_at, duration_ms, input_tokens, output_tokens, cost_usd, model')
        .gte('started_at', since)
        .order('started_at', { ascending: false })
        .limit(5000),
      supabase.from('kayla_cost_thresholds').select('*').order('agent_name'),
    ]);
    if (runsRes.error) toast.error(runsRes.error.message);
    else setRuns((runsRes.data as Run[]) || []);
    if (threshRes.error) toast.error(threshRes.error.message);
    else setThresholds((threshRes.data as Threshold[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    return runs.filter((r) => new Date(r.started_at).getTime() >= cutoff);
  }, [runs, windowDays]);

  const totals = useMemo(() => {
    let cost = 0;
    let input = 0;
    let output = 0;
    let success = 0;
    for (const r of filtered) {
      const c = r.cost_usd ?? estimateCost(r.input_tokens ?? 0, r.output_tokens ?? 0);
      cost += c;
      input += r.input_tokens ?? 0;
      output += r.output_tokens ?? 0;
      if (r.run_status === 'success' || r.run_status === 'completed') success++;
    }
    return { cost, input, output, runs: filtered.length, success, costPerSuccess: success ? cost / success : 0 };
  }, [filtered]);

  const perAgent = useMemo(() => {
    const map = new Map<string, { runs: number; cost: number; input: number; output: number; success: number }>();
    for (const r of filtered) {
      const a = r.agent_name || 'unknown';
      const cur = map.get(a) ?? { runs: 0, cost: 0, input: 0, output: 0, success: 0 };
      cur.runs++;
      cur.cost += r.cost_usd ?? estimateCost(r.input_tokens ?? 0, r.output_tokens ?? 0);
      cur.input += r.input_tokens ?? 0;
      cur.output += r.output_tokens ?? 0;
      if (r.run_status === 'success' || r.run_status === 'completed') cur.success++;
      map.set(a, cur);
    }
    return [...map.entries()]
      .map(([agent, v]) => ({ agent, ...v, costPerSuccess: v.success ? v.cost / v.success : 0 }))
      .sort((a, b) => b.cost - a.cost);
  }, [filtered]);

  // Today's cost per agent for cap warning
  const todayCostByAgent = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const map = new Map<string, number>();
    for (const r of runs) {
      if (new Date(r.started_at).getTime() < cutoff) continue;
      const c = r.cost_usd ?? estimateCost(r.input_tokens ?? 0, r.output_tokens ?? 0);
      map.set(r.agent_name, (map.get(r.agent_name) ?? 0) + c);
    }
    return map;
  }, [runs]);

  const warnings = useMemo(() => {
    return thresholds
      .filter((t) => t.enabled)
      .map((t) => ({
        ...t,
        today: todayCostByAgent.get(t.agent_name) ?? 0,
        pct: ((todayCostByAgent.get(t.agent_name) ?? 0) / Math.max(0.01, t.daily_cap_usd)) * 100,
      }))
      .filter((t) => t.pct >= 80)
      .sort((a, b) => b.pct - a.pct);
  }, [thresholds, todayCostByAgent]);

  const updateThreshold = async (t: Threshold, patch: Partial<Threshold>) => {
    const { error } = await supabase
      .from('kayla_cost_thresholds')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', t.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Updated');
      load();
    }
  };

  const addThresholdForAgent = async (agent: string) => {
    const { error } = await supabase
      .from('kayla_cost_thresholds')
      .insert({ agent_name: agent, daily_cap_usd: 5, monthly_cap_usd: 100, enabled: true });
    if (error) toast.error(error.message);
    else {
      toast.success('Threshold added');
      load();
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 4 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Kayla Agent Cost Meter</h2>
          <p className="text-sm text-white/60">AI token usage & spend across all 42 agents</p>
        </div>
        <div className="flex gap-2 items-center">
          <Tabs value={String(windowDays)} onValueChange={(v) => setWindowDays(Number(v) as 1 | 7 | 30)}>
            <TabsList>
              <TabsTrigger value="1">24h</TabsTrigger>
              <TabsTrigger value="7">7d</TabsTrigger>
              <TabsTrigger value="30">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={load} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {warnings.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Cost Cap Warnings (today)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {warnings.map((w) => (
              <div key={w.id} className="text-sm flex justify-between">
                <span className="text-white">{w.agent_name}</span>
                <span className="text-amber-300">
                  {fmt(w.today)} / {fmt(w.daily_cap_usd)} ({w.pct.toFixed(0)}%)
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><DollarSign className="h-3 w-3" /> Total Cost ({windowDays}d)</div>
            <div className="text-2xl font-bold text-mansagold mt-1">{fmt(totals.cost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><Zap className="h-3 w-3" /> Total Tokens</div>
            <div className="text-2xl font-bold text-white mt-1">{(totals.input + totals.output).toLocaleString()}</div>
            <div className="text-xs text-white/40 mt-1">{totals.input.toLocaleString()} in · {totals.output.toLocaleString()} out</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><Bot className="h-3 w-3" /> Runs / Success</div>
            <div className="text-2xl font-bold text-white mt-1">{totals.runs}</div>
            <div className="text-xs text-white/40 mt-1">{totals.success} succeeded</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-xs"><TrendingUp className="h-3 w-3" /> Cost per Success</div>
            <div className="text-2xl font-bold text-white mt-1">{fmt(totals.costPerSuccess)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Per-Agent Breakdown ({windowDays}d)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Runs</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>$/Success</TableHead>
                <TableHead>Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perAgent.map((a) => {
                const t = thresholds.find((x) => x.agent_name === a.agent);
                return (
                  <TableRow key={a.agent}>
                    <TableCell className="font-medium">{a.agent}</TableCell>
                    <TableCell>{a.runs} <span className="text-white/40 text-xs">({a.success} ok)</span></TableCell>
                    <TableCell>{(a.input + a.output).toLocaleString()}</TableCell>
                    <TableCell className="text-mansagold">{fmt(a.cost)}</TableCell>
                    <TableCell>{fmt(a.costPerSuccess)}</TableCell>
                    <TableCell>
                      {t ? (
                        <Badge variant={t.enabled ? 'default' : 'outline'}>
                          {fmt(t.daily_cap_usd)}/day
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => addThresholdForAgent(a.agent)}>Set Cap</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cost Caps (soft warnings)</CardTitle></CardHeader>
        <CardContent>
          {thresholds.length === 0 ? (
            <p className="text-sm text-white/50">No caps configured. Add caps from the per-agent table above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Daily Cap (USD)</TableHead>
                  <TableHead>Monthly Cap (USD)</TableHead>
                  <TableHead>Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {thresholds.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.agent_name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={t.daily_cap_usd}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (v !== t.daily_cap_usd) updateThreshold(t, { daily_cap_usd: v });
                        }}
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={t.monthly_cap_usd}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (v !== t.monthly_cap_usd) updateThreshold(t, { monthly_cap_usd: v });
                        }}
                        className="w-28"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={t.enabled ? 'default' : 'outline'}
                        onClick={() => updateThreshold(t, { enabled: !t.enabled })}
                      >
                        {t.enabled ? 'On' : 'Off'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <p className="text-xs text-white/40 mt-3">
            Pricing assumes Gemini 2.5 Flash via Lovable AI Gateway: ${PRICE_PER_M_INPUT}/1M input, ${PRICE_PER_M_OUTPUT}/1M output. Stored cost_usd values override this estimate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaylaAgentCostMeter;
