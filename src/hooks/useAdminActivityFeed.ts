import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminActivityEvent {
  id: string;
  source:
    | "role_change"
    | "security"
    | "fraud_prevention"
    | "verification"
    | "nuclear"
    | "activity";
  timestamp: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  detail: string;
  severity: "info" | "warning" | "danger";
}

/**
 * Unions the last 20 admin-visible events across every audit source we already
 * have (role changes, security log, fraud prevention actions, verifications,
 * plus the generic activity_log). Newest first. Read-only.
 */
export function useAdminActivityFeed(limit = 20) {
  return useQuery({
    queryKey: ["admin-activity-feed", limit],
    refetchInterval: 30_000,
    queryFn: async (): Promise<AdminActivityEvent[]> => {
      const perSource = Math.max(limit, 10);

      const [roleRes, secRes, fraudRes, verifRes, actRes] = await Promise.all([
        supabase
          .from("role_change_audit")
          .select("id, user_id, changed_by, old_role, new_role, changed_at, reason")
          .order("changed_at", { ascending: false })
          .limit(perSource),
        supabase
          .from("security_audit_log")
          .select("id, user_id, action, table_name, record_id, timestamp")
          .order("timestamp", { ascending: false })
          .limit(perSource),
        supabase
          .from("fraud_prevention_actions")
          .select("id, action_type, triggered_by, created_at, auto_triggered, reversed_at")
          .order("created_at", { ascending: false })
          .limit(perSource),
        supabase
          .from("business_verifications")
          .select("id, verification_status, verified_at, business_id")
          .not("verified_at", "is", null)
          .order("verified_at", { ascending: false })
          .limit(perSource),
        supabase
          .from("activity_log")
          .select("id, user_id, activity_type, activity_data, created_at")
          .order("created_at", { ascending: false })
          .limit(perSource),
      ]);

      const events: AdminActivityEvent[] = [];

      // Collect all user ids so we can enrich with names in one round-trip
      const allIds = new Set<string>();
      (roleRes.data || []).forEach((r) => {
        r.user_id && allIds.add(r.user_id);
        r.changed_by && allIds.add(r.changed_by);
      });
      (secRes.data || []).forEach((r) => r.user_id && allIds.add(r.user_id));
      (fraudRes.data || []).forEach((r) => r.triggered_by && allIds.add(r.triggered_by));
      (actRes.data || []).forEach((r) => r.user_id && allIds.add(r.user_id));

      let names = new Map<string, string>();
      if (allIds.size > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", Array.from(allIds));
        (profiles || []).forEach((p) =>
          names.set(p.id, p.full_name || p.email || p.id.slice(0, 8))
        );
      }
      const label = (id: string | null) =>
        (id && names.get(id)) || (id ? id.slice(0, 8) : "System");

      (roleRes.data || []).forEach((r: any) => {
        events.push({
          id: `role-${r.id}`,
          source: "role_change",
          timestamp: r.changed_at,
          actorId: r.changed_by,
          actorLabel: label(r.changed_by),
          action: `Role changed → ${r.new_role}`,
          detail: `${label(r.user_id)} was ${r.old_role || "n/a"} → ${r.new_role}${
            r.reason ? ` (${r.reason})` : ""
          }`,
          severity: r.new_role === "admin" ? "danger" : "warning",
        });
      });

      (secRes.data || []).forEach((r: any) => {
        events.push({
          id: `sec-${r.id}`,
          source: "security",
          timestamp: r.timestamp,
          actorId: r.user_id,
          actorLabel: label(r.user_id),
          action: r.event_type?.replace(/_/g, " ") || "Security event",
          detail:
            typeof r.details === "object" && r.details
              ? JSON.stringify(r.details).slice(0, 140)
              : String(r.details || ""),
          severity: /fail|denied|breach|nuclear/i.test(r.event_type || "")
            ? "danger"
            : "info",
        });
      });

      (fraudRes.data || []).forEach((r: any) => {
        events.push({
          id: `fraud-${r.id}`,
          source: "fraud_prevention",
          timestamp: r.created_at,
          actorId: r.triggered_by,
          actorLabel: r.auto_triggered ? "AI Fraud Detection" : label(r.triggered_by),
          action: `Prevention: ${r.action_type.replace(/_/g, " ")}`,
          detail: r.reversed_at ? "Later reversed by admin" : "Active",
          severity: r.reversed_at ? "warning" : "danger",
        });
      });

      (verifRes.data || []).forEach((r: any) => {
        events.push({
          id: `verif-${r.id}`,
          source: "verification",
          timestamp: r.verified_at,
          actorId: null,
          actorLabel: "Admin",
          action: `Verification ${r.verification_status}`,
          detail: `Business ${r.business_id.slice(0, 8)}`,
          severity: r.verification_status === "rejected" ? "warning" : "info",
        });
      });

      (actRes.data || []).forEach((r: any) => {
        events.push({
          id: `act-${r.id}`,
          source: r.activity_type?.startsWith("nuclear_") ? "nuclear" : "activity",
          timestamp: r.created_at,
          actorId: r.user_id,
          actorLabel: label(r.user_id),
          action: r.activity_type?.replace(/_/g, " ") || "Activity",
          detail:
            typeof r.details === "object" && r.details
              ? JSON.stringify(r.details).slice(0, 140)
              : String(r.details || ""),
          severity: r.activity_type?.startsWith("nuclear_") ? "danger" : "info",
        });
      });

      events.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return events.slice(0, limit);
    },
  });
}
