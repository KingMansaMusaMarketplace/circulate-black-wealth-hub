import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, ArrowDownRight, RefreshCw } from "lucide-react";

type EventRow = {
  event_name: string;
  session_id: string;
  path: string | null;
  created_at: string;
};

type RangeDays = 7 | 30 | 90;

const STEPS: { key: string; label: string; matches: (e: EventRow) => boolean }[] = [
  { key: "homepage_view", label: "Homepage visits", matches: (e) => e.event_name === "homepage_view" },
  { key: "sticky_cta_click", label: "Clicked sticky CTA", matches: (e) => e.event_name === "sticky_cta_click" },
  { key: "business_signup_page_view", label: "Reached signup page", matches: (e) => e.event_name === "business_signup_page_view" },
  { key: "business_signup_started", label: "Started filling form", matches: (e) => e.event_name === "business_signup_started" },
  { key: "business_signup_complete", label: "Completed signup", matches: (e) => e.event_name === "business_signup_complete" },
];

const FunnelAnalyticsPage = () => {
  const [range, setRange] = useState<RangeDays>(30);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (days: RangeDays) => {
    setLoading(true);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("funnel_events")
      .select("event_name, session_id, path, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000);
    if (!error && data) setEvents(data as EventRow[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents(range);
  }, [range]);

  const stepCounts = useMemo(() => {
    return STEPS.map((step) => {
      const sessions = new Set(events.filter(step.matches).map((e) => e.session_id));
      return { ...step, count: sessions.size };
    });
  }, [events]);

  const top = stepCounts[0]?.count || 0;
  const exitPages = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((e) => {
      if (!e.path) return;
      counts.set(e.path, (counts.get(e.path) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000] via-[#050a18] to-[#030712] text-white">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">Conversion Funnel</h1>
            <p className="text-blue-200/70">From homepage visit to business signup</p>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <Button
                key={d}
                size="sm"
                variant={range === d ? "default" : "outline"}
                onClick={() => setRange(d as RangeDays)}
                className={range === d ? "bg-mansagold text-black hover:bg-amber-400" : ""}
              >
                {d}d
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => fetchEvents(range)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900/60 border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Funnel Steps</CardTitle>
            <CardDescription className="text-blue-200/70">
              Unique sessions reaching each stage in the last {range} days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full bg-slate-700/40" />)
            ) : top === 0 ? (
              <p className="text-blue-200/70 text-center py-8">
                No funnel data yet. Events will appear once visitors hit the homepage.
              </p>
            ) : (
              stepCounts.map((step, i) => {
                const pct = top > 0 ? (step.count / top) * 100 : 0;
                const prev = i > 0 ? stepCounts[i - 1].count : step.count;
                const dropPct = prev > 0 ? (1 - step.count / prev) * 100 : 0;
                const barColor =
                  pct >= 50 ? "bg-emerald-500" : pct >= 15 ? "bg-mansagold" : "bg-red-500";
                return (
                  <div key={step.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{step.label}</span>
                      <span className="text-blue-200/80">
                        <span className="font-bold text-white">{step.count.toLocaleString()}</span>{" "}
                        <span className="text-xs">({pct.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all`}
                        style={{ width: `${Math.max(pct, 1.5)}%` }}
                      />
                    </div>
                    {i > 0 && dropPct > 0 && (
                      <div className="flex items-center gap-1 text-xs text-red-400 mt-1">
                        <ArrowDownRight className="h-3 w-3" />
                        {dropPct.toFixed(1)}% drop-off from previous step
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingDown className="h-5 w-5 text-mansagold" />
              Top Pages by Activity
            </CardTitle>
            <CardDescription className="text-blue-200/70">
              Where visitors are spending their attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-40 w-full bg-slate-700/40" />
            ) : exitPages.length === 0 ? (
              <p className="text-blue-200/70">No path data yet.</p>
            ) : (
              <ul className="space-y-2">
                {exitPages.map(([path, n]) => (
                  <li key={path} className="flex justify-between text-sm border-b border-white/5 pb-1">
                    <span className="font-mono text-blue-200">{path}</span>
                    <span className="font-bold">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunnelAnalyticsPage;
