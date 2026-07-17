import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, ShieldCheck, ShieldAlert, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

type Finding = {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  detail: string;
  table_or_function?: string;
};

type Run = {
  id: string;
  ran_at: string;
  triggered_by: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  findings: Finding[];
  summary: string | null;
  email_sent: boolean;
  email_error: string | null;
  duration_ms: number | null;
};

const sevColor: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-lime-500 text-black",
};

export default function SecurityAutopilotPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const loadRuns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("security_autopilot_runs")
      .select("*")
      .order("ran_at", { ascending: false })
      .limit(20);
    if (error) {
      toast.error("Failed to load runs: " + error.message);
    } else {
      setRuns((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const runNow = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("security-autopilot-scan", {
        body: { trigger: "manual" },
      });
      if (error) throw error;
      toast.success(`Scan complete: ${data?.total ?? 0} findings`);
      await loadRuns();
    } catch (e: any) {
      toast.error("Scan failed: " + (e?.message || "unknown"));
    } finally {
      setRunning(false);
    }
  };

  const latest = runs[0];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-mansablue" />
            Security Autopilot
          </h1>
          <p className="text-muted-foreground mt-1">
            Automated weekly scan every Monday at 8am ET. Emailed to Thomas@1325.AI.
          </p>
        </div>
        <Button onClick={runNow} disabled={running} size="lg">
          {running ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning…
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Now
            </>
          )}
        </Button>
      </div>

      {latest && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-semibold">Latest scan</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(latest.ran_at), { addSuffix: true })}
                {" · "}
                {format(new Date(latest.ran_at), "PPpp")}
                {" · "}
                {latest.triggered_by}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {latest.email_sent ? (
                <Badge variant="secondary" className="gap-1">
                  <Mail className="h-3 w-3" />
                  Email sent
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <Mail className="h-3 w-3" />
                  Email failed
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <SevBox label="Critical" count={latest.critical_count} color="bg-red-50 text-red-700 border-red-200" />
            <SevBox label="High" count={latest.high_count} color="bg-orange-50 text-orange-700 border-orange-200" />
            <SevBox label="Medium" count={latest.medium_count} color="bg-yellow-50 text-yellow-700 border-yellow-200" />
            <SevBox label="Low" count={latest.low_count} color="bg-lime-50 text-lime-700 border-lime-200" />
          </div>

          {latest.total_findings === 0 ? (
            <div className="p-6 bg-green-50 text-green-800 rounded-lg text-center">
              ✅ No security findings. All monitored checks passed.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(["critical", "high", "medium", "low"] as const).flatMap((sev) =>
                latest.findings
                  .filter((f) => f.severity === sev)
                  .map((f) => (
                    <div
                      key={f.id}
                      className="p-3 border rounded-lg flex items-start gap-3 hover:bg-accent/30"
                    >
                      <Badge className={sevColor[f.severity]}>{f.severity}</Badge>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{f.title}</div>
                        <div className="text-sm text-muted-foreground">{f.detail}</div>
                        {f.table_or_function && (
                          <div className="text-xs mt-1 font-mono text-muted-foreground">
                            {f.category} · {f.table_or_function}
                          </div>
                        )}
                      </div>
                    </div>
                  )),
              )}
            </div>
          )}
        </Card>
      )}

      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <ShieldAlert className="h-5 w-5" />
        Scan history
      </h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : runs.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          No scans yet. Click "Run Now" to run the first one.
        </Card>
      ) : (
        <Card className="divide-y">
          {runs.map((r) => (
            <div key={r.id} className="p-3 flex items-center justify-between text-sm gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="font-medium">
                  {format(new Date(r.ran_at), "PPP p")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.summary} · {r.triggered_by} · {r.duration_ms}ms
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{r.total_findings} findings</Badge>
                {r.email_sent ? (
                  <Badge variant="secondary" className="gap-1"><Mail className="h-3 w-3" />sent</Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1"><Mail className="h-3 w-3" />failed</Badge>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function SevBox({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`p-4 rounded-lg border text-center ${color}`}>
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-xs uppercase tracking-wide font-medium">{label}</div>
    </div>
  );
}
