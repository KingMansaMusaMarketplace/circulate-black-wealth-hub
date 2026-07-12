import { useAdminActivityFeed } from "@/hooks/useAdminActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity, Loader2 } from "lucide-react";

/**
 * "What changed today" — the single glanceable feed of every admin action
 * across the platform. Read-only. Refreshes every 30s.
 */
export function AdminActivityFeed() {
  const { data, isLoading } = useAdminActivityFeed(20);

  const severityColor = (s: string) =>
    s === "danger"
      ? "bg-red-500/20 text-red-300 border-red-500/40"
      : s === "warning"
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
      : "bg-blue-500/20 text-blue-300 border-blue-500/40";

  return (
    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-mansagold" />
          What changed recently
          <span className="text-xs font-normal text-blue-300 ml-auto">
            Auto-refreshing every 30s
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-blue-300">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading recent activity…
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-8 text-blue-300">
            No admin activity recorded yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
            {data.map((e) => (
              <div
                key={e.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Badge className={`${severityColor(e.severity)} shrink-0 mt-0.5`}>
                  {e.source.replace(/_/g, " ")}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-white text-sm font-medium truncate">
                      {e.action}
                    </p>
                    <span className="text-xs text-blue-300 shrink-0">
                      {formatDistanceToNow(new Date(e.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200/80 mt-0.5">
                    <span className="text-blue-300">by {e.actorLabel}</span>
                    {e.detail && <> — {e.detail}</>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
