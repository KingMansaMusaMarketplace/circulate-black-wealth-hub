import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Bot, Brain, TrendingUp, TrendingDown, Target, BarChart3,
  CheckCircle2, XCircle, Clock, Zap, Lightbulb, Activity,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { format, subDays } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const SERVICE_LABELS: Record<string, string> = {
  reviews: "Review Responder",
  onboarding: "Onboarding",
  churn: "Churn Predictor",
  matchmaker: "B2B Matchmaker",
  content: "Content Generator",
  scorer: "Quality Scorer",
  auto_discover: "Auto-Discover",
};

const CHART_COLORS = ["hsl(var(--primary))", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];
const PIE_COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#6b7280"];

export function KaylaImpactDashboard() {
  // Fetch outcome feedback
  const { data: feedback } = useQuery({
    queryKey: ["kayla-outcome-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kayla_outcome_feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  // Fetch performance metrics
  const { data: metrics } = useQuery({
    queryKey: ["kayla-performance-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kayla_performance_metrics")
        .select("*")
        .order("period_start", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Fetch learning signals
  const { data: signals } = useQuery({
    queryKey: ["kayla-learning-signals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kayla_learning_signals")
        .select("*")
        .order("confidence", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Fetch agent reports for trend data
  const { data: reports } = useQuery({
    queryKey: ["kayla-reports-trend"],
    queryFn: async () => {
      const since = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from("kayla_agent_reports")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Compute stats
  const totalFeedback = feedback?.length || 0;
  const accepted = feedback?.filter(f => f.outcome === "accepted").length || 0;
  const rejected = feedback?.filter(f => f.outcome === "rejected").length || 0;
  const pending = feedback?.filter(f => f.outcome === "pending").length || 0;
  const overallSuccessRate = totalFeedback > 0 ? Math.round((accepted / (accepted + rejected || 1)) * 100) : 0;

  // Service breakdown
  const serviceStatsMap = (feedback || []).reduce((acc: Record<string, { accepted: number; rejected: number; total: number }>, f) => {
    if (!acc[f.service_type]) acc[f.service_type] = { accepted: 0, rejected: 0, total: 0 };
    acc[f.service_type].total++;
    if (f.outcome === "accepted") acc[f.service_type].accepted++;
    if (f.outcome === "rejected") acc[f.service_type].rejected++;
    return acc;
  }, {});
  
  const serviceStats = Object.entries(serviceStatsMap).map(([service, stats]) => ({
    service,
    label: SERVICE_LABELS[service] || service,
    accepted: stats.accepted,
    rejected: stats.rejected,
    total: stats.total,
    rate: Math.round((stats.accepted / (stats.accepted + stats.rejected || 1)) * 100),
  }));

  // Trend data from reports
  const trendData = (reports || [])
    .filter(r => r.report_type === "kayla_services")
    .reduce((acc: Record<string, { date: string; actions: number; issues: number }>, r) => {
      const date = format(new Date(r.created_at), "MMM d");
      if (!acc[date]) acc[date] = { date, actions: 0, issues: 0 };
      acc[date].actions += r.issues_fixed || 0;
      acc[date].issues += r.issues_found || 0;
      return acc;
    }, {});
  const trendArray = Object.values(trendData);

  // Pie chart data
  const pieData = [
    { name: "Accepted", value: accepted },
    { name: "Rejected", value: rejected },
    { name: "Pending", value: pending },
    { name: "Other", value: Math.max(0, totalFeedback - accepted - rejected - pending) },
  ].filter(d => d.value > 0);

  return (
    <Card className="border-mansagold/20 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-mansagold/10">
            <Brain className="h-5 w-5 text-mansagold" />
          </div>
          <div>
            <CardTitle className="text-lg">Kayla — Adaptive Intelligence</CardTitle>
            <p className="text-sm text-muted-foreground">
              Learning from outcomes • {totalFeedback} feedback signals • {signals?.length || 0} learned patterns
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <KPICard
            label="Success Rate"
            value={`${overallSuccessRate}%`}
            icon={Target}
            trend={overallSuccessRate > 70 ? "up" : overallSuccessRate > 50 ? "flat" : "down"}
            color="text-mansagold"
          />
          <KPICard
            label="Actions Accepted"
            value={accepted.toString()}
            icon={CheckCircle2}
            trend="up"
            color="text-green-500"
          />
          <KPICard
            label="Patterns Learned"
            value={(signals?.length || 0).toString()}
            icon={Lightbulb}
            trend="up"
            color="text-purple-500"
          />
          <KPICard
            label="30-Day Actions"
            value={(reports || []).reduce((s, r) => s + (r.issues_fixed || 0), 0).toString()}
            icon={Activity}
            trend="up"
            color="text-blue-500"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">By Service</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Activity Trend */}
              <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-mansagold" />
                  30-Day Activity Trend
                </h4>
                {trendArray.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={trendArray}>
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="actions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="issues" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                    No trend data yet — Kayla needs a few runs first
                  </div>
                )}
              </div>

              {/* Outcome Distribution */}
              <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-mansagold" />
                  Outcome Distribution
                </h4>
                {pieData.length > 0 ? (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60}>
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {pieData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-muted-foreground">{d.name}:</span>
                          <span className="font-medium">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-[140px] flex items-center justify-center text-sm text-muted-foreground">
                    No outcome data yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* By Service Tab */}
          <TabsContent value="services" className="mt-4">
            {serviceStats.length > 0 ? (
              <div className="space-y-3">
                {serviceStats.map(svc => (
                  <div key={svc.service} className="p-3 rounded-lg border border-border/50 bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{svc.label}</p>
                        <p className="text-xs text-muted-foreground">{svc.total} total outcomes</p>
                      </div>
                      <Badge variant="outline" className={svc.rate >= 70 ? "text-green-500 border-green-500/30" : svc.rate >= 50 ? "text-yellow-500 border-yellow-500/30" : "text-red-500 border-red-500/30"}>
                        {svc.rate}% success
                      </Badge>
                    </div>
                    <Progress value={svc.rate} className="h-2" />
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" /> {svc.accepted} accepted</span>
                      <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /> {svc.rejected} rejected</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No service-level data yet. Outcomes will appear as users interact with Kayla's suggestions." />
            )}
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="mt-4">
            {signals && signals.length > 0 ? (
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {signals.map(signal => (
                    <div key={signal.id} className="p-3 rounded-lg border border-border/50 bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{signal.service_type}</Badge>
                          <Badge variant="secondary" className="text-[10px]">{signal.signal_type}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Zap className="h-3 w-3 text-mansagold" />
                          <span className="font-medium">{Math.round((signal.confidence as number) * 100)}%</span>
                          <span className="text-muted-foreground">confidence</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-1">{signal.signal_key}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {typeof signal.signal_value === "object" ? JSON.stringify(signal.signal_value) : String(signal.signal_value)}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{signal.sample_count} samples</span>
                        <span>Updated {format(new Date(signal.last_updated_at), "MMM d, h:mm a")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <EmptyState message="Kayla hasn't learned any patterns yet. As actions are accepted or rejected, she'll identify preferences and adjust her behavior." />
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-4">
            {feedback && feedback.length > 0 ? (
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {feedback.slice(0, 50).map(f => (
                    <div key={f.id} className="p-3 rounded-lg border border-border/50 bg-background/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">{SERVICE_LABELS[f.service_type] || f.service_type}</Badge>
                          <span className="text-xs text-muted-foreground">{f.action_type}</span>
                        </div>
                        <OutcomeBadge outcome={f.outcome} />
                      </div>
                      {f.original_content && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{f.original_content}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(f.created_at), "MMM d, h:mm a")}
                        {f.feedback_source && <Badge variant="secondary" className="text-[10px]">{f.feedback_source}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <EmptyState message="No feedback recorded yet. Kayla will track outcomes from review drafts, content, and B2B matches automatically." />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function KPICard({ label, value, icon: Icon, trend, color }: {
  label: string; value: string; icon: React.ElementType; trend: "up" | "down" | "flat"; color: string;
}) {
  return (
    <div className="p-3 rounded-lg border border-border/50 bg-background/50">
      <div className="flex items-center justify-between mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        {trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500" />}
        {trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
        {trend === "flat" && <Minus className="h-3 w-3 text-muted-foreground" />}
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const styles: Record<string, string> = {
    accepted: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    modified: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    pending: "bg-muted text-muted-foreground border-border",
    ignored: "bg-muted text-muted-foreground border-border",
  };
  return <Badge className={`text-[10px] ${styles[outcome] || styles.pending}`}>{outcome}</Badge>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">{message}</p>
    </div>
  );
}
