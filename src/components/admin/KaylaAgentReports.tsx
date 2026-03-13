import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, RefreshCw, CheckCircle2, AlertTriangle, Clock, Wrench } from "lucide-react";
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
  details: any[];
  actions_taken: string[];
  created_at: string;
  reviewed_at: string | null;
}

export function KaylaAgentReports() {
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["kayla-agent-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kayla_agent_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
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
      toast.success("Kayla completed her audit!", { description: `Found ${data.stats?.issues_found || 0} issues, fixed ${data.stats?.issues_fixed || 0}` });
    },
    onError: (err) => {
      toast.error("Audit failed", { description: err.message });
    },
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

  return (
    <Card className="border-mansagold/20 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-mansagold/10">
            <Bot className="h-5 w-5 text-mansagold" />
          </div>
          <div>
            <CardTitle className="text-lg">Kayla — Autonomous Agent</CardTitle>
            <p className="text-sm text-muted-foreground">Data quality audits & auto-maintenance</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => runAuditMutation.mutate()}
          disabled={runAuditMutation.isPending}
          className="bg-mansagold hover:bg-mansagold/90 text-black"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${runAuditMutation.isPending ? "animate-spin" : ""}`} />
          {runAuditMutation.isPending ? "Running..." : "Run Audit Now"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
        ) : !reports?.length ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No audit reports yet. Click "Run Audit Now" to start.</p>
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
                    <div className="flex items-center gap-2">
                      {report.reviewed_at ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Reviewed
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => markReviewed.mutate(report.id)}
                        >
                          Mark Reviewed
                        </Button>
                      )}
                    </div>
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
                      {report.issues_fixed} auto-fixed
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Clock className="h-3 w-3" />
                      {report.issues_requiring_review} need review
                    </span>
                  </div>

                  {report.actions_taken?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Actions taken:</p>
                      {report.actions_taken.map((action, i) => (
                        <p key={i} className="text-xs text-green-400">✅ {action}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
