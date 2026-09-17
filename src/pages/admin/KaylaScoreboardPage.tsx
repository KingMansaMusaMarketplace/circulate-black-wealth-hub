import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Play, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Run {
  id: string;
  run_label: string | null;
  started_at: string;
  finished_at: string | null;
  cases_run: number;
  average_score: number | null;
  accuracy_score: number | null;
  grounding_score: number | null;
  passed: number;
  failed: number;
}

interface Result {
  id: string;
  question: string;
  answer: string | null;
  score: number | null;
  accuracy: number | null;
  grounding: number | null;
  usefulness: number | null;
  grader_notes: string | null;
  tools_used: string | null;
  model_used: string | null;
  latency_ms: number | null;
}

const scoreColor = (score: number | null) => {
  if (score === null) return 'text-white/50';
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-[#FFB300]';
  return 'text-red-400';
};

const KaylaScoreboardPage: React.FC = () => {
  const { toast } = useToast();
  const [runs, setRuns] = useState<Run[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const loadRuns = useCallback(async () => {
    const { data } = await supabase
      .from('kayla_benchmark_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(20);
    const rows = (data as Run[]) || [];
    setRuns(rows);
    setLoading(false);
    setSelectedRun((prev) => prev ?? (rows[0]?.id ?? null));
    return rows;
  }, []);

  const loadResults = useCallback(async (runId: string) => {
    const { data } = await supabase
      .from('kayla_benchmark_results')
      .select('*')
      .eq('run_id', runId)
      .order('score', { ascending: true });
    setResults((data as Result[]) || []);
  }, []);

  useEffect(() => { loadRuns(); }, [loadRuns]);

  useEffect(() => {
    if (selectedRun) loadResults(selectedRun);
  }, [selectedRun, loadResults]);

  // While a test is still being graded, keep refreshing so answers appear one by one.
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(async () => {
      const rows = await loadRuns();
      if (selectedRun) await loadResults(selectedRun);
      const current = rows.find((r) => r.id === selectedRun);
      if (current?.finished_at) {
        setRunning(false);
        toast({
          title: 'Test complete',
          description: `Average score ${current.average_score} out of 100 — ${current.passed} passed, ${current.failed} need work.`,
        });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [running, selectedRun, loadRuns, loadResults, toast]);

  const runScoreboard = async () => {
    setRunning(true);
    setResults([]);
    toast({ title: 'Test started', description: 'Kayla is answering every test question. Answers appear here as they are graded.' });
    const { data, error } = await supabase.functions.invoke('kayla-benchmark', { body: {} });
    if (error) {
      setRunning(false);
      toast({ title: 'Test failed', description: error.message, variant: 'destructive' });
      return;
    }
    setSelectedRun(data.run_id);
    await loadRuns();
  };

  const latest = runs[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050a18] via-[#0a1428] to-[#030712] text-white">
      <Helmet>
        <title>Kayla Scoreboard | 1325.AI Admin</title>
        <meta name="description" content="Measure how accurately Kayla and the AI team answer real questions." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link to="/admin" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-7 w-7 text-[#FFB300]" />
              Kayla Scoreboard
            </h1>
            <p className="text-base text-white/85 mt-2 max-w-2xl">
              A fixed set of real questions with the correct answers written down. Run it after any
              change to see whether the AI team actually got smarter.
            </p>
          </div>
          <Button onClick={runScoreboard} disabled={running} className="bg-[#FFB300] text-black hover:bg-[#e6a100]">
            {running ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            {running ? 'Testing…' : 'Run the test'}
          </Button>
        </div>

        {latest && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Overall score', value: latest.average_score },
              { label: 'Correct facts', value: latest.accuracy_score },
              { label: 'Nothing invented', value: latest.grounding_score },
              { label: 'Questions passed', value: `${latest.passed}/${latest.cases_run}`, raw: true },
            ].map((s) => (
              <Card key={s.label} className="bg-white/10 border-white/20 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/80">{s.label}</p>
                <p className={`text-4xl font-bold mt-1 ${s.raw ? 'text-white' : scoreColor(s.value as number)}`}>
                  {s.value ?? '—'}
                </p>
              </Card>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 p-5 lg:col-span-1">
            <h2 className="text-lg font-bold mb-4 text-white">Past tests</h2>
            {loading && <p className="text-white/70 text-base">Loading…</p>}
            {!loading && !runs.length && (
              <p className="text-white/70 text-base">No tests yet. Press “Run the test” to create the first one.</p>
            )}
            <div className="space-y-2">
              {runs.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRun(r.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                    selectedRun === r.id ? 'bg-[#FFB300]/10 border-[#FFB300]/40' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base text-white">{r.run_label || new Date(r.started_at).toLocaleString()}</span>
                    <span className={`text-lg font-bold ${scoreColor(r.average_score)}`}>{r.average_score ?? '—'}</span>
                  </div>
                  <span className="text-sm text-white/70">{r.cases_run} questions</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-white/10 border-white/20 p-5 lg:col-span-2">
            <h2 className="text-lg font-bold mb-4 text-white">Answers, weakest first</h2>
            {!results.length && <p className="text-white/70 text-base">Pick a test on the left to see the answers.</p>}
            <div className="space-y-4">
              {results.map((r) => (
                <div key={r.id} className="border border-white/20 rounded-lg p-4 bg-black/30">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-base text-white">{r.question}</p>
                    <Badge className={`shrink-0 bg-white/15 text-base font-bold ${scoreColor(r.score)}`}>
                      {(r.score ?? 0) >= 70
                        ? <CheckCircle2 className="h-3 w-3 mr-1" />
                        : <AlertTriangle className="h-3 w-3 mr-1" />}
                      {r.score ?? '—'}
                    </Badge>
                  </div>
                  <p className="text-base text-white/90 mt-2 whitespace-pre-wrap line-clamp-6">{r.answer}</p>
                  {r.grader_notes && (
                    <p className="text-sm text-[#FFB300] mt-3">Grader: {r.grader_notes}</p>
                  )}
                  <p className="text-sm text-white/70 mt-2">
                    Correct facts {r.accuracy ?? '—'} · Nothing invented {r.grounding ?? '—'} · Useful {r.usefulness ?? '—'}
                    {r.tools_used ? ` · Looked up: ${r.tools_used}` : ' · No lookups'}
                    {r.latency_ms ? ` · ${(r.latency_ms / 1000).toFixed(1)}s` : ''}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KaylaScoreboardPage;
