import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, RefreshCw, CheckCircle2, AlertTriangle, Clock, Wrench, MessageSquare, UserPlus, TrendingDown, Handshake, Pen, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface AgentReport {
  id: string;
  report_type: string;
  status: string;
  summary: string;
  issues_found: number;
  issues_fixed: number;
  issues_requiring_review: number;
  details: any;
  actions_taken: string[];
  created_at: string;
  reviewed_at: string | null;
}

const SERVICE_OPTIONS = [
  { key: "all", label: "Run All", icon: Bot, desc: "Execute all 6 services" },
  { key: "reviews", label: "Review Responder", icon: MessageSquare, desc: "Draft review responses" },
  { key: "onboarding", label: "Onboarding", icon: UserPlus, desc: "Welcome new businesses" },
  { key: "churn", label: "Churn Predictor", icon: TrendingDown, desc: "Re-engage inactive users" },
  { key: "matchmaker", label: "B2B Matchmaker", icon: Handshake, desc: "Connect businesses" },
  { key: "content", label: "Content Gen", icon: Pen, desc: "Generate social posts" },
  { key: "scorer", label: "Quality Scorer", icon: BarChart3, desc: "Score all profiles" },
];

export function KaylaAgentReports() {
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["kayla-agent-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kayla_agent_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as AgentReport[];
    },
  });

  const runAuditMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("kayla-data-agent");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["kayla-agent-reports"] });
      toast.success("Data audit complete!", { description: `Found ${data.stats?.issues_found || 0} issues, fixed ${data.stats?.issues_fixed || 0}` });
    },
    onError: (err) => toast.error("Audit failed", { description: err.message }),
  });

  const runServiceMutation = useMutation({
    mutationFn: async (service: string) => {
      const { data, error } = await supabase.functions.invoke("kayla-services", {
        body: { service },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["kayla-agent-reports"] });
      toast.success("Kayla services complete!", { description: `${data.total_actions || 0} actions taken` });
    },
    onError: (err) => toast.error("Service failed", { description: err.message }),
  });

  const markReviewed = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from("kayla_agent_reports")
        .update({ reviewed_at: new Date().toISOString() })
        .eq("id", reportId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kayla-agent-reports"] });
      toast.success("Report marked as reviewed");
    },
  });

  const isRunning = runAuditMutation.isPending || runServiceMutation.isPending;

  return (
    <Card className="border-mansagold/20 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-mansagold/10">
              <Bot className="h-5 w-5 text-mansagold" />
            </div>
            <div>
              <CardTitle className="text-lg">Kayla — Autonomous Agent</CardTitle>
              <p className="text-sm text-muted-foreground">7 agentic services running autonomously</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {/* Data Audit button */}
              <Button
                variant="outline"
                className="h-auto p-3 flex items-start gap-3 justify-start border-mansagold/20 hover:bg-mansagold/5"
                onClick={() => runAuditMutation.mutate()}
                disabled={isRunning}
              >
                <RefreshCw className={`h-4 w-4 mt-0.5 text-mansagold ${runAuditMutation.isPending ? "animate-spin" : ""}`} />
                <div className="text-left">
                  <p className="font-medium text-sm">Data Quality Audit</p>
                  <p className="text-xs text-muted-foreground">Images, URLs, completeness</p>
                </div>
              </Button>

              {SERVICE_OPTIONS.map((svc) => (
                <Button
                  key={svc.key}
                  variant="outline"
                  className="h-auto p-3 flex items-start gap-3 justify-start border-border/50 hover:bg-mansagold/5"
                  onClick={() => runServiceMutation.mutate(svc.key)}
                  disabled={isRunning}
                >
                  <svc.icon className={`h-4 w-4 mt-0.5 text-mansagold ${runServiceMutation.isPending ? "opacity-50" : ""}`} />
                  <div className="text-left">
                    <p className="font-medium text-sm">{svc.label}</p>
                    <p className="text-xs text-muted-foreground">{svc.desc}</p>
                  </div>
                </Button>
              ))}
            </div>

            {isRunning && (
              <div className="flex items-center justify-center gap-2 py-4 text-mansagold">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Kayla is working...</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
            ) : !reports?.length ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground">No reports yet. Run a service to get started.</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {report.report_type.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {format(new Date(report.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        {report.reviewed_at ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Reviewed
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => markReviewed.mutate(report.id)}>
                            Mark Reviewed
                          </Button>
                        )}
                      </div>

                      <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed mb-3">
                        {report.summary}
                      </pre>

                      <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1 text-orange-400">
                          <AlertTriangle className="h-3 w-3" />
                          {report.issues_found} found
                        </span>
                        <span className="flex items-center gap-1 text-green-400">
                          <Wrench className="h-3 w-3" />
                          {report.issues_fixed} actions
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Clock className="h-3 w-3" />
                          {report.issues_requiring_review} need review
                        </span>
                      </div>

                      {report.actions_taken?.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Actions:</p>
                          {report.actions_taken.slice(0, 5).map((action, i) => (
                            <p key={i} className="text-xs text-green-400">✅ {action}</p>
                          ))}
                          {report.actions_taken.length > 5 && (
                            <p className="text-xs text-muted-foreground">+{report.actions_taken.length - 5} more</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
